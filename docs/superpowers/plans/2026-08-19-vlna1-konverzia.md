# Vlna 1 — Konverzia: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Chalet Beyond site from a brochure into a direct-booking channel — real prices below Booking.com, real availability, and a working inquiry form.

**Architecture:** Price data and the total calculation live in `shared/pricing.ts`, imported by the React client through the existing `@shared` alias and by Netlify Functions through a relative path — one source of truth, no duplicated numbers. Two Netlify Functions v2 endpoints declare their own routes via `config.path`: `/api/availability` fetches and parses iCal feeds into blocked days, `/api/inquiry` validates a submission with Zod and sends two emails through Resend. Pure logic (price maths, iCal parsing, request validation) sits in its own modules so it is unit-testable without a running server.

**Tech Stack:** TypeScript, React 19, Vite 7, Vitest 2 (already a dependency), Zod 4 (already a dependency), Netlify Functions v2, Resend, netlify-cli 26 (already a dependency).

**Spec:** `docs/superpowers/specs/2026-08-19-vlna1-konverzia-design.md`

---

## Deviation from the spec

Spec §5 specifies an `/api/*` redirect in `netlify.toml` and warns that it must precede the SPA catch-all. Netlify Functions v2 lets each function declare its own route with `export const config = { path: "/api/..." }`, which takes precedence over redirects. This plan uses `config.path` instead. Same behaviour, one less file to edit, and the ordering trap disappears entirely.

---

## File Structure

| File | Responsibility |
|---|---|
| `vitest.config.ts` | **Create** — test runner config, separate from the client-rooted `vite.config.ts` |
| `shared/pricing.ts` | **Create** — price tables and `calcTotal`; the only place numbers live |
| `shared/pricing.test.ts` | **Create** — price maths |
| `shared/contact.ts` | **Create** — phone, WhatsApp, email, Booking listing URL |
| `netlify/functions/lib/ical.ts` | **Create** — pure iCal → blocked days parser |
| `netlify/functions/lib/ical.test.ts` | **Create** — parser, including the exclusive-DTEND rule |
| `netlify/functions/lib/inquiry-schema.ts` | **Create** — Zod schema for the inquiry payload |
| `netlify/functions/lib/inquiry-schema.test.ts` | **Create** — validation rules |
| `netlify/functions/availability.ts` | **Create** — `GET /api/availability` handler |
| `netlify/functions/inquiry.ts` | **Create** — `POST /api/inquiry` handler |
| `client/src/components/PricingSection.tsx` | **Create** — price table with Booking comparison |
| `client/src/components/StickyContactBar.tsx` | **Create** — mobile phone / WhatsApp bar |
| `client/src/components/BookingSection.tsx` | **Modify** — availability, prices, form, rating badge |
| `client/src/components/AmenitiesSection.tsx` | **Modify** — content corrections |
| `client/src/pages/Home.tsx` | **Modify** — mount the two new components |
| `client/index.html` | **Modify** — analytics variables |
| `.env.example` | **Create** — documents every required variable |
| `package.json` | **Modify** — `test` script, `resend` dependency |

Anything inside `netlify/functions/lib/` is a helper, not an endpoint: Netlify only deploys top-level files in `netlify/functions/` as functions, so subdirectory modules are bundled but never routed.

---

## Task 1: Test infrastructure

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Create the Vitest config**

`vite.config.ts` is rooted at `client/` and loads Manus runtime plugins, neither of which suits tests that also cover `shared/` and `netlify/`. A separate config keeps the two concerns apart.

Create `vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  test: {
    environment: "node",
    include: ["shared/**/*.test.ts", "netlify/**/*.test.ts"],
  },
});
```

- [ ] **Step 2: Add the test script**

In `package.json`, add `test` to `scripts`, directly after `check`:

```json
    "test": "vitest run",
```

- [ ] **Step 3: Verify the runner starts**

Run: `pnpm test --passWithNoTests`

Expected: exits 0 with "No test files found". The flag is only for this step — plain `pnpm test` exits 1 when there is nothing to run, which is the behaviour we want from Task 2 onwards.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "test: add vitest config and test script"
```

---

## Task 2: Price data and total calculation

**Files:**
- Create: `shared/pricing.ts`
- Test: `shared/pricing.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `shared/pricing.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calcTotal, MAX_GUESTS, MIN_NIGHTS, PRICE_PER_NIGHT } from "./pricing";

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe("calcTotal", () => {
  it("matches the spec's reference case: 8 guests, 7 nights", () => {
    const result = calcTotal(utc("2026-09-11"), utc("2026-09-18"), 8);
    expect(result).toEqual({
      nights: 7,
      perNight: 675,
      total: 4725,
      bookingTotal: 5271,
      savings: 546,
    });
  });

  it("computes a two-night stay for two guests", () => {
    const result = calcTotal(utc("2026-09-11"), utc("2026-09-13"), 2);
    expect(result.nights).toBe(2);
    expect(result.total).toBe(630);
    expect(result.savings).toBe(76);
  });

  it("counts nights correctly across the autumn clock change", () => {
    // DST ends in Slovakia on 2026-10-25, making one local day 25 hours long.
    const result = calcTotal(utc("2026-10-24"), utc("2026-10-26"), 4);
    expect(result.nights).toBe(2);
  });

  it("charges a single guest the two-guest rate", () => {
    expect(calcTotal(utc("2026-09-11"), utc("2026-09-13"), 1).perNight).toBe(
      PRICE_PER_NIGHT[2],
    );
  });

  it("always saves the guest at least 10 percent against Booking", () => {
    for (let guests = 1; guests <= MAX_GUESTS; guests++) {
      const { total, bookingTotal } = calcTotal(
        utc("2026-09-11"),
        utc("2026-09-13"),
        guests,
      );
      expect(1 - total / bookingTotal).toBeGreaterThanOrEqual(0.1);
    }
  });

  it("rejects a guest count with no published rate", () => {
    expect(() => calcTotal(utc("2026-09-11"), utc("2026-09-13"), 9)).toThrow(
      /9/,
    );
  });
});

describe("constants", () => {
  it("requires at least two nights", () => {
    expect(MIN_NIGHTS).toBe(2);
  });
});
```

The "at least 10 percent" test is the one that matters commercially: it fails the build if anyone ever edits a price so the advertised discount stops being true.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test`

Expected: FAIL — `Failed to resolve import "./pricing"`.

- [ ] **Step 3: Write the implementation**

Create `shared/pricing.ts`:

```ts
/*
 * CHALET BEYOND — pricing
 *
 * Direct price = Booking.com rate minus 10%, floored to a multiple of 5 so the
 * advertised "-10 %" is always true rather than approximately true.
 * Booking rates captured 2026-08-19 for 2026-09-11 and 2027-02-12 — identical
 * in both, so there is no seasonal tier to model.
 * A single guest pays the two-guest rate; Booking publishes no lower tier.
 */

