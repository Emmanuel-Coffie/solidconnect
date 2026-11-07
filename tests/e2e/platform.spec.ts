import { test, expect, type APIRequestContext } from "@playwright/test";
const origin = "http://127.0.0.1:3001";
const post = (request: APIRequestContext, action: string, data: object = {}) =>
  request.post("/api/platform", {
    headers: { origin },
    data: { action, ...data },
  });
const enquiry = {
  kind: "Products enquiry",
  name: "Guest Customer",
  email: "guest@example.com",
  phone: "+233200000000",
  subject: "Guest purchase enquiry",
  message:
    "Please confirm availability and coordinate this purchase through admin.",
  listingId: "modern-villa",
};

test("guest enquiry requires no account", async ({ page }) => {
  await page.goto("/marketplace/modern-villa");
  await page.getByRole("button", { name: "Schedule a viewing" }).click();
  await page.getByLabel("Full name", { exact: true }).fill(enquiry.name);
  await page.getByLabel("Email address", { exact: true }).fill(enquiry.email);
  await page.getByLabel("Tell us what you need").fill(enquiry.message);
  await page.getByRole("button", { name: "Send request", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Request received");
  await expect(page.getByRole("alert")).toContainText(
    "admin team will contact you",
  );
  expect(
    (await (await page.request.get("/api/platform?action=session")).json())
      .user,
  ).toBeNull();
});

test("logistics offers rentals and rejects invalid enquiries", async ({
  page,
}) => {
  await page.goto("/services/logistics");
  await page
    .getByRole("button", { name: "Request a quote", exact: true })
    .first()
    .click();
  await page.getByLabel("Logistics service").click();
  await page.getByRole("option", { name: "Car rental", exact: true }).click();
  await page.getByLabel("Full name", { exact: true }).fill("Rental Customer");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("rental@example.com");
  await page
    .getByLabel("Tell us what you need")
    .fill("I need a car and driver for three days in Accra.");
  await page.getByRole("button", { name: "Send request", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Request received");
  expect(
    (
      await post(page.request, "request", { ...enquiry, email: "invalid" })
    ).status(),
  ).toBe(400);
  expect(
    (
      await page.request.post("/api/platform", {
        headers: { origin: "https://attacker.example" },
        data: { action: "request", ...enquiry },
      })
    ).status(),
  ).toBe(403);
});

test("standalone advertiser portal and disabled payments", async ({ page }) => {
  await page.goto("/login?next=%2Fportal%2Flistings");
  await expect(page).toHaveURL(/\/portal\/login\?next=/);
  await page.goto("/portal/register");
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toHaveCount(0);
  await page
    .getByLabel("Full name", { exact: true })
    .fill("Service Advertiser");
  await page
    .getByLabel("Email address", { exact: true })
    .fill(`advertiser-${Date.now()}@example.com`);
  await page
    .getByLabel("Password", { exact: true })
    .fill("A-long-test-password-2026");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page).toHaveURL(/\/portal$/);
  const listing = await post(page.request, "listing", {
    title: "Professional cleaning service",
    category: "Services",
    location: "Accra",
    price: 0,
    unit: "Price on request",
    description:
      "Professional home and office cleaning. Contact admin to coordinate availability.",
    image: "photo-1573167101669-476636b96cea",
  });
  expect(listing.ok()).toBe(true);
  expect((await listing.json()).listing.status).toBe("pending");
  await page.goto("/portal/listings");
  await expect(
    page.getByRole("heading", { name: "Professional cleaning service" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    (
      await post(page.request, "checkout", { product: "professional" })
    ).status(),
  ).toBe(410);
  expect(
    (
      await post(page.request, "mock-settle", {
        reference: "anything",
        status: "success",
      })
    ).status(),
  ).toBe(410);
  expect(
    (await page.request.post("/api/payments/webhook", { data: {} })).status(),
  ).toBe(410);
  await page
    .getByRole("button", { name: "Open workspace navigation", exact: true })
    .click();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/portal\/login$/);
  await page.goto("/pricing");
  await expect(page).toHaveURL(/\/contact$/);
});

test("admin owns guest requests; advertisers cannot bypass admin", async ({
  browser,
}) => {
  test.skip(!process.env.ADMIN_PASSWORD, "Admin seed required");
  const admin = await browser.newContext({ baseURL: origin });
  const owner = await browser.newContext({ baseURL: origin });
  const guest = await browser.newContext({ baseURL: origin });
  try {
    expect(
      (
        await post(admin.request, "login", {
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
        })
      ).ok(),
    ).toBe(true);
    await post(owner.request, "register", {
      name: "Listing Owner",
      email: `owner-${Date.now()}@example.com`,
      password: "A-long-test-password-2026",
      accountType: "Business",
    });
    const item = (
      await (
        await post(owner.request, "listing", {
          title: "Home moving van hire",
          category: "Logistics",
          location: "Accra",
          price: 0,
          unit: "Price on request",
          description:
            "A moving van and driver for home relocations, arranged through Solid Connect admin.",
          image: "photo-1578575437130-527eed3abbec",
        })
      ).json()
    ).listing;
    expect(
      (
        await post(admin.request, "moderate", {
          id: item.id,
          status: "published",
          featured: false,
          verified: false,
        })
      ).ok(),
    ).toBe(true);
    const entry = (
      await (
        await post(guest.request, "request", {
          ...enquiry,
          kind: "Logistics",
          listingId: item.id,
          details: {
            "Service required": "Home move / moving out",
            Origin: "Accra",
            Destination: "Tema",
          },
        })
      ).json()
    ).entry;
    const own = await (
      await owner.request.get("/api/platform?action=dashboard")
    ).json();
    expect(own.requests.some((r: { id: string }) => r.id === entry.id)).toBe(
      false,
    );
    expect(
      (
        await post(owner.request, "message", {
          conversationId: entry.id,
          text: "Cannot bypass admin",
        })
      ).status(),
    ).toBe(403);
    expect(
      (
        await post(owner.request, "request-status", {
          id: entry.id,
          status: "Completed",
        })
      ).status(),
    ).toBe(403);
    const inbox = await (
      await admin.request.get("/api/platform?action=admin")
    ).json();
    expect(
      inbox.requests.find((r: { id: string }) => r.id === entry.id).phone,
    ).toBe(enquiry.phone);
    const page = await admin.newPage();
    await page.goto("/portal/admin");
    await expect(
      page.getByRole("heading", { name: "Every enquiry. One admin team." }),
    ).toBeVisible();
    await expect(page.getByText(entry.id, { exact: true })).toBeVisible();
    expect(
      (
        await post(admin.request, "request-status", {
          id: entry.id,
          status: "In review",
        })
      ).ok(),
    ).toBe(true);
    // A signed-in customer still talks exclusively to admin.
    await post(guest.request, "register", {
      name: "Customer Account",
      email: `customer-${Date.now()}@example.com`,
      password: "A-long-test-password-2026",
      accountType: "Individual",
    });
    const conversation = (
      await (
        await post(guest.request, "request", {
          ...enquiry,
          listingId: item.id,
          subject: "Customer follow-up",
        })
      ).json()
    ).entry;
    expect(
      (
        await post(admin.request, "message", {
          conversationId: conversation.id,
          text: "Admin is coordinating your move.",
        })
      ).ok(),
    ).toBe(true);
    const customer = await (
      await guest.request.get("/api/platform?action=dashboard")
    ).json();
    expect(
      customer.messages.some(
        (message: { text: string }) =>
          message.text === "Admin is coordinating your move.",
      ),
    ).toBe(true);
    expect(
      (
        await post(owner.request, "message", {
          conversationId: conversation.id,
          text: "Advertiser must not enter this conversation.",
        })
      ).status(),
    ).toBe(403);
  } finally {
    await admin.close();
    await owner.close();
    await guest.close();
  }
});
