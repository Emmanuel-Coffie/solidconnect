import { z } from "zod";
export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().toLowerCase(),
  password: z.string().min(10, "Use at least 10 characters.").max(100),
  accountType: z.enum(["Individual", "Business"]),
});
export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
});
export const requestSchema = z.object({
  kind: z.string().min(2).max(80),
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  phone: z.string().max(30).optional(),
  subject: z.string().trim().min(3).max(200),
  message: z
    .string()
    .trim()
    .min(10, "Please include at least 10 characters.")
    .max(5000),
  listingId: z.string().max(100).optional(),
  details: z.record(z.string(), z.string().max(2000)).optional(),
});
export const listingSchema = z.object({
  title: z.string().trim().min(5).max(120),
  category: z.enum([
    "Jobs",
    "Artisans",
    "Properties",
    "Products",
    "Logistics",
    "Business Services",
  ]),
  location: z.string().trim().min(2).max(120),
  price: z.coerce.number().min(0).max(100000000),
  unit: z.string().max(60),
  description: z.string().trim().min(30).max(5000),
  image: z
    .string()
    .regex(
      /^(photo-[a-zA-Z0-9-]+|\/uploads\/[a-zA-Z0-9.-]+|https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9/_.,-]+)$/,
    ),
  details: z.record(z.string(), z.string().max(500)).default({}),
});
export function safeReturn(value: string | null) {
  return value?.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\")
    ? value
    : "/dashboard";
}