export const MIN_NIGHTS = 2;
export const MAX_GUESTS = 8;

/** Direct price per night in EUR, by guest count. */
export const PRICE_PER_NIGHT: Record<number, number> = {
  1: 315,
  2: 315,
  3: 360,
  4: 405,
  5: 495,
  6: 585,
  7: 630,
  8: 675,
};

/** Booking.com rate per night in EUR, by guest count. Shown to make the saving visible. */
export const BOOKING_PRICE_PER_NIGHT: Record<number, number> = {
  1: 353,
  2: 353,
  3: 403,
  4: 453,
  5: 553,
  6: 653,
  7: 703,
  8: 753,
};

export interface PriceBreakdown {
  nights: number;
  perNight: number;
  total: number;
  bookingTotal: number;
  savings: number;
}

const MS_PER_DAY = 86_400_000;

export function calcTotal(from: Date, to: Date, guests: number): PriceBreakdown {
  const perNight = PRICE_PER_NIGHT[guests];
  const bookingPerNight = BOOKING_PRICE_PER_NIGHT[guests];
  if (perNight === undefined || bookingPerNight === undefined) {
    throw new Error(`No published rate for ${guests} guests`);
  }

  // Math.round absorbs the 23- and 25-hour days either side of a clock change.
  const nights = Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
  const total = perNight * nights;
  const bookingTotal = bookingPerNight * nights;

  return { nights, perNight, total, bookingTotal, savings: bookingTotal - total };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test`

Expected: PASS — 7 tests.

- [ ] **Step 5: Commit**

```bash
git add shared/pricing.ts shared/pricing.test.ts
git commit -m "feat(pricing): direct rates and total calculation"
```

---

## Task 3: iCal parser

**Files:**
- Create: `netlify/functions/lib/ical.ts`
- Test: `netlify/functions/lib/ical.test.ts`

The one rule worth getting right: `DTEND` in iCal is **exclusive**. Booking's checkout day is available for the next guest's check-in, so it must not be marked blocked. Getting this wrong loses a booking every single time.

- [ ] **Step 1: Write the failing tests**

Create `netlify/functions/lib/ical.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseBlockedDates } from "./ical";

const bookingFeed = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "BEGIN:VEVENT",
  "DTSTART;VALUE=DATE:20260820",
  "DTEND;VALUE=DATE:20260823",
  "SUMMARY:CLOSED - Not available",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

