import { describe, expect, it } from "vitest";
import {
  calcTotal,
  CHILD_PRICE_PER_NIGHT,
  MAX_GUESTS,
  MIN_NIGHTS,
  PRICE_PER_NIGHT,
} from "./pricing";

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

/**
 * Local midnight, which is what react-day-picker hands the client. UTC has no
 * clock change, so a UTC fixture cannot exercise the rounding at all.
 * The test script pins TZ=Europe/Bratislava.
 */
const local = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day);

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

  it("counts nights correctly across the spring clock change", () => {
    // Clocks go forward on 2026-03-29, so this span is 47 local hours.
    // Math.floor would price it as one night — this is the case that catches it.
    const result = calcTotal(local(2026, 3, 28), local(2026, 3, 30), 4);
    expect(result.nights).toBe(2);
    expect(result.total).toBe(810);
  });

  it("counts nights correctly across the autumn clock change", () => {
    // Clocks go back on 2026-10-25, so this span is 49 local hours.
    const result = calcTotal(local(2026, 10, 24), local(2026, 10, 26), 4);
    expect(result.nights).toBe(2);
    expect(result.total).toBe(810);
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

  it("rejects a reversed date range instead of returning a negative total", () => {
    expect(() => calcTotal(utc("2026-09-13"), utc("2026-09-11"), 4)).toThrow(
      /at least 2 nights/,
    );
  });

  it("rejects a stay below the two-night minimum", () => {
    expect(() => calcTotal(utc("2026-09-11"), utc("2026-09-12"), 4)).toThrow(
      /at least 2 nights/,
    );
  });
});

describe("constants", () => {
  it("requires at least two nights", () => {
    expect(MIN_NIGHTS).toBe(2);
  });
});

describe("children", () => {
  it("charges the flat child rate on top of the adult tier", () => {
    // 2 adults (315) + 2 children (2 x 40) = 395 per night.
    const result = calcTotal(utc("2026-09-11"), utc("2026-09-13"), 2, 2);
    expect(result.perNight).toBe(315 + 2 * CHILD_PRICE_PER_NIGHT);
    expect(result.total).toBe((315 + 2 * CHILD_PRICE_PER_NIGHT) * 2);
  });

  it("prices a child below the cheapest extra adult", () => {
    // The tier step from 2 to 3 guests is 45; a child is 40. A family must never
    // be better off declaring a child as an adult.
    const adultStep = PRICE_PER_NIGHT[3] - PRICE_PER_NIGHT[2];
    expect(CHILD_PRICE_PER_NIGHT).toBeLessThan(adultStep);
  });

  it("defaults to no children so existing callers are unchanged", () => {
    const withArg = calcTotal(utc("2026-09-11"), utc("2026-09-13"), 4, 0);
    const without = calcTotal(utc("2026-09-11"), utc("2026-09-13"), 4);
    expect(withArg).toEqual(without);
  });

  it("counts children towards the capacity of the house", () => {
    // Eight beds is eight beds, whoever sleeps in them.
    expect(() => calcTotal(utc("2026-09-11"), utc("2026-09-13"), 6, 3)).toThrow();
  });

  it("allows a full house split between adults and children", () => {
    expect(() =>
      calcTotal(utc("2026-09-11"), utc("2026-09-13"), 5, 3),
    ).not.toThrow();
  });

  it("requires at least one adult", () => {
    expect(() => calcTotal(utc("2026-09-11"), utc("2026-09-13"), 0, 2)).toThrow();
  });

  it("rejects a fractional or negative child count", () => {
    expect(() => calcTotal(utc("2026-09-11"), utc("2026-09-13"), 2, -1)).toThrow();
    expect(() => calcTotal(utc("2026-09-11"), utc("2026-09-13"), 2, 1.5)).toThrow();
  });

  it("adds the child rate to the Booking comparison too, so the saving stays honest", () => {
    // Booking's own child policy is not published to us. Applying the same
    // surcharge to both sides keeps the advertised saving to the part we can
    // actually verify — the adult tier — instead of inventing a discount.
    const result = calcTotal(utc("2026-09-11"), utc("2026-09-13"), 2, 2);
    const adultsOnly = calcTotal(utc("2026-09-11"), utc("2026-09-13"), 2);
    expect(result.savings).toBe(adultsOnly.savings);
  });
});
