/*
 * CHALET BEYOND — Gallery / Priestory Section
 * Mobile-first: full-width tall images stacked vertically on mobile
 * Desktop: asymmetric grid
 * Fade-up reveal animations, hover overlay
 */
import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, staggerItem } from "@/components/FadeUp";

const images = [
  {
    src: "/manus-storage/chalet-living_c24d113a.png",
    label: "Obývacia izba",
    desc: "Kožená sedačka, kozub, drevenný strop — srdce chaletu.",
    large: true,
  },
  {
    src: "/manus-storage/chalet-mountain-view_91debae8.png",
    label: "Výhľad na Lomničák",
    desc: "Ikonická panoráma Vysokých Tatier pri západe slnka.",
    large: false,
  },
  {
    src: "/manus-storage/chalet-sauna_22931760.png",
    label: "Fínska sauna",
    desc: "Harvia kachle, cédrové lavice, podsvietenie.",
    large: false,
  },
  {
    src: "/manus-storage/chalet-interior-dining_31d1b175.png",
    label: "Jedáleň & kuchyňa",
    desc: "Projektor, kozub, plne vybavená kuchyňa pre 8 hostí.",
    large: false,
  },
  {
    src: "/manus-storage/chalet-bedroom_f7acdc90.png",
    label: "Spálňa",
    desc: "3 spálne, každá s vlastnou kúpeľňou.",
    large: false,
  },
];

function GalleryImage({
  src,
  label,
  desc,
  height = "300px",
}: {
  src: string;
  label: string;
  desc: string;
  height?: string;
}) {
  return (
    <div
      className="relative overflow-hidden group"
      style={{ height, borderRadius: "2px" }}
    >
      <img
        src={src}
        alt={label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ display: "block" }}
        loading="lazy"
      />
      {/* Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-4 md:p-5"
        style={{
          background:
            "linear-gradient(to top, oklch(0.08 0.010 55 / 0.92) 0%, oklch(0.08 0.010 55 / 0) 55%)",
        }}
      >
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(1rem, 3vw, 1.15rem)",
            letterSpacing: "0.05em",
            color: "oklch(0.92 0.008 75)",
            marginBottom: "0.2rem",
          }}
        >
          {label}
        </p>
        <p
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            fontFamily: "'Karla', sans-serif",
            fontSize: "0.82rem",
            fontWeight: 300,
            color: "oklch(0.78 0.015 75)",
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

export function GallerySection() {
  return (
    <section id="priestory" className="py-16 md:py-32" style={{ background: "oklch(0.08 0.010 55)" }}>
      <div className="container">
        <FadeUp className="mb-10 md:mb-16">
          <div className="amber-rule mb-8 md:mb-12" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4">
            <div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.72 0.12 65)",
                  marginBottom: "0.6rem",
                  textTransform: "uppercase",
                }}
              >
                Architektúra
              </p>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.4rem, 8vw, 4.5rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.0,
                  color: "oklch(0.92 0.008 75)",
                }}
              >
                POSTAVENÉ PRE<br />TÚTO KRAJINU
              </h2>
            </div>
            <p
              style={{
                fontFamily: "'Karla', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "oklch(0.62 0.020 65)",
                maxWidth: "44ch",
              }}
            >
              Tmavá kovová strecha. Vertikálny drevený obklad. Zasklenie od podlahy až po strop, ktoré vťahuje borovicový les dovnútra. Cez deň mizne v lese. V noci ho teplé svetlo mení na maják.
            </p>
          </div>
        </FadeUp>

        {/* Desktop: asymmetric grid */}
        <div className="hidden md:block">
          {/* Top row: large left + 2 small right */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <FadeUp delay={0} className="col-span-2">
              <GalleryImage
                src="/manus-storage/chalet-living_c24d113a.png"
                label="Obývacia izba"
                desc="Kožená sedačka, kozub, drevenný strop — srdce chaletu."
                height="480px"
              />
            </FadeUp>
            <div className="col-span-1 flex flex-col gap-3">
              <FadeUp delay={0.1} className="flex-1">
                <GalleryImage
                  src="/manus-storage/chalet-mountain-view_91debae8.png"
                  label="Výhľad na Lomničák"
                  desc="Ikonická panoráma Vysokých Tatier pri západe slnka."
                  height="232px"
                />
              </FadeUp>
              <FadeUp delay={0.2} className="flex-1">
                <GalleryImage
                  src="/manus-storage/chalet-sauna_22931760.png"
                  label="Fínska sauna"
                  desc="Harvia kachle, cédrové lavice, podsvietenie."
                  height="232px"
                />
              </FadeUp>
            </div>
          </div>
          {/* Bottom row: wide + small */}
          <div className="grid grid-cols-3 gap-3">
            <FadeUp delay={0.1} className="col-span-2">
              <GalleryImage
                src="/manus-storage/chalet-interior-dining_31d1b175.png"
                label="Jedáleň & kuchyňa"
                desc="Projektor, kozub, plne vybavená kuchyňa pre 8 hostí."
                height="280px"
              />
            </FadeUp>
            <FadeUp delay={0.2} className="col-span-1">
              <GalleryImage
                src="/manus-storage/chalet-bedroom_f7acdc90.png"
                label="Spálňa"
                desc="3 spálne, každá s vlastnou kúpeľňou."
                height="280px"
              />
            </FadeUp>
          </div>
        </div>

        {/* Mobile: 2-column grid for compact luxury feel */}
        <div className="md:hidden">
          {/* Hero image full width */}
          <StaggerContainer className="flex flex-col gap-2" staggerDelay={0.07}>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
              }}
            >
              <GalleryImage
                src="/manus-storage/chalet-living_c24d113a.png"
                label="Obývacia izba"
                desc="Kožená sedačka, kozub, drevenný strop."
                height="280px"
              />
            </motion.div>
            {/* 2-col row */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { src: "/manus-storage/chalet-mountain-view_91debae8.png", label: "Výhľad na Lomničák", desc: "Panoráma Tatier." },
                { src: "/manus-storage/chalet-sauna_22931760.png", label: "Fínska sauna", desc: "Harvia kachle." },
              ].map((img, i) => (
                <motion.div
                  key={img.src}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
                  }}
                >
                  <GalleryImage {...img} height="180px" />
                </motion.div>
              ))}
            </div>
            {/* Another full-width */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
              }}
            >
              <GalleryImage
                src="/manus-storage/chalet-interior-dining_31d1b175.png"
                label="Jedáleň & kuchyňa"
                desc="Projektor, kozub, plne vybavená kuchyňa."
                height="220px"
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
              }}
            >
              <GalleryImage
                src="/manus-storage/chalet-bedroom_f7acdc90.png"
                label="Spálňa"
                desc="3 spálne, každá s vlastnou kúpeľňou."
                height="200px"
              />
            </motion.div>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
