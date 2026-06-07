// src/components/ui/cinematic-landing-hero.tsx
// CHALET BEYOND — Cinematic Hero
// Design: Nordic Brutalism / Dark Timber — amber accents, Bebas Neue, deep shadows
// GSAP ScrollTrigger cinematic scroll sequence
// FIXES:
// - Hero photo fills the card background (no more empty black window)
// - Mountain card is landscape (object-position: center top)
// - Scroll duration reduced from 7000 to 5000
// - Scrub smoothness improved (scrub: 1.5)
// - Card starts visible (no gsap-reveal on card)
"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Film grain overlay */
  .cb-film-grain {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 50; opacity: 0.04; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  /* Timber grid pattern */
  .cb-bg-grid {
    background-size: 80px 80px;
    background-image: 
      linear-gradient(to right, rgba(180,120,40,0.06) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(180,120,40,0.06) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* Amber text glow */
  .cb-text-amber-glow {
    color: oklch(0.92 0.008 75);
    text-shadow: 
      0 0 80px rgba(180,120,40,0.4),
      0 10px 30px rgba(0,0,0,0.6),
      0 2px 4px rgba(0,0,0,0.4);
  }

  /* Amber reveal text */
  .cb-text-amber {
    background: linear-gradient(180deg, oklch(0.78 0.14 65) 0%, oklch(0.62 0.12 60) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter: drop-shadow(0px 0px 30px rgba(180,120,40,0.5));
  }

  /* Deep timber card */
  .cb-depth-card {
    background: linear-gradient(145deg, oklch(0.14 0.020 55) 0%, oklch(0.08 0.010 55) 100%);
    box-shadow: 
      0 40px 100px -20px rgba(0, 0, 0, 0.95),
      0 20px 40px -20px rgba(0, 0, 0, 0.85),
      inset 0 1px 2px rgba(180,120,40,0.15),
      inset 0 -2px 4px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(180,120,40,0.08);
    position: relative;
  }

  /* Mouse-reactive sheen */
  .cb-card-sheen {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(180,120,40,0.07) 0%, transparent 40%);
    mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* Floating glass badge */
  .cb-floating-badge {
    background: linear-gradient(135deg, rgba(180,120,40,0.12) 0%, rgba(180,120,40,0.02) 100%);
    backdrop-filter: blur(24px); 
    -webkit-backdrop-filter: blur(24px);
    box-shadow: 
      0 0 0 1px rgba(180,120,40,0.2),
      0 25px 50px -12px rgba(0, 0, 0, 0.8),
      inset 0 1px 1px rgba(180,120,40,0.25),
      inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  /* Amber CTA buttons */
  .cb-btn-amber {
    background: linear-gradient(180deg, oklch(0.72 0.12 65) 0%, oklch(0.60 0.10 60) 100%);
    color: oklch(0.10 0.010 55);
    box-shadow: 0 0 0 1px rgba(180,120,40,0.3), 0 2px 4px rgba(0,0,0,0.5), 0 12px 24px -4px rgba(180,120,40,0.4), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.3);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.08em;
  }
  .cb-btn-amber:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 0 1px rgba(180,120,40,0.4), 0 6px 12px -2px rgba(0,0,0,0.4), 0 20px 32px -6px rgba(180,120,40,0.5), inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.3);
  }
  .cb-btn-amber:active { transform: translateY(1px); }

  .cb-btn-ghost {
    background: transparent;
    color: oklch(0.72 0.12 65);
    box-shadow: 0 0 0 1px rgba(180,120,40,0.3);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.08em;
  }
  .cb-btn-ghost:hover {
    transform: translateY(-3px);
    background: rgba(180,120,40,0.08);
    box-shadow: 0 0 0 1px rgba(180,120,40,0.5), 0 10px 30px -5px rgba(180,120,40,0.2);
  }
  .cb-btn-ghost:active { transform: translateY(1px); }

  /* Stat badge */
  .cb-stat-badge {
    background: linear-gradient(180deg, rgba(180,120,40,0.08) 0%, rgba(180,120,40,0.02) 100%);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 
      0 0 0 1px rgba(180,120,40,0.15),
      0 10px 20px rgba(0,0,0,0.3),
      inset 0 1px 1px rgba(180,120,40,0.1);
  }

  /* Amber rule line */
  .cb-amber-rule {
    width: 3rem;
    height: 2px;
    background: oklch(0.72 0.12 65);
    margin-bottom: 1.5rem;
  }

  /* Landscape photo card */
  .cb-landscape-card {
    background: oklch(0.10 0.015 55);
    box-shadow:
      0 40px 80px -15px rgba(0,0,0,0.95),
      0 15px 25px -5px rgba(0,0,0,0.8),
      inset 0 1px 1px rgba(180,120,40,0.1);
    border: 1px solid rgba(180,120,40,0.06);
  }
`;

export interface ChaletCinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  heroImageUrl?: string;
  interiorImageUrl?: string;
  mountainImageUrl?: string;
}

export function ChaletCinematicHero({
  heroImageUrl = "/manus-storage/chalet-hero_d3d596c7.png",
  interiorImageUrl = "/manus-storage/chalet-living_c24d113a.png",
  mountainImageUrl = "/manus-storage/chalet-mountain-correct_289ff24f.png",
  className,
  ...props
}: ChaletCinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // Mouse parallax sheen on card
  useLayoutEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Cinematic GSAP scroll timeline
  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Initial states — only text elements are hidden, NOT the card
      gsap.set(".cb-text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".cb-text-reveal", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set([".cb-card-left", ".cb-card-right", ".cb-mockup-wrap", ".cb-badge", ".cb-stat"], { autoAlpha: 0 });
      gsap.set(".cb-cta-wrap", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });
      // Card starts below viewport, NOT hidden
      gsap.set(".cb-main-card", { y: window.innerHeight + 200, autoAlpha: 1 });

      // Intro animation — text appears
      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".cb-text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".cb-text-reveal", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      // Scroll timeline — reduced to 5000px, scrub 1.5 for smoothness
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=5000",
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
      });

      scrollTl
        // Phase 1 (0–2): Hero text fades, card rises from below
        .to([".cb-hero-text", ".cb-bg-grid"], { scale: 1.1, filter: "blur(16px)", opacity: 0.1, ease: "power2.inOut", duration: 2 }, 0)
        .to(".cb-main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        // Phase 2 (2–3.5): Card expands full screen — hero photo fills it
        .to(".cb-main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        // Phase 3 (3.5–6): Chalet mockup flies in with 3D
        .fromTo(".cb-mockup-wrap",
          { y: 200, z: -400, rotationX: 40, rotationY: -25, autoAlpha: 0, scale: 0.7 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2 }, "-=0.5"
        )
        // Phase 4: Stats and badges appear
        .fromTo(".cb-stat", { y: 30, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.12, ease: "back.out(1.2)", duration: 1.2 }, "-=1.5")
        .fromTo(".cb-badge", { y: 80, autoAlpha: 0, scale: 0.75, rotationZ: -8 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.2, stagger: 0.15 }, "-=1.8")
        // Phase 5: Card text slides in
        .fromTo(".cb-card-left", { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.2 }, "-=1.2")
        .fromTo(".cb-card-right", { x: 40, autoAlpha: 0, scale: 0.85 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.2 }, "<")
        // Phase 6: Hold
        .to({}, { duration: 1.5 })
        // Phase 7: Transition to CTA
        .set(".cb-hero-text", { autoAlpha: 0 })
        .set(".cb-cta-wrap", { autoAlpha: 1 })
        .to({}, { duration: 1 })
        .to([".cb-mockup-wrap", ".cb-badge", ".cb-card-left", ".cb-card-right"], {
          scale: 0.9, y: -30, z: -150, autoAlpha: 0, ease: "power3.in", duration: 1, stagger: 0.04,
        })
        // Phase 8: Card pulls back
        .to(".cb-main-card", {
          width: isMobile ? "92vw" : "85vw",
          height: isMobile ? "92vh" : "85vh",
          borderRadius: isMobile ? "32px" : "40px",
          ease: "expo.inOut",
          duration: 1.5
        }, "pullback")
        .to(".cb-cta-wrap", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.5 }, "pullback")
        // Phase 9: Card exits upward
        .to(".cb-main-card", { y: -window.innerHeight - 200, ease: "power3.in", duration: 1.2 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center justify-center antialiased",
        className
      )}
      style={{
        perspective: "1500px",
        background: "oklch(0.06 0.008 55)",
      }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="cb-film-grain" aria-hidden="true" />
      <div className="cb-bg-grid absolute inset-0 z-0 pointer-events-none opacity-60" aria-hidden="true" />

      {/* BACKGROUND: Hero tagline text */}
      <div className="cb-hero-text absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform">
        <p
          className="cb-text-track gsap-reveal mb-3"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.65rem, 1.5vw, 0.85rem)",
            letterSpacing: "0.25em",
            color: "oklch(0.62 0.10 65)",
            textTransform: "uppercase",
          }}
        >
          49°11'N 20°17'E — Veľká Lomnica
        </p>
        <h1
          className="cb-text-track gsap-reveal cb-text-amber-glow"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(4rem, 12vw, 10rem)",
            letterSpacing: "-0.01em",
            lineHeight: 0.95,
            marginBottom: "0.25rem",
          }}
        >
          CHALET
        </h1>
        <h1
          className="cb-text-reveal gsap-reveal cb-text-amber"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(4rem, 12vw, 10rem)",
            letterSpacing: "-0.01em",
            lineHeight: 0.95,
          }}
        >
          BEYOND
        </h1>
      </div>

      {/* BACKGROUND: CTA section (appears at end of scroll) */}
      <div className="cb-cta-wrap absolute z-10 flex flex-col items-center justify-center text-center w-screen px-6 gsap-reveal">
        <div className="cb-amber-rule mx-auto" />
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 7vw, 6rem)",
            letterSpacing: "-0.01em",
            lineHeight: 1.0,
            color: "oklch(0.92 0.008 75)",
            marginBottom: "1.5rem",
          }}
        >
          BEYOND YOUR<br />EXPECTATIONS
        </h2>
        <p
          style={{
            fontFamily: "'Karla', sans-serif",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            fontWeight: 300,
            color: "oklch(0.58 0.020 65)",
            maxWidth: "44ch",
            lineHeight: 1.7,
            marginBottom: "3rem",
          }}
        >
          Súkromný chalet pre 8 hostí v srdci Vysokých Tatier.<br />
          Priamo na golfovom ihrisku Black Stork PGA.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#rezervacia"
            className="cb-btn-amber flex items-center justify-center gap-3 px-10 py-4 rounded-sm"
            style={{ fontSize: "1.1rem" }}
          >
            Rezervovať pobyt
          </a>
          <a
            href="https://www.booking.com/hotel/sk/chalet-beyond.html"
            target="_blank"
            rel="noopener noreferrer"
            className="cb-btn-ghost flex items-center justify-center gap-3 px-10 py-4 rounded-sm"
            style={{ fontSize: "1.1rem" }}
          >
            Booking.com
          </a>
        </div>
      </div>

      {/* FOREGROUND: The deep timber card with hero photo background */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="cb-main-card cb-depth-card relative overflow-hidden flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          {/* Hero photo fills the card background — visible during "empty window" phase */}
          <img
            src={heroImageUrl}
            alt="Chalet Beyond — nočný pohľad"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: "center center",
              zIndex: 0,
            }}
          />
          {/* Dark overlay so content is readable */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, oklch(0.06 0.008 55 / 0.55) 0%, oklch(0.06 0.008 55 / 0.75) 100%)",
              zIndex: 1,
            }}
          />

          <div className="cb-card-sheen" aria-hidden="true" style={{ zIndex: 2 }} />

          {/* Card interior grid */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 py-6 lg:py-0" style={{ zIndex: 10 }}>

            {/* RIGHT: Brand name */}
            <div className="cb-card-right gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(3.5rem, 8vw, 7rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.0,
                  background: "linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) drop-shadow(0px 4px 8px rgba(0,0,0,0.6))",
                }}
              >
                CHALET<br />BEYOND
              </h2>
            </div>

            {/* CENTER: Mountain view photo — LANDSCAPE */}
            <div className="cb-mockup-wrap order-2 relative w-full h-[260px] lg:h-[480px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Landscape card — wider than tall */}
                <div
                  className="cb-landscape-card relative overflow-hidden will-change-transform"
                  style={{
                    width: "min(480px, 90%)",
                    height: "min(300px, 85%)",
                    borderRadius: "1.5rem",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Mountain view photo — landscape oriented */}
                  <img
                    src={mountainImageUrl}
                    alt="Výhľad na Lomnický štít"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 40%" }}
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, oklch(0.08 0.010 55 / 0.75) 0%, transparent 55%)",
                    }}
                  />
                  {/* Bottom label */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="cb-stat-badge rounded-xl p-3">
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.6rem",
                          letterSpacing: "0.15em",
                          color: "oklch(0.62 0.10 65)",
                          textTransform: "uppercase",
                          marginBottom: "0.2rem",
                        }}
                      >
                        Veľká Lomnica · 820 m n.m.
                      </p>
                      <p
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.2rem",
                          letterSpacing: "0.03em",
                          color: "oklch(0.92 0.008 75)",
                        }}
                      >
                        Výhľad na Lomnický štít
                      </p>
                    </div>
                  </div>
                  {/* Screen glare */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(110deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 45%)",
                    }}
                  />
                </div>

                {/* Floating badge — top left */}
                <div className="cb-badge absolute flex top-2 lg:top-6 left-0 lg:left-[-50px] cb-floating-badge rounded-xl p-3 items-center gap-3 z-30">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(180,120,40,0.3) 0%, rgba(180,120,40,0.05) 100%)",
                      border: "1px solid rgba(180,120,40,0.3)",
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="oklch(0.72 0.12 65)" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3l14 9-14 9V3z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: "oklch(0.92 0.008 75)", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Karla', sans-serif" }}>Golf Black Stork</p>
                    <p style={{ color: "oklch(0.62 0.10 65)", fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>PGA Certified</p>
                  </div>
                </div>

                {/* Floating badge — bottom right */}
                <div className="cb-badge absolute flex bottom-4 lg:bottom-10 right-0 lg:right-[-50px] cb-floating-badge rounded-xl p-3 items-center gap-3 z-30">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(180,120,40,0.3) 0%, rgba(180,120,40,0.05) 100%)",
                      border: "1px solid rgba(180,120,40,0.3)",
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="oklch(0.72 0.12 65)" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: "oklch(0.92 0.008 75)", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Karla', sans-serif" }}>Booking.com 9.4</p>
                    <p style={{ color: "oklch(0.62 0.10 65)", fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>Výnimočné</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT: Property stats */}
            <div className="cb-card-left gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-4 lg:px-0">
              <div className="cb-amber-rule hidden lg:block" />
              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                  letterSpacing: "0.01em",
                  lineHeight: 1.1,
                  color: "oklch(0.92 0.008 75)",
                  marginBottom: "1.25rem",
                  textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                }}
              >
                250 m² súkromia<br />v Tatrách
              </h3>
              <div className="hidden md:grid grid-cols-2 gap-3">
                {[
                  { val: "3", label: "Spálne" },
                  { val: "3", label: "Kúpeľne" },
                  { val: "8", label: "Max. hostí" },
                  { val: "PGA", label: "Golf resort" },
                ].map((s) => (
                  <div key={s.label} className="cb-stat cb-stat-badge rounded-lg p-3">
                    <p
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.6rem",
                        color: "oklch(0.72 0.12 65)",
                        lineHeight: 1.1,
                      }}
                    >
                      {s.val}
                    </p>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        color: "oklch(0.55 0.020 65)",
                        textTransform: "uppercase",
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
