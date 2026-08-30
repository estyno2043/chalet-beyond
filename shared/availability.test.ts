import { describe, expect, it } from "vitest";
import {
  checkoutOnlyDays,
  isoDay,
  nightsBetween,
  rangeIsFree,
} from "./availability";

// The real feed as of 2026-08-28: nights 18-21 September are sold.
const SEPTEMBER = ["2026-09-18", "2026-09-19", "2026-09-20", "2026-09-21"];

describe("isoDay", () => {
  it("formats from local parts, not UTC", () => {
    // 23:30 local on the 11th is still the 11th; toISOString would say the 12th
    // west of Greenwich and the 11th east of it, depending on the offset.
    expect(isoDay(new Date(2026, 8, 11, 23, 30))).toBe("2026-09-11");
  });
});

describe("checkoutOnlyDays", () => {
  it("keeps the first night of a run selectable as a departure", () => {
    expect(checkoutOnlyDays(SEPTEMBER)).toEqual(new Set(["2026-09-18"]));
  });

  it("marks every run in the feed, not just the first", () => {
    const feed = [...SEPTEMBER, "2026-12-23", "2026-12-24"];
    expect(checkoutOnlyDays(feed)).toEqual(
      new Set(["2026-09-18", "2026-12-23"]),
    );
  });

  it("treats a single isolated night as its own run", () => {
    expect(checkoutOnlyDays(["2026-10-05"])).toEqual(new Set(["2026-10-05"]));
  });

  it("handles a run crossing a month boundary as one run", () => {
    expect(checkoutOnlyDays(["2026-09-30", "2026-10-01"])).toEqual(
      new Set(["2026-09-30"]),
    );
  });

  it("returns nothing for an empty feed", () => {
    expect(checkoutOnlyDays([])).toEqual(new Set());
  });
});

describe("nightsBetween", () => {
  it("excludes the departure day", () => {
    expect(nightsBetween("2026-09-11", "2026-09-14")).toEqual([
      "2026-09-11",
      "2026-09-12",
      "2026-09-13",
    ]);
  });

  it("is empty when arrival and departure are the same day", () => {
    expect(nightsBetween("2026-09-11", "2026-09-11")).toEqual([]);
  });
});

describe("rangeIsFree", () => {
  it("allows checking out on the day the next booking starts", () => {
    // The case the old calendar refused: nights 11-17, departing on the 18th.
    expect(rangeIsFree("2026-09-11", "2026-09-18", SEPTEMBER)).toBe(true);
  });

  it("rejects a stay that would consume a sold night", () => {
    expect(rangeIsFree("2026-09-11", "2026-09-19", SEPTEMBER)).toBe(false);
  });

  it("rejects a stay that spans an entire booked run", () => {
    expect(rangeIsFree("2026-09-15", "2026-09-25", SEPTEMBER)).toBe(false);
  });

  it("allows arriving on the day the previous booking ends", () => {
    expect(rangeIsFree("2026-09-22", "2026-09-25", SEPTEMBER)).toBe(true);
  });

  it("allows any stay when nothing is sold", () => {
    expect(rangeIsFree("2026-09-11", "2026-09-18", [])).toBe(true);
  });
});
