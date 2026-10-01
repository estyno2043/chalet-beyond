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
      <div className="container">
        <SectionHeader lines={c.booking} description={c.bookingBody} />
      </div>
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
    </section>
  );
}
