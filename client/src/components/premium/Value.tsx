import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";
import { LineShadowText } from "@/components/ui/line-shadow-text";
export function Value({
  value,
  lineShadow,
}: {
  value: string | number;
  /** Colour of a Magic UI line shadow drawn behind the value. */
  lineShadow?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className="changing-value">
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={value}
          initial={{
            opacity: 0,
            y: reduce ? 0 : 8,
            filter: reduce ? "none" : "blur(1.5px)",
          }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            y: reduce ? 0 : -8,
            filter: reduce ? "none" : "blur(1.5px)",
          }}
          transition={{ duration: DUR.state, ease: EASE.enter }}
        >
          {lineShadow ? (
            <LineShadowText
              shadowColor={lineShadow}
            >{`${value}`}</LineShadowText>
          ) : (
            value
          )}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