describe("parseBlockedDates", () => {
  it("blocks every night of a stay but not the checkout day", () => {
    expect(parseBlockedDates(bookingFeed)).toEqual([
      "2026-08-20",
      "2026-08-21",
      "2026-08-22",
    ]);
  });

  it("merges and deduplicates overlapping events", () => {
    const feed = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20260901",
      "DTEND;VALUE=DATE:20260903",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20260902",
      "DTEND;VALUE=DATE:20260904",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    expect(parseBlockedDates(feed)).toEqual([
      "2026-09-01",
      "2026-09-02",
      "2026-09-03",
    ]);
  });

  it("handles folded lines", () => {
    const feed =
      "BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:2026\r\n 0820\r\nDTEND;VALUE=DATE:20260821\r\nEND:VEVENT";
    expect(parseBlockedDates(feed)).toEqual(["2026-08-20"]);
  });

  it("handles date-time values as well as plain dates", () => {
    const feed =
      "BEGIN:VEVENT\nDTSTART:20261005T140000Z\nDTEND:20261007T100000Z\nEND:VEVENT";
    expect(parseBlockedDates(feed)).toEqual(["2026-10-05", "2026-10-06"]);
  });

  it("crosses a month boundary", () => {
    const feed =
      "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20260930\nDTEND;VALUE=DATE:20261002\nEND:VEVENT";
    expect(parseBlockedDates(feed)).toEqual(["2026-09-30", "2026-10-01"]);
  });

  it("ignores an event missing an end date", () => {
    const feed = "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20260820\nEND:VEVENT";
    expect(parseBlockedDates(feed)).toEqual([]);
  });

  it("returns nothing for empty or unrelated input", () => {
    expect(parseBlockedDates("")).toEqual([]);
    expect(parseBlockedDates("not a calendar at all")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test`

Expected: FAIL — `Failed to resolve import "./ical"`.

- [ ] **Step 3: Write the implementation**

Create `netlify/functions/lib/ical.ts`:

```ts
/*
 * Minimal iCal reader for availability feeds.
 *
 * Booking.com and Airbnb both export all-day VEVENT blocks, so a full RFC 5545
 * parser would be a dependency in exchange for features neither feed uses.
 * DTEND is exclusive: the checkout day is bookable and must stay unblocked.
 * All arithmetic is in UTC so a server timezone can never shift a date.
 */

const DATE_LINE = /^DT(START|END)[^:]*:(\d{8})/;
const MS_PER_DAY = 86_400_000;

/** Normalises line endings and rejoins RFC 5545 folded continuation lines. */
function unfold(ics: string): string[] {
  return ics
    .replace(/\r\n/g, "\n")
    .replace(/\n[ \t]/g, "")
    .split("\n");
}

function toISO(compact: string): string {
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}

function nightsBetween(startISO: string, endISO: string): string[] {
  const days: string[] = [];
  let cursor = Date.parse(`${startISO}T00:00:00Z`);
  const end = Date.parse(`${endISO}T00:00:00Z`);
  while (cursor < end) {
    days.push(new Date(cursor).toISOString().slice(0, 10));
    cursor += MS_PER_DAY;
  }
  return days;
}

/** Returns every occupied night as a sorted, deduplicated list of YYYY-MM-DD. */
export function parseBlockedDates(ics: string): string[] {
  const blocked = new Set<string>();
  let start: string | null = null;
  let end: string | null = null;

  for (const line of unfold(ics)) {
    if (line.startsWith("BEGIN:VEVENT")) {
      start = null;
      end = null;
      continue;
    }
    if (line.startsWith("END:VEVENT")) {
      if (start && end) {
        for (const day of nightsBetween(start, end)) blocked.add(day);
      }
      start = null;
      end = null;
      continue;
    }
    const match = DATE_LINE.exec(line);
    if (!match) continue;
    if (match[1] === "START") start = toISO(match[2]);
    else end = toISO(match[2]);
  }

  return [...blocked].sort();
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test`

Expected: PASS — 14 tests total across both files.

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/lib/ical.ts netlify/functions/lib/ical.test.ts
git commit -m "feat(availability): iCal parser with exclusive DTEND handling"
```

---

## Task 4: Inquiry validation schema

**Files:**
- Create: `netlify/functions/lib/inquiry-schema.ts`
- Test: `netlify/functions/lib/inquiry-schema.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `netlify/functions/lib/inquiry-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { inquirySchema } from "./inquiry-schema";

const valid = {
  from: "2026-09-11",
  to: "2026-09-13",
  guests: 4,
  name: "Anna Nováková",
  email: "anna@example.com",
  phone: "+421900123456",
  message: "Prídeme s deťmi.",
};

describe("inquirySchema", () => {
  it("accepts a complete inquiry", () => {
    expect(inquirySchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an inquiry with no message", () => {
    const { message, ...withoutMessage } = valid;
    expect(inquirySchema.safeParse(withoutMessage).success).toBe(true);
  });

  it("rejects a stay shorter than the two-night minimum", () => {
    const result = inquirySchema.safeParse({ ...valid, to: "2026-09-12" });
    expect(result.success).toBe(false);
  });

  it("rejects a checkout before the checkin", () => {
    const result = inquirySchema.safeParse({ ...valid, to: "2026-09-09" });
    expect(result.success).toBe(false);
  });

  it("rejects more guests than the property sleeps", () => {
    expect(inquirySchema.safeParse({ ...valid, guests: 9 }).success).toBe(false);
  });

  it("rejects a malformed email", () => {
    expect(inquirySchema.safeParse({ ...valid, email: "anna@" }).success).toBe(
      false,
    );
  });

  it("rejects a missing phone number", () => {
    expect(inquirySchema.safeParse({ ...valid, phone: "" }).success).toBe(false);
  });

  it("rejects a malformed date", () => {
    expect(inquirySchema.safeParse({ ...valid, from: "11.9.2026" }).success).toBe(
      false,
    );
  });

  it("rejects a non-object payload", () => {
    expect(inquirySchema.safeParse(null).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test`

Expected: FAIL — `Failed to resolve import "./inquiry-schema"`.

- [ ] **Step 3: Write the implementation**

Create `netlify/functions/lib/inquiry-schema.ts`. Zod 4 exposes string formats at the top level, so this uses `z.email()` rather than the deprecated `z.string().email()`:

```ts
import { z } from "zod";
import { MAX_GUESTS, MIN_NIGHTS } from "../../../shared/pricing";

const MS_PER_DAY = 86_400_000;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Dátum musí byť v tvare RRRR-MM-DD");

export function nightsBetween(from: string, to: string): number {
  return Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
      MS_PER_DAY,
  );
}

export const inquirySchema = z
  .object({
    from: isoDate,
    to: isoDate,
    guests: z.number().int().min(1).max(MAX_GUESTS),
    name: z.string().trim().min(2, "Zadajte meno").max(100),
    email: z.email("Zadajte platný e-mail"),
    phone: z.string().trim().min(6, "Zadajte telefónne číslo").max(30),
    message: z.string().trim().max(2000).optional(),
  })
  .refine((value) => nightsBetween(value.from, value.to) >= MIN_NIGHTS, {
    message: `Minimálna dĺžka pobytu je ${MIN_NIGHTS} noci`,
    path: ["to"],
  });

export type Inquiry = z.infer<typeof inquirySchema>;
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test`

Expected: PASS — 23 tests total.

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/lib/inquiry-schema.ts netlify/functions/lib/inquiry-schema.test.ts
git commit -m "feat(inquiry): zod validation schema"
```

---

## Task 5: Availability endpoint

**Files:**
- Create: `netlify/functions/availability.ts`
- Create: `.env.example`

- [ ] **Step 1: Write the handler**

Create `netlify/functions/availability.ts`:

```ts
/*
 * GET /api/availability — occupied nights, merged from every configured iCal feed.
 * Response is cached for 30 minutes; a booking made on Booking.com does not need
 * to reach this site within seconds, and the feeds are slow to fetch.
 */
import { parseBlockedDates } from "./lib/ical";

export default async (): Promise<Response> => {
  const urls = (process.env.ICAL_URLS ?? "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  if (urls.length === 0) {
    console.error("availability: ICAL_URLS is not set");
    return Response.json({ error: "ical_not_configured" }, { status: 502 });
  }

  try {
    const feeds = await Promise.all(
      urls.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`${url} responded ${response.status}`);
        }
        return response.text();
      }),
    );

    const blocked = [...new Set(feeds.flatMap(parseBlockedDates))].sort();

    return Response.json(
      { blocked, updated: new Date().toISOString() },
      { headers: { "Cache-Control": "public, max-age=1800" } },
    );
  } catch (error) {
    console.error("availability: feed unreachable", error);
    return Response.json({ error: "ical_unreachable" }, { status: 502 });
  }
};

export const config = { path: "/api/availability" };
```

- [ ] **Step 2: Document the environment variables**

Create `.env.example`:

```bash
# Occupancy feeds, comma-separated.
# Booking extranet → Rates & Availability → Sync calendars → Export
ICAL_URLS=https://ical.booking.com/v1/export?t=REPLACE_ME

# Transactional email — resend.com, domain must be verified
RESEND_API_KEY=re_REPLACE_ME
OWNER_EMAIL=REPLACE_ME@chaletbeyond.sk

# Umami analytics
VITE_ANALYTICS_ENDPOINT=https://REPLACE_ME
VITE_ANALYTICS_WEBSITE_ID=REPLACE_ME
```

- [ ] **Step 3: Verify the misconfigured path**

`.env` does not exist yet, so `ICAL_URLS` is unset and the endpoint should say so rather than crash.

Run in one terminal: `pnpm exec netlify dev`
Then run: `curl -s -o /dev/null -w '%{http_code}' http://localhost:8888/api/availability`

Expected: `502`. The `netlify dev` log shows `availability: ICAL_URLS is not set`.

- [ ] **Step 4: Verify the working path**

Create a local `.env` containing a real feed URL from the Booking extranet:

```bash
echo 'ICAL_URLS=<real url from the Booking extranet>' >> .env
```

Restart `netlify dev`, then run: `curl -s http://localhost:8888/api/availability`

Expected: JSON with a `blocked` array of `YYYY-MM-DD` strings and an `updated` timestamp.

If the iCal URL is not available yet, this step is blocked — note it and continue to Task 6. Do not fake the feed.

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/availability.ts .env.example
git commit -m "feat(availability): /api/availability endpoint backed by iCal feeds"
```

---

## Task 6: Inquiry endpoint

**Files:**
- Create: `netlify/functions/inquiry.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Resend**

Run: `pnpm add resend`

- [ ] **Step 2: Write the handler**

Create `netlify/functions/inquiry.ts`. The owner's email is sent first and its success alone decides the response — if the guest's confirmation fails afterwards the lead is already safe, and failing the request would make the guest submit again and create a duplicate:

```ts
/*
 * POST /api/inquiry — validates a booking inquiry and emails both parties.
 * The total is recomputed here rather than trusted from the request body.
 */
import { Resend } from "resend";
import { calcTotal } from "../../shared/pricing";
import { inquirySchema } from "./lib/inquiry-schema";

const SENDER = "Chalet Beyond <rezervacie@chaletbeyond.sk>";

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405 });
  }

  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Neplatný dopyt" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const owner = process.env.OWNER_EMAIL;
  if (!apiKey || !owner) {
    console.error("inquiry: RESEND_API_KEY or OWNER_EMAIL is not set");
    return Response.json({ error: "mail_not_configured" }, { status: 502 });
  }

  const { from, to, guests, name, email, phone, message } = parsed.data;
  const price = calcTotal(utc(from), utc(to), guests);
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: SENDER,
      to: owner,
      replyTo: email,
      subject: `Dopyt ${from} → ${to} · ${guests} hostí · ${price.total} €`,
      text: [
        `Termín:     ${from} → ${to} (${price.nights} nocí)`,
        `Hostia:     ${guests}`,
        `Cena:       ${price.perNight} €/noc · spolu ${price.total} €`,
        `Na Bookingu by zaplatil ${price.bookingTotal} € (ušetril ${price.savings} €)`,
        "",
        `Meno:       ${name}`,
        `E-mail:     ${email}`,
        `Telefón:    ${phone}`,
        "",
        message ? `Poznámka:\n${message}` : "Bez poznámky.",
      ].join("\n"),
    });
  } catch (error) {
    console.error("inquiry: owner notification failed", error);
    return Response.json({ error: "mail_failed" }, { status: 502 });
  }

  try {
    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: "Váš dopyt — Chalet Beyond",
      text: [
        `Dobrý deň, ${name},`,
        "",
        "ďakujeme za dopyt. Ozveme sa do 24 hodín.",
        "",
        `Termín:  ${from} → ${to} (${price.nights} nocí)`,
        `Hostia:  ${guests}`,
        `Cena:    ${price.perNight} €/noc · spolu ${price.total} €`,
        "",
        "Toto je predbežná cena, nie záväzná rezervácia.",
        "",
        "Chalet Beyond",
        "Kamenná 2004/25A, 059 52 Veľká Lomnica",
      ].join("\n"),
    });
  } catch (error) {
    // The lead is already delivered; do not make the guest submit twice.
    console.error("inquiry: guest confirmation failed", error);
  }

  return Response.json({ ok: true });
};

export const config = { path: "/api/inquiry" };
```

- [ ] **Step 3: Verify validation rejects a short stay**

Run `pnpm exec netlify dev`, then:

```bash
curl -s -X POST http://localhost:8888/api/inquiry -H 'content-type: application/json' -d '{"from":"2026-09-11","to":"2026-09-12","guests":4,"name":"Test Test","email":"t@example.com","phone":"+421900000000"}'
```

Expected: HTTP 400, body `{"error":"Minimálna dĺžka pobytu je 2 noci"}`.

- [ ] **Step 4: Verify validation rejects nine guests**

```bash
curl -s -X POST http://localhost:8888/api/inquiry -H 'content-type: application/json' -d '{"from":"2026-09-11","to":"2026-09-13","guests":9,"name":"Test Test","email":"t@example.com","phone":"+421900000000"}'
```

Expected: HTTP 400.

- [ ] **Step 5: Verify a real send**

With `RESEND_API_KEY` and `OWNER_EMAIL` in `.env`, post a valid payload using a mailbox you control as `email`.

Expected: HTTP 200 `{"ok":true}`, an email to the owner whose subject reads `Dopyt 2026-09-11 → 2026-09-13 · 4 hostí · 810 €`, and a confirmation to the guest.

If the Resend key is not available yet, this step is blocked — note it and continue to Task 7.

- [ ] **Step 6: Commit**

```bash
git add netlify/functions/inquiry.ts package.json pnpm-lock.yaml
git commit -m "feat(inquiry): /api/inquiry endpoint with Resend delivery"
```

---

## Task 7: Contact constants

**Files:**
- Create: `shared/contact.ts`

Hard-coding a phone number across three components guarantees one of them will be missed when it changes.

- [ ] **Step 1: Write the module**

Create `shared/contact.ts`. Replace the placeholder number with the real one before deploying — Task 16 checks for it:

```ts
/*
 * CHALET BEYOND — contact details.
 * PHONE is a placeholder until the owner supplies the real number.
 */

/** E.164, used for tel: and wa.me links. */
export const PHONE = "+421900000000";

/** Human-readable form shown in the interface. */
export const PHONE_DISPLAY = "+421 900 000 000";

export const EMAIL = "contact@chaletbeyond.sk";

export const WHATSAPP_URL = `https://wa.me/${PHONE.replace(/\D/g, "")}`;

export const BOOKING_LISTING_URL =
  "https://www.booking.com/hotel/sk/chalet-beyond.html";

/** Booking.com guest rating, kept here so the badge and any future copy agree. */
export const BOOKING_RATING = "10";
```

- [ ] **Step 2: Verify it type-checks**

Run: `pnpm check`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add shared/contact.ts
git commit -m "feat(contact): shared contact constants"
```

---

## Task 8: Pricing section

**Files:**
- Create: `client/src/components/PricingSection.tsx`
- Modify: `client/src/pages/Home.tsx`

- [ ] **Step 1: Write the component**

Styling mirrors `AmenitiesSection` and `BookingSection`: Bebas Neue headings, JetBrains Mono labels, Karla body, amber `oklch(0.72 0.12 65)` accent, 2px radius.

Create `client/src/components/PricingSection.tsx`:

```tsx
/*
 * CHALET BEYOND — Pricing Section
 * Direct rates against Booking.com, so the saving from booking here is explicit.
 */
import { FadeUp } from "@/components/FadeUp";
import {
  BOOKING_PRICE_PER_NIGHT,
  MAX_GUESTS,
  PRICE_PER_NIGHT,
} from "@shared/pricing";

const MONO = "'JetBrains Mono', monospace";
const AMBER = "oklch(0.72 0.12 65)";
const MUTED = "oklch(0.58 0.020 65)";

const rows = Array.from({ length: MAX_GUESTS - 1 }, (_, i) => {
  const guests = i + 2;
  return {
    guests,
    direct: PRICE_PER_NIGHT[guests],
    booking: BOOKING_PRICE_PER_NIGHT[guests],
  };
});

export function PricingSection() {
  return (
    <section id="cennik" className="py-16 md:py-32" style={{ background: "oklch(0.08 0.010 55)" }}>
      <div className="container">
        <FadeUp className="mb-10 md:mb-16">
          <div className="amber-rule mb-8 md:mb-12" />
          <p
            style={{
              fontFamily: MONO,
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              color: AMBER,
              marginBottom: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            Cenník
          </p>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.0,
              color: "oklch(0.92 0.008 75)",
            }}
          >
            O 10 % LACNEJŠIE<br />
            <span style={{ color: AMBER }}>AKO NA BOOKINGU</span>
          </h2>
          <p
            style={{
              fontFamily: "'Karla', sans-serif",
              fontSize: "0.95rem",
              fontWeight: 300,
              lineHeight: 1.7,
              color: "oklch(0.62 0.020 65)",
              maxWidth: "46ch",
              marginTop: "1.25rem",
            }}
          >
            Rezerváciou priamo u nás neplatíte províziu sprostredkovateľa. Ceny sú
            za celý objekt vrátane daní a poplatkov.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div
            className="overflow-x-auto"
            style={{
              background: "oklch(0.12 0.012 55)",
              border: `1px solid ${AMBER.replace(")", " / 0.18)")}`,
              borderRadius: "2px",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "30rem" }}>
              <thead>
                <tr>
                  {["Hostí", "Booking.com", "Priamo u nás", "Ušetríte"].map((head) => (
                    <th
                      key={head}
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.62rem",
                        letterSpacing: "0.1em",
                        color: MUTED,
                        textTransform: "uppercase",
                        textAlign: head === "Hostí" ? "left" : "right",
                        padding: "1rem 1.25rem",
                        borderBottom: "1px solid oklch(0.72 0.12 65 / 0.18)",
                        fontWeight: 400,
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ guests, direct, booking }) => (
                  <tr key={guests}>
                    <td
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.85rem",
                        color: "oklch(0.78 0.015 75)",
                        padding: "0.85rem 1.25rem",
                      }}
                    >
                      {guests}
                    </td>
                    <td
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.9rem",
                        color: MUTED,
                        textDecoration: "line-through",
                        textAlign: "right",
                        padding: "0.85rem 1.25rem",
                      }}
                    >
                      {booking} €
                    </td>
                    <td
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.25rem",
                        letterSpacing: "0.02em",
                        color: "oklch(0.92 0.008 75)",
                        textAlign: "right",
                        padding: "0.85rem 1.25rem",
                      }}
                    >
                      {direct} €
                    </td>
                    <td
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.9rem",
                        color: AMBER,
                        textAlign: "right",
                        padding: "0.85rem 1.25rem",
                      }}
                    >
                      −{booking - direct} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            style={{
              fontFamily: "'Karla', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 300,
              color: "oklch(0.45 0.015 65)",
              marginTop: "1rem",
              lineHeight: 1.6,
            }}
          >
            Ceny za noc pri prenájme celého objektu. Minimálna dĺžka pobytu 2 noci ·
            Bezplatné storno do 14 dní pred príchodom.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount it in Home**

In `client/src/pages/Home.tsx`, add the import alongside the others:

```tsx
import { PricingSection } from "@/components/PricingSection";
```

Then place it immediately before `<BookingSection />` so the price is read before the form:

```tsx
      <LocationSection />
      <PricingSection />
      <BookingSection />
```

- [ ] **Step 3: Verify in the browser**

Run: `pnpm dev`, open `http://localhost:3000/#cennik`

Expected: a seven-row table, Booking prices struck through, direct prices in Bebas, savings in amber. Row for 8 guests reads `753 €` / `675 €` / `−78 €`.

- [ ] **Step 4: Verify it type-checks**

Run: `pnpm check`

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/PricingSection.tsx client/src/pages/Home.tsx
git commit -m "feat(pricing): price table comparing direct rates against Booking"
```

---

## Task 9: Booking section — live availability

**Files:**
- Modify: `client/src/components/BookingSection.tsx`

- [ ] **Step 1: Add the availability hook**

In `client/src/components/BookingSection.tsx`, replace the import on line 7:

```tsx
import { useState } from "react";
```

with:

```tsx
import { useEffect, useState } from "react";
```

Then add this immediately above `export function BookingSection() {`:

```tsx
/** Occupied nights from Booking and Airbnb. Empty when the feed is unreachable. */
function useBlockedDates(): { blocked: Date[]; failed: boolean } {
  const [blocked, setBlocked] = useState<Date[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/availability")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((data: { blocked: string[] }) => {
        if (cancelled) return;
        setBlocked(data.blocked.map((day) => new Date(`${day}T00:00:00`)));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { blocked, failed };
}
```

Parsing without the `Z` suffix is deliberate: `react-day-picker` compares against local-midnight dates, so a UTC date would land on the wrong day for anyone east of Greenwich.

- [ ] **Step 2: Wire it into the calendar**

Inside `BookingSection`, add below the existing `useState` calls:

```tsx
  const { blocked, failed: availabilityFailed } = useBlockedDates();
```

Change the `<Calendar>` `disabled` prop from:

```tsx
                  disabled={{ before: new Date() }}
```

to:

```tsx
                  disabled={[{ before: new Date() }, ...blocked]}
```

- [ ] **Step 3: Tell the guest when the feed is down**

Directly after the closing `</div>` of the `flex justify-center overflow-x-auto` wrapper that holds the calendar, insert:

```tsx
              {availabilityFailed && (
                <p
                  className="mt-4"
                  style={{
                    fontFamily: "'Karla', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    color: "oklch(0.45 0.015 65)",
                    textAlign: "center",
                  }}
                >
                  Obsadenosť sa nepodarilo načítať — dostupnosť overíme e-mailom.
                </p>
              )}
```

- [ ] **Step 4: Verify blocked days are unclickable**

Run `pnpm exec netlify dev` with a real `ICAL_URLS`, open `http://localhost:8888/#rezervacia`.

Expected: days occupied on Booking are dimmed and do not respond to clicks. The network tab shows one `200` for `/api/availability`.

- [ ] **Step 5: Verify the failure path**

Stop `netlify dev` and run `pnpm dev` instead, so `/api/availability` returns the SPA shell and the fetch fails.

Expected: the calendar still works with no days blocked, and the note "Obsadenosť sa nepodarilo načítať" appears. Nothing crashes.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/BookingSection.tsx
git commit -m "feat(booking): block occupied dates from the availability feed"
```

---

## Task 10: Booking section — prices in the summary

**Files:**
- Modify: `client/src/components/BookingSection.tsx`

- [ ] **Step 1: Import the calculation**

Add to the imports:

```tsx
import { calcTotal, MIN_NIGHTS } from "@shared/pricing";
```

- [ ] **Step 2: Compute the breakdown**

Below `const nights = getNights(dateRange?.from, dateRange?.to);` add:

```tsx
  const price =
    dateRange?.from && dateRange?.to && nights >= MIN_NIGHTS
      ? calcTotal(dateRange.from, dateRange.to, guests)
      : null;
```

The guard is `>= MIN_NIGHTS`, not `> 0`: `calcTotal` throws below the minimum rather than returning a negative total, so calling it for a one-night selection would crash the render.

Then the submit guard is simply:

```tsx
  const canProceed = price !== null;
```

- [ ] **Step 3: Show the numbers**

In the summary sidebar, replace the whole `{nights > 0 && ( ... )}` block that renders "Počet nocí" with:

```tsx
                {price && (
                  <>
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: "oklch(0.58 0.020 65)",
                          textTransform: "uppercase",
                        }}
                      >
                        {price.nights} × {price.perNight} €
                      </span>
                      <span
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.6rem",
                          color: "oklch(0.92 0.008 75)",
                        }}
                      >
                        {price.total} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: "oklch(0.58 0.020 65)",
                          textTransform: "uppercase",
                        }}
                      >
                        Na Booking.com
                      </span>
                      <span
                        style={{
                          fontFamily: "'Karla', sans-serif",
                          fontSize: "0.875rem",
                          color: "oklch(0.58 0.020 65)",
                          textDecoration: "line-through",
                        }}
                      >
                        {price.bookingTotal} €
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.85rem",
                        color: "oklch(0.72 0.12 65)",
                      }}
                    >
                      Ušetríte {price.savings} €
                    </p>
                  </>
                )}
```

- [ ] **Step 4: Correct the fine print**

Booking has no seasonal tiers, so the claim must go. Replace the "Minimálna dĺžka pobytu 2 noci · Celý objekt · Sezónne ceny" string with:

```tsx
                Minimálna dĺžka pobytu 2 noci · Celý objekt · Bezplatné storno do
                14 dní pred príchodom
```

- [ ] **Step 5: Verify the arithmetic on screen**

Run `pnpm dev`, select 11–18 September 2026 and set guests to 8.

Expected: `7 × 675 €` → `4 725 €`, Booking `5 271 €` struck through, `Ušetríte 546 €`.

- [ ] **Step 6: Verify the minimum-stay guard**

Select a single night.

Expected: the submit button stays disabled.

- [ ] **Step 7: Commit**

```bash
git add client/src/components/BookingSection.tsx
git commit -m "feat(booking): show direct price, total and saving in the summary"
```

---

## Task 11: Booking section — working inquiry form

**Files:**
- Modify: `client/src/components/BookingSection.tsx`

- [ ] **Step 1: Replace the mailto handler**

Delete the `CONTACT_EMAIL` constant and the entire `handleBooking` function, and add this state and submit handler in their place inside the component:

```tsx
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const iso = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!dateRange?.from || !dateRange?.to) return;

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          from: iso(dateRange.from),
          to: iso(dateRange.to),
          guests,
          ...form,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Odoslanie zlyhalo");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Odoslanie zlyhalo");
    }
  };
```

`iso` formats from local date parts on purpose — `toISOString()` would shift the selected day backwards for guests in a positive UTC offset, which is everyone in Slovakia.

- [ ] **Step 2: Import the contact constants for the fallback message**

```tsx
import { EMAIL, PHONE, PHONE_DISPLAY } from "@shared/contact";
```

- [ ] **Step 3: Replace the CTA with the form**

Replace the `<motion.button onClick={handleBooking} …>` element, the `{!canProceed && …}` hint and nothing else with:

```tsx
              {status === "sent" ? (
                <div
                  style={{
                    border: "1px solid oklch(0.72 0.12 65 / 0.4)",
                    padding: "1.25rem",
                    borderRadius: "2px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.3rem",
                      color: "oklch(0.72 0.12 65)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Dopyt odoslaný
                  </p>
                  <p
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 300,
                      color: "oklch(0.78 0.015 75)",
                      lineHeight: 1.6,
                    }}
                  >
                    Ozveme sa do 24 hodín. Potvrdenie sme poslali na {form.email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {([
                    { key: "name", label: "Meno a priezvisko", type: "text", required: true },
                    { key: "email", label: "E-mail", type: "email", required: true },
                    { key: "phone", label: "Telefón", type: "tel", required: true },
                  ] as const).map((field) => (
                    <input
                      key={field.key}
                      type={field.type}
                      required={field.required}
                      placeholder={field.label}
                      value={form[field.key]}
                      onChange={(event) =>
                        setForm({ ...form, [field.key]: event.target.value })
                      }
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.9rem",
                        color: "oklch(0.92 0.008 75)",
                        background: "oklch(0.10 0.012 55)",
                        border: "1px solid oklch(0.72 0.12 65 / 0.25)",
                        borderRadius: "2px",
                        padding: "0.7rem 0.85rem",
                        width: "100%",
                      }}
                    />
                  ))}
                  <textarea
                    placeholder="Poznámka (nepovinné)"
                    rows={3}
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.9rem",
                      color: "oklch(0.92 0.008 75)",
                      background: "oklch(0.10 0.012 55)",
                      border: "1px solid oklch(0.72 0.12 65 / 0.25)",
                      borderRadius: "2px",
                      padding: "0.7rem 0.85rem",
                      width: "100%",
                      resize: "vertical",
                    }}
                  />

                  <motion.button
                    type="submit"
                    disabled={!canProceed || status === "sending"}
                    className="w-full btn-amber justify-center gap-3 mt-1"
                    whileHover={{ scale: canProceed ? 1.01 : 1 }}
                    whileTap={{ scale: canProceed ? 0.97 : 1 }}
                    style={{
                      opacity: canProceed && status !== "sending" ? 1 : 0.5,
                      cursor: canProceed ? "pointer" : "not-allowed",
                    }}
                  >
                    <span>
                      {status === "sending" ? "Odosielam…" : "Odoslať nezáväzný dopyt"}
                    </span>
                    {status !== "sending" && <ArrowRight size={16} />}
                  </motion.button>

                  {!canProceed && (
                    <p
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 300,
                        color: "oklch(0.45 0.015 65)",
                        textAlign: "center",
                      }}
                    >
                      Vyberte termín aspoň na 2 noci
                    </p>
                  )}

                  {status === "error" && (
                    <p
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.78rem",
                        color: "oklch(0.65 0.15 25)",
                        textAlign: "center",
                        lineHeight: 1.6,
                      }}
                    >
                      {error}
                      <br />
                      Zavolajte nám na{" "}
                      <a href={`tel:${PHONE}`} style={{ color: "oklch(0.72 0.12 65)" }}>
                        {PHONE_DISPLAY}
                      </a>{" "}
                      alebo napíšte na{" "}
                      <a href={`mailto:${EMAIL}`} style={{ color: "oklch(0.72 0.12 65)" }}>
                        {EMAIL}
                      </a>
                      .
                    </p>
                  )}
                </form>
              )}
