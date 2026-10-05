import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { usePremiumCopy } from "./copy";
const Booking = lazy(() =>
  import("../BookingSection").then(module => ({
    default: module.BookingSection,
  }))
);
/** Keep anchor and heading available; load calendar code before it reaches view. */
export function BookingIsland() {
  const c = usePremiumCopy();
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1200px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={ref}
      id="rezervacia"
      className="premium-section booking-section"
    >
      {/* From 1280px the frame is one grid: the summary column starts level
          with the heading and stays sticky beside the calendar. */}
      <div className="container booking-frame">
        <SectionHeader lines={c.booking} />
        <div className="booking-island">
          <Suspense
            fallback={<div className="booking-placeholder" aria-busy="true" />}
          >
            {ready ? (
              <Booking embedded />
            ) : (
              <div className="booking-placeholder" />
            )}
          </Suspense>
        </div>
      </div>
    </section>
  );
}
