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
