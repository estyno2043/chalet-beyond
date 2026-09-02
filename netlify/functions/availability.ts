/*
 * GET /api/availability — occupied nights, merged from every configured iCal feed.
 *
 * The loading itself lives in lib/feeds so the inquiry endpoint can re-check a
 * range against the same source. Here it is only turned into a response.
 */
import { feedUrls, loadBlockedDates } from "./lib/feeds";

const CDN_CACHE = "public, max-age=1800";

export default async (): Promise<Response> => {
  const urls = feedUrls();

  if (urls.length === 0) {
    console.error("availability: ICAL_URLS is not set");
    return Response.json({ error: "ical_not_configured" }, { status: 502 });
  }

  const { blocked, failures } = await loadBlockedDates(urls);

  for (const failure of failures) {
    // failure.url is redacted by lib/feeds: the export token must not reach a log.
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
