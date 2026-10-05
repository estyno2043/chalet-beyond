import { ACTIVE_PROMOTIONS, type DatePromotion } from "./pricing-promotions";

export const MIN_NIGHTS = 2;
export const MAX_GUESTS = 8;
/** Bound per-night quote allocation; implausibly long inquiries need a manual quote. */
export const MAX_QUOTE_NIGHTS = 3660;
export const LONG_STAY_MIN_NIGHTS = 7;
export const LONG_STAY_DISCOUNT_RATE = 0.2;
export const CHILD_PRICE_PER_NIGHT = 40;
/** Guests aged 0–15 pay the child rate; guests aged 16+ count as adults. */
export const CHILD_MAX_AGE = 15;

/** Base adult rate per night in EUR. One guest pays the two-guest rate. */
export const PRICE_PER_NIGHT: Record<number, number> = {
  1: 300,
  2: 300,
  3: 350,
  4: 400,
  5: 500,
  6: 600,
  7: 650,
  8: 700,
};

export interface NightlyPrice {
  /** The calendar date of the night, YYYY-MM-DD. */
  date: string;
  baseRate: number;
  effectiveRate: number;
  promotionId: string | null;
  promotionLabel: string | null;
}

export interface PriceBreakdown {
  nights: number;
  /** Undiscounted nightly rate for this guest mix. */
  perNight: number;
  baseTotal: number;
  weeklyDiscount: number;
  promotionDiscount: number;
  discountKind: "weekly" | "promotion" | null;
  nightlyBreakdown: NightlyPrice[];
  total: number;
}

const MS_PER_DAY = 86_400_000;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function calendarDay(date: Date): number {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    throw new Error("Stay dates must be valid dates");
  }
  return (
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY
  );
}

function isoDay(day: number): string {
  return new Date(day * MS_PER_DAY).toISOString().slice(0, 10);
}

function parseIsoDay(value: string): number {
  const match = ISO_DATE.exec(value);
  if (!match) throw new Error(`Invalid promotion date: ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const date = Number(match[3]);
  const day = Date.UTC(year, month - 1, date) / MS_PER_DAY;
  if (isoDay(day) !== value)
    throw new Error(`Invalid promotion date: ${value}`);
  return day;
}

function eurosToCents(value: number, description: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${description} must be a non-negative finite amount`);
  }
  const cents = Math.round(value * 100);
  if (!Number.isSafeInteger(cents))
    throw new Error(`${description} is too large`);
  return cents;
}

function validatePromotions(promotions: readonly DatePromotion[]) {
  const ids = new Set<string>();
  return promotions.map(promotion => {
    if (
      !promotion.id?.trim() ||
      !promotion.label?.trim() ||
      ids.has(promotion.id)
    ) {
      throw new Error(
        `Promotion must have a unique id and label: ${promotion.id}`
      );
    }
    ids.add(promotion.id);
    const from = parseIsoDay(promotion.from);
    const through = parseIsoDay(promotion.through);
    if (through < from)
      throw new Error(`Promotion ${promotion.id} ends before it starts`);
    if ("percentOff" in promotion && promotion.percentOff !== undefined) {
      if (
        !Number.isFinite(promotion.percentOff) ||
        promotion.percentOff <= 0 ||
        promotion.percentOff >= 100
      ) {
        throw new Error(
          `Promotion ${promotion.id} percentage must be greater than 0 and less than 100`
        );
      }
    } else if (
      "adultRateByGuests" in promotion &&
      promotion.adultRateByGuests
    ) {
      const entries = Object.entries(promotion.adultRateByGuests);
      if (entries.length === 0)
        throw new Error(
          `Promotion ${promotion.id} needs at least one adult rate`
        );
      for (const [guests, rate] of entries) {
        if (
          !Number.isInteger(Number(guests)) ||
          Number(guests) < 1 ||
          Number(guests) > MAX_GUESTS ||
          rate === undefined
        ) {
          throw new Error(
            `Promotion ${promotion.id} has an invalid guest tier: ${guests}`
          );
        }
        eurosToCents(rate, `Promotion ${promotion.id} adult rate`);
      }
    } else {
      throw new Error("Promotion needs a percentage or adult rate");
    }
    return { ...promotion, fromDay: from, throughDay: through };
  });
}

/**
 * Quote a stay in EUR. Dated offers are evaluated per eligible night. A stay of
 * seven or more nights gets the cheaper of its 20% whole-stay weekly price and
 * its dated-offer price. Discounts never stack. Totals round to cents.
 */
