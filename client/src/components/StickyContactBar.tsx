import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import { PHONE, PHONE_DISPLAY } from "@shared/contact";
import { PRICE_PER_NIGHT } from "@shared/pricing";
import { useT } from "@/i18n/LanguageProvider";
import { usePastHero } from "@/hooks/usePastHero";
import { usePremiumCopy } from "./premium/copy";
import { RollLink } from "./RollButton";
import { EASE, DUR } from "@/lib/motion";
export function StickyContactBar() {
  const past = usePastHero();
  const c = usePremiumCopy();
  const t = useT();
  const reduce = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const [atBooking, setAtBooking] = useState(false);
  // The bar only leads to the booking block; once that block is on screen
  // the bar would just cover its continue button. The block loads lazily,
  // so look it up on each scroll frame rather than once.
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const rect = document
        .getElementById("rezervacia")
        ?.getBoundingClientRect();
      setAtBooking(Boolean(rect && rect.top < innerHeight && rect.bottom > 0));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    check();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    const check = () =>
      setFocused(
        Boolean(document.activeElement?.matches("input, textarea, select"))
      );
    const viewport = () => {
      check();
      if (
        window.visualViewport &&
        window.visualViewport.height < innerHeight * 0.75
      )
        setFocused(true);
    };
    document.addEventListener("focusin", check);
    document.addEventListener("focusout", check);
    window.visualViewport?.addEventListener("resize", viewport);
    return () => {
      document.removeEventListener("focusin", check);
      document.removeEventListener("focusout", check);
      window.visualViewport?.removeEventListener("resize", viewport);
    };
  }, []);
  return (
    <AnimatePresence>
      {past && !focused && !atBooking && (
        <m.div
          className="mobile-book-bar"
          initial={{ y: reduce ? 0 : "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{
            y: reduce ? 0 : "100%",
            opacity: 0,
            transition: { duration: DUR.ui, ease: EASE.ui },
          }}
          transition={{ duration: DUR.state, ease: EASE.drawer }}
        >
          <RollLink href="#rezervacia" tone="solid">
            {c.bar.replace(
              "{price}",
              String(Math.min(...Object.values(PRICE_PER_NIGHT)))
            )}
          </RollLink>
          <a
            href={`tel:${PHONE}`}
            className="mobile-book-bar__phone"
            aria-label={`${t.contact.callAria} ${PHONE_DISPLAY}`}
          >
            <Phone size={20} aria-hidden="true" />
          </a>
        </m.div>
      )}
    </AnimatePresence>
  );
}
