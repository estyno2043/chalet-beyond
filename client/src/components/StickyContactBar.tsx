/*
 * CHALET BEYOND — Sticky Contact Bar
 * Mobile only. Appears once the hero is behind the guest, so it never covers it.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { PHONE, PHONE_DISPLAY, WHATSAPP_URL } from "@shared/contact";

export function StickyContactBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          // display comes from the classes, not the style object: an inline
          // `display: grid` outranks `md:hidden` and the bar would stay on
          // desktop, fixed over the page.
          className="grid md:hidden"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "oklch(0.72 0.12 65 / 0.25)",
            borderTop: "1px solid oklch(0.72 0.12 65 / 0.25)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <a
            href={`tel:${PHONE}`}
            aria-label={`Zavolať na ${PHONE_DISPLAY}`}
            className="flex items-center justify-center gap-2"
            style={{
              background: "oklch(0.10 0.012 55)",
              color: "oklch(0.92 0.008 75)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.95rem",
              textDecoration: "none",
            }}
          >
            <Phone size={15} style={{ color: "oklch(0.72 0.12 65)" }} />
            Zavolať
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Napísať cez WhatsApp"
            className="flex items-center justify-center gap-2"
            style={{
              background: "oklch(0.72 0.12 65)",
              color: "oklch(0.06 0.008 55)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.95rem",
              textDecoration: "none",
            }}
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
