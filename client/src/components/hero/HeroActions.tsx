/*
 * CHALET BEYOND — hero actions.
 *
 * The one thing the first screen owed the guest and did not have: a way to act.
 * The mobile hero showed the brand and a scroll cue, so booking meant scrolling
 * a 10 000px page or opening the menu to find it.
 *
 * Shared by both heroes so the primary action cannot say one thing on a phone
 * and another on a laptop.
 */
import { Star } from "lucide-react";
import { BOOKING_RATING } from "@shared/contact";
import { MAX_GUESTS } from "@shared/pricing";
import { useT } from "@/i18n/LanguageProvider";

export function HeroActions({ compact = false }: { compact?: boolean }) {
  const t = useT();

  const scrollTo = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="flex flex-col items-center gap-4"
      style={{ width: "100%", maxWidth: compact ? "22rem" : "26rem" }}
    >
      {/* Proof first: the rating earns the click that follows it. */}
      <div
        className="flex items-center gap-2"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.68rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "oklch(0.86 0.012 75)",
          textShadow: "0 1px 8px rgba(0,0,0,0.8)",
        }}
      >
        <Star
          size={13}
          style={{ color: "oklch(0.72 0.12 65)" }}
          fill="oklch(0.72 0.12 65)"
        />
        <span>
          {BOOKING_RATING} · {t.hero.proof}
        </span>
      </div>

      <a
        href="#rezervacia"
        onClick={(event) => {
          event.preventDefault();
          scrollTo("#rezervacia");
        }}
        className="w-full flex items-center justify-center rounded-sm active:scale-[0.98]"
        style={{
          minHeight: "3rem",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "1.15rem",
          letterSpacing: "0.12em",
          textDecoration: "none",
          background:
            "linear-gradient(180deg, oklch(0.72 0.12 65) 0%, oklch(0.60 0.10 60) 100%)",
          color: "oklch(0.10 0.010 55)",
          boxShadow:
            "0 0 0 1px rgba(180,120,40,0.35), 0 6px 22px rgba(180,120,40,0.28)",
          transition: "transform var(--motion-ui) var(--ease-ui)",
        }}
      >
        {t.hero.ctaPrimary}
      </a>

      <a
        href="#chalet"
        onClick={(event) => {
          event.preventDefault();
          scrollTo("#chalet");
        }}
        className="flex items-center justify-center"
        style={{
          minHeight: "2.75rem",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textDecoration: "none",
          color: "oklch(0.82 0.015 75)",
          textShadow: "0 1px 8px rgba(0,0,0,0.8)",
          borderBottom: "1px solid oklch(0.72 0.12 65 / 0.45)",
        }}
      >
        {t.hero.ctaSecondary}
      </a>

      <p
        style={{
          fontFamily: "'Karla', sans-serif",
          fontSize: "0.72rem",
          fontWeight: 300,
          color: "oklch(0.78 0.015 75)",
          textAlign: "center",
          textShadow: "0 1px 8px rgba(0,0,0,0.85)",
        }}
      >
        {t.hero.capacity.replace("{max}", String(MAX_GUESTS))}
      </p>
    </div>
  );
}
