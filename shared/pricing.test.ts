import { describe, expect, it } from "vitest";
import {
  calcTotal,
  CHILD_PRICE_PER_NIGHT,
  LONG_STAY_DISCOUNT_RATE,
  LONG_STAY_MIN_NIGHTS,
  MAX_GUESTS,
  MIN_NIGHTS,
  PRICE_PER_NIGHT,
} from "./pricing";
import { ACTIVE_PROMOTIONS, type DatePromotion } from "./pricing-promotions";

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);
const local = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day);
const quote = (
  from: string,
  to: string,
  adults = 2,
  children = 0,
  promotions: readonly DatePromotion[] = []
) => calcTotal(utc(from), utc(to), adults, children, promotions);

describe("base stay rules", () => {
  it("rejects an implausibly long quote before allocating millions of nightly rows", () => {
    expect(() => quote("2026-10-01", "9999-12-31")).toThrow(/individual quote/);
  });
  it("uses the supplied nightly base tariff for every occupancy tier", () => {
    const published = [300, 300, 350, 400, 500, 600, 650, 700];
    published.forEach((rate, index) => {
      const adults = index + 1;
      expect(PRICE_PER_NIGHT[adults]).toBe(rate);
      expect(quote("2026-11-01", "2026-11-03", adults).perNight).toBe(rate);
      expect(quote("2026-11-01", "2026-11-03", adults).total).toBe(rate * 2);
    });
  });

  it("uses the published promotion configuration by default", () => {
    expect(calcTotal(utc("2026-10-01"), utc("2026-10-03"), 2)).toEqual(
      calcTotal(utc("2026-10-01"), utc("2026-10-03"), 2, 0, ACTIVE_PROMOTIONS)
    );
  });

  it("requires two calendar nights and one adult", () => {
    expect(MIN_NIGHTS).toBe(2);
    expect(() => quote("2026-09-11", "2026-09-12")).toThrow(
      /at least 2 nights/
    );
    expect(() => quote("2026-09-13", "2026-09-11")).toThrow(
      /at least 2 nights/
    );
    expect(() => quote("2026-09-11", "2026-09-13", 0, 2)).toThrow(
      /No published rate/
    );
  });

  it("counts spring and autumn clock changes by calendar day", () => {
    const spring = calcTotal(local(2026, 3, 28), local(2026, 3, 30), 4);
    const autumn = calcTotal(local(2026, 10, 24), local(2026, 10, 26), 4);
    expect(spring.nightlyBreakdown.map(night => night.date)).toEqual([
      "2026-03-28",
      "2026-03-29",
    ]);
    expect(autumn.nightlyBreakdown.map(night => night.date)).toEqual([
      "2026-10-24",
      "2026-10-25",
    ]);
    expect(spring.total).toBe(2 * PRICE_PER_NIGHT[4]);
    expect(autumn.total).toBe(spring.total);
  });

  it("rejects invalid stay dates rather than returning NaN", () => {
    expect(() => calcTotal(new Date("invalid"), utc("2026-09-13"), 2)).toThrow(
      /valid dates/
    );
  });

  it("charges a single guest the two-guest rate", () => {
    expect(quote("2026-09-11", "2026-09-13", 1).perNight).toBe(
      PRICE_PER_NIGHT[2]
    );
  });

  it("charges each child €40 per night and counts them towards capacity", () => {
    expect(CHILD_PRICE_PER_NIGHT).toBe(40);
    const family = quote("2026-09-11", "2026-09-13", 2, 2);
    expect(family.perNight).toBe(PRICE_PER_NIGHT[2] + 80);
    expect(family.total).toBe((PRICE_PER_NIGHT[2] + 80) * 2);
    expect(() => quote("2026-09-11", "2026-09-13", 6, 3)).toThrow(/At most 8/);
    expect(() => quote("2026-09-11", "2026-09-13", 5, 3)).not.toThrow();
    expect(() => quote("2026-09-11", "2026-09-13", 2, -1)).toThrow(
      /whole number/
    );
    expect(() => quote("2026-09-11", "2026-09-13", 2, 1.5)).toThrow(
      /whole number/
    );
    expect(() => quote("2026-09-11", "2026-09-13", MAX_GUESTS + 1)).toThrow();
  });
});

describe("seven-night discount", () => {
  it("starts at exactly seven nights and applies to the entire family quote", () => {
    expect(LONG_STAY_MIN_NIGHTS).toBe(7);
    expect(LONG_STAY_DISCOUNT_RATE).toBe(0.2);
    const six = quote("2026-09-11", "2026-09-17", 2, 2);
    const seven = quote("2026-09-11", "2026-09-18", 2, 2);
    expect(six.discountKind).toBeNull();
    expect(six.total).toBe(6 * (PRICE_PER_NIGHT[2] + 80));
    expect(seven.baseTotal).toBe(7 * (PRICE_PER_NIGHT[2] + 80));
    expect(seven.weeklyDiscount).toBe(seven.baseTotal * 0.2);
    expect(seven.total).toBe(seven.baseTotal * 0.8);
    expect(seven.promotionDiscount).toBe(0);
    expect(
      seven.nightlyBreakdown.reduce(
        (sum, night) => sum + night.effectiveRate,
        0
      )
    ).toBe(seven.total);
  });
});

