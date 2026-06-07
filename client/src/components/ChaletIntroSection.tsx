/*
 * CHALET BEYOND — Intro Section
 * "V srdci Vysokých Tatier..." — main brand statement
 * Asymmetric layout: large heading left, body text right
 * Amber rule dividers, fade-up animations
 */
import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, staggerItem } from "@/components/FadeUp";
import { Flame, Eye, Coffee } from "lucide-react";

const highlights = [
  {
    icon: Flame,
    title: "Kozub & vírivka",
    desc: "Ticho zimných večerov pri kozube, v horúcej vírivke pod hviezdami.",
  },
  {
    icon: Eye,
    title: "Výhľad na Lomničák",
    desc: "Ranná káva s panorámou, ktorá berie dych — priamo z vášho súkromného útočiska.",
  },
  {
    icon: Coffee,
    title: "Architektúra & príroda",
    desc: "Čisté línie, veľkorysé presklené plochy a dokonalé prepojenie interiéru s krajinou.",
  },
];

export function ChaletIntroSection() {
  return (
    <section id="chalet" className="py-24 md:py-36">
      <div className="container">
        {/* Amber rule top */}
        <FadeUp>
          <div className="amber-rule mb-16" />
        </FadeUp>

        {/* Asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start mb-20">
          {/* Left: large heading */}
          <FadeUp delay={0.05}>
            <div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.72 0.12 65)",
                  marginBottom: "1.25rem",
                  textTransform: "uppercase",
                }}
              >
                O chalete
              </p>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.0,
                  color: "oklch(0.92 0.008 75)",
                }}
              >
                BEYOND<br />
                <span style={{ color: "oklch(0.72 0.12 65)" }}>YOUR</span><br />
                EXPECTATIONS
              </h2>
            </div>
          </FadeUp>

          {/* Right: body text */}
          <FadeUp delay={0.15}>
            <div style={{ paddingTop: "0.5rem" }}>
              <p
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "1.125rem",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: "oklch(0.78 0.015 75)",
                  marginBottom: "1.5rem",
                }}
              >
                Prebúdzajte sa s ikonickým výhľadom na Lomničák, priamo z pohodlia vášho súkromného útočiska na golfovom ihrisku. Každý detail Chalet Beyond je navrhnutý tak, aby prekonal očakávania.
              </p>
              <p
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "1.125rem",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: "oklch(0.78 0.015 75)",
                  marginBottom: "2rem",
                }}
              >
                Čisté línie, veľkorysé presklené plochy a dokonalé prepojenie interiéru s okolitou krajinou. Tu nejde len o bývanie. Ide o zážitok.
              </p>
              <p
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.4rem",
                  letterSpacing: "0.04em",
                  color: "oklch(0.72 0.12 65)",
                }}
              >
                Chalet Beyond, beyond your expectations.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* Three highlights */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px" staggerDelay={0.1}>
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={staggerItem}
                className="glow-hover p-8 md:p-10"
                style={{
                  background: "oklch(0.14 0.012 55)",
                  borderTop: "1px solid oklch(0.72 0.12 65 / 0.18)",
                }}
              >
                <div
                  className="mb-5 inline-flex items-center justify-center w-10 h-10"
                  style={{ color: "oklch(0.72 0.12 65)" }}
                >
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.5rem",
                    letterSpacing: "0.03em",
                    color: "oklch(0.92 0.008 75)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Karla', sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 300,
                    lineHeight: 1.65,
                    color: "oklch(0.58 0.020 65)",
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
