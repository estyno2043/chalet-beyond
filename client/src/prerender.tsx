/* Server entry for scripts/prerender-hero.mjs: the hero as static markup. */
import { renderToStaticMarkup } from "react-dom/server";
import { Hero } from "@/components/Hero";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import type { Lang } from "@shared/i18n";

export { LANGS } from "@shared/i18n";

export function renderHero(lang: Lang): string {
  return renderToStaticMarkup(
    <LanguageProvider lang={lang}>
      <Hero />
    </LanguageProvider>
  );
}
