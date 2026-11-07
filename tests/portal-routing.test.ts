import test from "node:test";
import assert from "node:assert/strict";
import { portalDestination } from "../src/lib/portal-routing";

const origins = {
  portalHost: "portal.solidconnectltd.com",
  portalUrl: "https://portal.solidconnectltd.com",
  publicUrl: "https://www.solidconnectltd.com",
};
test("public account links preserve their destination on the canonical portal", () => {
  assert.equal(
    portalDestination(
      "https://www.solidconnectltd.com/portal/login?next=%2Fportal%2Flistings",
      origins,
    )?.href,
    "https://portal.solidconnectltd.com/portal/login?next=%2Fportal%2Flistings",
  );
});
test("portal public navigation returns to the website while portal aliases stay local", () => {
  assert.equal(
    portalDestination(
      "https://portal.solidconnectltd.com/marketplace?q=cleaning",
      origins,
    )?.href,
    "https://www.solidconnectltd.com/marketplace?q=cleaning",
  );
  assert.equal(
    portalDestination("https://portal.solidconnectltd.com/", origins)?.pathname,
    "/portal",
  );
  assert.equal(
    portalDestination(
      "https://portal.solidconnectltd.com/login?next=%2Fportal",
      origins,
    )?.pathname,
    "/portal/login",
  );
  assert.equal(
    portalDestination(
      "https://portal.solidconnectltd.com/dashboard/listings",
      origins,
    )?.pathname,
    "/portal/listings",
  );
});
test("canonical routing excludes API, media, existing portal pages and preview hosts", () => {
  for (const path of [
    "/api/platform",
    "/_next/data/file",
    "/images/logo.png",
    "/portal/admin",
  ])
    assert.equal(
      portalDestination("https://portal.solidconnectltd.com" + path, origins),
      null,
    );
  assert.equal(
    portalDestination("https://preview.vercel.app/portal", origins),
    null,
  );
  assert.equal(portalDestination("http://localhost:3001/portal", {}), null);
});
