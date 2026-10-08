import { LineShadowText } from "@/components/ui/line-shadow-text";

/**
 * Section heading, one masked line per entry. No reveal of its own: a
 * one-shot reveal fired ~100px after the heading was already on screen, so
 * guests saw it, lost it and saw it fade back in. Scroll-linked motion (the
 * intro's drop-in, hero-handoff.css) is set per section in CSS instead.
 */
export function SectionHeader({
  lines,
  description,
  className = "",
  lineShadow,
}: {
  lines: string[];
  description?: string;
  className?: string;
  /** Colour of a Magic UI line shadow drawn behind each heading line. */
  lineShadow?: string;
}) {
  return (
    <div className={`section-header ${className}`}>
      <h2>
        {lines.map((line, i) => (
          <span className="heading-mask" key={i}>
            <span data-heading-line>
              {lineShadow ? (
                <LineShadowText shadowColor={lineShadow}>{line}</LineShadowText>
              ) : (
                line
              )}
            </span>
            {i < lines.length - 1 && <span className="sr-only"> </span>}
          </span>
        ))}
      </h2>
      {description && <p>{description}</p>}
    </div>
  );
}
