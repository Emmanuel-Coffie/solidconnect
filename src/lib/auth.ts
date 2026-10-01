import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "node:crypto";
import { readStore, type User } from "./store";
const globals = globalThis as unknown as { devSecret?: string };
function secret() {
  const configured = process.env.NEXTAUTH_SECRET;
  if (
    !configured &&
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_LOCAL_DEMO !== "true"
  )
    throw new Error("NEXTAUTH_SECRET is required.");
  return new TextEncoder().encode(
    configured ?? (globals.devSecret ??= randomBytes(48).toString("hex")),
  );
}
export async function createSession(user: User) {
  const token = await new SignJWT({ version: user.sessionVersion ?? 0 })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  (await cookies()).set("solid-session", token, {
    httpOnly: true,
    secure: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
    sameSite: "lax",
    path: "/",
    maxAge: 604800,
  });
}
export async function currentUser() {
  const token = (await cookies()).get("solid-session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ["HS256"],
    });
    const user = (await readStore()).users.find((x) => x.id === payload.sub);
    return user && (user.sessionVersion ?? 0) === (payload.version ?? 0)
      ? user
      : null;
  } catch {
    return null;
  }
}
export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new ApiError(401, "Sign in to continue.");
  return user;
}
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  let valid = false;
  if (origin) {
    try {
      const parsed = new URL(origin);
      valid =
        ["http:", "https:"].includes(parsed.protocol) &&
        parsed.host === req.headers.get("host");
    } catch {
      valid = false;
    }
  }
  if (!valid) throw new ApiError(403, "Refresh this page and try again.");
}
const rate = new Map<string, { count: number; until: number }>();
export function rateLimit(key: string, limit = 30) {
  const now = Date.now();
  if (rate.size > 10000)
    for (const [k, v] of rate) if (v.until < now) rate.delete(k);
  const current = rate.get(key);
  if (current && current.until > now) {
    if (current.count >= limit)
      throw new ApiError(
        429,
        "Too many attempts. Please try again in a few minutes.",
      );
    current.count++;
  } else rate.set(key, { count: 1, until: now + 600000 });
}
