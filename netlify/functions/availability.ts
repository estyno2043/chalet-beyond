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

    // Array.from rather than a spread: tsconfig sets no `target`, so tsc
    // assumes ES5 and rejects iterating a Set directly.
    const blocked = Array.from(new Set(feeds.flatMap(parseBlockedDates))).sort();

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
