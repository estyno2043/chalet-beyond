import { useEffect, useRef } from "react";
import { EASE, DUR } from "@/lib/motion";

/** Progressive enhancement: content stays visible if observers/WAAPI fail. */
export function SectionHeader({
  lines,
  description,
  className = "",
}: {
  lines: string[];
  description?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window) || !node.animate) return;
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        node
          .querySelectorAll<HTMLElement>("[data-heading-line]")
          .forEach((line, index) => {
            line.animate(
              reduce
                ? [{ opacity: 0 }, { opacity: 1 }]
                : [
                    { transform: "translateY(110%)", opacity: 0 },
                    { transform: "translateY(0)", opacity: 1 },
                  ],
              {
                duration: (reduce ? DUR.state : DUR.section) * 1000,
                delay: reduce ? 0 : Math.min(index, 4) * 60,
                easing: `cubic-bezier(${EASE.enter})`,
                fill: "backwards",
              }
            );
          });
        node.querySelector("p")?.animate(
          reduce
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [
                {
                  opacity: 0,
                  transform: "translateY(14px)",
                  filter: "blur(4px)",
                },
                { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
              ],
          {
            duration: (reduce ? DUR.state : DUR.section) * 1000,
            delay: reduce ? 0 : 180,
            easing: `cubic-bezier(${EASE.enter})`,
            fill: "backwards",
          }
        );
      },
      { rootMargin: "-100px 0px", threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [lines.join("|"), description]);
  return (
    <div ref={ref} className={`section-header ${className}`}>
      <h2>
        {lines.map((line, i) => (
          <span className="heading-mask" key={i}>
            <span data-heading-line>{line}</span>
            {i < lines.length - 1 && <span className="sr-only"> </span>}
          </span>
        ))}
      </h2>
      {description && <p>{description}</p>}
    </div>
  );
}
