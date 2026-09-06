import { z } from "zod";
import { MAX_GUESTS, MIN_NIGHTS } from "../../../shared/pricing";

const MS_PER_DAY = 86_400_000;

// The shape check alone is not enough: Date.parse rolls impossible days forward
// (2026-02-30 becomes 2026-03-02) instead of failing, which would price a stay
// from a different date than the one the guest sent. Require a round trip.
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Dátum musí byť v tvare RRRR-MM-DD")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value)
    );
  }, "Neexistujúci dátum");

export function nightsBetween(from: string, to: string): number {
  return Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
      MS_PER_DAY,
  );
}

export const inquirySchema = z
  .object({
    from: isoDate,
    to: isoDate,
    // Messages are spelled out because the client renders them verbatim to the
    // guest; Zod's defaults are English and read like internals.
    // `guests` is the adult count: it selects the price tier.
    guests: z
      .number()
      .int()
      .min(1, "Zadajte počet dospelých")
      .max(MAX_GUESTS, `Najviac ${MAX_GUESTS} hostí`),
    // Children aged 0-15. Flat rate each, but they still occupy a bed, so the
    // combined total is bounded below.
    children: z
      .number()
      .int()
      .min(0, "Počet detí nemôže byť záporný")
      .max(MAX_GUESTS - 1, `Najviac ${MAX_GUESTS} hostí`)
      .optional()
      .default(0),
    name: z.string().trim().min(2, "Zadajte meno").max(100),
    email: z.email("Zadajte platný e-mail"),
    phone: z.string().trim().min(6, "Zadajte telefónne číslo").max(30),
    message: z.string().trim().max(2000).optional(),
    // Honeypot: hidden in the form, so a human never fills it and a bot that
    // completes every field does. Checked in the handler, not rejected here —
    // a caught bot gets a normal-looking 200 rather than a hint to retry.
    website: z.string().max(200).optional(),
  })
  .refine((value) => value.guests + (value.children ?? 0) <= MAX_GUESTS, {
    message: `Najviac ${MAX_GUESTS} hostí vrátane detí`,
    path: ["children"],
  })
  .refine((value) => nightsBetween(value.from, value.to) >= MIN_NIGHTS, {
    message: `Minimálna dĺžka pobytu je ${MIN_NIGHTS} noci`,
    path: ["to"],
  });

export type Inquiry = z.infer<typeof inquirySchema>;
