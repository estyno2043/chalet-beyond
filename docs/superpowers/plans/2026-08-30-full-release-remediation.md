# Chalet Beyond Full Release Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every release blocker found in review of `wave1-konverzia`, harden booking inquiry flow, and reach measurable production readiness.

**Architecture:** Keep React/Vite frontend and Netlify Functions. Move availability loading and range validation into focused shared modules used by client and server. Treat availability, contact data, price claims, abuse controls, accessibility, performance, and deployment checks as independent release gates.

**Tech Stack:** React 19, TypeScript, Vite 7, React Day Picker 9, Zod 4, Vitest 2, Netlify Functions, Resend, pnpm 10.4.1.

**Spec:** `docs/superpowers/specs/2026-08-19-vlna1-konverzia-design.md`

**Review baseline:** `wave1-konverzia` at `39972d7108cb830d6269044530ef7b90012b18a1`, reviewed 2026-08-30.

## Global Constraints

- Preserve Slovak public copy and dark Nordic visual direction.
- Booking stays use check-in inclusive and checkout exclusive semantics.
- Minimum stay remains `MIN_NIGHTS = 2`; capacity remains `MAX_GUESTS = 8`.
- Never trust client price, availability, anti-bot result, or e-mail-delivery status.
- Never log iCal URLs, tokens, Resend keys, inquiry messages, or full personal data.
- Production contact actions must never point to a placeholder number.
- Degraded or unavailable iCal data must never be presented as confirmed availability.
- All new logic starts with a failing test.
- Release requires typecheck, tests, formatting, production build, dependency audit, and browser smoke tests.

## Findings Covered

| Priority | Finding                                                        | Release condition                                                                             |
| -------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| P0       | Fake phone and WhatsApp links                                  | Invalid/missing phone hides phone actions; configured real number passes validation           |
| P0       | Date range can cross occupied nights                           | UI rejects/reset ranges containing any blocked night                                          |
| P0       | Availability loads after calendar becomes interactive          | Calendar remains unavailable until trustworthy feed result arrives                            |
| P0       | Inquiry endpoint never re-checks iCal                          | Server rejects occupied, degraded, or unverifiable stays                                      |
| P1       | Per-instance rate limit and missing client honeypot            | Honeypot is wired; Turnstile is verified server-side; local limiter remains secondary control |
| P1       | Secret iCal URLs are logged                                    | Logs contain feed index/reason only                                                           |
| P1       | UI claims confirmation e-mail was sent after failure           | API returns `confirmationSent`; UI copy follows value                                         |
| P1       | Form lacks labels, names, autocomplete, live status            | Form and controls pass automated and keyboard checks                                          |
| P1       | Pricing claims can become stale                                | Claims carry verified date and fail closed after freshness window                             |
| P1       | Mobile LCP near 9 seconds                                      | Mobile LCP <= 4.0 s and initial transfer <= 2.5 MB                                            |
| P1       | 71 production audit advisories                                 | Zero high/critical production advisories                                                      |
| P2       | Missing landmarks, zoom, modal focus, reduced-motion handling  | Axe has no serious/critical violations                                                        |
| P2       | Missing robots, social metadata, headers, CI, E2E, real README | Deployment and repository checks exist and pass                                               |
| P2       | Prettier fails on 44 files                                     | `pnpm format:check` passes                                                                    |

---

### Task 1: Make Contact Configuration Fail Safe

**Files:**

- Modify: `shared/contact.ts`
- Modify: `client/src/components/StickyContactBar.tsx`
- Modify: `client/src/components/BookingSection.tsx`
- Modify: `.env.example`
- Create: `shared/contact.test.ts`

**Interfaces:**

- Produces: `PHONE: string | null`, `PHONE_DISPLAY: string | null`, `WHATSAPP_URL: string | null`.
- Consumes: public environment variable `VITE_CONTACT_PHONE_E164` in `+421XXXXXXXXX` format.

- [ ] **Step 1: Write failing contact validation tests**

```ts
import { describe, expect, it } from "vitest";
import { parseContactPhone } from "./contact";

describe("parseContactPhone", () => {
  it("rejects missing and placeholder numbers", () => {
    expect(parseContactPhone(undefined)).toBeNull();
    expect(parseContactPhone("+421000000000")).toBeNull();
  });

  it("formats a valid Slovak E.164 number", () => {
    expect(parseContactPhone("+421900123456")).toEqual({
      e164: "+421900123456",
      display: "+421 900 123 456",
      whatsapp: "https://wa.me/421900123456",
    });
  });
});
```

