import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";
export function Value({ value }: { value: string | number }) {
  const reduce = useReducedMotion();
  return (
    <span className="changing-value">
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={value}
          initial={{
            opacity: 0,
            y: reduce ? 0 : 4,
            filter: reduce ? "none" : "blur(2px)",
          }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.state, ease: EASE.ui }}
        >
          {value}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