```

The error state keeps the guest's typed details on screen and offers a phone number — a failed submit must never be a dead end.

- [ ] **Step 4: Verify a successful submit**

Run `pnpm exec netlify dev` with Resend configured. Select 11–13 September 2026, 4 guests, fill the form with a mailbox you control, submit.

Expected: the button reads "Odosielam…", then the panel is replaced by "Dopyt odoslaný". Two emails arrive. The owner's subject line reads `… · 4 hostí · 810 €`.

- [ ] **Step 5: Verify the failure path**

Stop `netlify dev`, run `pnpm dev`, and submit again.

Expected: the red error line appears with the phone number and email, and the typed values are still in the fields.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/BookingSection.tsx
git commit -m "feat(booking): replace mailto CTA with a real inquiry form"
```

---

## Task 12: Booking rating badge

**Files:**
- Modify: `client/src/components/BookingSection.tsx`

The property has one review, so a review section would advertise its own thinness. The score alone, attributed and linked, is the honest version.

- [ ] **Step 1: Extend the contact import**

```tsx
import {
  BOOKING_LISTING_URL,
  BOOKING_RATING,
  EMAIL,
  PHONE,
  PHONE_DISPLAY,
} from "@shared/contact";
```

- [ ] **Step 2: Add the badge**

In the summary sidebar, directly after the closing `</div>` of the block containing the `Chalet Beyond` heading and `Veľká Lomnica, Vysoké Tatry` line, insert:

