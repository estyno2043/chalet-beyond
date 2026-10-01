// Render checks in Chrome and WebKit. Emulation cannot reproduce Safari's toolbar or rubber-band physics.
// API responses are mocked. No inquiry email is sent.
const { chromium, webkit } = require(
  process.env.PLAYWRIGHT_PATH || "playwright"
);
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.TEST_BASE_URL || "http://localhost:4180";
const output = ".impeccable/review/mobile-followup";
fs.mkdirSync(output, { recursive: true });

const box = el => {
  const r = el.getBoundingClientRect();
  return {
    top: r.top,
    bottom: r.bottom,
    height: r.height,
    worldTop: r.top + scrollY,
  };
};

(async () => {
  const results = [];
  for (const engine of (process.env.TEST_ENGINES || "chromium,webkit").split(
    ","
  )) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch(
      engine === "chromium"
        ? { channel: "chrome", headless: true }
        : { headless: true }
    );
    for (const [lang, width, height] of [
      ["sk", 430, 740],
      ["de", 390, 664],
      ["en", 375, 600],
      ["pl", 320, 568],
    ]) {
      const page = await browser.newPage({
        viewport: { width, height },
        isMobile: true,
        hasTouch: true,
      });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.route("**/api/availability", route =>
        route.fulfill({ json: { blocked: [] } })
      );
      await page.goto(`${base}/${lang === "sk" ? "" : lang}`, {
        waitUntil: "networkidle",
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2000);
      const initial = await page.evaluate(() => {
        const rect = selector => {
          const r = document.querySelector(selector).getBoundingClientRect();
          return { top: r.top, bottom: r.bottom, height: r.height };
        };
        return {
          hero: rect("#hero"),
          title: rect("#hero-title"),
          cta: rect("#hero .roll-btn"),
          stats: rect(".chalet-hero__stats"),
          innerHeight,
          bar: !!document.querySelector(".mobile-book-bar"),
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      assert(!initial.bar, "contact bar covers cold hero");
      assert(!initial.overflow, "horizontal overflow");
      assert(initial.title.top >= 72, "heading collides with navigation");
      assert(
        initial.stats.bottom <= height + 1,
        "facts extend behind available viewport"
      );
      assert(initial.cta.bottom < initial.stats.top);
      await page.screenshot({
        path: `${output}/${engine}-${lang}-${width}-hero.png`,
      });

      const samples = [];
      for (const y of [
        0,
        height * 0.35,
        height * 0.8,
        height * 1.25,
        height * 0.6,
        height * 0.1,
        0,
      ]) {
        await page.evaluate(
          y => window.scrollTo({ top: y, behavior: "instant" }),
          y
        );
        await page.waitForTimeout(80);
        const sample = await page.evaluate(() => {
          const h = document.querySelector(".hero-handoff__hero");
          const s = document.querySelector("#page-sheet");
          return {
            scroll: scrollY,
            heroWorldTop: h.getBoundingClientRect().top + scrollY,
            sheetWorldTop: s.getBoundingClientRect().top + scrollY,
            transform: getComputedStyle(h).transform,
            dim: !!document.querySelector(".hero-handoff__dim"),
          };
        });
        assert.equal(sample.transform, "none");
        assert(!sample.dim);
        assert(
          Math.abs(sample.heroWorldTop) < 1,
          "hero moves relative to document"
        );
        assert(
          Math.abs(sample.sheetWorldTop - initial.hero.height) < 1,
          "handoff geometry jumps"
        );
        samples.push(sample);
      }
      await page.waitForTimeout(350);
      assert.equal(await page.locator(".mobile-book-bar").count(), 0);
      // Height changes simulate layout constraints, not Safari browser chrome.
      await page.setViewportSize({ width, height: height + 120 });
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(100);
      assert.equal(
        await page
          .locator("#hero")
          .evaluate(e => Math.round(e.getBoundingClientRect().height)),
        height
      );
      assert.equal(await page.locator(".mobile-book-bar").count(), 0);

      if (lang === "sk") {
        await page.waitForSelector(".gallery-cover", { state: "attached" });
        const photos = page.locator(".gallery-cover .photo-reveal");
        const photo = photos.nth(1);
        const position = await photo.evaluate(box);
        await page.evaluate(
          y => window.scrollTo({ top: y, behavior: "instant" }),
          position.worldTop + position.height / 2 - height * 0.75 - 30
        );
        await photo.locator("img").evaluate(img => img.decode());
        await page.waitForTimeout(120);
        assert.equal(
          await photo.getAttribute("data-photo-reveal"),
          "pending",
          "photo reveals before midpoint"
        );
        await page.evaluate(() =>
          window.scrollBy({ top: 60, behavior: "instant" })
        );
        await page
          .waitForFunction(
            () =>
              document
                .querySelectorAll(".gallery-cover .photo-reveal")[1]
                ?.getAttribute("data-photo-reveal") !== "pending",
            null,
            { timeout: 1500 }
          )
          .catch(async error => {
            console.error(
              engine,
              await photo.evaluate(e => ({
                state: e.dataset.photoReveal,
                midpoint:
                  e.getBoundingClientRect().top +
                  e.getBoundingClientRect().height / 2,
                viewport: innerHeight,
                scrollY,
              }))
            );
            throw error;
          });
        assert.equal(
          await photo.getAttribute("data-photo-reveal"),
          "revealing",
          "decoded photo should animate at midpoint"
        );
        assert.equal(
          await photo
            .locator(".photo-reveal__scale")
            .evaluate(e => getComputedStyle(e).clipPath),
          "none"
        );
        await page.screenshot({
          path: `${output}/${engine}-photo-midpoint.png`,
        });
        await page.waitForTimeout(850);
        assert.equal(await photo.getAttribute("data-photo-reveal"), "done");
        await page.evaluate(() =>
          window.scrollBy({ top: -200, behavior: "instant" })
        );
        assert.equal(
          await photo.getAttribute("data-photo-reveal"),
          "done",
          "reverse scroll re-hides photo"
        );
        // Jump directly beyond the marker; the card-entry fallback must make it visible.
        const jumped = photos.nth(2);
        const target = await jumped.evaluate(box);
        await page.evaluate(
          y => window.scrollTo({ top: y, behavior: "instant" }),
          target.worldTop + target.height * 0.6
        );
        await page.waitForTimeout(950);
        assert.equal(
          await jumped.getAttribute("data-photo-reveal"),
          "done",
          "fast jump leaves photo pending"
        );

        await page.emulateMedia({ reducedMotion: "reduce" });
        const reduced = photos.nth(3);
        const reducedPosition = await reduced.evaluate(box);
        await page.evaluate(
          y => window.scrollTo({ top: y, behavior: "instant" }),
          reducedPosition.worldTop +
            reducedPosition.height / 2 -
            height * 0.75 -
            30
        );
        await reduced.locator("img").evaluate(img => img.decode());
        assert.equal(
          await reduced
            .locator(".photo-reveal__scale")
            .evaluate(e => getComputedStyle(e).transform),
          "none"
        );
        await page.evaluate(() =>
          window.scrollBy({ top: 60, behavior: "instant" })
        );
        await page.waitForTimeout(950);
        assert.equal(await reduced.getAttribute("data-photo-reveal"), "done");
      }
      assert.deepEqual(errors, []);
      results.push({ engine, lang, width, height, initial, samples, errors });
      await page.close();
    }
    await browser.close();
  }
  fs.writeFileSync(
    "docs/validation/mobile-followup-browser.json",
    JSON.stringify(
      {
        date: new Date().toISOString(),
        base,
        results,
        limitation:
          "WebKit/Chrome emulation. Safari toolbar, physical iPhone inertia and rubber-band not reproduced.",
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
        "cold hero CTA and facts fit short viewports",
        "native hero world geometry stays fixed down/up",
        "viewport resize and return-to-top bar state",
        "photo midpoint, fast jump, once-only reveal, reduced motion",
      ],
      output,
    })
  );
})().catch(error => {
  console.error(error);
  process.exit(1);
});
