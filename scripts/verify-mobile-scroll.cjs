// Chrome CDP synthetic touch flings, 4x CPU. Measures rAF cadence, not physical iPhone FPS.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.TEST_BASE_URL || "http://localhost:4180";
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const runs = [];
  for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 664 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.route("**/api/availability", r =>
      r.fulfill({ json: { blocked: [] } })
    );
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Tracing.start", {
      categories: "devtools.timeline",
      transferMode: "ReturnAsStream",
    });
    await page.evaluate(() => {
      window.__scrollProbe = { running: true, frames: [], tasks: [] };
      const probe = window.__scrollProbe;
      probe.observer = new PerformanceObserver(list =>
        probe.tasks.push(...list.getEntries().map(e => e.duration))
      );
      probe.observer.observe({ type: "longtask" });
      let last;
      const tick = now => {
        if (!probe.running) return;
        const hero = document.querySelector(".hero-handoff__hero");
        probe.frames.push({
          delta: last ? now - last : 0,
          scroll: scrollY,
          worldTop: hero.getBoundingClientRect().top + scrollY,
          transform: getComputedStyle(hero).transform,
        });
        last = now;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    for (const yDistance of [-850, 850]) {
      await cdp.send("Input.synthesizeScrollGesture", {
        x: 195,
        y: 400,
        yDistance,
        speed: 900,
        gestureSourceType: "touch",
        preventFling: false,
      });
      await page.waitForTimeout(600);
    }
    const samples = await page.evaluate(() => {
      const probe = window.__scrollProbe;
      probe.running = false;
      probe.observer.disconnect();
      return { frames: probe.frames, longTasks: probe.tasks };
    });
    const completion = new Promise(resolve =>
      cdp.once("Tracing.tracingComplete", resolve)
    );
    await cdp.send("Tracing.end");
    const { stream } = await completion;
    let trace = "";
    for (;;) {
      const chunk = await cdp.send("IO.read", { handle: stream });
      trace += chunk.data;
      if (chunk.eof) break;
    }
    await cdp.send("IO.close", { handle: stream });
    const paints = JSON.parse(trace).traceEvents.filter(
      e => e.name === "Paint"
    );
    const deltas = samples.frames
      .map(f => f.delta)
      .filter(Boolean)
      .sort((a, b) => a - b);
    assert(
      samples.frames.every(
        f => f.transform === "none" && Math.abs(f.worldTop) < 1
      )
    );
    assert(
      Math.max(...samples.frames.map(f => f.scroll)) > 664,
      "gesture did not leave hero"
    );
    const result = {
      run,
      frames: deltas.length,
      rAFp95ms: deltas[Math.floor(deltas.length * 0.95)],
      rAFover50ms: deltas.filter(d => d > 50).length,
      longTasks: samples.longTasks,
      maxScroll: Math.max(...samples.frames.map(f => f.scroll)),
      finalScroll: samples.frames.at(-1).scroll,
      heroWorldGeometryStable: true,
      paintEvents: paints.length,
      paintMs: paints.reduce((sum, e) => sum + (e.dur || 0) / 1000, 0),
    };
    runs.push(result);
    console.log(JSON.stringify(result));
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(
    "docs/validation/mobile-followup-scroll.json",
    JSON.stringify(
      {
        date: new Date().toISOString(),
        method:
          "Production preview, Chrome synthetic touch flings down/up, 390x664, 4x CPU. Three fresh contexts. Includes rAF geometry probe overhead. Not physical Safari or compositor FPS.",
        runs,
      },
      null,
      2
    )
  );
})().catch(error => {
  console.error(error);
  process.exit(1);
});
