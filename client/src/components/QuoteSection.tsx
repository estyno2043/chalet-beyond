/*
 * CHALET BEYOND — Quote / Atmosphere Section
 * Full-bleed dark section with large atmospheric quote
 * Clip-path diagonal cut top, amber accent line
 */
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function QuoteSection() {
  const { ref, isInView } = useScrollAnimation(0.2, true);

  return (
    <section
      className="relative py-24 md:py-40 overflow-hidden"
      style={{ background: "oklch(0.12 0.012 55)" }}
    >
      {/* Amber accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "oklch(0.72 0.12 65 / 0.3)" }}
      />

      <div className="container">
        <div ref={ref} className="max-w-4xl mx-auto text-center">
          {/* Decorative amber dash */}
          <motion.div
            className="mx-auto mb-8"
            style={{
              width: "3rem",
              height: "2px",
              background: "oklch(0.72 0.12 65)",
            }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
          />

          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
          >
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                letterSpacing: "0.02em",
                lineHeight: 1.2,
                color: "oklch(0.92 0.008 75)",
                marginBottom: "1.5rem",
              }}
            >
              O ticho zimných večerov pri kozube,<br />
              v horúcej vírivke pod hviezdami.<br />
              <span style={{ color: "oklch(0.72 0.12 65)" }}>
                O rannú kávu s panorámou, ktorá berie dych.
              </span>
            </p>
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              fontFamily: "'Karla', sans-serif",
              fontSize: "1rem",
              fontWeight: 300,
              letterSpacing: "0.08em",
              color: "oklch(0.55 0.020 65)",
              textTransform: "uppercase",
            }}
          >
            O priestor, kde architektúra a príroda hovoria jedným jazykom.
          </motion.p>
        </div>
      </div>

      {/* Bottom amber line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "oklch(0.72 0.12 65 / 0.3)" }}
      />
    </section>
  );
}
