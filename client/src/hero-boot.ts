/*
 * Inlined by scripts/prerender-hero.mjs right after the prerendered hero, as a
 * classic script: it runs before the first paint, so the title entrance starts
 * without waiting for the app bundle. React picks it up from
 * window.__heroBoot (see Hero.tsx).
 */
import {
  playTitleEntrance,
  titleFontReady,
  type HeroBoot,
} from "./components/hero-entrance";

const boot: HeroBoot = { parsedAt: performance.now() };
window.__heroBoot = boot;

const section = document.getElementById("hero");
const title = document.getElementById("hero-title");

if (section && title) {
  // The markup was rendered without knowing the guest's settings.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.dataset.intro = "off";
    title.dataset.intro = "off";
  } else {
    void titleFontReady().then(() => {
      // React got here first and runs the entrance on its own title.
      if (!title.isConnected) return;
      boot.startedAt = performance.now();
      playTitleEntrance(section, title);
    });
  }
}
