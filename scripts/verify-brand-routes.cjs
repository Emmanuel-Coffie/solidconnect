const { chromium } = require("@playwright/test");
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  const p = await b.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  for (const [route, name] of [
    ["/services/recruitment", "recruitment-brand"],
    ["/services/real-estate", "property-brand"],
    ["/contact", "contact-brand"],
    ["/about", "about-brand"],
  ]) {
    await p.goto("http://127.0.0.1:3001" + route, {
      waitUntil: "networkidle",
      timeout: 120000,
    });
    console.log(
      route,
      await p.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter(
          (i) => i.loading !== "lazy" && (!i.complete || !i.naturalWidth),
        ).length,
        animation: getComputedStyle(document.querySelector(".page-arrival"))
          .animationName,
      })),
    );
    await p.screenshot({ path: "docs/" + name + ".png" });
  }
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto("http://127.0.0.1:3001/services", { waitUntil: "networkidle" });
  await p.screenshot({
    path: "docs/services-brand-mobile.png",
    fullPage: true,
  });
  console.log(
    "mobile services overflow",
    await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  );
  console.log("pageErrors", errors);
  await b.close();
  if (errors.length) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