```tsx
              <a
                href={BOOKING_LISTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
                style={{ textDecoration: "none" }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1rem",
                    color: "oklch(0.06 0.008 55)",
                    background: "oklch(0.72 0.12 65)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "2px",
                  }}
                >
                  {BOOKING_RATING}
                </span>
                <span
                  style={{
                    fontFamily: "'Karla', sans-serif",
                    fontSize: "0.78rem",
                    color: "oklch(0.62 0.020 65)",
                  }}
                >
                  Hodnotenie na Booking.com
                </span>
              </a>
```

- [ ] **Step 3: Verify**

Run: `pnpm dev`, open `#rezervacia`

Expected: an amber `10` chip beside "Hodnotenie na Booking.com", opening the listing in a new tab.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/BookingSection.tsx
git commit -m "feat(booking): link the Booking.com rating badge"
```

---

## Task 13: Sticky contact bar

**Files:**
- Create: `client/src/components/StickyContactBar.tsx`
- Modify: `client/src/pages/Home.tsx`

- [ ] **Step 1: Write the component**

Create `client/src/components/StickyContactBar.tsx`:

```tsx
/*
 * CHALET BEYOND — Sticky Contact Bar
 * Mobile only. Appears once the hero is behind the guest, so it never covers it.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { PHONE, PHONE_DISPLAY, WHATSAPP_URL } from "@shared/contact";

export function StickyContactBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="md:hidden"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "oklch(0.72 0.12 65 / 0.25)",
            borderTop: "1px solid oklch(0.72 0.12 65 / 0.25)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <a
            href={`tel:${PHONE}`}
            aria-label={`Zavolať na ${PHONE_DISPLAY}`}
            className="flex items-center justify-center gap-2"
            style={{
              background: "oklch(0.10 0.012 55)",
              color: "oklch(0.92 0.008 75)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.95rem",
              textDecoration: "none",
            }}
          >
            <Phone size={15} style={{ color: "oklch(0.72 0.12 65)" }} />
            Zavolať
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Napísať cez WhatsApp"
            className="flex items-center justify-center gap-2"
            style={{
              background: "oklch(0.72 0.12 65)",
              color: "oklch(0.06 0.008 55)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.95rem",
              textDecoration: "none",
            }}
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Mount it**

In `client/src/pages/Home.tsx` add the import:

```tsx
import { StickyContactBar } from "@/components/StickyContactBar";
```

and render it last, after `<Footer />`, so it layers above everything:

```tsx
      <Footer />
      <StickyContactBar />
```

- [ ] **Step 3: Verify on a mobile viewport**

Run `pnpm dev`, set the viewport to 375×812, scroll past the hero.

Expected: the bar slides up from the bottom with two halves — dark "Zavolať", amber "WhatsApp". It is absent at the top of the page and absent entirely at desktop widths.

- [ ] **Step 4: Verify it does not cover the footer**

Scroll to the very bottom.

Expected: footer text is readable and not hidden behind the bar. If it is, add `paddingBottom: "4rem"` to the `md:hidden` footer container.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/StickyContactBar.tsx client/src/pages/Home.tsx
git commit -m "feat(contact): sticky phone and WhatsApp bar on mobile"
```

---

## Task 14: Amenities corrections

**Files:**
- Modify: `client/src/components/AmenitiesSection.tsx`

Booking lists facilities the site never mentions, and the site makes one promise Booking contradicts. Both are fixed here.

- [ ] **Step 1: Extend the icon import**

Replace the `lucide-react` import block with:

```tsx
import {
  Wifi, Car, Thermometer, Waves, Flame, Utensils,
  Tv, ShowerHead, Wind, Mountain, TreePine, Baby,
  Plane, Snowflake, WashingMachine, Coffee
} from "lucide-react";
```

- [ ] **Step 2: Correct and extend the amenities list**

Replace the whole `amenities` array with:

```tsx
const amenities = [
  { icon: Wifi, label: "Bezplatné WiFi" },
  { icon: Car, label: "Súkromné parkovanie" },
  { icon: Plane, label: "Letiskový transfer" },
  { icon: Thermometer, label: "Fínska sauna" },
  { icon: Waves, label: "Vírivka / Hot tub" },
  { icon: Flame, label: "Kozub" },
  { icon: Utensils, label: "Plne vybavená kuchyňa" },
  { icon: Coffee, label: "Kávovar" },
  { icon: Tv, label: "Projektor, TV & Netflix" },
  { icon: WashingMachine, label: "Práčka & sušička" },
  { icon: ShowerHead, label: "3 kúpeľne, župany" },
  { icon: Snowflake, label: "Lyžiareň" },
  { icon: Wind, label: "Vonkajší gril (BBQ)" },
  { icon: Mountain, label: "Výhľad na hory" },
  { icon: TreePine, label: "Záhrada & terasa" },
  { icon: Baby, label: "Detská stolička" },
];
```

`Vhodné pre rodiny` is replaced by `Detská stolička`: Booking states that cribs and extra beds are unavailable, so a blanket family promise sets up a complaint on arrival. The high chair is a fact.

- [ ] **Step 3: State the child policy in the house rules**

In `client/src/components/BookingSection.tsx`, replace these two entries in the house-rules array:

```tsx
                { label: "Vek", value: "Bez obmedzenia" },
                { label: "Deti", value: "Vítané" },
```

with:

```tsx
                { label: "Deti", value: "Vítané, od 16 r. ako dospelí" },
                { label: "Postieľky", value: "Nie sú k dispozícii" },
```

- [ ] **Step 4: Verify**

Run: `pnpm dev`

Expected: sixteen amenity tiles including Letiskový transfer, Lyžiareň, Práčka & sušička and Kávovar. House rules read "Vítané, od 16 r. ako dospelí" and "Nie sú k dispozícii".

- [ ] **Step 5: Commit**

```bash
git add client/src/components/AmenitiesSection.tsx client/src/components/BookingSection.tsx
git commit -m "fix(content): align amenities and child policy with the Booking listing"
```

---

## Task 15: Repair analytics

**Files:**
- Modify: `client/index.html`

The current tag references `%VITE_ANALYTICS_ENDPOINT%`, which Vite never substitutes, producing `Malformed URI sequence in request URL` on every page load and recording nothing.

- [ ] **Step 1: Guard the tag**

In `client/index.html`, replace the analytics `<script>` element with:

```html
    <script type="module">
      const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
      const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
      if (endpoint && websiteId) {
        const tag = document.createElement("script");
        tag.defer = true;
        tag.src = `${endpoint}/umami`;
        tag.dataset.websiteId = websiteId;
        document.head.appendChild(tag);
      }
    </script>
```

Vite substitutes `import.meta.env` inside a module script, and the guard means an unconfigured environment simply skips analytics instead of firing a broken request.

- [ ] **Step 2: Verify the unconfigured case is silent**

With no analytics variables in `.env`, run `pnpm dev` and load the page.

Expected: no `Malformed URI sequence` in the terminal, no failed request in the network tab.

- [ ] **Step 3: Verify the configured case works**

Add real values to `.env`, restart, reload.

Expected: a request to `<endpoint>/umami` returning 200.

- [ ] **Step 4: Commit**

```bash
git add client/index.html
git commit -m "fix(analytics): load umami only when configured"
```

---

## Task 16: Full verification against the spec

**Files:** none — this task only verifies.

Work through the spec's seven success criteria. Every one must pass before this branch is proposed for merge.

- [ ] **Step 1: Confirm the placeholder phone number is gone**

Run: `grep -rn "421900000000" shared/ client/`

Expected: no matches. If the real number is still unknown, this branch is not deployable — record it and stop.

- [ ] **Step 2: Unit tests and types**

Run: `pnpm test && pnpm check`

Expected: all tests pass, no type errors.

- [ ] **Step 3: Production build**

Run: `pnpm build`

Expected: build completes, `dist/public` written.

- [ ] **Step 4: Availability reaches the calendar (spec criterion 1)**

Block a test date in the Booking extranet, wait for the 30-minute cache to lapse or restart `netlify dev`, then reload.

Expected: that day is unclickable in the calendar.

- [ ] **Step 5: Inquiry is delivered (spec criterion 2)**

Submit the form with real dates and a mailbox you control.

Expected: owner email with dates, guests, price and contact details; guest confirmation email.

- [ ] **Step 6: Price is visible (spec criterion 3)**

Open `#rezervacia` and pick any valid range.

Expected: per-night rate, total and saving are all on screen without further scrolling.

- [ ] **Step 7: Arithmetic is right (spec criterion 4)**

Select 8 guests and a seven-night range.

Expected: `4 725 €` total and `Ušetríte 546 €`.

- [ ] **Step 8: Analytics reports (spec criterion 5)**

Load the built site with analytics configured.

Expected: request to the analytics endpoint returns 200; no `Malformed URI sequence` anywhere in the logs.

- [ ] **Step 9: The site survives a dead endpoint (spec criterion 6)**

Rename `netlify/functions/availability.ts` to `availability.ts.off`, restart `netlify dev`, reload.

Expected: page renders, calendar works unblocked, the fallback note appears, and the form still submits. Restore the filename afterwards.

- [ ] **Step 10: Validation holds server-side (spec criterion 7)**

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:8888/api/inquiry -H 'content-type: application/json' -d '{"from":"2026-09-11","to":"2026-09-12","guests":4,"name":"Test Test","email":"t@example.com","phone":"+421900000000"}'
curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:8888/api/inquiry -H 'content-type: application/json' -d '{"from":"2026-09-11","to":"2026-09-13","guests":9,"name":"Test Test","email":"t@example.com","phone":"+421900000000"}'
```

Expected: `400` for both.

- [ ] **Step 11: Commit any fixes and push the branch**

```bash
git push -u origin wave1-konverzia
```

---

## Blocked without the owner

These tasks cannot be completed — not merely verified — until the owner supplies the values. Build the code, record the gap, do not invent substitutes.

| Missing value | Blocks |
|---|---|
| Phone number, WhatsApp yes/no | Tasks 7, 13, and Step 1 of Task 16 |
| iCal feed URL | Task 5 Step 4, Task 9 Step 4, Task 16 Step 4 |
| `RESEND_API_KEY`, verified domain, `OWNER_EMAIL` | Task 6 Step 5, Task 11 Step 4, Task 16 Step 5 |
| Umami endpoint and website ID | Task 15 Step 3, Task 16 Step 8 |
| Confirmed Booking commission rate | Price tables in `shared/pricing.ts` — if it is not 15 %, recompute both tables and rerun `pnpm test` |
| Confirmed distance to the golf course | Copy in `ChaletIntroSection.tsx` claiming "dve minúty od vchodových dverí" |
