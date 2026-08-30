/*
 * CHALET BEYOND — flag marks for the language switcher.
 *
 * Inline SVG: no network request, sharp at any size, and nothing for the CSP to
 * block. Kept to plain rectangles — a flag here is a visual anchor beside the
 * language name, not an illustration.
 *
 * A flag names a country, not a language: German is spoken in Austria and
 * Switzerland too, and English has no flag of its own. The switcher always
 * shows the language name alongside, so the flag is never the only cue.
 */
import type { ReactElement } from "react";
import type { Lang } from "@shared/i18n";

const box = { display: "block" } as const;

function Sk() {
  return (
    <svg viewBox="0 0 9 6" width="20" height="14" style={box} aria-hidden="true">
      <rect width="9" height="6" fill="#fff" />
      <rect width="9" height="4" y="2" fill="#0b4ea2" />
      <rect width="9" height="2" y="4" fill="#ee1c25" />
      <path d="M3 1.6h1.4v2c0 .8-.7 1.2-.7 1.2S3 4.4 3 3.6z" fill="#ee1c25" stroke="#fff" strokeWidth=".18" />
    </svg>
  );
}

function De() {
  return (
    <svg viewBox="0 0 9 6" width="20" height="14" style={box} aria-hidden="true">
      <rect width="9" height="2" fill="#000" />
      <rect width="9" height="2" y="2" fill="#d00" />
      <rect width="9" height="2" y="4" fill="#ffce00" />
    </svg>
  );
}

function En() {
  return (
    <svg viewBox="0 0 60 36" width="20" height="14" style={box} aria-hidden="true">
      <rect width="60" height="36" fill="#012169" />
      <path d="M0 0l60 36M60 0L0 36" stroke="#fff" strokeWidth="7" />
      <path d="M0 0l60 36M60 0L0 36" stroke="#c8102e" strokeWidth="4" />
      <path d="M30 0v36M0 18h60" stroke="#fff" strokeWidth="12" />
      <path d="M30 0v36M0 18h60" stroke="#c8102e" strokeWidth="7" />
    </svg>
  );
}

function Pl() {
  return (
    <svg viewBox="0 0 9 6" width="20" height="14" style={box} aria-hidden="true">
      <rect width="9" height="6" fill="#fff" />
      <rect width="9" height="3" y="3" fill="#dc143c" />
    </svg>
  );
}

export const FLAGS: Record<Lang, () => ReactElement> = {
  sk: Sk,
  de: De,
  en: En,
  pl: Pl,
};
