/*
 * CHALET BEYOND — FadeUp Component
 * Reusable Framer Motion scroll-triggered fade-up animation
 * ease: [0.23, 1, 0.32, 1] — expo out, snappy and physical
 */
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export function FadeUp({
  children,
  delay = 0,
  duration = 0.7,
  y = 40,
  className,
  once = true,
  threshold = 0.05,
}: FadeUpProps) {
  const { ref, isInView } = useScrollAnimation(threshold, once);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration,
        delay,
        ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  threshold = 0.05,
}: StaggerContainerProps) {
  const { ref, isInView } = useScrollAnimation(threshold, true);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
          duration: 0.65,
          ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
        },
  },
};
