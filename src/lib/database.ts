import type { Prisma } from "@prisma/client";
import type { State, User, Payment } from "./store";
import type { Listing } from "./catalog";
import { seedListings } from "./catalog";
type DB = Prisma.TransactionClient;
const json = (value: unknown) =>
  JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
export async function readDatabase(db: DB): Promise<State> {
  const [
    users,
    listings,
    requests,
    favourites,
    messages,
    payments,
    tokens,
    notifications,
  ] = await Promise.all([
    db.user.findMany(),
    db.listing.findMany({ orderBy: { createdAt: "asc" } }),
    db.serviceRequest.findMany({ orderBy: { createdAt: "asc" } }),
    db.favourite.findMany(),
    db.message.findMany({ orderBy: { createdAt: "asc" } }),
    db.payment.findMany({ orderBy: { createdAt: "asc" } }),
    db.authToken.findMany(),
    db.notification.findMany({ orderBy: { createdAt: "asc" } }),
  ]);
  return {
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      accountType: u.accountType,
      role: u.role as User["role"],
      bio: u.bio ?? undefined,
      phone: u.phone ?? undefined,
      company: u.company ?? undefined,
      sessionVersion: u.sessionVersion,
      emailVerified: u.emailVerified,
    })),
    listings: listings.length
      ? listings.map((l) => l.payload as unknown as Listing)
      : structuredClone(seedListings),
    requests: requests.map(
      (r) => r.payload as unknown as State["requests"][number],
    ),
    favourites,
    messages: messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
    payments: payments.map((p) => ({
      id: p.id,
      userId: p.userId,
      reference: p.reference,
      amount: p.amount,
      currency: p.currency,
      status: p.status as Payment["status"],
      provider: p.provider as Payment["provider"],
      description: p.description,
      createdAt: p.createdAt.toISOString(),
    })),
    tokens: tokens.map((t) => ({ ...t, expires: t.expires.getTime() })),
    notifications: notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}
export async function saveDatabase(db: DB, s: State) {
  for (const user of s.users) {
    await db.user.upsert({
      where: { id: user.id },
      create: user,
      update: user,
    });
    await db.profile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, bio: user.bio ?? "", phone: user.phone ?? "" },
      update: { bio: user.bio ?? "", phone: user.phone ?? "" },
    });
    if (user.accountType === "Business")
      await db.businessProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, name: user.company || user.name },
        update: { name: user.company || user.name },
      });
  }
  for (const listing of s.listings) {
    const data = {
      ownerId: s.users.some((u) => u.id === listing.ownerId)
        ? listing.ownerId
        : null,
      category: listing.category,
      status: listing.status,
      payload: json(listing),
      createdAt: new Date(listing.createdAt),
    };
    await db.listing.upsert({
      where: { id: listing.id },
      create: { id: listing.id, ...data },
      update: data,
    });
    const listingId = listing.id;
    // Type-specific models retain room for domain rules without duplicating listing ownership.
    if (listing.category === "Jobs")
      await db.job.upsert({
        where: { listingId },
        create: {
          listingId,
          employmentType:
            listing.details["Employment type"] ?? listing.details.Type,
          experience: listing.details.Experience,
        },
        update: {
          employmentType:
            listing.details["Employment type"] ?? listing.details.Type,
          experience: listing.details.Experience,
        },
      });
    if (listing.category === "Artisans")
      await db.artisanProfile.upsert({
        where: { listingId },
        create: { listingId, specialty: listing.details.Specialty },
        update: { specialty: listing.details.Specialty },
      });
    if (listing.category === "Properties")
      await db.property.upsert({
        where: { listingId },
        create: {
          listingId,
          bedrooms: Number(listing.details.Bedrooms) || null,
          bathrooms: Number(listing.details.Bathrooms) || null,
          purpose: listing.details.Type,
        },
        update: {
          bedrooms: Number(listing.details.Bedrooms) || null,
          bathrooms: Number(listing.details.Bathrooms) || null,
          purpose: listing.details.Type,
        },
      });
    if (listing.category === "Products")
      await db.product.upsert({
        where: { listingId },
        create: { listingId, minimumOrder: listing.details["Minimum order"] },
        update: { minimumOrder: listing.details["Minimum order"] },
      });
    if (
      listing.category === "Logistics" ||
      listing.category === "Business Services"
    )
      await db.serviceListing.upsert({
        where: { listingId },
        create: { listingId, serviceType: listing.category },
        update: { serviceType: listing.category },
      });
  }
  for (const r of s.requests) {
    const data = {
      userId: r.userId || null,
      listingId: r.listingId || null,
      kind: r.kind,
      status: r.status,
      payload: json(r),
      createdAt: new Date(r.createdAt),
    };
    await db.serviceRequest.upsert({
      where: { id: r.id },
      create: { id: r.id, ...data },
      update: data,
    });
    await db.conversation.upsert({
      where: { id: r.id },
      create: { id: r.id },
      update: {},
    });
    if (r.kind === "Job application" && r.listingId)
      await db.jobApplication.upsert({
        where: { requestId: r.id },
        create: { requestId: r.id, jobId: r.listingId },
        update: {},
      });
    if (/logistics/i.test(r.kind))
      await db.logisticsRequest.upsert({
        where: { requestId: r.id },
        create: {
          requestId: r.id,
          origin: r.details?.Origin,
          destination: r.details?.Destination,
        },
        update: {},
      });
    if (/trade|import/i.test(r.kind))
      await db.tradeRequest.upsert({
        where: { requestId: r.id },
        create: {
          requestId: r.id,
          direction: r.details?.["Import or export"],
          originCountry: r.details?.["Origin country"],
          destinationCountry: r.details?.["Destination country"],
        },
        update: {},
      });
    if (/marketing|strategy/i.test(r.kind))
      await db.marketingRequest.upsert({
        where: { requestId: r.id },
        create: {
          requestId: r.id,
          objectives: r.details?.Objectives,
          budget: r.details?.["Budget range"],
        },
        update: {},
      });
    if (!r.userId)
      await db.contactSubmission.upsert({
        where: { requestId: r.id },
        create: { requestId: r.id, email: r.email ?? "" },
        update: {},
      });
  }
  for (const m of s.messages) {
    const data = { ...m, createdAt: new Date(m.createdAt) };
    await db.message.upsert({ where: { id: m.id }, create: data, update: {} });
  }
  for (const p of s.payments) {
    const data = { ...p, createdAt: new Date(p.createdAt) };
    await db.payment.upsert({
      where: { id: p.id },
      create: data,
      update: { status: p.status },
    });
  }
  for (const n of s.notifications) {
    const data = { ...n, createdAt: new Date(n.createdAt) };
    await db.notification.upsert({
      where: { id: n.id },
      create: data,
      update: { read: n.read },
    });
  }
  // These collections are small and replaced atomically under the transaction lock.
  await db.favourite.deleteMany();
  if (s.favourites.length)
    await db.favourite.createMany({ data: s.favourites });
  await db.authToken.deleteMany();
  if (s.tokens.length)
    await db.authToken.createMany({
      data: s.tokens.map((t) => ({ ...t, expires: new Date(t.expires) })),
    });
}
