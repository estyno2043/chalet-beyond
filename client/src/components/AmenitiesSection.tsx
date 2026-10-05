import { useEffect, useRef } from "react";
import { useT } from "@/i18n/LanguageProvider";
import { AMENITIES, usePremiumCopy } from "./premium/copy";
import { SectionHeader } from "./premium/SectionHeader";
import { RevealPhoto } from "./premium/Photo";
/** Stagger between important rows that arrive in the same frame. */
const SEK_STAGGER = 90;
export function AmenitiesSection() {
  const t = useT();
  const c = usePremiumCopy();
  const list = useRef<HTMLUListElement>(null);
  // Important rows flicker once as each scrolls into view; text stays static
  // otherwise. The class is removed when the flicker ends.
  useEffect(() => {
    const rows =
      list.current?.querySelectorAll<HTMLElement>("[data-important]");
    if (
      !rows?.length ||
      typeof IntersectionObserver === "undefined" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const done = new AbortController();
    const observer = new IntersectionObserver(
      entries => {
        entries
          .filter(entry => entry.isIntersecting)
          .forEach((entry, i) => {
            const row = entry.target as HTMLElement;
            observer.unobserve(row);
            row.style.setProperty("--sek-delay", `${i * SEK_STAGGER}ms`);
            row.classList.add("is-glitching");
            row.addEventListener(
              "animationend",
              event => {
                if (event.animationName === "amenity-sek")
                  row.classList.remove("is-glitching");
              },
              { signal: done.signal }
            );
          });
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    rows.forEach(row => observer.observe(row));
    return () => {
      observer.disconnect();
      done.abort();
    };
  }, []);
  return (
    <section id="vybavenie" className="premium-section amenities-section">
      <div className="container">
        <SectionHeader lines={c.amenities} description={c.amenitiesBody} />
        <div className="featured-amenities">
          {[58, 33, 44].map((id, i) => (
            <figure key={id}>
              <RevealPhoto
                id={id}
                className={`featured-amenity--${id}`}
                sizes="(min-width: 768px) 30vw, 100vw"
              />
              <figcaption>
                <h3>{c.featured[i]}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
        <ul ref={list} className="amenities-list">
          {AMENITIES.map(({ key, important }) => {
            const text = t.amenities.items[key];
            return important ? (
              <li key={key} data-important="" data-text={text}>
                <span>{text}</span>
              </li>
            ) : (
              <li key={key}>{text}</li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
