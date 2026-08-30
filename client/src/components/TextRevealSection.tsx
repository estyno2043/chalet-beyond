/**
 * TextRevealSection — Chalet Beyond
 * Full-width scroll-driven letter reveal section
 * Uses TextGradientScroll (user-provided component, pasted_content_4)
 * Placed between ChaletIntroSection and GallerySection
 * Design: dark background, amber ghost text, cream revealed text
 */
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { useT } from "@/i18n/LanguageProvider";

export function TextRevealSection() {
  const t = useT();
  return (
    <section
      className="relative w-full"
      style={{ background: "oklch(0.06 0.008 55)" }}
    >
      {/* Subtle top border */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, oklch(0.72 0.12 65 / 0.25), transparent)",
        }}
      />

      {/* Generous padding so the scroll trigger has room to complete the reveal */}
      <div
        className="max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-40 relative"
        style={{
          fontFamily: "'Karla', sans-serif",
          fontSize: "clamp(1.35rem, 2.8vw, 2.2rem)",
          fontWeight: 300,
          lineHeight: 1.65,
          color: "oklch(0.92 0.008 75)",
          letterSpacing: "0.01em",
        }}
      >
        <TextGradientScroll
          text={t.textReveal}
          type="letter"
          textOpacity="soft"
          className="leading-relaxed"
        />
      </div>

      {/* Subtle bottom border */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, oklch(0.72 0.12 65 / 0.25), transparent)",
        }}
      />
    </section>
  );
}
