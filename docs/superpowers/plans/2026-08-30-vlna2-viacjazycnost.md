# Vlna 2 — Viacjazyčnosť: Implementation Plan

> **For agentic workers:** follow task by task; each ends with its own verification and commit.

**Goal:** SK/DE/EN/PL with per-language URLs, typed dictionaries and a flag switcher.

**Spec:** `docs/superpowers/specs/2026-08-30-vlna2-viacjazycnost-design.md`

**Order rationale:** the Slovak dictionary is extracted *before* any other language is
added, so there is a checkpoint where the page must look byte-identical to today. Bugs
introduced while moving ~60 strings are far cheaper to find against an unchanged page
than against three new ones.

---

## Task 1 — i18n core

**Files:** `shared/i18n/types.ts`, `shared/i18n/index.ts`, `shared/i18n/index.test.ts`

- [ ] `Lang = "sk" | "de" | "en" | "pl"`, `LANGS` ordered for the switcher
- [ ] `langFromPath(pathname)` → `/de/x` → `de`; `/`, `/anything-else` → `sk`
- [ ] `pathForLang(pathname, lang)` → preserves the rest of the path and any hash
- [ ] Tests: every language round-trips, unknown prefix falls back to sk, `/de` and
      `/de/` both parse, switching preserves `#rezervacia`
- [ ] Verify: `pnpm test`
- [ ] Commit

## Task 2 — Slovak dictionary + provider

**Files:** `shared/i18n/sk.ts`, `client/src/i18n/LanguageProvider.tsx`

- [ ] `sk.ts` groups keys by section: `nav`, `hero`, `intro`, `gallery`, `amenities`,
      `location`, `pricing`, `booking`, `rules`, `footer`, `contact`
- [ ] `Dict = typeof sk` — the shape every other language must satisfy
- [ ] `LanguageProvider` reads the language from the route, exposes `useT()` and
      `useLang()`, sets `document.documentElement.lang`
- [ ] Verify: `pnpm check`
- [ ] Commit

## Task 3 — Move the components onto `t`

**Files:** the 10 components holding Slovak text

- [ ] Replace every literal with a `t.*` reference, one component per commit-sized step
- [ ] **Checkpoint: the page must be visually identical.** Compare section text before
      and after; any difference is a transcription error, not an improvement
- [ ] Verify: `pnpm check`, then in the browser confirm each section's text is unchanged
- [ ] Commit

## Task 4 — Routing, switcher, flags

**Files:** `client/src/App.tsx`, `client/src/i18n/flags.tsx`,
`client/src/components/LanguageSwitcher.tsx`, `client/src/components/Navigation.tsx`,
`client/index.html`

- [ ] Routes for `/`, `/de/`, `/en/`, `/pl/` all rendering `Home`
- [ ] Four inline SVG flags, no network requests
- [ ] Switcher shows flag **and** language name, `hreflang` + `aria-label` per link,
      preserves the current hash
- [ ] Present in both the desktop nav and the mobile menu
- [ ] `hreflang` link tags in `index.html`
- [ ] Verify: each URL renders, `<html lang>` matches, switching from `/de/#rezervacia`
      lands on `/#rezervacia`, switcher fits at 375px
- [ ] Commit

## Task 5 — German

**Files:** `shared/i18n/de.ts`

- [ ] Functional copy translated exactly; atmospheric copy rewritten to read natively
- [ ] Formal `Sie` throughout
- [ ] Verify: `pnpm check` passes (proves no key is missing), `/de/` shows no Slovak
- [ ] Commit

## Task 6 — English and Polish

**Files:** `shared/i18n/en.ts`, `shared/i18n/pl.ts`

- [ ] Same policy as German
- [ ] Verify: `pnpm check`, both routes free of Slovak
- [ ] Commit

## Task 7 — Verification against the spec

- [ ] All four routes render in their own language
- [ ] Deleting a key from `de.ts` fails `pnpm check` — then restore it
- [ ] `<html lang>` correct on each route
- [ ] `hreflang` complete and self-referential
- [ ] Switcher preserves the hash
- [ ] Prices identical across languages
- [ ] 375px: switcher reachable, no overflow
- [ ] `pnpm build`
