/*
 * Loading occupied nights from the configured iCal feeds.
 *
 * Lives here rather than in the availability function because the inquiry
 * endpoint needs the same answer: a date range the client believed was free
 * has to be re-checked on the server before it turns into a booking request.
 */
import { parseBlockedDates } from "./ical";

/** A feed that accepts the connection but never answers must not hold the function open. */
const FEED_TIMEOUT_MS = 5000;

export type FeedFailure = {
  /** Already redacted — safe to log. */
  url: string;
  reason: "unreachable" | "invalid";
  detail: string;
};

export type FeedLoad = {
  /** Sorted, deduplicated occupied nights from every feed that answered. */
  blocked: string[];
  failures: FeedFailure[];
};

/**
 * The export URL's query string is the credential: anyone holding it can read
 * the property's whole occupancy. Logs are the likeliest place for it to leak,
 * so nothing outside this module ever sees the full URL.
 */
export function redactFeedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return "<unparseable feed url>";
  }
}

/** Feed URLs from the environment, in the order they were configured. */
export function feedUrls(): string[] {
  return (process.env.ICAL_URLS ?? "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

type FeedResult = { ok: true; blocked: string[] } | ({ ok: false } & FeedFailure);

/** Never throws: every failure is returned so the other feeds still count. */
async function loadFeed(url: string): Promise<FeedResult> {
  let body: string;
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    });
    if (!response.ok) {
      return {
        ok: false,
        url: redactFeedUrl(url),
        reason: "unreachable",
        detail: `responded ${response.status}`,
      };
    }
    body = await response.text();
  } catch (error) {
    return {
      ok: false,
      url: redactFeedUrl(url),
      reason: "unreachable",
      detail: String(error),
    };
  }

  try {
    return { ok: true, blocked: parseBlockedDates(body) };
  } catch (error) {
    // Reachable and served fine, but not a calendar — typically a revoked export
    // URL answering 200 with an HTML login page. The fix is to reissue the URL,
    // not to chase a network problem, so this must not be reported as unreachable.
    return {
      ok: false,
      url: redactFeedUrl(url),
      reason: "invalid",
      detail: String(error),
    };
  }
}

/**
 * One failing feed must not discard the nights another reported correctly, so
 * each is loaded independently and the failures are handed back for the caller
 * to decide how much it still trusts the answer.
 */
export async function loadBlockedDates(urls: string[]): Promise<FeedLoad> {
  const results = await Promise.all(urls.map(loadFeed));

  // Array.from rather than a spread: tsconfig sets no `target`, so tsc
  // assumes ES5 and rejects iterating a Set directly.
  const blocked = Array.from(
    new Set(results.flatMap((result) => (result.ok ? result.blocked : []))),
  ).sort();

  const failures = results
    .filter((result): result is Extract<FeedResult, { ok: false }> => !result.ok)
    .map(({ url, reason, detail }) => ({ url, reason, detail }));

  return { blocked, failures };
}
