import { afterEach, describe, expect, it, vi } from "vitest";
import { loadBlockedDates, redactFeedUrl } from "./feeds";

const calendar = (start: string, end: string) =>
  [
    "BEGIN:VCALENDAR",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

const ok = (body: string) => new Response(body, { status: 200 });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("redactFeedUrl", () => {
  it("drops the query string, which carries the export token", () => {
    expect(
      redactFeedUrl("https://ical.booking.com/v1/export?t=super-secret-token"),
    ).toBe("https://ical.booking.com/v1/export");
  });

  it("keeps enough of the URL to tell two feeds apart", () => {
    expect(redactFeedUrl("https://airbnb.com/calendar/ical/123.ics?s=abc")).toBe(
      "https://airbnb.com/calendar/ical/123.ics",
    );
  });

  it("never returns the input when it cannot be parsed", () => {
    expect(redactFeedUrl("not a url at all")).toBe("<unparseable feed url>");
  });
});

describe("loadBlockedDates", () => {
  it("merges and deduplicates nights across feeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(ok(calendar("20260820", "20260822")))
        .mockResolvedValueOnce(ok(calendar("20260821", "20260823"))),
    );

    const result = await loadBlockedDates(["https://a.test/x", "https://b.test/y"]);

    expect(result.blocked).toEqual(["2026-08-20", "2026-08-21", "2026-08-22"]);
    expect(result.failures).toEqual([]);
  });

  it("keeps the nights a healthy feed reported when another one fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(ok(calendar("20260820", "20260822")))
        .mockRejectedValueOnce(new Error("ECONNRESET")),
    );

    const result = await loadBlockedDates(["https://a.test/x", "https://b.test/y"]);

    expect(result.blocked).toEqual(["2026-08-20", "2026-08-21"]);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].reason).toBe("unreachable");
  });

  it("reports a non-2xx response as unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })));

    const result = await loadBlockedDates(["https://a.test/x"]);

    expect(result.blocked).toEqual([]);
    expect(result.failures[0].reason).toBe("unreachable");
  });

  it("separates a revoked URL answering with HTML from a network problem", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok("<html>sign in</html>")));

    const result = await loadBlockedDates(["https://a.test/x"]);

    expect(result.failures[0].reason).toBe("invalid");
  });

  it("redacts the token in the failure it reports", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));

    const result = await loadBlockedDates(["https://a.test/export?t=secret"]);

    expect(result.failures[0].url).toBe("https://a.test/export");
  });
});
