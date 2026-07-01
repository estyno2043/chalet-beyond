/*
 * CHALET BEYOND — "Postavené pre túto krajinu" gallery
 * Album grid → tap a cover to open a full-screen lightbox and click/swipe
 * through that album's photos. Photos sourced from the Booking.com listing.
 * Mobile-first: single-column album covers, swipeable full-screen viewer.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/components/FadeUp";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

const B = "/gallery/booking/";

interface Album {
  id: string;
  title: string;
  cover: string;
  coverPos?: string;
  images: string[];
}

const ALBUMS: Album[] = [
  {
    id: "interior",
    title: "Interiér",
    cover: `${B}856619250.jpg`,
    images: [
      `${B}856619250.jpg`,
      `${B}846908005.jpg`,
      `${B}846907991.jpg`,
      `${B}846907975.jpg`,
      `${B}846907896.jpg`,
      `${B}846907854.jpg`,
      `${B}846907839.jpg`,
      `${B}846907971.jpg`,
      `${B}846908018.jpg`,
    ],
  },
  {
    id: "spalne",
    title: "Spálne",
    cover: `${B}856621487.jpg`,
    images: [
      `${B}856621487.jpg`,
      `${B}856619306.jpg`,
      `${B}846907878.jpg`,
      `${B}856614236.jpg`,
      `${B}856616419.jpg`,
    ],
  },
  {
    id: "wellness",
    title: "Sauna & wellness",
    cover: `${B}846907929.jpg`,
    images: [
      `${B}846907929.jpg`,
      `${B}847763837.jpg`,
      `${B}847763840.jpg`,
      `${B}847763847.jpg`,
      `${B}846907844.jpg`,
    ],
  },
  {
    id: "exterior",
    title: "Exteriér",
    cover: `${B}856619975.jpg`,
    images: [
      `${B}856619975.jpg`,
      `${B}856619150.jpg`,
      `${B}846907870.jpg`,
      `${B}846907960.jpg`,
      `${B}846908012.jpg`,
      `${B}846908131.jpg`,
      `${B}846907938.jpg`,
      `${B}847763795.jpg`,
      `${B}847763875.jpg`,
    ],
  },
  {
    id: "okolie",
    title: "Golf & Tatry",
    cover: "/gallery/golf-fairway.jpg",
    images: [
      "/gallery/golf-fairway.jpg",
      `${B}846907954.jpg`,
      `${B}846907979.jpg`,
      `${B}856621056.jpg`,
      `${B}846907886.jpg`,
      `${B}846907911.jpg`,
    ],
  },
];

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  album,
  index,
  onClose,
  onIndex,
}: {
  album: Album;
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const total = album.images.length;
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: number) => onIndex((index + dir + total) % total),
    [index, total, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "oklch(0.04 0.006 55 / 0.96)",
        backdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6"
        style={{ height: "56px", flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(0.72 0.12 65)",
          }}
        >
          {album.title} · {index + 1}/{total}
        </span>
        <button
          onClick={onClose}
          aria-label="Zavrieť"
          className="flex items-center justify-center rounded-sm"
          style={{
            width: 40,
            height: 40,
            color: "oklch(0.92 0.008 75)",
            border: "1px solid oklch(0.72 0.12 65 / 0.3)",
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Image stage */}
      <div
        className="relative flex-1 flex items-center justify-center px-2 sm:px-16 min-h-0"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={album.images[index]}
            src={album.images[index]}
            alt={`${album.title} ${index + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.25 }}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "3px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          />
        </AnimatePresence>

        {/* Desktop arrows */}
        <button
          onClick={() => go(-1)}
          aria-label="Predchádzajúca"
          className="hidden sm:flex items-center justify-center absolute left-3 rounded-full"
          style={{ width: 48, height: 48, background: "oklch(0.10 0.010 55 / 0.6)", color: "oklch(0.92 0.008 75)", border: "1px solid oklch(0.72 0.12 65 / 0.25)" }}
        >
          <ChevronLeft size={26} />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Ďalšia"
          className="hidden sm:flex items-center justify-center absolute right-3 rounded-full"
          style={{ width: 48, height: 48, background: "oklch(0.10 0.010 55 / 0.6)", color: "oklch(0.92 0.008 75)", border: "1px solid oklch(0.72 0.12 65 / 0.25)" }}
        >
          <ChevronRight size={26} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div
        className="flex gap-2 overflow-x-auto px-3 py-3"
        style={{ flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {album.images.map((src, i) => (
          <button
            key={src}
            onClick={() => onIndex(i)}
            aria-label={`Foto ${i + 1}`}
            style={{
              flexShrink: 0,
              width: 64,
              height: 44,
              borderRadius: "3px",
              overflow: "hidden",
              border: i === index ? "2px solid oklch(0.72 0.12 65)" : "2px solid transparent",
              opacity: i === index ? 1 : 0.55,
              transition: "opacity 0.2s",
            }}
          >
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────
export function GallerySection() {
  const [openAlbum, setOpenAlbum] = useState<number | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  const open = (albumIdx: number) => {
    setOpenAlbum(albumIdx);
    setImgIndex(0);
  };

  return (
    <section id="priestory" className="py-16 md:py-32" style={{ background: "oklch(0.08 0.010 55)" }}>
      <div className="container">
        <FadeUp className="mb-8 md:mb-16">
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
              Tmavá kovová strecha. Vertikálny drevený obklad. Zasklenie od podlahy až po strop. Vyberte si priestor a prezrite si galériu.
            </p>
          </div>
        </FadeUp>

        {/* Album covers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {ALBUMS.map((album, i) => (
            <FadeUp key={album.id} delay={(i % 3) * 0.08}>
              <button
                onClick={() => open(i)}
                className="group relative w-full overflow-hidden"
                style={{
                  height: "clamp(220px, 46vw, 300px)",
                  borderRadius: "3px",
                  display: "block",
                }}
              >
                <img
                  src={album.cover}
                  alt={album.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: album.coverPos || "center" }}
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-4 md:p-5"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(0.06 0.008 55 / 0.92) 0%, oklch(0.06 0.008 55 / 0.15) 55%, transparent 100%)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Images size={14} style={{ color: "oklch(0.72 0.12 65)" }} />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "oklch(0.80 0.06 68)",
                      }}
                    >
                      {album.images.length} fotiek
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(1.5rem, 5vw, 2rem)",
                      letterSpacing: "0.03em",
                      color: "oklch(0.95 0.008 75)",
                      lineHeight: 1,
                    }}
                  >
                    {album.title}
                  </span>
                </div>
              </button>
            </FadeUp>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openAlbum !== null && (
          <Lightbox
            album={ALBUMS[openAlbum]}
            index={imgIndex}
            onIndex={setImgIndex}
            onClose={() => setOpenAlbum(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
