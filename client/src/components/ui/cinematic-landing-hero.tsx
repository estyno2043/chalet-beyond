// src/components/ui/cinematic-landing-hero.tsx
// CHALET BEYOND — Cinematic Hero
// Adapted from CinematicHero template for luxury chalet landing page
// Design: Nordic Brutalism / Dark Timber — amber accents, Bebas Neue, deep shadows
// GSAP ScrollTrigger cinematic scroll sequence
"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
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

  /* Silver gradient text */
  .cb-text-silver {
    background: linear-gradient(180deg, oklch(0.92 0.008 75) 0%, oklch(0.62 0.045 65) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter: 
      drop-shadow(0px 10px 20px rgba(0,0,0,0.7)) 
      drop-shadow(0px 2px 4px rgba(0,0,0,0.5));
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
  .cb-btn-amber:active {
    transform: translateY(1px);
  }

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
  .cb-btn-ghost:active {
    transform: translateY(1px);
  }

  /* Chalet image card */
  .cb-chalet-card {
    background: oklch(0.10 0.015 55);
    box-shadow:
      0 40px 80px -15px rgba(0,0,0,0.95),
      0 15px 25px -5px rgba(0,0,0,0.8),
      inset 0 1px 1px rgba(180,120,40,0.1);
    border: 1px solid rgba(180,120,40,0.06);
  }

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
`;

export interface ChaletCinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  heroImageUrl?: string;
  interiorImageUrl?: string;
  mountainImageUrl?: string;
}

export function ChaletCinematicHero({
  heroImageUrl = "/manus-storage/chalet-hero_d3d596c7.png",
  interiorImageUrl = "/manus-storage/chalet-living_c24d113a.png",
  mountainImageUrl = "/manus-storage/chalet-mountain-view_91debae8.png",
  className,
  ...props
}: ChaletCinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const chaletImgRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // Mouse parallax on the chalet image
  useLayoutEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && chaletImgRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(chaletImgRef.current, {
            rotationY: xVal * 8,
            rotationX: -yVal * 8,
            ease: "power3.out",
            duration: 1.2,
          });
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
      // Initial states
      gsap.set(".cb-text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".cb-text-reveal", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".cb-main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".cb-card-left", ".cb-card-right", ".cb-mockup-wrap", ".cb-badge", ".cb-stat"], { autoAlpha: 0 });
      gsap.set(".cb-cta-wrap", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      // Intro animation
      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".cb-text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".cb-text-reveal", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      // Scroll timeline
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=7000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        // Phase 1: Hero text fades, card rises
        .to([".cb-hero-text", ".cb-bg-grid"], { scale: 1.15, filter: "blur(20px)", opacity: 0.15, ease: "power2.inOut", duration: 2 }, 0)
        .to(".cb-main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        // Phase 2: Card expands full screen
        .to(".cb-main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        // Phase 3: Chalet mockup flies in with 3D
        .fromTo(".cb-mockup-wrap",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        // Phase 4: Stats and badges appear
        .fromTo(".cb-stat", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        .fromTo(".cb-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")
        // Phase 5: Card text slides in
        .fromTo(".cb-card-left", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
        .fromTo(".cb-card-right", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
        // Phase 6: Hold
        .to({}, { duration: 2.5 })
        // Phase 7: Transition to CTA
        .set(".cb-hero-text", { autoAlpha: 0 })
        .set(".cb-cta-wrap", { autoAlpha: 1 })
        .to({}, { duration: 1.5 })
        .to([".cb-mockup-wrap", ".cb-badge", ".cb-card-left", ".cb-card-right"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
        })
        // Phase 8: Card pulls back
        .to(".cb-main-card", {
          width: isMobile ? "92vw" : "85vw",
          height: isMobile ? "92vh" : "85vh",
          borderRadius: isMobile ? "32px" : "40px",
          ease: "expo.inOut",
          duration: 1.8
        }, "pullback")
        .to(".cb-cta-wrap", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        // Phase 9: Card exits upward
        .to(".cb-main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

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
      {/* Styles are injected via dangerouslySetInnerHTML to scope GSAP class names */}
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="cb-film-grain" aria-hidden="true" />
      <div className="cb-bg-grid cb-bg-grid absolute inset-0 z-0 pointer-events-none opacity-60" aria-hidden="true" />

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
            className="cb-btn-amber flex items-center justify-center gap-3 px-10 py-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            style={{ fontSize: "1.1rem" }}
          >
            Rezervovať pobyt
          </a>
          <a
            href="https://www.booking.com/hotel/sk/chalet-beyond.html"
            target="_blank"
            rel="noopener noreferrer"
            className="cb-btn-ghost flex items-center justify-center gap-3 px-10 py-4 rounded-sm focus:outline-none"
            style={{ fontSize: "1.1rem" }}
          >
            Booking.com
          </a>
        </div>
      </div>

      {/* FOREGROUND: The deep timber card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="cb-main-card cb-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="cb-card-sheen" aria-hidden="true" />

          {/* Card interior grid */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">

            {/* RIGHT (desktop) / TOP (mobile): Brand name */}
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

            {/* CENTER: Chalet photo with 3D tilt */}
            <div className="cb-mockup-wrap order-2 lg:order-2 relative w-full h-[300px] lg:h-[520px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.85] md:scale-90 lg:scale-100">
                <div
                  ref={chaletImgRef}
                  className="cb-chalet-card relative w-[280px] lg:w-[340px] h-[380px] lg:h-[460px] rounded-[2rem] overflow-hidden will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Main chalet photo */}
                  <img
                    src={heroImageUrl}
                    alt="Chalet Beyond — nočný pohľad"
                    className="w-full h-full object-cover"
                    style={{ display: "block" }}
                  />
                  {/* Subtle gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, oklch(0.08 0.010 55 / 0.7) 0%, transparent 50%)",
                    }}
                  />
                  {/* Bottom label */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="cb-stat-badge rounded-xl p-3">
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.15em",
                          color: "oklch(0.62 0.10 65)",
                          textTransform: "uppercase",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Veľká Lomnica · 820 m n.m.
                      </p>
                      <p
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.4rem",
                          letterSpacing: "0.03em",
                          color: "oklch(0.92 0.008 75)",
                        }}
                      >
                        Výhľad na Lomničák
                      </p>
                    </div>
                  </div>

                  {/* Screen glare */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(110deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 45%)",
                    }}
                  />
                </div>

                {/* Floating badge — top left */}
                <div className="cb-badge absolute flex top-4 lg:top-8 left-[-10px] lg:left-[-60px] cb-floating-badge rounded-xl p-3 items-center gap-3 z-30">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(180,120,40,0.3) 0%, rgba(180,120,40,0.05) 100%)",
                      border: "1px solid rgba(180,120,40,0.3)",
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="oklch(0.72 0.12 65)" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3l14 9-14 9V3z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: "oklch(0.92 0.008 75)", fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Karla', sans-serif" }}>Golf Black Stork</p>
                    <p style={{ color: "oklch(0.62 0.10 65)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>PGA Certified</p>
                  </div>
                </div>

                {/* Floating badge — bottom right */}
                <div className="cb-badge absolute flex bottom-8 lg:bottom-16 right-[-10px] lg:right-[-60px] cb-floating-badge rounded-xl p-3 items-center gap-3 z-30">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(180,120,40,0.3) 0%, rgba(180,120,40,0.05) 100%)",
                      border: "1px solid rgba(180,120,40,0.3)",
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="oklch(0.72 0.12 65)" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: "oklch(0.92 0.008 75)", fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Karla', sans-serif" }}>Booking.com 9.4</p>
                    <p style={{ color: "oklch(0.62 0.10 65)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>Výnimočné</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT (desktop) / BOTTOM (mobile): Property stats */}
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
