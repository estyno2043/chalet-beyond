import { describe, expect, it } from "vitest";
import { calcTotal, MAX_GUESTS, MIN_NIGHTS, PRICE_PER_NIGHT } from "./pricing";

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

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

  it("counts nights correctly across the autumn clock change", () => {
    // DST ends in Slovakia on 2026-10-25, making one local day 25 hours long.
    const result = calcTotal(utc("2026-10-24"), utc("2026-10-26"), 4);
    expect(result.nights).toBe(2);
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
});

describe("constants", () => {
  it("requires at least two nights", () => {
    expect(MIN_NIGHTS).toBe(2);
  });
});