- [ ] **Step 2: Run test and verify failure**

```bash
pnpm test -- shared/contact.test.ts
```

Expected: FAIL because `parseContactPhone` does not exist.

- [ ] **Step 3: Replace hard-coded placeholder with validated configuration**

```ts
export function parseContactPhone(raw: string | undefined) {
  const e164 = raw?.trim() ?? "";
  if (!/^\+421\d{9}$/.test(e164) || e164 === "+421000000000") return null;
  return {
    e164,
    display: e164.replace(/^(\+421)(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3 $4"),
    whatsapp: `https://wa.me/${e164.slice(1)}`,
  };
}

const contactPhone = parseContactPhone(import.meta.env.VITE_CONTACT_PHONE_E164);
export const PHONE = contactPhone?.e164 ?? null;
export const PHONE_DISPLAY = contactPhone?.display ?? null;
export const WHATSAPP_URL = contactPhone?.whatsapp ?? null;
```

- [ ] **Step 4: Render phone and WhatsApp actions only when configuration is valid**

```tsx
{
  PHONE && PHONE_DISPLAY ? <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a> : null;
}
{
  WHATSAPP_URL ? <a href={WHATSAPP_URL}>WhatsApp</a> : null;
}
```

Keep e-mail action visible when phone configuration is absent.

- [ ] **Step 5: Document public phone environment variable**

```dotenv
# Public contact phone in Slovak E.164 format; invalid/missing value hides phone actions.
VITE_CONTACT_PHONE_E164=+421900123456
```

Set verified owner number in Netlify before release; do not copy sample value into production.

- [ ] **Step 6: Verify and commit**

```bash
pnpm test -- shared/contact.test.ts
pnpm check
git add shared/contact.ts shared/contact.test.ts client/src/components/StickyContactBar.tsx client/src/components/BookingSection.tsx .env.example
git commit -m "fix: make contact actions fail safe"
```

---

### Task 2: Extract Trustworthy Availability Service and Redact Feed Secrets

**Files:**

- Create: `netlify/functions/lib/availability-service.ts`
- Create: `netlify/functions/lib/availability-service.test.ts`
- Modify: `netlify/functions/availability.ts`

**Interfaces:**

- Produces: `loadAvailability(urls, fetcher)` returning `{ blocked, degraded, failures }`.
- Produces: `loadConfiguredAvailability()` which reads `ICAL_URLS` and delegates to `loadAvailability`.
- Produces: failures shaped as `{ feed: number; reason: "unreachable" | "invalid"; detail: string }` without URL.
- Consumes: existing `parseBlockedDates(ical: string): string[]`.

- [ ] **Step 1: Write failing service tests**

Cover parallel feed merge, duplicate removal, partial failure, total failure, five-second timeout, invalid HTML response, and secret redaction.

```ts
it("does not expose feed URL or token in a failure", async () => {
  const secretUrl = "https://ical.example/export?t=secret-token";
  const result = await loadAvailability(
    [secretUrl],
    async () => new Response("down", { status: 503 })
  );
  expect(JSON.stringify(result)).not.toContain(secretUrl);
  expect(JSON.stringify(result)).not.toContain("secret-token");
  expect(result.failures[0]).toMatchObject({ feed: 1, reason: "unreachable" });
});
```

- [ ] **Step 2: Run test and verify failure**

```bash
pnpm test -- netlify/functions/lib/availability-service.test.ts
```

- [ ] **Step 3: Move feed loading into service**

```ts
export type AvailabilityResult = {
  blocked: string[];
  degraded: boolean;
  failures: Array<{
    feed: number;
    reason: "unreachable" | "invalid";
    detail: string;
  }>;
};

export async function loadAvailability(
  urls: string[],
  fetcher: typeof fetch = fetch
): Promise<AvailabilityResult>;

