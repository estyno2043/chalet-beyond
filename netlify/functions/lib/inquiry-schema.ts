import { z } from "zod";
import { MAX_GUESTS, MIN_NIGHTS } from "../../../shared/pricing";

const MS_PER_DAY = 86_400_000;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Dátum musí byť v tvare RRRR-MM-DD");

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
    guests: z.number().int().min(1).max(MAX_GUESTS),
    name: z.string().trim().min(2, "Zadajte meno").max(100),
    email: z.email("Zadajte platný e-mail"),
    phone: z.string().trim().min(6, "Zadajte telefónne číslo").max(30),
    message: z.string().trim().max(2000).optional(),
  })
  .refine((value) => nightsBetween(value.from, value.to) >= MIN_NIGHTS, {
    message: `Minimálna dĺžka pobytu je ${MIN_NIGHTS} noci`,
    path: ["to"],
  });

export type Inquiry = z.infer<typeof inquirySchema>;
