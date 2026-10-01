// Synthetic inquiry API only. No real owner or guest email is sent.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const fs = require("fs");
const assert = require("assert");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  let requests = [];
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.route("**/api/availability", r =>
    r.fulfill({ json: { blocked: [], degraded: false } })
  );
  await page.route("**/api/inquiry", r => {
    requests.push(r.request().postDataJSON());
    return r.fulfill({ json: { ok: true, confirmationSent: true } });
  });
  await page.goto(
    `${process.env.TEST_BASE_URL || "http://localhost:3000"}/de`,
    { waitUntil: "networkidle" }
  );
  await page.locator("#cennik").scrollIntoViewIfNeeded();
  const childPlus = page
    .locator("#cennik")
    .getByRole("button", { name: "+ Kinder (0–15)", exact: true });
  for (let i = 0; i < 4; i++) await childPlus.click();
  assert(
    await page
      .locator("#cennik .calculated-price")
      .innerText()
      .then(t => t.includes("475 €"))
  );
  await page.locator("#rezervacia").scrollIntoViewIfNeeded();
  await page.waitForSelector(".rdp-day_button");
  assert.equal(
    await page
      .locator("#booking-guest-1")
      .locator("..")
      .locator("output")
      .textContent(),
    "4"
  );
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  assert(
    await page
      .locator("#date-validation")
      .innerText()
      .then(t => t.includes("mindestens"))
  );
  const days = page
    .locator(".rdp-month")
    .first()
    .locator(".rdp-day_button:not(:disabled)");
  await days.nth(10).click();
  await days.nth(13).click();
  await page.waitForTimeout(300);
  assert.equal(
    await page.locator(".booking-total strong").innerText(),
    "1425 €"
  );
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.locator("#inquiry-name").fill("Test Family");
  await page.locator("#inquiry-email").fill("test@example.invalid");
  await page
    .locator("#inquiry-message")
    .fill("Synthetic browser test. Never delivered.");
  await page.locator('button[type="submit"]').click();
  await page.waitForSelector(".booking-success");
  await page.waitForFunction(() => document.activeElement?.classList.contains("booking-success"));
  assert.equal(requests.length, 1);
  assert.equal(requests[0].children, 4);
  assert.equal(requests[0].phone, "");
  assert(
    await page
      .locator(".booking-success")
      .evaluate(e => e === document.activeElement)
  );
  await page
    .locator("#rezervacia")
    .screenshot({ path: ".impeccable/review/booking-success-desktop.png" });
  await page.locator("#priestory").scrollIntoViewIfNeeded();
  await page.locator(".gallery-cover").first().click();
  await page.waitForSelector('[role="dialog"]');
  await page.waitForTimeout(550);
  assert.equal(
    await page
      .locator('[role="dialog"]')
      .evaluate(e => e.parentElement.tagName),
    "BODY"
  );
  assert.equal(
    await page.evaluate(() => document.documentElement.style.overflow),
    "hidden"
  );
  assert(
    await page
      .locator('[role="dialog"]')
      .evaluate(e => e.contains(document.activeElement))
  );
  await page.keyboard.press("ArrowRight");
  assert(
    await page
      .locator(".lightbox-navigation p")
      .innerText()
      .then(t => t.includes("2 /"))
  );
  await page.screenshot({ path: ".impeccable/review/lightbox-desktop.png" });
  await page.keyboard.press("Escape");
  await page.waitForSelector('[role="dialog"]', { state: "detached" });
  assert(
    await page
      .locator(".gallery-cover")
      .first()
      .evaluate(e => e === document.activeElement)
  );
  assert.equal(
    await page.evaluate(() => document.documentElement.style.overflow),
    ""
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".gallery-cover").first().click();
  await page.waitForSelector(".lightbox-drag");
  await page.waitForTimeout(550);
  let b = await page.locator(".lightbox-drag").boundingBox();
  await page.mouse.move(b.x + b.width * 0.8, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.2, b.y + b.height / 2, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  assert(
    await page
      .locator(".lightbox-navigation p")
      .innerText()
      .then(t => t.includes("2 /"))
  );
  b = await page.locator(".lightbox-drag").boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height * 0.3);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height * 0.3 + 160, {
    steps: 12,
  });
  await page.mouse.up();
  await page.waitForSelector('[role="dialog"]', { state: "detached" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#chalet").scrollIntoViewIfNeeded();
  assert.equal(
    await page
      .locator(".scroll-photo")
      .first()
      .evaluate(e => getComputedStyle(e).animationName),
    "none"
  );
  assert.equal(
    await page
      .locator(".guest-counter button")
      .first()
      .evaluate(e => getComputedStyle(e).transform),
    "none"
  );
  console.log(
    JSON.stringify({
      result: "PASS",
      checks: [
        "2 adults + 4 children = 475/night; shared with booking",
        "3 nights = 1425",
        "inline missing-date error",
        "optional phone POST; mocked success focus",
        "gallery portal, scroll lock, focus return, keyboard immediate",
        "pointer swipe + downward dismissal",
        "reduced motion static parallax",
      ],
      requests: "mocked only",
      errors,
    })
  );
  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
