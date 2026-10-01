// Check deferred content and required 1280px booking composition.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const assert = require("assert");
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });
  await page.route("**/api/availability", r =>
    r.fulfill({ json: { blocked: [] } })
  );
  await page.goto(`${base}/de`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".gallery-cover").count(), 0);
  await page.locator('#hero a[href="#rezervacia"]').click();
  await page.waitForSelector(".rdp-month");
  await page.waitForFunction(
    () => document.querySelectorAll(".rdp-month").length === 2
  );
  await page.waitForTimeout(500);
  assert(
    await page
      .locator("#rezervacia")
      .evaluate(e => e.getBoundingClientRect().top < 150)
  );
  await page
    .locator(".booking-calendar")
    .evaluate(e =>
      window.scrollTo({
        top: e.getBoundingClientRect().top + scrollY - 110,
        behavior: "instant",
      })
    );
  const geometry = await page.evaluate(() => {
    const calendar = document.querySelector(".booking-calendar");
    const summary = document.querySelector(".booking-summary");
    const a = calendar.getBoundingClientRect(),
      b = summary.getBoundingClientRect();
    return {
      calendarRight: a.right,
      summaryLeft: b.left,
      top: b.top,
      height: b.height,
      position: getComputedStyle(summary).position,
      targetWidth: document
        .querySelector(".rdp-day_button")
        .getBoundingClientRect().width,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  assert(geometry.summaryLeft > geometry.calendarRight);
  assert.equal(geometry.position, "sticky");
  assert(geometry.targetWidth >= 44);
  assert(!geometry.overflow);
  assert(geometry.top >= 70 && geometry.top < 150);
  assert(geometry.top + geometry.height <= 720);
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.waitForSelector("#date-validation");
  // A cold direct URL must load the real destination, not leave a placeholder.
  await page.goto(`${base}/de#cennik`, { waitUntil: "networkidle" });
  await page.waitForSelector(".calculated-price");
  assert(
    await page
      .locator("#cennik")
      .evaluate(e => e.getBoundingClientRect().top < 150)
  );
  console.log({
    result: "PASS",
    geometry,
    checks: [
      "cold hero CTA loads booking",
      "1280px adjacent two-month calendar and sticky summary",
      "44px targets",
      "cold pricing deep link",
    ],
  });
  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
