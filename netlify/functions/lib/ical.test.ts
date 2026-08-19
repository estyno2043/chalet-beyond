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
      "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTSTART;VALUE=DATE:2026\r\n 0820\r\nDTEND;VALUE=DATE:20260821\r\nEND:VEVENT\r\nEND:VCALENDAR";
    expect(parseBlockedDates(feed)).toEqual(["2026-08-20"]);
  });

  it("handles date-time values as well as plain dates", () => {
    const feed =
      "BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART:20261005T140000Z\nDTEND:20261007T100000Z\nEND:VEVENT\nEND:VCALENDAR";
    expect(parseBlockedDates(feed)).toEqual(["2026-10-05", "2026-10-06"]);
  });

  it("crosses a month boundary", () => {
    const feed =
      "BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:20260930\nDTEND;VALUE=DATE:20261002\nEND:VEVENT\nEND:VCALENDAR";
    expect(parseBlockedDates(feed)).toEqual(["2026-09-30", "2026-10-01"]);
  });

  it("ignores an event missing an end date", () => {
    const feed =
      "BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:20260820\nEND:VEVENT\nEND:VCALENDAR";
    expect(parseBlockedDates(feed)).toEqual([]);
  });

  it("returns nothing for a calendar with no events", () => {
    expect(parseBlockedDates("BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR")).toEqual(
      [],
    );
  });

  it("throws rather than reporting everything free when the feed is not a calendar", () => {
    // An expired Booking export URL answers 200 with an HTML login page.
    expect(() =>
      parseBlockedDates(
        "<!doctype html><html><body>Session expired. Please log in.</body></html>",
      ),
    ).toThrow(/BEGIN:VCALENDAR/);
    expect(() => parseBlockedDates("")).toThrow(/BEGIN:VCALENDAR/);
  });
});
