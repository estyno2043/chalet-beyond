/*
 * CHALET BEYOND — pricing
 *
 * Direct price = Booking.com rate minus 10%, floored to a multiple of 5 so the
 * advertised "-10 %" is always true rather than approximately true.
 * Booking rates captured 2026-08-19 for 2026-09-11 and 2027-02-12 — identical
 * in both, so there is no seasonal tier to model.
 * A single guest pays the two-guest rate; Booking publishes no lower tier.
 */

export const MIN_NIGHTS = 2;
export const MAX_GUESTS = 8;

/** Direct price per night in EUR, by guest count. */
export const PRICE_PER_NIGHT: Record<number, number> = {
  1: 315,
  2: 315,
  3: 360,
  4: 405,
  5: 495,
  6: 585,
  7: 630,
  8: 675,
};

/** Booking.com rate per night in EUR, by guest count. Shown to make the saving visible. */
export const BOOKING_PRICE_PER_NIGHT: Record<number, number> = {
  1: 353,
  2: 353,
  3: 403,
  4: 453,
  5: 553,
  6: 653,
  7: 703,
  8: 753,
};

export interface PriceBreakdown {
  nights: number;
  perNight: number;
  total: number;
  bookingTotal: number;
  savings: number;
}

const MS_PER_DAY = 86_400_000;

export function calcTotal(from: Date, to: Date, guests: number): PriceBreakdown {
  const perNight = PRICE_PER_NIGHT[guests];
  const bookingPerNight = BOOKING_PRICE_PER_NIGHT[guests];
  if (perNight === undefined || bookingPerNight === undefined) {
    throw new Error(`No published rate for ${guests} guests`);
  }

  // Math.round absorbs the 23- and 25-hour days either side of a clock change.
  const nights = Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
  // Enforced here rather than in each caller: this figure is quoted to the guest
  // and to the owner by email, and a negative or zero total reaching either is
  // far worse than a rejected call.
  if (nights < MIN_NIGHTS) {
    throw new Error(`Stay must be at least ${MIN_NIGHTS} nights, got ${nights}`);
  }

  const total = perNight * nights;
  const bookingTotal = bookingPerNight * nights;

  return { nights, perNight, total, bookingTotal, savings: bookingTotal - total };
}
