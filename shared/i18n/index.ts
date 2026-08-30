import { de } from "./de";
import { en } from "./en";
import { pl } from "./pl";
import { sk } from "./sk";
import type { Dict } from "./sk";
import type { Lang } from "./types";

export * from "./types";
export type { Dict };

/**
 * Dictionaries by language. Every entry is typed as `Dict`, so a language that
 * drops or misspells a key fails `pnpm check` instead of rendering a blank.
 * Languages not yet written fall back to Slovak rather than to an empty page.
 */
export const dictionaries: Record<Lang, Dict> = {
  sk,
  de,
  en,
  pl,
};
