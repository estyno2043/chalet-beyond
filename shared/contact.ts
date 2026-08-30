/*
 * CHALET BEYOND — contact details.
 */

/** E.164, used for tel: and wa.me links. */
export const PHONE = "+421905111061";

/** Human-readable form shown in the interface. */
export const PHONE_DISPLAY = "+421 905 111 061";

export const EMAIL = "contact@chaletbeyond.sk";

export const WHATSAPP_URL = `https://wa.me/${PHONE.replace(/\D/g, "")}`;

export const BOOKING_LISTING_URL =
  "https://www.booking.com/hotel/sk/chalet-beyond.html";

/** Booking.com guest rating, kept here so the badge and any future copy agree. */
export const BOOKING_RATING = "10";
