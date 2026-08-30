/*
 * CHALET BEYOND — language switcher.
 *
 * Shows the flag and the language name: a flag marks a country, not a language,
 * so on its own it would be a guess for anyone outside the obvious case.
 *
 * The current hash is carried across, so switching language from #rezervacia
 * keeps the guest at the booking form instead of throwing them back to the top
 * of a 10 000px page.
 */
import { useLocation } from "wouter";
import { LANGS, LANG_NAMES, pathForLang } from "@shared/i18n";
import { FLAGS } from "@/i18n/flags";
import { useLang } from "@/i18n/LanguageProvider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const current = useLang();
  const [, navigate] = useLocation();

  return (
    <div
      className={compact ? "flex flex-wrap gap-2" : "flex items-center gap-1"}
      role="group"
      aria-label="Language"
    >
      {LANGS.map((lang) => {
        const Flag = FLAGS[lang];
        const active = lang === current;
        // href carries the plain path for crawlers; the hash is read at click
        // time, because React does not re-render when only the hash changes and
        // a value captured during render would be stale.
        const href = pathForLang(window.location.pathname, lang);

        return (
          <a
            key={lang}
            href={href}
            onClick={(event) => {
              event.preventDefault();
              // Captured before navigating: navigate() rewrites the URL and the
              // hash is gone by the time the new page settles.
              const hash = window.location.hash;
              navigate(pathForLang(window.location.pathname, lang) + hash);
              if (hash) {
                requestAnimationFrame(() =>
                  document.querySelector(hash)?.scrollIntoView({ behavior: "auto" }),
                );
              }
            }}
            hrefLang={lang}
            aria-label={LANG_NAMES[lang]}
            aria-current={active ? "true" : undefined}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm transition-colors duration-200"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: compact ? "0.8rem" : "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: active ? "oklch(0.92 0.008 75)" : "oklch(0.58 0.020 65)",
              background: active ? "oklch(0.72 0.12 65 / 0.12)" : "transparent",
              border: `1px solid ${active ? "oklch(0.72 0.12 65 / 0.35)" : "transparent"}`,
            }}
          >
            <Flag />
            <span>{compact ? LANG_NAMES[lang] : lang}</span>
          </a>
        );
      })}
    </div>
  );
}
