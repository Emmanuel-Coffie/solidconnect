import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hash, compare } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import {
  currentUser,
  requireUser,
  createSession,
  sameOrigin,
  rateLimit,
  ApiError,
} from "@/lib/auth";
import { readStore, mutate, newId, publicUser } from "@/lib/store";
import {
  registerSchema,
  loginSchema,
  listingSchema,
  requestSchema,
} from "@/lib/validation";
import { checkoutProducts, provider, verifyAndSave } from "@/lib/payments";
import { sendEmail } from "@/lib/email";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function errorResponse(error: unknown) {
  if (error instanceof z.ZodError)
    return NextResponse.json(
      { error: error.issues[0]?.message ?? "Please review your details." },
      { status: 400 },
    );
  if (error instanceof ApiError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  console.error(
    "Platform request failed:",
    error instanceof Error ? error.message : "unknown",
  );
  return NextResponse.json(
    { error: "We could not complete this action. Please try again." },
    { status: 500 },
  );
}
export async function GET(req: Request) {
  try {
    const q = new URL(req.url).searchParams;
    const action = q.get("action");
    const state = await readStore();
    if (action === "listings")
      return NextResponse.json({
        listings: state.listings.filter((x) => x.status === "published"),
      });
    if (action === "track") {
      const ref = q.get("reference")?.trim().toUpperCase();
      if (ref !== "SC-DEMO-2026")
        throw new ApiError(
          404,
          "No shipment found. Check the tracking number or try SC-DEMO-2026.",
        );
      return NextResponse.json({
        reference: ref,
        demo: true,
        origin: "Tema, Ghana",
        destination: "Rotterdam, Netherlands",
        status: "In transit",
        eta: "8 October 2026",
        events: [
          { label: "Order created", date: "24 Sep · 09:00", done: true },
          { label: "Picked up", date: "25 Sep · 14:30", done: true },
          { label: "In transit", date: "28 Sep · 08:15", done: true },
          { label: "Out for delivery", date: "Awaiting arrival", done: false },
          { label: "Delivered", date: "Pending", done: false },
        ],
      });
    }
    const user = await currentUser();
    if (action === "session")
      return NextResponse.json({ user: user ? publicUser(user) : null });
    if (!user) throw new ApiError(401, "Sign in to continue.");
    if (action === "payment") {
      const payment = state.payments.find(
        (x) => x.reference === q.get("reference") && x.userId === user.id,
      );
      if (!payment) throw new ApiError(404, "Payment not found.");
      return NextResponse.json({ payment: await verifyAndSave(payment) });
    }
    if (action === "admin") {
      if (user.role !== "ADMIN")
        throw new ApiError(403, "Administrator access is required.");
      return NextResponse.json({
        users: state.users.map(publicUser),
        listings: state.listings,
        requests: state.requests,
        payments: state.payments,
      });
    }
    const ownListings = state.listings.filter((x) => x.ownerId === user.id);
    const requests = state.requests.filter(
      (x) =>
        x.userId === user.id || ownListings.some((l) => l.id === x.listingId),
    );
    const conversations = new Set(requests.map((x) => x.id));
    return NextResponse.json({
      user: publicUser(user),
      listings: ownListings,
      requests,
      saved: state.listings.filter((x) =>
        state.favourites.some(
          (f) => f.userId === user.id && f.listingId === x.id,
        ),
      ),
      messages: state.messages.filter((x) =>
        conversations.has(x.conversationId),
      ),
      payments: state.payments.filter((x) => x.userId === user.id),
      notifications: state.notifications.filter((x) => x.userId === user.id),
    });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const body = await req.json();
    const action = z.string().max(40).parse(body.action);
    rateLimit(
      `action:${action}:${req.headers.get("x-forwarded-for") ?? "local"}`,
      action === "login" || action === "register" ? 30 : 120,
    );
    if (action === "register") {
      const input = registerSchema.parse(body);
      const passwordHash = await hash(input.password, 12);
      const user = await mutate((s) => {
        if (s.users.some((x) => x.email === input.email))
          throw new ApiError(
            409,
            "An account already uses this email. Try signing in.",
          );
        const u = {
          id: newId(),
          name: input.name,
          email: input.email,
          passwordHash,
          accountType: input.accountType,
          role: "USER" as const,
        };
        s.users.push(u);
        return u;
      });
      await createSession(user);
      await sendEmail(
        user.email,
        "Welcome to Solid Connect",
        `Welcome ${user.name}. Your account is ready. Discover opportunities at Solid Connect.`,
      ).catch(() => {});
      return NextResponse.json({ user: publicUser(user) });
    }
    if (action === "login") {
      const input = loginSchema.parse(body);
      const user = (await readStore()).users.find(
        (x) => x.email === input.email,
      );
      if (!user || !(await compare(input.password, user.passwordHash)))
        throw new ApiError(
          401,
          "Email or password is incorrect. Please try again.",
        );
      await createSession(user);
      return NextResponse.json({ user: publicUser(user) });
    }
    if (action === "logout") {
      (await cookies()).delete("solid-session");
      return NextResponse.json({ ok: true });
    }
    if (action === "forgot") {
      const email = z.email().parse(body.email);
      const user = (await readStore()).users.find(
        (x) => x.email === email.toLowerCase(),
      );
      if (user && process.env.RESEND_API_KEY) {
        const token = randomBytes(32).toString("hex");
        await mutate((s) => {
          s.tokens = s.tokens.filter(
            (x) => x.userId !== user.id || x.kind !== "reset",
          );
          s.tokens.push({
            hash: createHash("sha256").update(token).digest("hex"),
            userId: user.id,
            kind: "reset",
            expires: Date.now() + 3600000,
          });
        });
        await sendEmail(
          email,
          "Reset your Solid Connect password",
          `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`,
        );
      }
      return NextResponse.json({
        message: process.env.RESEND_API_KEY
          ? "If this account exists, a reset link has been sent."
          : "Password reset email is not configured in this local demo. Contact the administrator.",
      });
    }
    if (action === "reset") {
      const input = z
        .object({
          token: z.string().min(32),
          password: z.string().min(10).max(100),
        })
        .parse(body);
      const passwordHash = await hash(input.password, 12);
      await mutate((s) => {
        const token = s.tokens.find(
          (x) =>
            x.hash === createHash("sha256").update(input.token).digest("hex") &&
            x.kind === "reset" &&
            x.expires > Date.now(),
        );
        if (!token)
          throw new ApiError(
            400,
            "This reset link has expired or is invalid. Request a new link.",
          );
        const user = s.users.find((x) => x.id === token.userId)!;
        user.passwordHash = passwordHash;
        user.sessionVersion = (user.sessionVersion ?? 0) + 1;
        s.tokens = s.tokens.filter((x) => x !== token);
      });
      return NextResponse.json({ ok: true });
    }
    if (action === "request" || action === "contact") {
      const input = requestSchema.parse(body);
      const user = await currentUser();
      if (action === "request" && !user)
        throw new ApiError(401, "Sign in to send your request.");
      const entry = await mutate((s) => {
        if (
          input.listingId &&
          !s.listings.some(
            (x) => x.id === input.listingId && x.status === "published",
          )
        )
          throw new ApiError(404, "This listing is no longer available.");
        if (
          input.kind === "Job application" &&
          s.requests.some(
            (x) =>
              x.kind === input.kind &&
              x.userId === user?.id &&
              x.listingId === input.listingId,
          )
        )
          throw new ApiError(
            409,
            "You have already applied for this position.",
          );
        const item = {
          ...input,
          id: newId(),
          userId: user?.id ?? "",
          status: "Submitted",
          createdAt: new Date().toISOString(),
        };
        s.requests.push(item);
        if (user)
          s.notifications.push({
            id: newId(),
            userId: user.id,
            text: `${input.subject} — request received`,
            read: false,
            createdAt: item.createdAt,
          });
        return item;
      });
      await sendEmail(
        input.email,
        "Your request has been received",
        `Reference: ${entry.id}\n${input.subject}\nYou can follow up from your Solid Connect dashboard.`,
      ).catch(() => {});
      return NextResponse.json({ entry });
    }
    if (action === "verify-email") {
      const token = z.string().min(32).max(128).parse(body.token);
      await mutate((s) => {
        const tokenHash = createHash("sha256").update(token).digest("hex");
        const record = s.tokens.find(
          (t) =>
            t.hash === tokenHash &&
            t.kind === "verify" &&
            t.expires > Date.now(),
        );
        if (!record)
          throw new ApiError(
            400,
            "This verification link is invalid or has expired. Request a new one from your profile.",
          );
        const account = s.users.find((u) => u.id === record.userId);
        if (!account)
          throw new ApiError(
            400,
            "This verification link is invalid or has expired. Request a new one from your profile.",
          );
        account.emailVerified = true;
        s.tokens = s.tokens.filter((t) => t !== record);
      });
      return NextResponse.json({ message: "Your email is verified." });
    }
    const user = await requireUser();
    if (action === "send-verification") {
      if (user.emailVerified)
        return NextResponse.json({
          message: "Your email is already verified.",
        });
      if (!process.env.RESEND_API_KEY)
        throw new ApiError(
          503,
          "Verification email is not configured in this preview.",
        );
      const token = randomBytes(32).toString("hex");
      await mutate((s) => {
        s.tokens = s.tokens.filter(
          (t) => t.userId !== user.id || t.kind !== "verify",
        );
        s.tokens.push({
          hash: createHash("sha256").update(token).digest("hex"),
          userId: user.id,
          kind: "verify",
          expires: Date.now() + 86400000,
        });
      });
      await sendEmail(
        user.email,
        "Verify your Solid Connect email",
        `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`,
      );
      return NextResponse.json({
        message: "Verification link sent. Check your inbox.",
      });
    }
    if (action === "profile") {
      const input = z
        .object({
          name: z.string().trim().min(2).max(100),
          bio: z.string().max(1000),
          company: z.string().max(100),
          phone: z.string().max(30),
        })
        .parse(body);
      await mutate((s) =>
        Object.assign(
          s.users.find((x) => x.id === user.id)!,
          input,
        ),
      );
      return NextResponse.json({ ok: true });
    }
    if (action === "save") {
      const id = z.string().parse(body.listingId);
      const saved = await mutate((s) => {
        if (!s.listings.some((x) => x.id === id && x.status === "published"))
          throw new ApiError(404, "Listing unavailable.");
        const existing = s.favourites.find(
          (x) => x.userId === user.id && x.listingId === id,
        );
        if (existing) {
          s.favourites = s.favourites.filter((x) => x !== existing);
          return false;
        }
        s.favourites.push({ userId: user.id, listingId: id });
        return true;
      });
      return NextResponse.json({ saved });
    }
    if (action === "listing") {
      const input = listingSchema.parse(body);
      const listing = await mutate((s) => {
        const existing = body.id
          ? s.listings.find((x) => x.id === body.id && x.ownerId === user.id)
          : null;
        if (body.id && !existing) throw new ApiError(404, "Listing not found.");
        if (existing) {
          Object.assign(existing, input, { status: "pending" });
          return existing;
        }
        const item = {
          ...input,
          id: newId(),
          ownerId: user.id,
          provider: user.company || user.name,
          verified: false,
          featured: false,
          status: "pending" as const,
          createdAt: new Date().toISOString(),
        };
        s.listings.push(item);
        return item;
      });
      return NextResponse.json({ listing });
    }
    if (action === "listing-status") {
      const id = z.string().parse(body.id);
      await mutate((s) => {
        const listing = s.listings.find(
          (x) => x.id === id && x.ownerId === user.id,
        );
        if (!listing) throw new ApiError(404, "Listing not found.");
        listing.status = "suspended";
      });
      return NextResponse.json({ ok: true });
    }
    if (action === "message") {
      const input = z
        .object({
          conversationId: z.string(),
          text: z.string().trim().min(1).max(5000),
        })
        .parse(body);
      const message = await mutate((s) => {
        const entry = s.requests.find((x) => x.id === input.conversationId);
        const owner = s.listings.find(
          (x) => x.id === entry?.listingId,
        )?.ownerId;
        if (
          !entry ||
          (entry.userId !== user.id &&
            owner !== user.id &&
            user.role !== "ADMIN")
        )
          throw new ApiError(
            403,
            "You do not have access to this conversation.",
          );
        const msg = {
          ...input,
          id: newId(),
          userId: user.id,
          createdAt: new Date().toISOString(),
        };
        s.messages.push(msg);
        return msg;
      });
      return NextResponse.json({ message });
    }
    if (action === "request-status") {
      const input = z
        .object({
          id: z.string(),
          status: z.enum([
            "Submitted",
            "In review",
            "Shortlisted",
            "Rejected",
            "Quoted",
            "Completed",
          ]),
        })
        .parse(body);
      await mutate((s) => {
        const entry = s.requests.find((x) => x.id === input.id);
        const owner = s.listings.find(
          (x) => x.id === entry?.listingId,
        )?.ownerId;
        if (!entry || (owner !== user.id && user.role !== "ADMIN"))
          throw new ApiError(403, "Only the provider can change this status.");
        entry.status = input.status;
      });
      return NextResponse.json({ ok: true });
    }
    if (action === "read-notifications") {
      await mutate((s) =>
        s.notifications
          .filter((x) => x.userId === user.id)
          .forEach((x) => (x.read = true)),
      );
      return NextResponse.json({ ok: true });
    }
    if (action === "checkout") {
      if (
        process.env.PAYMENTS_MODE === "live" &&
        !process.env.PAYSTACK_SECRET_KEY
      )
        throw new ApiError(
          503,
          "Live payments are not configured. Please contact support.",
        );
      const productKey = z
        .enum(["professional", "consultation", "listing"])
        .parse(body.product);
      const product = checkoutProducts[productKey];
      const payment = await mutate((s) => {
        const pending = s.payments.find(
          (x) =>
            x.userId === user.id &&
            x.description === product.description &&
            x.provider ===
              (process.env.PAYMENTS_MODE === "live" ? "paystack" : "mock") &&
            x.status === "pending",
        );
        if (pending) return pending;
        const p = {
          id: newId(),
          userId: user.id,
          reference: `SC-${randomBytes(12).toString("hex")}`,
          amount: product.amount,
          currency: "GHS",
          status: "pending" as const,
          provider:
            process.env.PAYMENTS_MODE === "live" &&
            process.env.PAYSTACK_SECRET_KEY
              ? ("paystack" as const)
              : ("mock" as const),
          description: product.description,
          createdAt: new Date().toISOString(),
        };
        s.payments.push(p);
        return p;
      });
      return NextResponse.json({
        ...(await provider.initialize(
          payment,
          user.email,
          process.env.NEXTAUTH_URL ?? new URL(req.url).origin,
        )),
        payment,
      });
    }
    if (action === "mock-settle") {
      const result = await mutate((s) => {
        const p = s.payments.find(
          (x) => x.reference === body.reference && x.userId === user.id,
        );
        if (!p || p.provider !== "mock" || process.env.PAYMENTS_MODE === "live")
          throw new ApiError(403, "Test payment unavailable.");
        if (p.status !== "pending") return p;
        p.status = z.enum(["success", "failed"]).parse(body.status);
        return p;
      });
      return NextResponse.json({ payment: result });
    }
    if (action === "moderate") {
      if (user.role !== "ADMIN")
        throw new ApiError(403, "Administrator access is required.");
      const input = z
        .object({
          id: z.string(),
          status: z.enum(["published", "pending", "rejected", "suspended"]),
          featured: z.boolean(),
          verified: z.boolean(),
        })
        .parse(body);
      await mutate((s) => {
        const listing = s.listings.find((x) => x.id === input.id);
        if (!listing) throw new ApiError(404, "Listing not found.");
        Object.assign(listing, input);
      });
      return NextResponse.json({ ok: true });
    }
    throw new ApiError(400, "Unknown action.");
  } catch (e) {
    return errorResponse(e);
  }
}
