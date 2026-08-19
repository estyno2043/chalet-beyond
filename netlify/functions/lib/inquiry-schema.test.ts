import { describe, expect, it } from "vitest";
import { inquirySchema } from "./inquiry-schema";

const valid = {
  from: "2026-09-11",
  to: "2026-09-13",
  guests: 4,
  name: "Anna Nováková",
  email: "anna@example.com",
  phone: "+421900123456",
  message: "Prídeme s deťmi.",
};

describe("inquirySchema", () => {
  it("accepts a complete inquiry", () => {
    expect(inquirySchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an inquiry with no message", () => {
    const { message, ...withoutMessage } = valid;
    expect(inquirySchema.safeParse(withoutMessage).success).toBe(true);
  });

  it("rejects a stay shorter than the two-night minimum", () => {
    const result = inquirySchema.safeParse({ ...valid, to: "2026-09-12" });
    expect(result.success).toBe(false);
  });

  it("rejects a checkout before the checkin", () => {
    const result = inquirySchema.safeParse({ ...valid, to: "2026-09-09" });
    expect(result.success).toBe(false);
  });

  it("rejects more guests than the property sleeps", () => {
    expect(inquirySchema.safeParse({ ...valid, guests: 9 }).success).toBe(false);
  });

  it("rejects a malformed email", () => {
    expect(inquirySchema.safeParse({ ...valid, email: "anna@" }).success).toBe(
      false,
    );
  });

  it("rejects a missing phone number", () => {
    expect(inquirySchema.safeParse({ ...valid, phone: "" }).success).toBe(false);
  });

  it("rejects a malformed date", () => {
    expect(inquirySchema.safeParse({ ...valid, from: "11.9.2026" }).success).toBe(
      false,
    );
  });

  it("rejects a date that does not exist rather than rolling it forward", () => {
    // Date.parse turns 2026-02-30 into 2026-03-02, which would price the stay
    // from a different day than the one shown to the owner.
    const result = inquirySchema.safeParse({
      ...valid,
      from: "2026-02-30",
      to: "2026-03-04",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Neexistujúci dátum");
  });

  it("reports an impossible month as a date problem, not a length problem", () => {
    const result = inquirySchema.safeParse({ ...valid, from: "2026-13-01" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Neexistujúci dátum");
  });

  it("rejects a non-object payload", () => {
    expect(inquirySchema.safeParse(null).success).toBe(false);
  });
});
