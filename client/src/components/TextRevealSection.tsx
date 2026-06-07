/**
 * TextRevealSection — Chalet Beyond
 * Full-width scroll-driven word reveal section
 * Uses TextRevealByWord from magicui, adapted for dark timber theme
 * Placed between ChaletIntroSection and GallerySection
 */
import { TextRevealByWord } from "@/components/ui/text-reveal";

const REVEAL_TEXT =
  "V srdci Vysokých Tatier, tam kde sa pokoj prírody stretáva s výnimočným dizajnom. Tu nejde len o bývanie. Ide o zážitok. O ticho zimných večerov pri kozube, v horúcej vírivke pod hviezdami. O rannú kávu s panorámou, ktorá berie dych. O priestor, kde architektúra a príroda hovoria jedným jazykom.";

export function TextRevealSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "oklch(0.06 0.008 55)" }}
    >
      {/* Subtle top border */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, oklch(0.72 0.12 65 / 0.25), transparent)",
        }}
      />

      <TextRevealByWord text={REVEAL_TEXT} />

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
