import { describe, expect, it } from "vitest";
import {
  PHONE,
  PHONE_DISPLAY,
  EMAIL,
  WHATSAPP_URL,
  BOOKING_LISTING_URL,
} from "./contact";

describe("Contact Information & Phone Tests", () => {
  it("PHONE matches standard E.164 international format without spaces or dashes", () => {
    // E.164 format: starts with +, followed by 1 to 15 digits
    expect(PHONE).toMatch(/^\+[1-9]\d{7,14}$/);
    expect(PHONE).not.toContain(" ");
    expect(PHONE).not.toContain("-");
    expect(PHONE).toBe("+421905111061");
  });

  it("PHONE_DISPLAY is formatted cleanly with spacing for human readability", () => {
    expect(PHONE_DISPLAY).toBe("+421 905 111 061");
    // Stripping spaces must match PHONE exactly
    expect(PHONE_DISPLAY.replace(/\s+/g, "")).toBe(PHONE);
  });

  it("WHATSAPP_URL is a valid wa.me URL with clean digits", () => {
    expect(WHATSAPP_URL).toBe("https://wa.me/421905111061");
    expect(WHATSAPP_URL).toMatch(/^https:\/\/wa\.me\/\d+$/);
  });

  it("EMAIL is a valid email format", () => {
    expect(EMAIL).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(EMAIL).toBe("contact@chaletbeyond.sk");
  });

  it("BOOKING_LISTING_URL is a valid secure booking.com URL", () => {
    expect(BOOKING_LISTING_URL).toMatch(/^https:\/\/www\.booking\.com\//);
  });
});
