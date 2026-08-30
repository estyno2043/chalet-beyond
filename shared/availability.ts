/*
 * CHALET BEYOND — availability rules for the date picker.
 *
 * The feed reports occupied NIGHTS, but a calendar selects DAYS, and the two do
 * not line up at the edges. A stay from the 11th to the 18th occupies the nights
 * of the 11th through the 17th; the 18th is only a departure. So when nights
 * 18-21 are sold, the 18th is still a valid check-out — the departing guest
 * leaves in the morning, the next arrives in the afternoon. Blocking it outright
 * costs exactly the back-to-back bookings that fill a season.
 */

/** Local-midnight YYYY-MM-DD. Never toISOString(): that shifts the day in any positive UTC offset. */
export function isoDay(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const MS_PER_DAY = 86_400_000;

function shiftDay(day: string, delta: number): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) + delta * MS_PER_DAY)
    .toISOString()
    .slice(0, 10);
}

/**
 * Occupied days that may still be chosen as a check-out: the first night of each
 * booked run. Everything after it in the run is unusable in either direction.
 */
export function checkoutOnlyDays(blocked: readonly string[]): Set<string> {
  const taken = new Set(blocked);
  return new Set(blocked.filter((day) => !taken.has(shiftDay(day, -1))));
}

/** The nights a stay consumes: [from, to). The departure day is not one of them. */
export function nightsBetween(from: string, to: string): string[] {
  const nights: string[] = [];
  for (let day = from; day < to; day = shiftDay(day, 1)) nights.push(day);
  return nights;
}

/** True when no night the stay consumes is already sold. */
export function rangeIsFree(
  from: string,
  to: string,
  blocked: readonly string[],
): boolean {
  const taken = new Set(blocked);
  return nightsBetween(from, to).every((night) => !taken.has(night));
}
