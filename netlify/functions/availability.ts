/*
 * GET /api/availability — occupied nights, merged from every configured iCal feed.
 *
 * One failing feed must not discard the nights another feed reported correctly,
 * so each is loaded independently and the response carries a `degraded` flag
 * when some of them did not answer.
 */
import { parseBlockedDates } from "./lib/ical";

/** A feed that accepts the connection but never answers must not hold the function open. */
const FEED_TIMEOUT_MS = 5000;

const CDN_CACHE = "public, max-age=1800";

type FeedResult =
  | { ok: true; blocked: string[] }
  | { ok: false; url: string; reason: "unreachable" | "invalid"; detail: string };

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
        url,
        reason: "unreachable",
        detail: `responded ${response.status}`,
      };
    }
    body = await response.text();
  } catch (error) {
    return { ok: false, url, reason: "unreachable", detail: String(error) };
  }

  try {
    return { ok: true, blocked: parseBlockedDates(body) };
  } catch (error) {
    // Reachable and served fine, but not a calendar — typically a revoked export
    // URL answering 200 with an HTML login page. The fix is to reissue the URL,
    // not to chase a network problem, so this must not be reported as unreachable.
    return { ok: false, url, reason: "invalid", detail: String(error) };
  }
}

export default async (): Promise<Response> => {
  const urls = (process.env.ICAL_URLS ?? "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  if (urls.length === 0) {
    console.error("availability: ICAL_URLS is not set");
    return Response.json({ error: "ical_not_configured" }, { status: 502 });
  }

  const results = await Promise.all(urls.map(loadFeed));

  const failures = results.filter(
    (result): result is Extract<FeedResult, { ok: false }> => !result.ok,
  );
  for (const failure of failures) {
    console.error(`availability: feed ${failure.reason}`, failure.url, failure.detail);
  }

  if (failures.length === urls.length) {
    // Nothing trustworthy to report. Name the revoked-URL case separately so the
    // owner is pointed at the extranet rather than at a suspected outage.
    const error = failures.some((failure) => failure.reason === "invalid")
      ? "ical_invalid"
      : "ical_unreachable";
    return Response.json({ error }, { status: 502 });
  }

  // Array.from rather than a spread: tsconfig sets no `target`, so tsc
  // assumes ES5 and rejects iterating a Set directly.
  const blocked = Array.from(
    new Set(results.flatMap((result) => (result.ok ? result.blocked : []))),
  ).sort();

  const degraded = failures.length > 0;

  return Response.json(
    { blocked, updated: new Date().toISOString(), degraded },
    {
      headers: {
        // The browser must not hold its own copy: a guest with the page open
        // would keep seeing nights that sold minutes ago. The CDN absorbs the
        // load instead. A degraded answer is not cached at all, so the next
        // request retries the feed that failed.
        "Cache-Control": "no-store",
        ...(degraded ? {} : { "Netlify-CDN-Cache-Control": CDN_CACHE }),
      },
    },
  );
};

export const config = { path: "/api/availability" };
