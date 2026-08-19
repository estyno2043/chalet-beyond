import { describe, expect, it } from "vitest";
import { calcTotal, MAX_GUESTS, MIN_NIGHTS, PRICE_PER_NIGHT } from "./pricing";

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
