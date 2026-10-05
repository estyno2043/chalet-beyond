// Production UI with synthetic availability only. No inquiry is submitted.
const { chromium, webkit } = require(
  process.env.PLAYWRIGHT_PATH || "playwright"
);
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.TEST_BASE_URL || "http://localhost:4180";
const output = ".impeccable/review/mobile-followup";
fs.mkdirSync(output, { recursive: true });

(async () => {
  const results = [];
  for (const engine of ["chromium", "webkit"]) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch(
      engine === "chromium"
        ? { channel: "chrome", headless: true }
        : { headless: true }
    );
    for (const [lang, width, height] of [
      ["de", 1280, 720],
      ["sk", 390, 664],
    ]) {
      const page = await browser.newPage({
        viewport: { width, height },
        isMobile: width < 768,
        hasTouch: width < 768,
      });
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.route("**/api/availability", r =>
        r.fulfill({ json: { blocked: [] } })
      );
      await page.goto(`${base}/${lang === "sk" ? "" : lang}`, {
        waitUntil: "networkidle",
      });
      await page.locator('#hero a[href="#rezervacia"]').click();
      await page.waitForSelector(".rdp-day_button", { state: "attached" });
      const counters = page.locator("#rezervacia .guest-counter");
      const adultPlus = counters.nth(0).locator("button").last();
      const childPlus = counters.nth(1).locator("button").last();
      const childMinus = counters.nth(1).locator("button").first();
      await childPlus.click();
      await childPlus.click();
      await page.locator(".rdp-button_next").click();
      const day = n =>
        page
          .locator(".rdp-month")
          .first()
          .locator(".rdp-day_button")
          .filter({ hasText: new RegExp(`^${n}$`) });
      const totalIs = amount =>
        page.waitForFunction(
          amount =>
            document
              .querySelector(".booking-total strong")
              ?.textContent.replace(/\D/g, "") === String(amount),
          amount
        );
      await day(10).click();
      await day(16).click();
      await totalIs(2280);
      assert.equal(
        await page.locator(".summary-discount").count(),
        0,
        "six nights incorrectly discounted"
      );
      await day(10).click();
      await day(17).click();
      await totalIs(2128);
      assert.equal(
        await page
          .locator(".summary-price-lines dd")
          .first()
          .innerText()
          .then(t => t.replace(/\D/g, "")),
        "2660"
      );
      assert.equal(
        await page
          .locator(".summary-discount dd")
          .innerText()
          .then(t => t.replace(/\D/g, "")),
        "532"
      );
      await page
        .locator(".booking-calendar")
        .evaluate(e =>
          window.scrollTo({
            top: e.getBoundingClientRect().top + scrollY - 110,
            behavior: "instant",
          })
        );
      await page.waitForTimeout(400);
      const geometry = await page.evaluate(() => {
        const e = document.querySelector(".booking-summary"),
          r = e.getBoundingClientRect();
        return {
          top: r.top,
          bottom: r.bottom,
          height: r.height,
          position: getComputedStyle(e).position,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      assert(!geometry.overflow);
      if (width >= 1280) {
        assert.equal(geometry.position, "sticky");
        assert(
          geometry.top >= 100 && geometry.bottom <= height,
          `discount summary spills outside viewport: ${JSON.stringify(geometry)}`
        );
      }
      await page
        .locator(".booking-summary")
        .screenshot({ path: `${output}/${engine}-${lang}-weekly-summary.png` });
      for (let i = 0; i < 4; i++) await adultPlus.click();
      assert(
        await adultPlus.isDisabled(),
        "capacity exceeds eight including children"
      );
      await childMinus.click();
      await childMinus.click();
      await adultPlus.click();
      await adultPlus.click();
      await totalIs(3920);
      assert(await adultPlus.isDisabled());
      assert.deepEqual(errors, []);
      results.push({
        engine,
        lang,
        width,
        height,
        sixNightFamily: 2280,
        sevenNightFamily: 2128,
        sevenNightEightAdults: 3920,
        geometry,
        errors,
      });
      await page.close();
    }
    await browser.close();
  }
  fs.writeFileSync(
    "docs/validation/mobile-followup-pricing.json",
    JSON.stringify(
      {
        date: new Date().toISOString(),
        base,
        results,
        mocks: "Availability only; no inquiry submission",
      },
      null,
      2
    )
  );
  console.log(
    JSON.stringify({
      result: "PASS",
      cases: results.length,
      checks: [
        "six vs seven nights",
        "base/discount/total reconciliation",
        "child charge and eight-person capacity",
        "desktop discounted summary fits viewport",
      ],
      output,
    })
  );
})().catch(error => {
  console.error(error);
  process.exit(1);
});
