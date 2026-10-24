import { lazy, Suspense, useEffect, useRef, useState } from "react";

let bookingPreloaded = false;
const loadBookingModule = () => {
  bookingPreloaded = true;
  return import("../BookingSection").then(module => ({
    default: module.BookingSection,
  }));
};

const Booking = lazy(loadBookingModule);

export function preloadBookingSection() {
  void loadBookingModule();
}

const isBookingAnchor = (hash: string) =>
  hash === "#rezervacia" ||
  hash === "#cennik" ||
  hash === "rezervacia" ||
  hash === "cennik";

/** Keep the anchor available; load calendar code before it reaches view. */
export function BookingIsland() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(
    () =>
      bookingPreloaded ||
      (typeof window !== "undefined" && isBookingAnchor(window.location.hash))
  );
  useEffect(() => {
    if (ready) return;
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
    const onAnchorClick = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      const href = anchor?.getAttribute("href");
      if (href && isBookingAnchor(href)) {
        setReady(true);
      }
    };
    document.addEventListener("click", onAnchorClick, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", onAnchorClick, true);
    };
  }, [ready]);
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
