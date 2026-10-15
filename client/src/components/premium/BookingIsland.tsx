import { lazy, Suspense, useEffect, useRef, useState } from "react";
const Booking = lazy(() =>
  import("../BookingSection").then(module => ({
    default: module.BookingSection,
  }))
);
/** Keep the anchor available; load calendar code before it reaches view. */
export function BookingIsland() {
  const ref = useRef<HTMLDivElement>(null);
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
    <div ref={ref} id="rezervacia" className="container booking-island">
      <Suspense
        fallback={<div className="booking-placeholder" aria-busy="true" />}
      >
        {ready ? <Booking /> : <div className="booking-placeholder" />}
      </Suspense>
    </div>
  );
}
