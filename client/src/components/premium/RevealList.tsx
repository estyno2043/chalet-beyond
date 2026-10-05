import { useEffect, useRef, type ReactNode } from "react";
/** At most five row steps; reduced motion preserves only opacity. */
export function RevealList({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !node.animate) return;
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const columns = matchMedia("(min-width: 768px)").matches ? 2 : 1;
        Array.from(node.children).forEach((item, i) =>
          item.animate(
            reduced
              ? [{ opacity: 0 }, { opacity: 1 }]
              : [
                  { opacity: 0, transform: "translateY(8px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
            {
              duration: reduced ? 240 : 520,
              delay: reduced ? 0 : Math.min(4, Math.floor(i / columns)) * 60,
              easing: "cubic-bezier(.16,1,.3,1)",
              fill: "backwards",
            }
          )
        );
      },
      { rootMargin: "-100px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <ul className="amenities-list" ref={ref}>
      {children}
    </ul>
  );
}
