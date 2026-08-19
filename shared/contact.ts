/*
 * CHALET BEYOND — contact details.
 *
 * PHONE is a placeholder until the owner supplies the real number, and it uses
 * the unassignable 000 prefix on purpose: the 0900 range is premium-rate in
 * Slovakia, so a plausible-looking placeholder that slipped into production
 * would charge guests who tapped "Zavolať". This one can only fail to connect.
 * Task 16 greps for it and blocks the deploy.
 */

/** E.164, used for tel: and wa.me links. */
export const PHONE = "+421000000000";

/** Human-readable form shown in the interface. */
export const PHONE_DISPLAY = "+421 000 000 000";

export const EMAIL = "contact@chaletbeyond.sk";

export const WHATSAPP_URL = `https://wa.me/${PHONE.replace(/\D/g, "")}`;

export const BOOKING_LISTING_URL =
  "https://www.booking.com/hotel/sk/chalet-beyond.html";

/** Booking.com guest rating, kept here so the badge and any future copy agree. */
export const BOOKING_RATING = "10";