export function calcTotal(
  from: Date,
  to: Date,
  adults: number,
  children = 0,
  promotions: readonly DatePromotion[] = ACTIVE_PROMOTIONS
): PriceBreakdown {
  if (!Number.isInteger(children) || children < 0) {
    throw new Error(
      `Children must be a non-negative whole number, got ${children}`
    );
  }
  if (adults + children > MAX_GUESTS) {
    throw new Error(
      `At most ${MAX_GUESTS} guests, got ${adults} adults and ${children} children`
    );
  }
  const adultRate = PRICE_PER_NIGHT[adults];
  if (!Number.isInteger(adults) || adultRate === undefined) {
    throw new Error(`No published rate for ${adults} adults`);
  }
  const firstDay = calendarDay(from);
  const nights = calendarDay(to) - firstDay;
  if (nights < MIN_NIGHTS) {
    throw new Error(
      `Stay must be at least ${MIN_NIGHTS} nights, got ${nights}`
    );
  }
  if (nights > MAX_QUOTE_NIGHTS) {
    throw new Error("Stay requires an individual quote");
  }

  const validatedPromotions = validatePromotions(promotions);
  const childCents = CHILD_PRICE_PER_NIGHT * children * 100;
  const baseNightCents = eurosToCents(adultRate, "Adult rate") + childCents;
  const baseTotalCents = baseNightCents * nights;
  if (!Number.isSafeInteger(baseTotalCents))
    throw new Error("Stay total is too large");
  const promotionalNights = Array.from({ length: nights }, (_, index) => {
    const day = firstDay + index;
    let rateCents = baseNightCents;
    let promotionId: string | null = null;
    let promotionLabel: string | null = null;
    for (const promotion of validatedPromotions) {
      if (day < promotion.fromDay || day > promotion.throughDay) continue;
      let offeredCents: number;
      if ("percentOff" in promotion && promotion.percentOff !== undefined) {
        offeredCents = Math.round(
          baseNightCents * (1 - promotion.percentOff / 100)
        );
      } else if (
        "adultRateByGuests" in promotion &&
        promotion.adultRateByGuests
      ) {
        // A single adult pays the two-adult base tier and gets its fixed offer
        // unless the promotion explicitly sets a distinct one-adult rate.
        const adultOffer =
          promotion.adultRateByGuests[adults] ??
          (adults === 1 ? promotion.adultRateByGuests[2] : undefined);
        if (adultOffer === undefined) continue;
        offeredCents =
          eurosToCents(adultOffer, `Promotion ${promotion.id} adult rate`) +
          childCents;
      } else {
        continue;
      }
      if (offeredCents < rateCents) {
        rateCents = offeredCents;
        promotionId = promotion.id;
        promotionLabel = promotion.label;
      }
    }
    return { date: isoDay(day), rateCents, promotionId, promotionLabel };
  });
  const promotionTotalCents = promotionalNights.reduce(
    (sum, night) => sum + night.rateCents,
    0
  );
  const weeklyTotalCents =
    nights >= LONG_STAY_MIN_NIGHTS
      ? Math.round(baseTotalCents * (1 - LONG_STAY_DISCOUNT_RATE))
      : baseTotalCents;
  const discountKind =
    weeklyTotalCents < baseTotalCents && weeklyTotalCents <= promotionTotalCents
      ? "weekly"
      : promotionTotalCents < baseTotalCents
        ? "promotion"
        : null;
  const totalCents =
    discountKind === "weekly" ? weeklyTotalCents : promotionTotalCents;

  // Allocate a whole-stay weekly discount over nights so rows add exactly to
  // the quoted total, even when a percentage leaves a fractional cent.
  let allocatedWeeklyCents = 0;
  const nightlyBreakdown: NightlyPrice[] = promotionalNights.map(
    (night, index) => {
      let effectiveCents = night.rateCents;
      if (discountKind === "weekly") {
        effectiveCents =
          index === nights - 1
            ? weeklyTotalCents - allocatedWeeklyCents
            : Math.round(baseNightCents * (1 - LONG_STAY_DISCOUNT_RATE));
        allocatedWeeklyCents += effectiveCents;
      }
      return {
        date: night.date,
        baseRate: baseNightCents / 100,
        effectiveRate: effectiveCents / 100,
        promotionId: discountKind === "promotion" ? night.promotionId : null,
        promotionLabel:
          discountKind === "promotion" ? night.promotionLabel : null,
      };
    }
  );

  return {
    nights,
    perNight: baseNightCents / 100,
    baseTotal: baseTotalCents / 100,
    weeklyDiscount:
      discountKind === "weekly" ? (baseTotalCents - totalCents) / 100 : 0,
    promotionDiscount:
      discountKind === "promotion" ? (baseTotalCents - totalCents) / 100 : 0,
    discountKind,
    nightlyBreakdown,
    total: totalCents / 100,
  };
}
