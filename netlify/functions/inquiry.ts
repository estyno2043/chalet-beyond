/*
 * POST /api/inquiry — validates a booking inquiry and emails both parties.
 * The total is recomputed here rather than trusted from the request body.
 */
import { Resend } from "resend";
import { calcTotal } from "../../shared/pricing";
import { inquirySchema } from "./lib/inquiry-schema";

const SENDER = "Chalet Beyond <rezervacie@chaletbeyond.sk>";

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405 });
  }

  const body = await request.json().catch(() => null);
  // Array.isArray matters: typeof [] is "object", so a JSON array would slip
  // through to Zod and surface its English message.
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    // Zod's own message here is English and mentions its internals; the client
    // shows this string to the guest unchanged.
    return Response.json({ error: "Neplatný dopyt" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Neplatný dopyt" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const owner = process.env.OWNER_EMAIL;
  if (!apiKey || !owner) {
    console.error("inquiry: RESEND_API_KEY or OWNER_EMAIL is not set");
    return Response.json({ error: "mail_not_configured" }, { status: 502 });
  }

  const { from, to, guests, name, email, phone, message } = parsed.data;
  const price = calcTotal(utc(from), utc(to), guests);
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: SENDER,
      to: owner,
      replyTo: email,
      subject: `Dopyt ${from} → ${to} · ${guests} hostí · ${price.total} €`,
      text: [
        `Termín:     ${from} → ${to} (${price.nights} nocí)`,
        `Hostia:     ${guests}`,
        `Cena:       ${price.perNight} €/noc · spolu ${price.total} €`,
        `Na Bookingu by zaplatil ${price.bookingTotal} € (ušetril ${price.savings} €)`,
        "",
        `Meno:       ${name}`,
        `E-mail:     ${email}`,
        `Telefón:    ${phone}`,
        "",
        message ? `Poznámka:\n${message}` : "Bez poznámky.",
      ].join("\n"),
    });
    // The SDK reports delivery failures in the payload rather than by throwing,
    // so a rejected send would otherwise look like success and the lead vanishes.
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (error) {
    console.error("inquiry: owner notification failed", error);
    return Response.json({ error: "mail_failed" }, { status: 502 });
  }

  try {
    const { error } = await resend.emails.send({
      from: SENDER,
      to: email,
      subject: "Váš dopyt — Chalet Beyond",
      text: [
        `Dobrý deň, ${name},`,
        "",
        "ďakujeme za dopyt. Ozveme sa do 24 hodín.",
        "",
        `Termín:  ${from} → ${to} (${price.nights} nocí)`,
        `Hostia:  ${guests}`,
        `Cena:    ${price.perNight} €/noc · spolu ${price.total} €`,
        "",
        "Toto je predbežná cena, nie záväzná rezervácia.",
        "",
        "Chalet Beyond",
        "Kamenná 2004/25A, 059 52 Veľká Lomnica",
      ].join("\n"),
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (error) {
    // The lead is already delivered; do not make the guest submit twice.
    console.error("inquiry: guest confirmation failed", error);
  }

  return Response.json({ ok: true });
};

export const config = { path: "/api/inquiry" };
