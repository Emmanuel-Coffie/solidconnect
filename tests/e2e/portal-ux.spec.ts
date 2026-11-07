import { test, expect } from "@playwright/test";

const origin = "http://127.0.0.1:3001";

test("advertiser creates, edits and withdraws a listing through the workspace", async ({
  page,
}) => {
  await page.request.post("/api/platform", {
    headers: { origin },
    data: {
      action: "register",
      name: "UX Service Partner",
      email: `ux-${Date.now()}@example.com`,
      password: "Long-portal-password-2026",
      accountType: "Business",
    },
  });
  await page.goto("/portal");
  await expect(
    page.getByRole("heading", { name: "Your expertise. A wider audience." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Create your first listing", exact: true })
    .click();
  await page
    .getByLabel("Listing title", { exact: true })
    .fill("Professional office cleaning");
  await page
    .getByRole("navigation", { name: "Workspace navigation" })
    .getByRole("link", { name: "Overview", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Leave without saving?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await expect(page.getByLabel("Listing title", { exact: true })).toHaveValue(
    "Professional office cleaning",
  );
  await page.getByLabel("Location", { exact: true }).fill("Accra");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("Description", { exact: true })
    .fill(
      "Office cleaning for teams in Accra. Availability is coordinated through Solid Connect admin.",
    );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Submit for review", exact: true })
    .click();
  await expect(page).toHaveURL(/\/portal\/listings$/);
  await expect(
    page.getByRole("heading", {
      name: "Professional office cleaning",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Edit listing", exact: true }).click();
  await expect(page.getByLabel("Listing title", { exact: true })).toHaveValue(
    "Professional office cleaning",
  );
  await page
    .getByLabel("Listing title", { exact: true })
    .fill("Office cleaning and maintenance");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Submit for review", exact: true })
    .click();
  await expect(page).toHaveURL(/\/portal\/listings$/);
  await page
    .getByRole("button", { name: "Withdraw listing", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Withdraw listing", exact: true })
    .click();
  await expect(page.locator(".record .status")).toHaveText("suspended");
  await page.goto("/portal/settings");
  await expect(page).toHaveURL(/\/portal\/profile$/);
  await page.goto("/portal/orders");
  await expect(page).toHaveURL(/\/portal\/requests$/);
});

test("admin triages enquiries, recovers search and errors, and uses mobile navigation", async ({
  page,
}) => {
  test.skip(!process.env.ADMIN_PASSWORD, "Admin seed required");
  await page.request.post("/api/platform", {
    headers: { origin },
    data: {
      action: "login",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
  });
  const subject = `UX moving request ${Date.now()}`;
  await page.request.post("/api/platform", {
    headers: { origin },
    data: {
      action: "request",
      kind: "Logistics request",
      name: "UX Customer",
      email: "ux-customer@example.com",
      subject,
      message:
        "Please arrange a moving van with a driver for an office relocation.",
    },
  });
  await page.goto("/portal/admin");
  await page.getByLabel("Search enquiries", { exact: true }).fill(subject);
  await expect(page.locator(".inbox-item")).toHaveCount(1);
  await expect(page.locator(".request-detail-card")).toContainText(subject);
  await page.getByLabel("Request status", { exact: true }).click();
  await page.getByRole("option", { name: "In review", exact: true }).click();
  await expect(page.locator(".MuiAlert-root")).toContainText(
    "Request status updated.",
  );
  await page
    .getByLabel("Search enquiries", { exact: true })
    .fill("No-such-enquiry-xyz");
  await expect(
    page.getByRole("heading", { name: "No matches found." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(
    page.getByLabel("Search enquiries", { exact: true }),
  ).toBeFocused();
  await expect(page.locator(".inbox-item").first()).toBeVisible();
  await page.route("**/api/platform?action=admin", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Temporarily unavailable." }),
    }),
  );
  await page
    .getByRole("button", { name: "Refresh inbox", exact: true })
    .click();
  await expect(page.locator(".MuiAlert-root")).toContainText(
    "Your current view is preserved.",
  );
  await page.unroute("**/api/platform?action=admin");
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.locator(".MuiAlert-root")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".inbox-item").first().click();
  await expect(
    page.getByRole("button", { name: "Back to enquiries" }),
  ).toBeVisible();
  await expect(page.locator(".inbox-queue")).toBeHidden();
  await page.getByRole("button", { name: "Back to enquiries" }).click();
  await page.getByRole("button", { name: "Open workspace navigation" }).click();
  await expect(
    page
      .getByRole("presentation")
      .getByRole("navigation", { name: "Workspace navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open workspace navigation" }),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
