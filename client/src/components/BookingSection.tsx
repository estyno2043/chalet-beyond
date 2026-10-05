import { useEffect, useRef, useState, type FormEvent } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { sk, de, enUS, pl } from "react-day-picker/locale";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang, useT } from "@/i18n/LanguageProvider";
import { useGuests } from "@/contexts/GuestsContext";
import { calcTotal, MIN_NIGHTS } from "@shared/pricing";
import {
  checkoutOnlyDays,
  isoDay,
  nightsBetween,
  rangeIsFree,
} from "@shared/availability";
import { EMAIL, PHONE, PHONE_DISPLAY } from "@shared/contact";
import { SectionHeader } from "./premium/SectionHeader";
import { GuestCounters } from "./premium/GuestCounters";
import { Value } from "./premium/Value";
import { usePremiumCopy } from "./premium/copy";
import { RollButton } from "./RollButton";
import { BlindDisclosure } from "./ui/blind-disclosure";
import { EASE, DUR, SPRING_GESTURE } from "@/lib/motion";
import "react-day-picker/style.css";

const locales = { sk, de, en: enUS, pl };
function useAvailability() {
  const [state, setState] = useState({
    blocked: [] as string[],
    failed: false,
    loading: true,
  });
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/availability", { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Availability unavailable");
        const data = await response.json();
        if (
          !Array.isArray(data.blocked) ||
          !data.blocked.every(
            (day: unknown) =>
              typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day)
          )
        )
          throw new Error("Invalid availability");
        setState({
          blocked: data.blocked,
          failed: Boolean(data.degraded),
          loading: false,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setState({ blocked: [], failed: true, loading: false });
      });
    return () => controller.abort();
  }, []);
  return state;
}
function useCalendarMonths(ref: React.RefObject<HTMLDivElement | null>) {
  const [months, setMonths] = useState(1);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(entries =>
      setMonths(entries[0].contentRect.width >= 648 ? 2 : 1)
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return months;
}

export function BookingSection({ embedded = false }: { embedded?: boolean }) {
  const t = useT();
  const c = usePremiumCopy();
  const lang = useLang();
  const reduce = useReducedMotion();
  const { adults, children } = useGuests();
  const { blocked, failed, loading } = useAvailability();
  const [range, setRange] = useState<DateRange>();
  const [step, setStep] = useState<"dates" | "contact">("dates");
  const [dateError, setDateError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });
  const [formHeight, setFormHeight] = useState(440);
  const calendarRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const months = useCalendarMonths(calendarRef);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkoutOnly = checkoutOnlyDays(blocked);
  const fullyBlocked = blocked
    .filter(day => !checkoutOnly.has(day))
    .map(day => new Date(`${day}T00:00:00`));
  const nights =
    range?.from && range.to
      ? nightsBetween(isoDay(range.from), isoDay(range.to)).length
      : 0;
  const valid = Boolean(
    range?.from &&
      range.to &&
      nights >= MIN_NIGHTS &&
      rangeIsFree(isoDay(range.from), isoDay(range.to), blocked)
  );
  const price = valid
    ? calcTotal(range!.from!, range!.to!, adults, children)
    : null;
  const format = (date?: Date) =>
    date
      ? new Intl.DateTimeFormat(lang, {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(date)
      : "—";
  const money = (amount: number) =>
    new Intl.NumberFormat(lang, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);

  const select = (next: DateRange | undefined, clicked: Date) => {
    setDateError("");
    if (!next?.from) {
      setRange(undefined);
      return;
    }
    const finished =
      range?.from && range?.to && isoDay(range.from) !== isoDay(range.to);
    if (finished || !range?.from) {
      if (checkoutOnly.has(isoDay(clicked))) return;
      setRange({ from: clicked });
      return;
    }
    if (
      next.to &&
      isoDay(next.to) !== isoDay(next.from) &&
      !rangeIsFree(isoDay(next.from), isoDay(next.to), blocked)
    ) {
      setDateError(c.datesBusy);
      if (!checkoutOnly.has(isoDay(clicked))) setRange({ from: clicked });
      return;
    }
    setRange(next);
  };
  const proceed = () => {
    if (!valid || loading) {
      setDateError(c.dateError);
      calendarRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "center",
      });
      calendarRef.current?.focus({ preventScroll: true });
      return;
    }
    setStep("contact");
  };
  useEffect(() => {
    if (step === "contact")
      contactRef.current
        ?.querySelector<HTMLInputElement>("input")
        ?.focus({ preventScroll: true });
  }, [step]);
  useEffect(() => {
    if (status !== "sent" || !successRef.current) return;
    const node = successRef.current;
    node.focus({ preventScroll: true });
    const rect = node.getBoundingClientRect();
    if (rect.top < 90 || rect.bottom > innerHeight)
      node.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "center",
      });
  }, [status, reduce]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!valid || loading) {
      setStep("dates");
      setDateError(c.dateError);
      return;
    }
    setFormHeight(contactRef.current?.getBoundingClientRect().height ?? 440);
    setStatus("sending");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          from: isoDay(range!.from!),
          to: isoDay(range!.to!),
          guests: adults,
          children,
          lang,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.code === "dates_taken") {
          setStep("dates");
          setDateError(t.booking.datesTaken);
        }
        throw new Error("Inquiry rejected");
      }
      if (data.ok !== true) throw new Error("Invalid inquiry response");
      setConfirmationSent(data.confirmationSent !== false);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }
  const contents = (
    <div className={embedded ? "booking-contents" : "container"}>
      {!embedded && <SectionHeader lines={c.booking} />}
      <div className="booking-layout">
        <div className="booking-calendar-column">
          <div
            className="booking-calendar"
            ref={calendarRef}
            tabIndex={-1}
            aria-describedby="availability-state date-validation"
          >
            <DayPicker
              mode="range"
              locale={locales[lang]}
              weekStartsOn={1}
              numberOfMonths={months}
              selected={range}
              onSelect={select}
              disabled={[
                { before: today },
                ...fullyBlocked,
                ...(loading ? [() => true] : []),
              ]}
              modifiers={{
                checkoutOnly: blocked
                  .filter(day => checkoutOnly.has(day))
                  .map(day => new Date(`${day}T00:00:00`)),
              }}
              modifiersClassNames={{ checkoutOnly: "checkout-only" }}
              fixedWeeks
              showOutsideDays={false}
              startMonth={today}
              endMonth={new Date(today.getFullYear() + 2, today.getMonth())}
            />
          </div>
          <p
            id="availability-state"
            className="availability-state"
            role="status"
          >
            {loading
              ? t.booking.availabilityLoading
              : failed
                ? t.booking.availabilityFailed
                : t.booking.pickDates}
          </p>
          <p id="date-validation" className="date-validation" role="alert">
            {dateError || "\u00a0"}
          </p>
          <GuestCounters id="booking" />
          <p className="guest-note">{c.childNote}</p>
        </div>
        <aside className="booking-summary">
          <h3>{c.summary}</h3>
          <dl className="summary-lines">
            <div>
              <dt>{t.booking.checkIn}</dt>
              <dd>
                <Value value={format(range?.from)} />
              </dd>
            </div>
            <div>
              <dt>{t.booking.checkOut}</dt>
              <dd>
                <Value value={format(range?.to)} />
              </dd>
            </div>
            <div>
              <dt>{c.nights}</dt>
              <dd>
                <Value value={price?.nights ?? "—"} />
              </dd>
            </div>
          </dl>
          <dl className="summary-price-lines">
            <div>
              <dt>{c.baseStay}</dt>
              <dd>
                <Value value={price ? money(price.baseTotal) : "—"} />
              </dd>
            </div>
            {price?.discountKind && (
              <div className="summary-discount">
                <dt>
                  {price.discountKind === "weekly"
                    ? c.weeklySaving
                    : c.promotionSaving}
                </dt>
                <dd>
                  <Value
                    value={`−${money(price.discountKind === "weekly" ? price.weeklyDiscount : price.promotionDiscount)}`}
                  />
                </dd>
              </div>
            )}
          </dl>
          <div className="booking-total">
            <span>{c.total}</span>
            <strong aria-live="polite">
              <Value value={price ? money(price.total) : "—"} />
            </strong>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <motion.div
                key="success"
                ref={node => {
                  successRef.current = node;
                  if (node)
                    requestAnimationFrame(() => {
                      node.focus({ preventScroll: true });
                      const rect = node.getBoundingClientRect();
                      if (rect.top < 90 || rect.bottom > innerHeight)
                        node.scrollIntoView({
                          behavior: reduce ? "auto" : "smooth",
                          block: "center",
                        });
                    });
                }}
                tabIndex={-1}
                role="status"
                className="booking-success"
                style={{ minHeight: formHeight }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DUR.state }}
              >
                <motion.div
                  className="success-ring"
                  initial={{ scale: reduce ? 1 : 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={reduce ? { duration: DUR.state } : SPRING_GESTURE}
                >
                  <svg viewBox="0 0 48 48" aria-hidden="true">
                    <motion.path
                      d="M13 25l8 8 15-18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: DUR.section,
                        delay: 0.12,
                        ease: EASE.enter,
                      }}
                    />
                  </svg>
                </motion.div>
                <motion.h4
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18, duration: DUR.state }}
                >
                  {t.booking.sentTitle}
                </motion.h4>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.24, duration: DUR.state }}
                >
                  {c.successBody}
                  {confirmationSent && (
                    <>
                      {" "}
                      {c.successEmail} <strong>{form.email}</strong>.
                    </>
                  )}
                </motion.p>
              </motion.div>
            ) : step === "dates" ? (
              <motion.div
                key="dates"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.ui }}
              >
                <RollButton
                  tone="solid"
                  className="booking-action"
                  onClick={proceed}
                >
                  {c.continue}
                </RollButton>
              </motion.div>
            ) : (
              <motion.div
                key="contact"
                ref={contactRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.ui }}
              >
                <RollButton
                  size="sm"
                  className="edit-dates"
                  onClick={() => setStep("dates")}
                >
                  {c.edit}
                </RollButton>
                <form className="inquiry-form" onSubmit={submit}>
                  {(
                    [
                      {
                        key: "name",
                        label: t.booking.nameField,
                        type: "text",
                        autoComplete: "name",
                      },
                      {
                        key: "email",
                        label: t.booking.emailField,
                        type: "email",
                        autoComplete: "email",
                      },
                      {
                        key: "phone",
                        label: `${t.booking.phoneField} (${c.optional})`,
                        type: "tel",
                        autoComplete: "tel",
                      },
                    ] as const
                  ).map(field => (
                    <div key={field.key}>
                      <label htmlFor={`inquiry-${field.key}`}>
                        {field.label}
                      </label>
                      <input
                        id={`inquiry-${field.key}`}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        required={field.key !== "phone"}
                        minLength={
                          field.key === "name"
                            ? 2
                            : field.key === "phone"
                              ? 6
                              : undefined
                        }
                        maxLength={
                          field.key === "name"
                            ? 100
                            : field.key === "phone"
                              ? 30
                              : 254
                        }
                        value={form[field.key]}
                        onChange={event =>
                          setForm({ ...form, [field.key]: event.target.value })
                        }
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="inquiry-message">
                      {t.booking.messageField}
                    </label>
                    <textarea
                      id="inquiry-message"
                      rows={3}
                      maxLength={2000}
                      value={form.message}
                      onChange={event =>
                        setForm({ ...form, message: event.target.value })
                      }
                    />
                  </div>
                  <div aria-hidden="true" className="inquiry-honeypot">
                    <label htmlFor="inquiry-website">Website</label>
                    <input
                      id="inquiry-website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={event =>
                        setForm({ ...form, website: event.target.value })
                      }
                    />
                  </div>
                  <RollButton
                    tone="solid"
                    type="submit"
                    className="booking-action"
                    disabled={status === "sending"}
                  >
                    {status === "sending"
                      ? t.booking.sending
                      : t.booking.submit}
                  </RollButton>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          {status === "error" && (
            <p role="alert" className="inquiry-error">
              {t.booking.sendFailed}{" "}
              <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a> ·{" "}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          )}
          <p className="booking-assurances">{c.assurances}</p>
        </aside>
      </div>
      <BlindDisclosure className="house-rules" summary={t.rules.title}>
        <dl>
          {[
            { label: t.rules.checkIn, value: "15:00 – 23:00" },
            { label: t.rules.checkOut, value: "08:00 – 11:00" },
            { label: t.rules.smoking, value: t.rules.smokingValue },
            { label: t.rules.pets, value: t.rules.petsValue },
            { label: t.rules.quiet, value: "23:00 – 05:00" },
            { label: t.rules.children, value: t.rules.childrenValue },
            { label: t.rules.cribs, value: t.rules.cribsValue },
            { label: t.rules.capacity, value: t.rules.capacityValue },
          ].map(rule => (
            <div key={rule.label} data-slat>
              <dt>{rule.label}</dt>
              <dd>{rule.value}</dd>
            </div>
          ))}
        </dl>
      </BlindDisclosure>
    </div>
  );
  return embedded ? (
    contents
  ) : (
    <section id="rezervacia" className="premium-section booking-section">
      {contents}
    </section>
  );
}