export async function loadConfiguredAvailability(): Promise<AvailabilityResult> {
  const urls = (process.env.ICAL_URLS ?? "")
    .split(",")
    .map(url => url.trim())
    .filter(Boolean);
  if (urls.length === 0) throw new Error("ICAL_URLS is not set");
  return loadAvailability(urls);
}
```

Use feed index as identifier. Never retain URL in returned failure objects.

- [ ] **Step 4: Make function handler consume service and log redacted failures**

```ts
for (const failure of result.failures) {
  console.error(
    `availability: feed-${failure.feed} ${failure.reason}`,
    failure.detail
  );
}
```

- [ ] **Step 5: Verify and commit**

```bash
pnpm test -- netlify/functions/lib/availability-service.test.ts netlify/functions/lib/ical.test.ts
pnpm check
git add netlify/functions/availability.ts netlify/functions/lib/availability-service.ts netlify/functions/lib/availability-service.test.ts
git commit -m "refactor: centralize secure availability loading"
```

---

### Task 3: Reject Occupied Ranges in Client and Server

**Files:**

- Create: `shared/availability.ts`
- Create: `shared/availability.test.ts`
- Modify: `client/src/components/BookingSection.tsx`
- Modify: `netlify/functions/inquiry.ts`
- Create: `netlify/functions/inquiry.test.ts`

**Interfaces:**

- Produces: `stayIntersectsBlocked(from, to, blocked): boolean` using ISO dates.
- Client availability state: `"loading" | "ready" | "degraded" | "error"`.
- Server response: `409 { error: "Termín už nie je dostupný." }` for occupied stay.
- Server response: `503 { error: "Dostupnosť teraz nevieme overiť." }` for incomplete feeds.

- [ ] **Step 1: Write failing exclusive-checkout range tests**

```ts
describe("stayIntersectsBlocked", () => {
  it("rejects a stay crossing a blocked night", () => {
    expect(
      stayIntersectsBlocked("2026-09-10", "2026-09-14", ["2026-09-12"])
    ).toBe(true);
  });

  it("allows checkout on the first blocked date", () => {
    expect(
      stayIntersectsBlocked("2026-09-10", "2026-09-12", ["2026-09-12"])
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Implement shared range predicate**

```ts
export function stayIntersectsBlocked(
  from: string,
  to: string,
  blocked: readonly string[]
): boolean {
  return blocked.some(night => night >= from && night < to);
}
```

- [ ] **Step 3: Add explicit loading state and safe Day Picker behavior**

```tsx
<Calendar
  mode="range"
  selected={dateRange}
  onSelect={setDateRange}
  disabled={
    availabilityState !== "ready" ? true : [{ before: today }, ...blocked]
  }
  excludeDisabled
/>
```

Reset `dateRange` when newly loaded blocked dates intersect current selection. Require `availabilityState === "ready"` in `canProceed`.

- [ ] **Step 4: Write failing handler tests for occupied and degraded availability**

Mock `loadAvailability` and Resend. Assert zero e-mails are sent for `409` and `503` responses.

```ts
expect(send).not.toHaveBeenCalled();
expect(response.status).toBe(409);
```

- [ ] **Step 5: Re-check availability immediately before calculating price and sending mail**

```ts
const availability = await loadConfiguredAvailability();
if (availability.degraded || availability.failures.length > 0) {
  return Response.json(
    { error: "Dostupnosť teraz nevieme overiť." },
    { status: 503 }
  );
}
if (stayIntersectsBlocked(from, to, availability.blocked)) {
  return Response.json(
    { error: "Termín už nie je dostupný." },
    { status: 409 }
  );
}
```

- [ ] **Step 6: Verify and commit**

```bash
pnpm test -- shared/availability.test.ts netlify/functions/inquiry.test.ts
pnpm check
git add shared/availability.ts shared/availability.test.ts client/src/components/BookingSection.tsx netlify/functions/inquiry.ts netlify/functions/inquiry.test.ts
git commit -m "fix: validate occupied ranges end to end"
```

---

### Task 4: Harden Inquiry Abuse Controls and Delivery Truth

**Files:**

- Create: `client/src/components/TurnstileWidget.tsx`
- Create: `netlify/functions/lib/turnstile.ts`
- Create: `netlify/functions/lib/turnstile.test.ts`
- Modify: `client/index.html`
- Modify: `client/src/components/BookingSection.tsx`
- Modify: `netlify/functions/lib/inquiry-schema.ts`
- Modify: `netlify/functions/lib/inquiry-schema.test.ts`
- Modify: `netlify/functions/inquiry.ts`
- Modify: `.env.example`

**Interfaces:**

- Client sends `website: string` and `turnstileToken: string`.
- Server calls Cloudflare Siteverify with `TURNSTILE_SECRET_KEY`, token, and client IP.
- Inquiry response: `{ ok: true; confirmationSent: boolean }`.

- [ ] **Step 1: Add failing schema tests**

```ts
it("rejects a missing Turnstile token", () => {
  expect(
    inquirySchema.safeParse({ ...valid, turnstileToken: "" }).success
  ).toBe(false);
});

it("rejects nonsense phone text", () => {
  expect(
    inquirySchema.safeParse({ ...valid, phone: "abcdefghi" }).success
  ).toBe(false);
});
```

- [ ] **Step 2: Add hidden honeypot and accessible Turnstile widget**

```tsx
<input
  name="website"
  value={form.website}
  onChange={event => setForm({ ...form, website: event.target.value })}
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
  className="absolute -left-[10000px]"
/>
```

Load `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit` once. Widget callback stores token; expired callback clears it.

- [ ] **Step 3: Write Turnstile verification tests**

Test valid response, invalid response, timeout, missing secret, and remote IP forwarding. Do not log token.

- [ ] **Step 4: Verify Turnstile before rate counting or e-mail sending**

```ts
const human = await verifyTurnstile(turnstileToken, clientIp(request));
if (!human) {
  return Response.json(
    { error: "Overenie proti spamu zlyhalo." },
    { status: 400 }
  );
}
```

Keep existing in-memory limiter as secondary burst control. Turnstile supplies cross-instance abuse protection.

- [ ] **Step 5: Return truthful confirmation status**

```ts
let confirmationSent = true;
try {
  await sendGuestConfirmation();
} catch (error) {
  confirmationSent = false;
  console.error("inquiry: guest confirmation failed", error);
}
return Response.json({ ok: true, confirmationSent });
```

UI copy:

```tsx
{
  confirmationSent
    ? `Potvrdenie sme poslali na ${form.email}.`
    : "Dopyt sme prijali. Potvrdzovací e-mail sa nepodarilo odoslať.";
}
```

- [ ] **Step 6: Document environment values**

```dotenv
VITE_TURNSTILE_SITE_KEY=public-site-key-from-cloudflare
TURNSTILE_SECRET_KEY=secret-key-from-cloudflare
```

Store real values in Netlify environment configuration, never in Git.

- [ ] **Step 7: Verify and commit**

```bash
pnpm test -- netlify/functions/lib/inquiry-schema.test.ts netlify/functions/lib/turnstile.test.ts netlify/functions/inquiry.test.ts
pnpm check
git add client/index.html client/src/components/TurnstileWidget.tsx client/src/components/BookingSection.tsx netlify/functions/lib/turnstile.ts netlify/functions/lib/turnstile.test.ts netlify/functions/lib/inquiry-schema.ts netlify/functions/lib/inquiry-schema.test.ts netlify/functions/inquiry.ts .env.example
git commit -m "fix: harden inquiry delivery and abuse controls"
```

---

### Task 5: Make Pricing Claims Verifiable

**Files:**

- Modify: `shared/pricing.ts`
- Modify: `shared/pricing.test.ts`
- Modify: `client/src/components/PricingSection.tsx`
- Modify: `client/src/components/BookingSection.tsx`
- Modify: `docs/BOOKING_ICAL.md`

**Interfaces:**

- Produces: `PRICE_VERIFIED_ON = "2026-08-19"` and `PRICE_REVIEW_AFTER_DAYS = 30`.
- Produces: `isPriceClaimFresh(today: string): boolean`.

- [ ] **Step 1: Write failing freshness boundary tests**

```ts
it("expires comparative pricing after 30 days", () => {
  expect(isPriceClaimFresh("2026-09-18")).toBe(true);
  expect(isPriceClaimFresh("2026-09-19")).toBe(false);
});
```

- [ ] **Step 2: Implement deterministic freshness calculation in UTC**

When stale, keep direct prices visible but remove Booking comparison, savings value, and absolute “10 % cheaper” claim.

- [ ] **Step 3: Add visible verification date and qualify price status**

Fresh copy: `Ceny porovnané s Booking.com dňa 19. 8. 2026.`

Stale copy: `Predbežná priama cena. Aktuálnu dostupnosť a konečnú cenu potvrdíme e-mailom.`

Do not state taxes and fees are included until owner confirms this in writing.

- [ ] **Step 4: Add monthly owner procedure**

Document exact checks: all eight guest tiers, at least one weekday and weekend date, tax/fee inclusion, minimum stay, and `PRICE_VERIFIED_ON` update in same commit.

- [ ] **Step 5: Verify and commit**

```bash
pnpm test -- shared/pricing.test.ts
pnpm check
git add shared/pricing.ts shared/pricing.test.ts client/src/components/PricingSection.tsx client/src/components/BookingSection.tsx docs/BOOKING_ICAL.md
git commit -m "fix: expire stale comparative pricing claims"
```

---

### Task 6: Repair Accessibility and Interaction Semantics

**Files:**

- Modify: `client/index.html`
- Modify: `client/src/pages/Home.tsx`
- Modify: `client/src/components/BookingSection.tsx`
- Modify: `client/src/components/Navigation.tsx`
- Modify: `client/src/components/GallerySection.tsx`
- Modify: `client/src/index.css`
- Create: `client/src/components/BookingSection.test.tsx`
- Create: `client/src/components/Navigation.test.tsx`
- Modify: `package.json`

**Interfaces:**

- Form status uses `role="status"`; errors use `role="alert"`.
- Mobile menu and lightbox restore focus to trigger on close.

- [ ] **Step 1: Install browser component-test support**

```bash
pnpm add -D @testing-library/react @testing-library/user-event jsdom
```

- [ ] **Step 2: Write failing keyboard and accessible-name tests**

Test form labels, `autocomplete`, guest button names, 44 px targets, closed-menu tab order, Escape close, focus restoration, and lightbox dialog name.

- [ ] **Step 3: Restore browser zoom and main landmark**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Wrap page sections between navigation and footer in `<main id="main-content">` and add skip link before navigation.

- [ ] **Step 4: Add persistent labels and field metadata**

```tsx
<label htmlFor="inquiry-email">E-mail</label>
<input
  id="inquiry-email"
  name="email"
  type="email"
  autoComplete="email"
  required
/>
```

Use `name`, `autocomplete="name"`, `autocomplete="email"`, and `autocomplete="tel"`. Give status/error containers `aria-live` semantics.

- [ ] **Step 5: Repair guest buttons and modal/menu focus**

Set guest controls to at least `w-11 h-11` and add `aria-label="Znížiť počet hostí"` / `aria-label="Zvýšiť počet hostí"`.

Render mobile menu only while open or apply `hidden`/`inert` so closed links cannot receive focus. Give lightbox `role="dialog"`, `aria-modal="true"`, labelled title, initial close-button focus, focus trap, and trigger focus restoration.

- [ ] **Step 6: Scope reduced-motion behavior**

Remove global animation/transition cancellation. Under `prefers-reduced-motion: reduce`, disable scroll-controlled and decorative motion while preserving instant state changes, focus indicators, menu visibility, and dialog visibility.

- [ ] **Step 7: Verify and commit**

```bash
pnpm test -- client/src/components/BookingSection.test.tsx client/src/components/Navigation.test.tsx
pnpm check
git add package.json pnpm-lock.yaml client/index.html client/src/pages/Home.tsx client/src/components/BookingSection.tsx client/src/components/BookingSection.test.tsx client/src/components/Navigation.tsx client/src/components/Navigation.test.tsx client/src/components/GallerySection.tsx client/src/index.css
git commit -m "fix: repair booking and navigation accessibility"
```

---

### Task 7: Meet Mobile Performance Budget

**Files:**

- Modify: `client/public/videos/hero-mobile.mp4`
- Modify: `client/public/logo.png`
- Modify: `client/src/components/HeroMobile.tsx`
- Modify: `client/src/pages/Home.tsx`
- Modify: `vite.config.ts`
- Modify: `client/index.html`
- Create: `scripts/check-asset-budget.mjs`
- Modify: `package.json`

**Interfaces:**

- Asset budget script exits non-zero above fixed byte limits.
- Production Vite config excludes Manus runtime, JSX locator, debug collector, and storage proxy.

- [ ] **Step 1: Record baseline**

```bash
du -b client/public/videos/hero-mobile.mp4 client/public/logo.png
pnpm build
```

Baseline: hero video about 6.3 MB, logo about 892 KB, HTML about 368 KB, JS about 599 KB.

- [ ] **Step 2: Encode mobile hero for fast start**

```bash
ffmpeg -i client/public/videos/hero-mobile.mp4 -vf "scale=-2:1280,fps=24" -an -c:v libx264 -preset slow -crf 29 -movflags +faststart /tmp/hero-mobile.optimized.mp4
```

Verify duration, crop, first frame, loop seam, Safari playback, then replace source. Target <= 2,000,000 bytes.

- [ ] **Step 3: Replace oversized logo with correctly sized WebP/PNG assets**

Generate 96 px and 192 px variants, keep transparent edges, update header/favicon references, and target combined size <= 150,000 bytes.

- [ ] **Step 4: Lazy-load desktop-only hero**

```tsx
const HeroSCV = lazy(() =>
  import("@/components/HeroSCV").then(module => ({ default: module.HeroSCV }))
);
```

Mobile must not download SCV code or chapter videos. Desktop chapter videos use `preload="metadata"`; preload only active chapter.

- [ ] **Step 5: Exclude development plugins from production**

```ts
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === "development"
      ? [
          jsxLocPlugin(),
          vitePluginManusRuntime(),
          vitePluginManusDebugCollector(),
          vitePluginStorageProxy(),
        ]
      : []),
  ],
}));
```

- [ ] **Step 6: Remove unresolved analytics token from source comment**

Describe legacy percent-style substitution without spelling the token syntax containing `VITE_ANALYTICS_ENDPOINT`; production build must emit no undefined-env warning.

- [ ] **Step 7: Add asset budget gate**

```js
const limits = {
  "client/public/videos/hero-mobile.mp4": 2_000_000,
  "client/public/logo.png": 150_000,
};
```

Add `"assets:check": "node scripts/check-asset-budget.mjs"` and run it in build/CI.

- [ ] **Step 8: Verify and commit**

```bash
pnpm assets:check
pnpm build
git add client/public/videos/hero-mobile.mp4 client/public/logo.png client/src/components/HeroMobile.tsx client/src/pages/Home.tsx vite.config.ts client/index.html scripts/check-asset-budget.mjs package.json
git commit -m "perf: meet mobile asset and bundle budgets"
```

Acceptance: mobile Lighthouse median of three runs >= 85, LCP <= 4.0 s, TBT <= 300 ms, initial transfer <= 2.5 MB; desktop score remains >= 90.

---

### Task 8: Add Production Metadata, Headers, and Predictable Local Runtime

**Files:**

- Modify: `client/index.html`
- Create: `client/public/robots.txt`
- Create: `client/public/sitemap.xml`
- Modify: `netlify.toml`
- Modify: `package.json`
- Modify: `.gitignore`
- Remove from Git: `.netlify/netlify.toml`

**Interfaces:**

- Canonical production origin: `https://chaletbeyond.sk`.
- `pnpm dev` starts Netlify and its configured Vite child; developer opens `http://localhost:3000`.

- [ ] **Step 1: Add canonical, Open Graph, and Twitter metadata**

Add canonical URL, `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`, theme color, and optimized favicon links. Use absolute HTTPS production URLs.

- [ ] **Step 2: Add crawler files**

`robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://chaletbeyond.sk/sitemap.xml
```

`sitemap.xml` contains one canonical `/` URL with valid XML and no fake change frequency.

- [ ] **Step 3: Add security headers**

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self'; connect-src 'self' https://challenges.cloudflare.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
```

Confirm analytics origin in `connect-src` only when analytics is configured.

- [ ] **Step 4: Make local commands non-recursive and documented by behavior**

```json
{
  "scripts": {
    "dev": "netlify dev",
    "dev:ui": "vite --host"
  }
}
```

Set `[dev].command = "pnpm dev:ui"`. Start one command, browse Vite on port 3000, and let `/api` proxy to Netlify on 8888.

- [ ] **Step 5: Untrack local Netlify state**

```bash
git rm --cached .netlify/netlify.toml
```

Keep `.netlify` ignored. Confirm no absolute local paths remain in tracked files.

- [ ] **Step 6: Verify and commit**

```bash
pnpm dev
curl -I http://localhost:3000/
curl -I http://localhost:3000/robots.txt
curl -s http://localhost:3000/api/availability
git add client/index.html client/public/robots.txt client/public/sitemap.xml netlify.toml package.json .gitignore
git commit -m "chore: harden production metadata and runtime"
```

---

### Task 9: Remove Vulnerable Template Baggage and Add Release Gates

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Remove: `server/index.ts`
- Remove: unused `client/src/components/ui/chart.tsx`
- Remove: unused template UI modules proven unreachable from `client/src/main.tsx`
- Create: `.github/workflows/ci.yml`
- Create: `e2e/booking.spec.ts`
- Create: `playwright.config.ts`
- Rewrite: `README.md`
- Modify: `client/src/pages/NotFound.tsx`
- Modify: `client/src/components/ErrorBoundary.tsx`

**Interfaces:**

- CI runs Node 20 and pnpm 10.4.1.
- Release gate command: `pnpm verify`.

- [ ] **Step 1: Remove known unused high-advisory dependency chains**

```bash
pnpm remove axios nanoid streamdown recharts express
pnpm remove -D @types/express add pnpm
```

Remove static Express compatibility server and change build to `vite build`; Netlify serves `dist/public` directly. Removing these chains eliminates current high findings from axios/form-data, nanoid, lodash/lodash-es, and path-to-regexp.

Remove obsolete `start` script with the Express server. Keep `preview` for local production-bundle inspection.

- [ ] **Step 2: Remove unreachable UI template files and their packages**

Generate entry graph from `client/src/main.tsx`, preserve every reachable module, then remove unreachable shadcn wrappers. Remove corresponding package only when `rg` finds no remaining import. Run build after each package group.

```bash
rg -n "from ['\"](recharts|streamdown|axios|nanoid|express)['\"]" client server shared netlify
pnpm build
pnpm audit --prod --audit-level high
```

Expected: no matching imports, build passes, zero high/critical production advisories.

- [ ] **Step 3: Add format check and aggregate verification scripts**

```json
{
  "scripts": {
    "format:check": "prettier --check .",
    "audit:prod": "pnpm audit --prod --audit-level high",
    "verify": "pnpm format:check && pnpm check && pnpm test && pnpm assets:check && pnpm build && pnpm audit:prod"
  }
}
```

- [ ] **Step 4: Format repository once**

```bash
pnpm format
pnpm format:check
```

Review formatting diff separately from behavior changes.

- [ ] **Step 5: Add Playwright booking smoke test**

```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

Test mobile and desktop: page load, menu keyboard flow, gallery Escape/focus restoration, blocked range rejection, loading-state lock, successful inquiry with mocked APIs, 409 occupied response, 503 availability response, confirmation-mail failure copy, and phone action absence without environment configuration.

- [ ] **Step 6: Add GitHub Actions CI**

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.4.1
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm verify
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm exec playwright test
```

- [ ] **Step 7: Replace template README and production error screens**

README must document project purpose, prerequisites, exact environment variables, `pnpm dev`, tests, build, Netlify deployment, iCal refresh behavior, price-review process, and incident contacts. Translate 404 page to Slovak and match chalet design. Error boundary must show generic Slovak copy and log stack through controlled development-only logging; never render stack to guests.

- [ ] **Step 8: Verify and commit**

```bash
pnpm install --frozen-lockfile
pnpm verify
pnpm exec playwright test
git diff --check
git status --short
git add package.json pnpm-lock.yaml .github/workflows/ci.yml e2e playwright.config.ts README.md client/src/pages/NotFound.tsx client/src/components/ErrorBoundary.tsx
git commit -m "chore: add complete release quality gates"
```

---

## Final Release Gate

- [ ] Verified owner phone configured or phone/WhatsApp controls absent.
- [ ] No stay crossing blocked night can advance or submit.
- [ ] Inquiry server independently checks complete current availability.
- [ ] iCal query tokens never appear in logs or API responses.
- [ ] Turnstile, honeypot, IP limit, and recipient limit all reject abuse paths.
- [ ] Confirmation copy matches `confirmationSent` response.
- [ ] Pricing comparison is fresh or automatically hidden.
- [ ] Axe reports zero serious/critical violations on mobile and desktop.
- [ ] Mobile Lighthouse median >= 85, LCP <= 4.0 s, TBT <= 300 ms.
- [ ] Desktop Lighthouse >= 90.
- [ ] Production audit reports zero high/critical advisories.
- [ ] `pnpm verify` passes from clean clone with frozen lockfile.
- [ ] Playwright booking suite passes against Netlify local runtime.
- [ ] Netlify deploy preview smoke test passes before merge to `main`.

## Recommended Execution Order

1. Tasks 1–4: release blockers and inquiry integrity.
2. Task 5: business-copy correctness.
3. Task 6: accessibility.
4. Task 7: performance.
5. Tasks 8–9: platform hardening, cleanup, CI, E2E, documentation.

Do not merge partial Tasks 2–4 independently: client and server availability contracts must ship together.
