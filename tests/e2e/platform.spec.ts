import { test, expect } from "@playwright/test";
const base = "http://127.0.0.1:3001";
test("public pages, search, empty results, tracking and mobile navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /People. Businesses./ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore Our Services" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Seven ways to create stronger connections.",
    }),
  ).toBeVisible();
  await page.goto("/marketplace");
  await page.getByLabel("What are you looking for?").fill("Frontend");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Frontend Developer" }),
  ).toBeVisible();
  await page.getByLabel("What are you looking for?").fill("no-results-zzzzz");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No matches just yet." }),
  ).toBeVisible();
  await page.goto("/track");
  await page.getByRole("button", { name: "SC-DEMO-2026" }).click();
  await expect(page.getByText("Rotterdam, Netherlands")).toBeVisible();
  await page.getByLabel("Tracking number", { exact: true }).fill("INVALID");
  await page
    .getByRole("button", { name: "Track shipment", exact: true })
    .click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "No shipment found",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("link", { name: "Track a shipment", exact: true }).last(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close navigation" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "docs/home-mobile.png", fullPage: true });
  expect(errors).toEqual([]);
});
test("account, listing, enquiry, messaging, favourites, payments and authorization", async ({
  page,
}) => {
  const email = `qa-${Date.now()}@example.com`;
  await page.goto("/register");
  await page.getByLabel("Full name", { exact: true }).fill("QA Solid Connect");
  await page.getByLabel("Email address", { exact: true }).fill(email);
  await page
    .getByLabel("Password", { exact: true })
    .fill("Test-account-password-2026");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page).toHaveURL(/dashboard$/);
  await expect(
    page.getByRole("heading", { name: /Welcome back/ }),
  ).toBeVisible();
  const post = (action: string, data: object = {}) =>
    page.request.post("/api/platform", {
      headers: { origin: base },
      data: { action, ...data },
    });
  expect((await page.request.get("/api/platform?action=admin")).status()).toBe(
    403,
  );
  expect(
    (
      await page.request.post("/api/platform", {
        headers: { origin: "https://attacker.example" },
        data: { action: "save", listingId: "modern-villa" },
      })
    ).status(),
  ).toBe(403);
  await page.goto("/dashboard/listings/new");
  await page.getByLabel("Listing title").fill("QA Operations Coordinator");
  await page.getByLabel("Location", { exact: true }).fill("Accra, Ghana");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("Description", { exact: true })
    .fill(
      "Coordinate logistics operations and keep our growing business connected with customers.",
    );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page).toHaveURL(/dashboard\/listings$/);
  await expect(
    page.getByRole("heading", { name: "QA Operations Coordinator" }),
  ).toBeVisible();
  const application = await post("request", {
    kind: "Job application",
    name: "QA Solid Connect",
    email,
    subject: "Frontend Developer",
    message: "I would like to apply with my React and TypeScript experience.",
    listingId: "frontend-developer",
  });
  expect(application.ok()).toBe(true);
  expect(
    (
      await post("request", {
        kind: "Job application",
        name: "QA Solid Connect",
        email,
        subject: "Frontend Developer",
        message: "A duplicate application should be rejected.",
        listingId: "frontend-developer",
      })
    ).status(),
  ).toBe(409);
  const entry = (await application.json()).entry;
  expect(
    (
      await post("message", {
        conversationId: entry.id,
        text: "Thank you for reviewing my application.",
      })
    ).ok(),
  ).toBe(true);
  expect(
    (
      await post("message", { conversationId: "not-mine", text: "Forbidden" })
    ).status(),
  ).toBe(403);
  for (const kind of [
    "Artisans",
    "Property viewing",
    "Logistics",
    "Distribution",
    "Sales & Marketing",
    "Import & Export",
  ]) {
    const response = await post("request", {
      kind,
      name: "QA Solid Connect",
      email,
      subject: `QA ${kind} request`,
      message:
        "Please help me with this service request and provide a quotation.",
      details: { Origin: "Tema", Destination: "Kumasi" },
    });
    expect(response.ok()).toBe(true);
  }
  expect((await post("save", { listingId: "modern-villa" })).ok()).toBe(true);
  await page.goto("/dashboard/saved");
  await expect(
    page.getByRole("heading", { name: "A new perspective on city living" }),
  ).toBeVisible();
  await page.goto("/dashboard/messages");
  await expect(
    page.getByText("Thank you for reviewing my application."),
  ).toBeVisible();
  await page.goto("/checkout?product=professional");
  await page.getByLabel("Billing name").fill("QA Solid Connect");
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(
    page.getByRole("button", { name: "Simulate successful payment" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Simulate successful payment" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Test payment successful" }),
  ).toBeVisible();
  const dashboard = await (
    await page.request.get("/api/platform?action=dashboard")
  ).json();
  expect(dashboard.payments[0].status).toBe("success");
  expect(dashboard.payments[0].amount).toBe(9900);
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Recent activity" }),
  ).toBeVisible();
  await page.screenshot({ path: "docs/dashboard-desktop.png", fullPage: true });
  await post("logout");
  expect(
    (await page.request.get("/api/platform?action=dashboard")).status(),
  ).toBe(401);
});

