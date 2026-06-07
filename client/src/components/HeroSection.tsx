/*
 * CHALET BEYOND — Hero Section
 * Full-bleed night exterior photo, text anchored bottom-left
 * Clip-path wipe reveal on image, staggered text entrance
 * Dark overlay preserves warm amber glow of the photo
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

const HERO_IMAGE = "/manus-storage/chalet-hero_d3d596c7.png";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax: image moves up slower than scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  // Text fades out on scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -40]);

  const handleScrollDown = () => {
    const el = document.querySelector("#chalet");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "600px" }}
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY }}
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={{ clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] as [number, number, number, number], delay: 0.1 }}
      >
        <img
          src={HERO_IMAGE}
          alt="Chalet Beyond v noci — teplé svetlo okien proti snehu a tmavému lesu"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 60%" }}
        />
        {/* Gradient overlay — preserves amber glow, darkens sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.08 0.010 55 / 0.92) 0%, oklch(0.08 0.010 55 / 0.55) 40%, oklch(0.08 0.010 55 / 0.30) 70%, oklch(0.08 0.010 55 / 0.15) 100%)",
          }}
        />
      </motion.div>

      {/* Content — bottom-left anchored */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 container pb-16 md:pb-20"
        style={{ opacity: textOpacity, y: textY }}
      >
        {/* Coordinates — environmental detail */}
        <motion.div
          className="font-mono-data mb-4"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.12em", color: "oklch(0.72 0.12 65 / 0.7)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          49°11'N 20°17'E — VEĽKÁ LOMNICA, VYSOKÉ TATRY
        </motion.div>

        {/* Main heading */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.5rem, 10vw, 6rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1.0,
              color: "oklch(0.92 0.008 75)",
            }}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
          >
            CHALET BEYOND
          </motion.h1>
        </div>

        {/* Tagline */}
        <div className="overflow-hidden mb-8">
          <motion.p
            style={{
              fontFamily: "'Karla', sans-serif",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              fontWeight: 300,
              color: "oklch(0.78 0.015 75)",
              maxWidth: "52ch",
              lineHeight: 1.5,
            }}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
          >
            V srdci Vysokých Tatier, kde sa pokoj prírody stretáva s výnimočným dizajnom.
          </motion.p>
        </div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
        >
          <button
            className="btn-amber"
            onClick={() => {
              const el = document.querySelector("#rezervacia");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Rezervovať pobyt
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              const el = document.querySelector("#chalet");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Objaviť chalet
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-6 right-6 md:right-10 flex flex-col items-center gap-1"
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{ color: "oklch(0.72 0.12 65 / 0.6)" }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em" }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
