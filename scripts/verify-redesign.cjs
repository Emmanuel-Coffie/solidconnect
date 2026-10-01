const { chromium } = require("@playwright/test");
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  for (const [url, name] of [
    ["/marketplace", "marketplace-redesign"],
    ["/services", "services-redesign"],
    ["/", "home-redesign"],
  ]) {
    await p.goto("http://127.0.0.1:3001" + url, {
      waitUntil: "networkidle",
      timeout: 120000,
    });
    await p.screenshot({ path: "docs/" + name + ".png", fullPage: false });
    console.log(name, await p.locator("h1").innerText());
  }
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto("http://127.0.0.1:3001/marketplace", {
    waitUntil: "networkidle",
  });
  await p.screenshot({
    path: "docs/marketplace-redesign-mobile.png",
    fullPage: true,
  });
  console.log(
    "overflow",
    await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
