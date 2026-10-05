import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HeroHandoff } from "@/components/HeroHandoff";
import { ChaletIntroSection } from "@/components/ChaletIntroSection";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { GuestsProvider } from "@/contexts/GuestsContext";
import "@/components/premium/premium.css";
import { StickyContactBar } from "@/components/StickyContactBar";

const PageStory = lazy(() => import("@/components/premium/PageStory"));
const STORY_ANCHORS = [
  "priestory",
  "photo-interlude",
  "vybavenie",
  "okolie",
  "cennik",
  "rezervacia",
  "premium-footer",
];

function StoryPlaceholder() {
  return (
    <div aria-busy="true">
      {STORY_ANCHORS.map(id => (
        <div key={id} id={id} style={{ minHeight: "100svh" }} />
      ))}
    </div>
  );
}

function DeferredStory() {
  const ref = useRef<HTMLDivElement>(null);
  const pendingAnchor = useRef(window.location.hash.slice(1));
  const [ready, setReady] = useState(() =>
    STORY_ANCHORS.includes(pendingAnchor.current)
  );
  useEffect(() => {
    if (ready) return;
    // Also expose the complete document without requiring a scroll gesture.
    // The first-screen entrance gets the network and main thread first.
    let idle: number | undefined;
    const warmup = window.setTimeout(() => {
      if ("requestIdleCallback" in window)
        idle = window.requestIdleCallback(() => setReady(true), {
          timeout: 1000,
        });
      else setReady(true);
    }, 4000);
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) setReady(true);
      },
      { rootMargin: "600px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    // A large scroll jump can pass the observer's window in one frame.
    const loadAfterJump = () => {
      if (
        ref.current &&
        ref.current.getBoundingClientRect().top <= innerHeight + 600
      )
        setReady(true);
    };
    window.addEventListener("scroll", loadAfterJump, { passive: true });
    const loadForAnchor = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      const href = anchor?.getAttribute("href");
      if (!href?.startsWith("#") || !STORY_ANCHORS.includes(href.slice(1)))
        return;
      pendingAnchor.current = href.slice(1);
      setReady(true);
    };
    document.addEventListener("click", loadForAnchor, true);
    return () => {
      observer.disconnect();
      window.clearTimeout(warmup);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.removeEventListener("scroll", loadAfterJump);
      document.removeEventListener("click", loadForAnchor, true);
    };
  }, [ready]);
  const restoreAnchor = () => {
    if (!pendingAnchor.current) return;
    document
      .getElementById(pendingAnchor.current)
      ?.scrollIntoView({ behavior: "instant" });
    pendingAnchor.current = "";
  };
  return (
    <div ref={ref}>
      <Suspense fallback={<StoryPlaceholder />}>
        {ready ? <PageStory onReady={restoreAnchor} /> : <StoryPlaceholder />}
      </Suspense>
    </div>
  );
}

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "oklch(0.06 0.008 55)",
        color: "oklch(0.92 0.008 75)",
      }}
    >
      <Navigation />
      {/* The rest of the page rises over the hero as one sheet. */}
      <GuestsProvider>
        <HeroHandoff hero={<Hero />}>
          <ChaletIntroSection />

          <DeferredStory />
        </HeroHandoff>
      </GuestsProvider>
      {/* Last so it layers above everything */}
      <StickyContactBar />
    </div>
  );
}
