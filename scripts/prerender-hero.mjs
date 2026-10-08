/*
 * Puts the hero into the built HTML, one page per language, so the title is
 * on screen before the app bundle arrives — the hero title is the page's
 * largest paint. React still renders the whole page as before and replaces
 * this markup; hero-boot.ts and Hero.tsx keep the entrance continuous.
 *
 * Runs after `vite build` (package.json "build"). Writes index.html (sk) and
 * de.html / en.html / pl.html; netlify.toml routes /de, /en, /pl to them.
 */
import { build as esbuild } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "dist/public");
const ssrDir = path.join(root, "dist/prerender");

await build({
  configFile: path.join(root, "vite.config.ts"),
  logLevel: "warn",
  build: {
    ssr: path.join(root, "client/src/prerender.tsx"),
    outDir: ssrDir,
    emptyOutDir: true,
  },
});
const { renderHero, LANGS } = await import(
  pathToFileURL(path.join(ssrDir, "prerender.js")).href
);

const boot = await esbuild({
  entryPoints: [path.join(root, "client/src/hero-boot.ts")],
  bundle: true,
  format: "iife",
  minify: true,
  target: "es2020",
  write: false,
});
const bootScript = boot.outputFiles[0].text.trim();

const template = fs.readFileSync(path.join(publicDir, "index.html"), "utf8");
for (const marker of ['<html lang="sk">', '<div id="root"></div>']) {
  if (!template.includes(marker)) throw new Error(`index.html lacks ${marker}`);
}

for (const lang of LANGS) {
  // The wrappers Home and HeroHandoff put around the hero, so it sits where
  // React will render it.
  const markup =
    '<div class="min-h-screen" style="background:oklch(0.06 0.008 55);color:oklch(0.92 0.008 75)">' +
    `<div class="hero-handoff__hero">${renderHero(lang)}</div></div>`;
  // Function replacements: the minified script may contain "$&" and friends.
  const html = template
    .replace('<html lang="sk">', () => `<html lang="${lang}">`)
    .replace(
      '<div id="root"></div>',
      () => `<div id="root">${markup}</div><script>${bootScript}</script>`
    );
  const file = lang === "sk" ? "index.html" : `${lang}.html`;
  fs.writeFileSync(path.join(publicDir, file), html);
}

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered hero: ${LANGS.join(", ")}`);
