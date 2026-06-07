import { useInView } from "framer-motion";
import { useRef } from "react";

export function useScrollAnimation(threshold = 0.15, once = true) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: threshold, once });
  return { ref, isInView };
}
