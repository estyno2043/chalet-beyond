/*
 * CHALET BEYOND — Booking Section
 * Interactive date range calendar using react-day-picker (already in deps)
 * Check-in/check-out selection, guest count, inquiry form
 * Direct booking only — CTA opens an email inquiry to contact@chaletbeyond.sk
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/components/FadeUp";
import { Calendar } from "@/components/ui/calendar";
import { Users, CalendarDays, ArrowRight } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { calcTotal, MIN_NIGHTS } from "@shared/pricing";
import {
  BOOKING_LISTING_URL,
  BOOKING_RATING,
  EMAIL,
  PHONE,
  PHONE_DISPLAY,
} from "@shared/contact";

function formatDate(date: Date | undefined): string {
  if (!date) return "—";
  return date.toLocaleDateString("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getNights(from: Date | undefined, to: Date | undefined): number {
  if (!from || !to) return 0;
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Occupied nights from Booking and Airbnb. Empty when every feed is unreachable.
 * `failed` also covers a partial answer: the endpoint returns `degraded: true`
 * when some feeds did not respond, so the list is real but incomplete and the
 * guest still needs telling that availability could not be fully confirmed.
 */
function useBlockedDates(): { blocked: Date[]; failed: boolean } {
  const [blocked, setBlocked] = useState<Date[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/availability")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((data: { blocked: string[]; degraded?: boolean }) => {
        if (cancelled) return;
        // No `Z`: react-day-picker compares local-midnight dates, so a UTC date
        // would land on the previous day for anyone east of Greenwich.
        setBlocked(data.blocked.map((day) => new Date(`${day}T00:00:00`)));
        if (data.degraded) setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { blocked, failed };
}

export function BookingSection() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [step, setStep] = useState<"calendar" | "confirm">("calendar");
  const { blocked, failed: availabilityFailed } = useBlockedDates();

  const nights = getNights(dateRange?.from, dateRange?.to);
  // Guarded on MIN_NIGHTS, not > 0: calcTotal throws below the minimum rather
  // than returning a negative total, so a one-night selection would crash here.
  const price =
    dateRange?.from && dateRange?.to && nights >= MIN_NIGHTS
      ? calcTotal(dateRange.from, dateRange.to, guests)
      : null;
  const canProceed = price !== null;

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  // Built from local date parts: toISOString() would shift the selected day
  // back by one for anyone in a positive UTC offset, which is all of Slovakia.
  const iso = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!dateRange?.from || !dateRange?.to) return;

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          from: iso(dateRange.from),
          to: iso(dateRange.to),
          guests,
          ...form,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Odoslanie zlyhalo");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Odoslanie zlyhalo");
    }
  };

  return (
    <section id="rezervacia" className="py-16 md:py-36" style={{ background: "oklch(0.08 0.010 55)" }}>
      <div className="container">
        <FadeUp className="mb-10 md:mb-16">
          <div className="amber-rule mb-8 md:mb-12" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.72 0.12 65)",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                Rezervácia
              </p>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.0,
                  color: "oklch(0.92 0.008 75)",
                }}
              >
                PREKONÁVA VAŠE<br />
                <span style={{ color: "oklch(0.72 0.12 65)" }}>OČAKÁVANIA</span>
              </h2>
            </div>
            <p
              style={{
                fontFamily: "'Karla', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "oklch(0.62 0.020 65)",
                maxWidth: "38ch",
              }}
            >
              Iba priama rezervácia – žiadne poplatky za platformu, žiadni sprostredkovatelia.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 md:gap-8 lg:gap-12">
          {/* Calendar */}
          <FadeUp delay={0.1}>
            <div
              className="p-4 md:p-8"
              style={{
                background: "oklch(0.12 0.012 55)",
                border: "1px solid oklch(0.72 0.12 65 / 0.18)",
                borderRadius: "2px",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <CalendarDays size={16} style={{ color: "oklch(0.72 0.12 65)" }} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    color: "oklch(0.58 0.020 65)",
                    textTransform: "uppercase",
                  }}
                >
                  Vyberte dátumy
                </span>
              </div>

              <div className="flex justify-center overflow-x-auto">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  disabled={[{ before: new Date() }, ...blocked]}
                  className="rounded-none"
                  style={{
                    "--rdp-accent-color": "oklch(0.72 0.12 65)",
                    "--rdp-background-color": "oklch(0.72 0.12 65 / 0.15)",
                    color: "oklch(0.92 0.008 75)",
                  } as React.CSSProperties}
                />
              </div>

              {availabilityFailed && (
                <p
                  className="mt-4"
                  style={{
                    fontFamily: "'Karla', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    color: "oklch(0.45 0.015 65)",
                    textAlign: "center",
                  }}
                >
                  Obsadenosť sa nepodarilo načítať — dostupnosť overíme e-mailom.
                </p>
              )}

              {/* Selected range display */}
              <AnimatePresence>
                {dateRange?.from && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                    className="mt-6 pt-6"
                    style={{ borderTop: "1px solid oklch(0.72 0.12 65 / 0.18)" }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.65rem",
                            letterSpacing: "0.12em",
                            color: "oklch(0.58 0.020 65)",
                            textTransform: "uppercase",
                            marginBottom: "0.4rem",
                          }}
                        >
                          Check-in
                        </p>
                        <p
                          style={{
                            fontFamily: "'Karla', sans-serif",
                            fontSize: "0.95rem",
                            fontWeight: 400,
                            color: "oklch(0.92 0.008 75)",
                          }}
                        >
                          {formatDate(dateRange.from)}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.65rem",
                            letterSpacing: "0.12em",
                            color: "oklch(0.58 0.020 65)",
                            textTransform: "uppercase",
                            marginBottom: "0.4rem",
                          }}
                        >
                          Check-out
                        </p>
                        <p
                          style={{
                            fontFamily: "'Karla', sans-serif",
                            fontSize: "0.95rem",
                            fontWeight: 400,
                            color: "oklch(0.92 0.008 75)",
                          }}
                        >
                          {formatDate(dateRange.to)}
                        </p>
                      </div>
                    </div>
                    {nights > 0 && (
                      <p
                        className="mt-3"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.1rem",
                          letterSpacing: "0.04em",
                          color: "oklch(0.72 0.12 65)",
                        }}
                      >
                        {nights} {nights === 1 ? "noc" : nights < 5 ? "noci" : "nocí"}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>

          {/* Booking summary sidebar */}
          <FadeUp delay={0.2}>
            <div
              className="p-4 md:p-8 flex flex-col gap-6"
              style={{
                background: "oklch(0.14 0.012 55)",
                border: "1px solid oklch(0.72 0.12 65 / 0.25)",
                borderRadius: "2px",
                position: "sticky",
                    top: "auto",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    letterSpacing: "0.03em",
                    color: "oklch(0.92 0.008 75)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Chalet Beyond
                </h3>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    color: "oklch(0.58 0.020 65)",
                    textTransform: "uppercase",
                  }}
                >
                  Veľká Lomnica, Vysoké Tatry
                </p>
              </div>

              {/* The score alone, attributed and linked. The property has one
                  review, so a review section would advertise its own thinness. */}
              <a
                href={BOOKING_LISTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
                style={{ textDecoration: "none" }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1rem",
                    color: "oklch(0.06 0.008 55)",
                    background: "oklch(0.72 0.12 65)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "2px",
                  }}
                >
                  {BOOKING_RATING}
                </span>
                <span
                  style={{
                    fontFamily: "'Karla', sans-serif",
                    fontSize: "0.78rem",
                    color: "oklch(0.62 0.020 65)",
                  }}
                >
                  Hodnotenie na Booking.com
                </span>
              </a>

              {/* Divider */}
              <div className="amber-rule" />

              {/* Dates summary */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: "oklch(0.58 0.020 65)",
                      textTransform: "uppercase",
                    }}
                  >
                    Check-in
                  </span>
                  <span
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.875rem",
                      color: "oklch(0.78 0.015 75)",
                    }}
                  >
                    {dateRange?.from ? formatDate(dateRange.from) : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: "oklch(0.58 0.020 65)",
                      textTransform: "uppercase",
                    }}
                  >
                    Check-out
                  </span>
                  <span
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.875rem",
                      color: "oklch(0.78 0.015 75)",
                    }}
                  >
                    {dateRange?.to ? formatDate(dateRange.to) : "—"}
                  </span>
                </div>
                {price && (
                  <>
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: "oklch(0.58 0.020 65)",
                          textTransform: "uppercase",
                        }}
                      >
                        {price.nights} × {price.perNight} €
                      </span>
                      <span
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.6rem",
                          color: "oklch(0.92 0.008 75)",
                        }}
                      >
                        {price.total} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: "oklch(0.58 0.020 65)",
                          textTransform: "uppercase",
                        }}
                      >
                        Na Booking.com
                      </span>
                      <span
                        style={{
                          fontFamily: "'Karla', sans-serif",
                          fontSize: "0.875rem",
                          color: "oklch(0.58 0.020 65)",
                          textDecoration: "line-through",
                        }}
                      >
                        {price.bookingTotal} €
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.85rem",
                        color: "oklch(0.72 0.12 65)",
                      }}
                    >
                      Ušetríte {price.savings} €
                    </p>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="amber-rule" />

              {/* Guests */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={14} style={{ color: "oklch(0.72 0.12 65)" }} />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        color: "oklch(0.58 0.020 65)",
                        textTransform: "uppercase",
                      }}
                    >
                      Hostia
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-7 h-7 flex items-center justify-center transition-colors duration-150"
                      style={{
                        border: "1px solid oklch(0.72 0.12 65 / 0.3)",
                        color: "oklch(0.72 0.12 65)",
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.3rem",
                        color: "oklch(0.92 0.008 75)",
                        minWidth: "1.5rem",
                        textAlign: "center",
                      }}
                    >
                      {guests}
                    </span>
                    <button
                      onClick={() => setGuests(Math.min(8, guests + 1))}
                      className="w-7 h-7 flex items-center justify-center transition-colors duration-150"
                      style={{
                        border: "1px solid oklch(0.72 0.12 65 / 0.3)",
                        color: "oklch(0.72 0.12 65)",
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "'Karla', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    color: "oklch(0.45 0.015 65)",
                  }}
                >
                  Max. 8 hostí
                </p>
              </div>

              {status === "sent" ? (
                <div
                  style={{
                    border: "1px solid oklch(0.72 0.12 65 / 0.4)",
                    padding: "1.25rem",
                    borderRadius: "2px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.3rem",
                      color: "oklch(0.72 0.12 65)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Dopyt odoslaný
                  </p>
                  <p
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 300,
                      color: "oklch(0.78 0.015 75)",
                      lineHeight: 1.6,
                    }}
                  >
                    Ozveme sa do 24 hodín. Potvrdenie sme poslali na {form.email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {(
                    [
                      { key: "name", label: "Meno a priezvisko", type: "text" },
                      { key: "email", label: "E-mail", type: "email" },
                      { key: "phone", label: "Telefón", type: "tel" },
                    ] as const
                  ).map((field) => (
                    <input
                      key={field.key}
                      type={field.type}
                      required
                      placeholder={field.label}
                      value={form[field.key]}
                      onChange={(event) =>
                        setForm({ ...form, [field.key]: event.target.value })
                      }
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.9rem",
                        color: "oklch(0.92 0.008 75)",
                        background: "oklch(0.10 0.012 55)",
                        border: "1px solid oklch(0.72 0.12 65 / 0.25)",
                        borderRadius: "2px",
                        padding: "0.7rem 0.85rem",
                        width: "100%",
                      }}
                    />
                  ))}
                  <textarea
                    placeholder="Poznámka (nepovinné)"
                    rows={3}
                    value={form.message}
                    onChange={(event) =>
                      setForm({ ...form, message: event.target.value })
                    }
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.9rem",
                      color: "oklch(0.92 0.008 75)",
                      background: "oklch(0.10 0.012 55)",
                      border: "1px solid oklch(0.72 0.12 65 / 0.25)",
                      borderRadius: "2px",
                      padding: "0.7rem 0.85rem",
                      width: "100%",
                      resize: "vertical",
                    }}
                  />

                  <motion.button
                    type="submit"
                    disabled={!canProceed || status === "sending"}
                    className="w-full btn-amber justify-center gap-3 mt-1"
                    whileHover={{ scale: canProceed ? 1.01 : 1 }}
                    whileTap={{ scale: canProceed ? 0.97 : 1 }}
                    style={{
                      opacity: canProceed && status !== "sending" ? 1 : 0.5,
                      cursor: canProceed ? "pointer" : "not-allowed",
                    }}
                  >
                    <span>
                      {status === "sending"
                        ? "Odosielam…"
                        : "Odoslať nezáväzný dopyt"}
                    </span>
                    {status !== "sending" && <ArrowRight size={16} />}
                  </motion.button>

                  {!canProceed && (
                    <p
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 300,
                        color: "oklch(0.45 0.015 65)",
                        textAlign: "center",
                      }}
                    >
                      Vyberte termín aspoň na 2 noci
                    </p>
                  )}

                  {status === "error" && (
                    <p
                      style={{
                        fontFamily: "'Karla', sans-serif",
                        fontSize: "0.78rem",
                        color: "oklch(0.65 0.15 25)",
                        textAlign: "center",
                        lineHeight: 1.6,
                      }}
                    >
                      {error}
                      <br />
                      Zavolajte nám na{" "}
                      <a
                        href={`tel:${PHONE}`}
                        style={{ color: "oklch(0.72 0.12 65)" }}
                      >
                        {PHONE_DISPLAY}
                      </a>{" "}
                      alebo napíšte na{" "}
                      <a
                        href={`mailto:${EMAIL}`}
                        style={{ color: "oklch(0.72 0.12 65)" }}
                      >
                        {EMAIL}
                      </a>
                      .
                    </p>
                  )}
                </form>
              )}

              <p
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 300,
                  color: "oklch(0.45 0.015 65)",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Minimálna dĺžka pobytu 2 noci · Celý objekt · Bezplatné storno do
                14 dní pred príchodom
              </p>
            </div>
          </FadeUp>
        </div>

        {/* House rules */}
        <FadeUp delay={0.1} className="mt-12">
          <div
            className="p-6 md:p-8"
            style={{
              background: "oklch(0.12 0.012 55)",
              border: "1px solid oklch(0.72 0.12 65 / 0.12)",
              borderRadius: "2px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.3rem",
                letterSpacing: "0.04em",
                color: "oklch(0.92 0.008 75)",
                marginBottom: "1rem",
              }}
            >
              Pravidlá domu
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Check-in", value: "15:00 – 23:00" },
                { label: "Check-out", value: "08:00 – 11:00" },
                { label: "Fajčenie", value: "Zakázané" },
                { label: "Domáce zvieratá", value: "Nie sú povolené" },
                { label: "Ticho", value: "23:00 – 05:00" },
                { label: "Vek", value: "Bez obmedzenia" },
                { label: "Deti", value: "Vítané" },
                { label: "Kapacita", value: "Max. 8 osôb" },
              ].map((rule) => (
                <div key={rule.label}>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.1em",
                      color: "oklch(0.58 0.020 65)",
                      textTransform: "uppercase",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {rule.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Karla', sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      color: "oklch(0.78 0.015 75)",
                    }}
                  >
                    {rule.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
