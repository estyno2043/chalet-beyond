/*
 * CHALET BEYOND — Architektúra / Gallery Section
 * "POSTAVENÉ PRE TÚTO KRAJINU" — 5 photos of the actual chalet.
 * Mobile: stacked column with one large hero + 2-up rows.
 * Desktop: asymmetric grid — large left hero, smaller right column, wide row.
 */
import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, staggerItem } from "@/components/FadeUp";

interface GalleryImg {
  src: string;
  label: string;
  desc: string;
}

const IMAGES: GalleryImg[] = [
  {
    src: "/gallery/exterior-night.jpg",
    label: "Exteriér v noci",
    desc: "Tmavá kovová strecha, vertikálny drevený obklad, teplé okná pri zotmení.",
  },
  {
    src: "/gallery/mountain-view.jpg",
    label: "Výhľad na Lomnický štít",
    desc: "Ranná panoráma priamo zo strechy chaletu.",
  },
  {
    src: "/gallery/dining.jpg",
    label: "Jedáleň & kuchyňa",
    desc: "Projektor, kozub, plne vybavená kuchyňa pre 8 hostí.",
  },
  {
    src: "/gallery/bedroom.jpg",
    label: "Spálňa",
    desc: "Tri spálne, každá s vlastným ambientom.",
  },
  {
    src: "/gallery/sauna.jpg",
    label: "Fínska sauna",
    desc: "Harvia kachle, cédrové lavice, podsvietenie.",
  },
  {
    src: "/gallery/bathroom.jpg",
    label: "Kúpeľňa",
    desc: "Travertín, dvojité umývadlo, sklená sprcha.",
  },
];

function GalleryImage({
  src,
  label,
  desc,
  height = "300px",
  objectPosition = "center",
}: {
  src: string;
  label: string;
  desc: string;
  height?: string;
  objectPosition?: string;
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
        style={{ display: "block", objectPosition }}
        loading="lazy"
      />
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
          {/* Top: large exterior + right column with mountain + bedroom */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <FadeUp delay={0} className="col-span-2">
              <GalleryImage
                src={IMAGES[0].src}
                label={IMAGES[0].label}
                desc={IMAGES[0].desc}
                height="520px"
              />
            </FadeUp>
            <div className="col-span-1 flex flex-col gap-3">
              <FadeUp delay={0.1} className="flex-1">
                <GalleryImage
                  src={IMAGES[1].src}
                  label={IMAGES[1].label}
                  desc={IMAGES[1].desc}
                  height="252px"
                  objectPosition="center 40%"
                />
              </FadeUp>
              <FadeUp delay={0.2} className="flex-1">
                <GalleryImage
                  src={IMAGES[3].src}
                  label={IMAGES[3].label}
                  desc={IMAGES[3].desc}
                  height="252px"
                />
              </FadeUp>
            </div>
          </div>
          {/* Bottom: dining wide + sauna + bathroom */}
          <div className="grid grid-cols-4 gap-3">
            <FadeUp delay={0.1} className="col-span-2">
              <GalleryImage
                src={IMAGES[2].src}
                label={IMAGES[2].label}
                desc={IMAGES[2].desc}
                height="300px"
              />
            </FadeUp>
            <FadeUp delay={0.2} className="col-span-1">
              <GalleryImage
                src={IMAGES[4].src}
                label={IMAGES[4].label}
                desc={IMAGES[4].desc}
                height="300px"
              />
            </FadeUp>
            <FadeUp delay={0.3} className="col-span-1">
              <GalleryImage
                src={IMAGES[5].src}
                label={IMAGES[5].label}
                desc={IMAGES[5].desc}
                height="300px"
              />
            </FadeUp>
          </div>
        </div>

        {/* Mobile: stacked column */}
        <div className="md:hidden">
          <StaggerContainer className="flex flex-col gap-2" staggerDelay={0.07}>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
              }}
            >
              <GalleryImage
                src={IMAGES[0].src}
                label={IMAGES[0].label}
                desc={IMAGES[0].desc}
                height="280px"
              />
            </motion.div>
            <div className="grid grid-cols-2 gap-2">
              {[IMAGES[1], IMAGES[3]].map((img, i) => (
                <motion.div
                  key={img.src}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
                  }}
                >
                  <GalleryImage
                    src={img.src}
                    label={img.label}
                    desc={img.desc}
                    height="180px"
                    objectPosition={img.src.includes("mountain") ? "center 40%" : "center"}
                  />
                </motion.div>
              ))}
            </div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
              }}
            >
              <GalleryImage
                src={IMAGES[2].src}
                label={IMAGES[2].label}
                desc={IMAGES[2].desc}
                height="220px"
              />
            </motion.div>
            <div className="grid grid-cols-2 gap-2">
              {[IMAGES[4], IMAGES[5]].map((img, i) => (
                <motion.div
                  key={img.src}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
                  }}
                >
                  <GalleryImage
                    src={img.src}
                    label={img.label}
                    desc={img.desc}
                    height="200px"
                  />
                </motion.div>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
