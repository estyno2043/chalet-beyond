/*
 * CHALET BEYOND — "Zážitok" Section
 * What Chalet Beyond is (not a hotel, not an Airbnb) + 4 feature tiles.
 * Mobile-first: stacked layout, amber rule dividers, fade-up animations.
 */
import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, staggerItem } from "@/components/FadeUp";

const features = [
  {
    emoji: "⛳",
    title: "GOLF",
    desc: "Golfový rezort Black Stork – jediné golfové ihrisko PGA na Slovensku. 27 jamiek certifikovaných podľa štandardov kvality PGA od roku 2011. Dve minúty od vchodových dverí.",
  },
  {
    emoji: "🌲",
    title: "SÚKROMIE",
    desc: "Celý pozemok je výhradne váš. Príďte, zmiznite, resetujte sa.",
  },
  {
    emoji: "🧖",
    title: "WELLNESS",
    desc: "Súkromná sauna a vonkajšia vírivka. Otvorené celoročne, vyhrievané a pripravené.",
  },
  {
    emoji: "🏔",
    title: "TATRY",
    desc: "Lomnický štít na obzore. Lyžiarske vleky 10 minút odtiaľto. Zjazdovky od záhradnej bránky.",
  },
];

export function ChaletIntroSection() {
  return (
    <section id="chalet" className="py-16 md:py-36">
      <div className="container">
        {/* Amber rule top */}
        <FadeUp>
          <div className="amber-rule mb-10 md:mb-16" />
        </FadeUp>

        {/* Asymmetric: heading left, body right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-20 items-start mb-12 md:mb-20">
          <FadeUp delay={0.05}>
            <div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.72 0.12 65)",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                }}
              >
                Čo je Chalet Beyond?
              </p>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.8rem, 9vw, 5.5rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.0,
                  color: "oklch(0.92 0.008 75)",
                }}
              >
                NIE JE TO HOTEL.<br />
                <span style={{ color: "oklch(0.72 0.12 65)" }}>NIE JE TO AIRBNB.</span>
              </h2>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div style={{ paddingTop: "0.5rem" }}>
              <p
                style={{
                  fontFamily: "'Karla', sans-serif",
                  fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: "oklch(0.78 0.015 75)",
                }}
              >
                Súkromný horský rezort určený pre tých, ktorí chcú mať Tatry úplne pre seba. Pár krokov od ihriska Black Stork fairway. Priamy výhľad na Lomnický štít. Žiadna recepcia, žiadne spoločné priestory – len chata a hory.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* Four feature tiles */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
          staggerDelay={0.1}
        >
          {features.map((item) => (
            <motion.div
              key={item.title}
              variants={staggerItem}
              className="glow-hover p-7 md:p-9 group"
              style={{
                background: "oklch(0.14 0.012 55)",
                borderTop: "1px solid oklch(0.72 0.12 65 / 0.18)",
                cursor: "default",
              }}
              whileHover={{ backgroundColor: "oklch(0.16 0.015 55)" }}
            >
              <div
                className="mb-4"
                style={{ fontSize: "1.9rem", lineHeight: 1 }}
                aria-hidden="true"
              >
                {item.emoji}
              </div>
              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(1.3rem, 4vw, 1.6rem)",
                  letterSpacing: "0.06em",
                  color: "oklch(0.92 0.008 75)",
                  marginBottom: "0.6rem",
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
                  color: "oklch(0.62 0.020 65)",
                }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
