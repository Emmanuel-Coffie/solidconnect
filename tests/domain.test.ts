import test from "node:test";
import assert from "node:assert/strict";
import {
  registerSchema,
  listingSchema,
  requestSchema,
  safeReturn,
} from "../src/lib/validation";
test("registration rejects weak passwords and privileged roles", () => {
  assert.equal(
    registerSchema.safeParse({
      name: "Example User",
      email: "user@example.com",
      password: "short",
      accountType: "Business",
    }).success,
    false,
  );
  const result = registerSchema.parse({
    name: "Example User",
    email: "USER@example.com",
    password: "A-good-password-123",
    accountType: "Individual",
    role: "ADMIN",
  });
  assert.equal(result.email, "user@example.com");
  assert.equal("role" in result, false);
});
test("listing validation rejects arbitrary remote image URLs and negative prices", () => {
  const listing = {
    title: "Frontend Developer",
    category: "Jobs",
    location: "Accra",
    price: 8000,
    unit: "/ month",
    description: "A meaningful role description with clear responsibilities.",
    image: "photo-1521737711867-e3b97375f902",
  };
  assert.equal(listingSchema.safeParse(listing).success, true);
  assert.equal(
    listingSchema.safeParse({ ...listing, price: -1 }).success,
    false,
  );
  assert.equal(
    listingSchema.safeParse({
      ...listing,
      image: "https://attacker.example/tracker",
    }).success,
    false,
  );
  assert.equal(
    listingSchema.safeParse({ ...listing, category: "Unknown" }).success,
    false,
  );
});
test("requests require contact details and a meaningful message", () => {
  assert.equal(
    requestSchema.safeParse({
      kind: "Logistics",
      name: "Test Person",
      email: "person@example.com",
      subject: "Cargo quote",
      message: "Please quote for 200 kg from Tema to Kumasi.",
      details: { Origin: "Tema", Destination: "Kumasi" },
    }).success,
    true,
  );
  assert.equal(
    requestSchema.safeParse({
      kind: "Trade",
      name: "T",
      email: "invalid",
      subject: "x",
      message: "x",
    }).success,
    false,
  );
});
test("redirects remain on this application", () => {
  assert.equal(safeReturn("//attacker.example"), "/portal");
  assert.equal(safeReturn("https://attacker.example"), "/portal");
  assert.equal(safeReturn("/\\attacker.example"), "/portal");
  assert.equal(safeReturn("/marketplace/jobs"), "/marketplace/jobs");
});