describe("dated promotions", () => {
  const autumn: DatePromotion = {
    id: "autumn",
    label: "Autumn offer",
    from: "2026-10-02",
    through: "2026-10-03",
    percentOff: 15,
  };

  it("applies a percentage only to eligible nights; checkout is not a billed night", () => {
    const result = quote("2026-10-01", "2026-10-05", 2, 0, [autumn]);
    expect(result.discountKind).toBe("promotion");
    expect(result.nightlyBreakdown.map(night => night.promotionId)).toEqual([
      null,
      "autumn",
      "autumn",
      null,
    ]);
    expect(result.promotionDiscount).toBe(PRICE_PER_NIGHT[2] * 2 * 0.15);
    expect(result.total).toBe(result.baseTotal - result.promotionDiscount);
  });

  it("chooses the lowest overlapping offer per night and keeps child charges on fixed adult rates", () => {
    const fixed: DatePromotion = {
      id: "fixed",
      label: "Fixed rate",
      from: "2026-10-02",
      through: "2026-10-03",
      adultRateByGuests: { 2: 230 },
    };
    const result = quote("2026-10-01", "2026-10-04", 2, 2, [autumn, fixed]);
    expect(result.nightlyBreakdown.map(night => night.effectiveRate)).toEqual([
      PRICE_PER_NIGHT[2] + 80,
      310,
      310,
    ]);
    expect(result.nightlyBreakdown[1].promotionId).toBe("fixed");
    expect(result.total).toBe(PRICE_PER_NIGHT[2] + 80 + 620);
  });

  it("gives one adult the two-adult fixed offer unless an explicit one-adult rate exists", () => {
    const offer: DatePromotion = {
      id: "solo",
      label: "Solo offer",
      from: "2026-10-02",
      through: "2026-10-03",
      adultRateByGuests: { 2: 250 },
    };
    expect(quote("2026-10-02", "2026-10-04", 1, 0, [offer]).total).toBe(500);
    expect(
      quote("2026-10-02", "2026-10-04", 1, 0, [
        { ...offer, adultRateByGuests: { 1: 230, 2: 250 } },
      ]).total
    ).toBe(460);
  });

  it("chooses the cheaper whole-stay quote, without stacking a promotion and weekly discount", () => {
    const weak: DatePromotion = {
      id: "weak",
      label: "One night",
      from: "2026-10-02",
      through: "2026-10-02",
      percentOff: 30,
    };
    const strong: DatePromotion = {
      id: "strong",
      label: "Full week",
      from: "2026-10-01",
      through: "2026-10-07",
      percentOff: 30,
    };
    const weekly = quote("2026-10-01", "2026-10-08", 2, 0, [weak]);
    const promo = quote("2026-10-01", "2026-10-08", 2, 0, [strong]);
    expect(weekly.discountKind).toBe("weekly");
    expect(weekly.total).toBe(weekly.baseTotal * 0.8);
    expect(weekly.promotionDiscount).toBe(0);
    expect(
      weekly.nightlyBreakdown.every(night => night.promotionId === null)
    ).toBe(true);
    expect(promo.discountKind).toBe("promotion");
    expect(promo.total).toBe(promo.baseTotal * 0.7);
    expect(promo.weeklyDiscount).toBe(0);
  });

  it("quotes the 12.5% offer and rounds fractional cents per night", () => {
    const fraction: DatePromotion = {
      id: "fraction",
      label: "Fraction",
      from: "2026-10-01",
      through: "2026-10-02",
      percentOff: 12.5,
    };
    const result = quote("2026-10-01", "2026-10-03", 2, 0, [fraction]);
    expect(result.nightlyBreakdown.map(night => night.effectiveRate)).toEqual([
      262.5, 262.5,
    ]);
    expect(result.total).toBe(525);
    expect(result.baseTotal - result.promotionDiscount).toBe(result.total);

    const centOffer: DatePromotion = { ...fraction, percentOff: 12.345 };
    const rounded = quote("2026-10-01", "2026-10-03", 2, 0, [centOffer]);
    expect(rounded.nightlyBreakdown.map(night => night.effectiveRate)).toEqual([
      262.97, 262.97,
    ]);
    expect(rounded.total).toBe(525.94);
  });

  it("rejects malformed offer dates, reversed windows, duplicate IDs and invalid rates", () => {
    const invalid = (promotion: DatePromotion) => () =>
      quote("2026-10-01", "2026-10-03", 2, 0, [promotion]);
    expect(invalid({ ...autumn, from: "2026-02-30" })).toThrow(
      /Invalid promotion date/
    );
    expect(invalid({ ...autumn, from: "2026-10-04" })).toThrow(/ends before/);
    expect(invalid({ ...autumn, percentOff: 100 })).toThrow(/percentage/);
    expect(invalid({ ...autumn, percentOff: Number.NaN })).toThrow(
      /percentage/
    );
    expect(invalid({ ...autumn, percentOff: -2 })).toThrow(/percentage/);
    expect(() =>
      quote("2026-10-01", "2026-10-03", 2, 0, [autumn, autumn])
    ).toThrow(/unique id/);
    expect(
      invalid({
        id: "bad",
        label: "Bad",
        from: "2026-10-01",
        through: "2026-10-02",
        adultRateByGuests: { 2: -1 },
      })
    ).toThrow(/non-negative/);
  });
});
