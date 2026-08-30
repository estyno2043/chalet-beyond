/*
 * CHALET BEYOND — language plumbing.
 *
 * Slovak lives at the root: the site already runs there and moving it to /sk/
 * would break every link that exists today.
 */

export const LANGS = ["sk", "de", "en", "pl"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "sk";

/** Shown beside the flag — a flag marks a country, not a language. */
export const LANG_NAMES: Record<Lang, string> = {
  sk: "Slovenčina",
  de: "Deutsch",
  en: "English",
  pl: "Polski",
};

function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

/** Language a path belongs to. Anything unrecognised is Slovak. */
export function langFromPath(pathname: string): Lang {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLang(first) ? first : DEFAULT_LANG;
}

/**
 * The same location in another language, keeping whatever follows the prefix.
 * A guest switching language from #rezervacia should stay at the booking form,
 * not be thrown back to the top of a 10 000px page.
 */
export function pathForLang(pathname: string, lang: Lang): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length && isLang(segments[0])) segments.shift();

  const rest = segments.join("/");
  if (lang === DEFAULT_LANG) return rest ? `/${rest}` : "/";
  return rest ? `/${lang}/${rest}` : `/${lang}`;
}
