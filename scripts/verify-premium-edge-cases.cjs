// All inquiry and availability requests are mocked; no live emails.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const assert = require("assert");
(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });
  let responseMode = "taken";
  let posted = 0;
  const p = await b.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const future = new Date();
  future.setMonth(future.getMonth() + 1, 10);
  const iso = d =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const d11 = new Date(future);
  d11.setDate(11);
  const d12 = new Date(future);
  d12.setDate(12);
  await p.route("**/api/availability", r =>
    r.fulfill({
      json: { blocked: [iso(future), iso(d11), iso(d12)], degraded: false },
    })
  );
  await p.route("**/api/inquiry", r => {
    posted++;
    return responseMode === "taken"
      ? r.fulfill({ status: 409, json: { code: "dates_taken" } })
      : r.fulfill({ json: { ok: true, confirmationSent: false } });
  });
  await p.goto(`${process.env.TEST_BASE_URL || "http://localhost:3000"}/de`, {
    waitUntil: "networkidle",
  });
  await p.locator('#hero a[href="#rezervacia"]').click();
  await p.waitForSelector(".rdp-button_next", { state: "attached" });
  await p.locator(".rdp-button_next").click();
  const month = p.locator(".rdp-month").first();
  const day = n =>
    month.locator(".rdp-day_button").filter({ hasText: new RegExp(`^${n}$`) });
  await day(10).click();
  assert.equal(await p.locator(".summary-lines dd").first().innerText(), "—");
  await day(8).click();
  await day(10).click();
  await p.waitForTimeout(260);
  assert(
    await p
      .locator(".booking-total strong")
      .innerText()
      .then(t => t.replace(/\D/g, "") === "600")
  );
  await day(8).click();
  await day(14).click();
  assert(
    await p
      .locator("#date-validation")
      .innerText()
      .then(t => t.includes("belegte"))
  );
  await p.reload({ waitUntil: "networkidle" });
  await p.locator('#hero a[href="#rezervacia"]').click();
  await p.waitForSelector(".rdp-button_next", { state: "attached" });
  await p.locator(".rdp-button_next").click();
  await day(16).click();
  await day(19).click();
  await p.getByRole("button", { name: "Weiter", exact: true }).click();
  await p.locator("#inquiry-name").fill("Test Family");
  await p.locator("#inquiry-email").fill("test@example.invalid");
  await p.waitForSelector(".mobile-book-bar", { state: "detached" });
  await p.locator("button[type=submit]").click();
  await p.waitForTimeout(400);
  assert(
    await p
      .locator("#date-validation")
      .innerText()
      .then(t => t.includes("belegt"))
  );
  assert.equal(posted, 1);
  await p.locator("#priestory").scrollIntoViewIfNeeded();
  await p.locator(".gallery-cover").first().tap();
  await p.waitForSelector("[role=dialog]");
  await p.waitForTimeout(550);
  const c = await p.context().newCDPSession(p);
  let box = await p.locator(".lightbox-drag").boundingBox();
  let x = box.x + box.width * 0.8,
    y = box.y + box.height / 2;
  await c.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let i = 1; i <= 10; i++) {
    await c.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - i * 18, y }],
    });
    await p.waitForTimeout(20);
  }
  await c.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await p.waitForTimeout(300);
  assert(
    await p
      .locator(".lightbox-navigation p")
      .innerText()
      .then(t => t.includes("2 /"))
  );
  box = await p.locator(".lightbox-drag").boundingBox();
  x = box.x + box.width / 2;
  y = box.y + box.height * 0.3;
  await c.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let i = 1; i <= 10; i++) {
    await c.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y + i * 16 }],
    });
    await p.waitForTimeout(20);
  }
  await c.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await p.waitForSelector("[role=dialog]", { state: "detached" });
  await p.route("**/api/availability", r =>
    r.fulfill({ status: 502, json: { error: "unavailable" } })
  );
  await p.reload({ waitUntil: "networkidle" });
  await p.locator('#hero a[href="#rezervacia"]').click();
  await p.waitForSelector(".rdp-day_button");
  assert(
    await p
      .locator("#availability-state")
      .innerText()
      .then(t => t.includes("E-Mail"))
  );
  console.log({
    result: "PASS",
    checks: [
      "occupied nights: checkout-only permitted, occupied arrival rejected, spans rejected",
      "dates_taken 409 returns localized calendar error",
      "mobile bar hides during input focus",
      "CDP touch swipe and downward dismissal",
      "availability failure reports confirmation needed",
    ],
    posted: "mocked only",
  });
  await b.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
