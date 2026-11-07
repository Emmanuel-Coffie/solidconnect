import { test, expect } from "@playwright/test";

test("marketplace search, empty recovery and responsive portal", async ({
  page,
}) => {
  await page.goto("/marketplace");
  await expect(
    page.getByRole("heading", {
      name: "Products. Services. Your next connection.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "A new perspective on city living" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/screenshots/marketplace-desktop.png",
    fullPage: true,
  });
  await page.getByLabel("What are you looking for?").fill("no-results-zzzz");
  await page.getByLabel("What are you looking for?").press("Enter");
  await expect(
    page.getByRole("heading", { name: "No matches just yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No matches just yet." }),
  ).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portal/login");
  await expect(
    page.getByRole("navigation", { name: "Portal navigation" }),
  ).toBeVisible();
  await page.getByLabel("Email address", { exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Password", { exact: true })).toBeFocused();
  await page.screenshot({
    path: "test-results/screenshots/portal-mobile.png",
    fullPage: true,
  });
  const overflow = await page.evaluate(() =>
    Array.from(document.querySelectorAll("body *"))
      .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
      .map((el) => ({
        tag: el.tagName,
        cls: el.className,
        width: el.getBoundingClientRect().width,
      }))
      .slice(0, 12),
  );
  expect(overflow).toEqual([]);
});