test("administrator moderation, upload rejection, payment failure and account isolation", async ({
  page,
  browser,
}) => {
  test.skip(!process.env.ADMIN_PASSWORD, "Local admin seed required.");
  const login = await page.request.post("/api/platform", {
    headers: { origin: base },
    data: {
      action: "login",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
  });
  expect(login.ok()).toBe(true);
  const data = await (
    await page.request.get("/api/platform?action=admin")
  ).json();
  const listing = data.listings.find(
    (l: { title: string; status: string }) =>
      l.title === "QA Operations Coordinator" && l.status === "pending",
  );
  expect(listing).toBeTruthy();
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Keep the network moving." }),
  ).toBeVisible();
  const moderate = await page.request.post("/api/platform", {
    headers: { origin: base },
    data: {
      action: "moderate",
      id: listing.id,
      status: "published",
      featured: false,
      verified: false,
    },
  });
  expect(moderate.ok()).toBe(true);
  const publicListings = await (
    await page.request.get("/api/platform?action=listings")
  ).json();
  expect(
    publicListings.listings.some((l: { id: string }) => l.id === listing.id),
  ).toBe(true);
  const context = await browser.newContext({ baseURL: base });
  const other = await context.newPage();
  const email = `isolation-${Date.now()}@example.com`;
  await other.request.post("/api/platform", {
    headers: { origin: base },
    data: {
      action: "register",
      name: "QA Isolated User",
      email,
      password: "Another-test-password-2026",
      accountType: "Individual",
    },
  });
  const forbidden = await other.request.post("/api/platform", {
    headers: { origin: base },
    data: { action: "listing-status", id: listing.id },
  });
  expect(forbidden.status()).toBe(404);
  const upload = await other.request.post("/api/upload", {
    headers: { origin: base },
    multipart: {
      file: {
        name: "fake.png",
        mimeType: "image/png",
        buffer: Buffer.from("not an image"),
      },
    },
  });
  expect(upload.status()).toBe(400);
  const initiated = await (
    await other.request.post("/api/platform", {
      headers: { origin: base },
      data: { action: "checkout", product: "listing", amount: 1 },
    })
  ).json();
  expect(initiated.payment.amount).toBe(4900);
  const settled = await other.request.post("/api/platform", {
    headers: { origin: base },
    data: {
      action: "mock-settle",
      reference: initiated.payment.reference,
      status: "failed",
    },
  });
  expect(settled.ok()).toBe(true);
  await other.goto(`/payment/success?reference=${initiated.payment.reference}`);
  await expect(
    other.getByRole("heading", { name: "Payment was not completed" }),
  ).toBeVisible();
  const isolated = await page.request.get(
    `/api/platform?action=payment&reference=${initiated.payment.reference}`,
  );
  expect(isolated.status()).toBe(404);
  const replay = await (
    await other.request.post("/api/platform", {
      headers: { origin: base },
      data: {
        action: "mock-settle",
        reference: initiated.payment.reference,
        status: "success",
      },
    })
  ).json();
  expect(replay.payment.status).toBe("failed");
  await page.goto("/dashboard/profile");
  await expect(
    page.getByRole("heading", { name: "Your profile" }),
  ).toBeVisible();
  await page
    .getByLabel("Full name", { exact: true })
    .fill("Solid Connect Admin");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Profile updated.")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Recent activity" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "docs/dashboard-mobile.png", fullPage: true });
  await context.close();
});
