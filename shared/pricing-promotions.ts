/**
 * Dated offers used by both the browser quote and the server email quote.
 * Dates are ISO calendar dates. `through` is the last discounted night;
 * a checkout on the next day is still eligible for that night.
 *
 * Add an object to ACTIVE_PROMOTIONS to publish an offer. For example:
 * { id: "winter", label: "Winter offer", from: "2027-01-10",
 *   through: "2027-01-31", percentOff: 15 }
 *
 * A fixed adult nightly rate can be set for specific occupancy tiers:
 * { id: "midweek", label: "Midweek", from: "2027-02-01",
 *   through: "2027-02-28", adultRateByGuests: { 2: 270, 3: 320 } }
 * A one-adult booking uses the two-adult offer unless tier 1 is set explicitly.
 * Children are still added at their normal €40 nightly rate. Overlapping
 * offers use the lowest eligible nightly price; the 7-night discount is then
 * compared with that offer quote, and the cheaper whole-stay quote wins.
 */
export type DatePromotion = {
  id: string;
  label: string;
  from: string;
  through: string;
} & (
  | { percentOff: number; adultRateByGuests?: never }
  | { adultRateByGuests: Partial<Record<number, number>>; percentOff?: never }
);

export const ACTIVE_PROMOTIONS: readonly DatePromotion[] = [];
