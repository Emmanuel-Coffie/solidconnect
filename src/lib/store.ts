import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { seedListings, type Listing } from "./catalog";
import { readDatabase, saveDatabase } from "./database";
export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  accountType: string;
  role: "USER" | "ADMIN";
  bio?: string;
  company?: string;
  phone?: string;
  emailVerified?: boolean;
  sessionVersion?: number;
};
export type Entry = {
  id: string;
  userId: string;
  kind: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  email?: string;
  name?: string;
  listingId?: string;
  details?: Record<string, string>;
};
export type Payment = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  reference: string;
  status: "pending" | "success" | "failed";
  provider: "mock" | "paystack";
  description: string;
  createdAt: string;
};
export type Message = {
  id: string;
  conversationId: string;
  userId: string;
  text: string;
  createdAt: string;
};
export type State = {
  users: User[];
  listings: Listing[];
  requests: Entry[];
  favourites: { userId: string; listingId: string }[];
  messages: Message[];
  payments: Payment[];
  tokens: { hash: string; userId: string; kind: string; expires: number }[];
  notifications: {
    id: string;
    userId: string;
    text: string;
    read: boolean;
    createdAt: string;
  }[];
};
const initial = (): State => ({
  users: [],
  listings: structuredClone(seedListings),
  requests: [],
  favourites: [],
  messages: [],
  payments: [],
  tokens: [],
  notifications: [],
});
const globalStore = globalThis as unknown as {
  prisma?: PrismaClient;
  storeQueue?: Promise<unknown>;
};
function db() {
  return (globalStore.prisma ??= new PrismaClient());
}
const file = path.join(process.cwd(), ".data", "platform.json");
async function readLocal(): Promise<State> {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    return initial();
  }
}
export async function readStore(): Promise<State> {
  if (process.env.DATABASE_URL) {
    return readDatabase(db());
  }
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_LOCAL_DEMO !== "true"
  )
    throw new Error("PostgreSQL is required in production.");
  return readLocal();
}
export async function mutate<T>(
  fn: (state: State) => T | Promise<T>,
): Promise<T> {
  const run = async () => {
    if (process.env.DATABASE_URL)
      return db().$transaction(
        async (tx) => {
          await tx.$executeRaw`SELECT pg_advisory_xact_lock(840071)`;
          const state = await readDatabase(tx);
          const result = await fn(state);
          await saveDatabase(tx, state);
          return result;
        },
        { timeout: 15000 },
      );
    if (
      process.env.NODE_ENV === "production" &&
      process.env.ALLOW_LOCAL_DEMO !== "true"
    )
      throw new Error("PostgreSQL is required in production.");
    const state = await readLocal();
    const result = await fn(state);
    await mkdir(path.dirname(file), { recursive: true });
    const temp = `${file}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(state, null, 2));
    await rename(temp, file);
    return result;
  };
  const pending = (globalStore.storeQueue ?? Promise.resolve()).then(run, run);
  globalStore.storeQueue = pending.catch(() => {});
  return pending;
}
export const newId = () => randomUUID();
export function publicUser(user: User) {
  const { passwordHash, sessionVersion, ...safe } = user;
  void passwordHash;
  void sessionVersion;
  return safe;
}
