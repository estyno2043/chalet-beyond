/*
 * POST /api/inquiry — validates a booking inquiry and emails both parties.
 * The total is recomputed here rather than trusted from the request body.
 */
import { Resend } from "resend";
import { calcTotal } from "../../shared/pricing";
import { inquirySchema } from "./lib/inquiry-schema";
import { exceedsLimit } from "./lib/rate-limit";

const SENDER = "Chalet Beyond <rezervacie@chaletbeyond.sk>";

/** Resend exposes no signal or timeout option, so the call is raced instead. */
const SEND_TIMEOUT_MS = 5000;

// A real guest sends one inquiry, occasionally two. These bounds are far above
// genuine use and far below what makes flooding worthwhile.
const PER_IP = { limit: 5, windowMs: 15 * 60_000 };
const PER_RECIPIENT = { limit: 3, windowMs: 60 * 60_000 };

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

function clientIp(request: Request): string {
  return (
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function withTimeout<T>(work: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const expiry = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${SEND_TIMEOUT_MS}ms`)),
      SEND_TIMEOUT_MS,
    );
  });
  try {
    return await Promise.race([work, expiry]);
  } finally {
    clearTimeout(timer!);
  }
}

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

  const { from, to, guests, name, email, phone, message, website } = parsed.data;

  // Honeypot filled means a bot. Answer as if it worked: telling the caller it
  // was detected just invites a retry with the field left blank.
  if (website) {
    console.warn("inquiry: honeypot triggered", clientIp(request));
    return Response.json({ ok: true });
  }

  // The confirmation goes to an address the caller chose, so without a ceiling
  // this endpoint will mail anyone, repeatedly, from the owner's verified
  // domain — costing the domain's reputation and the Resend account with it.
  if (
    exceedsLimit(`ip:${clientIp(request)}`, PER_IP.limit, PER_IP.windowMs) ||
    exceedsLimit(
      `to:${email.toLowerCase()}`,
      PER_RECIPIENT.limit,
      PER_RECIPIENT.windowMs,
    )
  ) {
    console.warn("inquiry: rate limited", clientIp(request), email);
    return Response.json(
      { error: "Priveľa dopytov. Skúste o chvíľu alebo nám zavolajte." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const owner = process.env.OWNER_EMAIL;
  if (!apiKey || !owner) {
    // The cause goes to the log; the guest gets a sentence. `error` is rendered
    // to them verbatim, so an internal code here would surface as UI text.
    console.error("inquiry: RESEND_API_KEY or OWNER_EMAIL is not set");
    return Response.json(
      { error: "Dopyt sa nepodarilo odoslať." },
      { status: 502 },
    );
  }

  const price = calcTotal(utc(from), utc(to), guests);
  const resend = new Resend(apiKey);

  try {
    const { error } = await withTimeout(
      resend.emails.send({
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
      }),
      "owner notification",
    );
    // The SDK reports delivery failures in the payload rather than by throwing,
    // so a rejected send would otherwise look like success and the lead vanishes.
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (error) {
    console.error("inquiry: owner notification failed", error);
    return Response.json(
      { error: "Dopyt sa nepodarilo odoslať." },
      { status: 502 },
    );
  }

  try {
    const { error } = await withTimeout(
      resend.emails.send({
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
      }),
      "guest confirmation",
    );
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (error) {
    // The lead is already delivered; do not make the guest submit twice.
    console.error("inquiry: guest confirmation failed", error);
  }

  return Response.json({ ok: true });
};

export const config = { path: "/api/inquiry" };
