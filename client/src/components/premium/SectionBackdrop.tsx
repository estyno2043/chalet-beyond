import type { ReactNode } from "react";
import { Photo } from "./Photo";

/**
 * Decorative low-opacity photograph behind a section's content. The host
 * section must be `position: relative; isolation: isolate`. Opacity and
 * framing are set per section in premium.css; `children` layer over the photo.
 */
export function SectionBackdrop({
  photoId,
  className = "",
  children,
}: {
  photoId: number;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`section-backdrop ${className}`} aria-hidden="true">
      <Photo
        id={photoId}
        alt=""
        sizes="100vw"
        className="section-backdrop__photo"
      />
      {children}
    </div>
  );
}
