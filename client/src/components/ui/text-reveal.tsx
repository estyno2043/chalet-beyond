"use client";
/**
 * TextRevealByWord — Chalet Beyond adaptation
 * Scroll-driven word-by-word reveal using Framer Motion
 * Colors: dark background, amber/cream text reveal
 * Source: magicui/text-reveal
 */

import { FC, ReactNode, useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.9", "end 0.3"],
  });

  const words = text.split(" ");

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[180vh]", className)} style={{ position: "relative" }}>
      <div className="sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center bg-transparent px-[1.5rem] py-[5rem]">
        <p
          className="flex flex-wrap gap-y-1 p-5 text-2xl font-bold md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl"
          style={{ fontFamily: "'Karla', sans-serif", fontWeight: 300, lineHeight: 1.4 }}
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  // Slight upward movement as word reveals
  const y = useTransform(progress, range, [8, 0]);

  return (
    <span className="relative mx-1 lg:mx-2">
      {/* Ghost text — dim amber placeholder */}
      <span
        className="absolute"
        style={{ color: "oklch(0.72 0.12 65 / 0.18)" }}
      >
        {children}
      </span>
      {/* Revealed text — bright cream */}
      <motion.span
        style={{
          opacity,
          y,
          color: "oklch(0.88 0.012 75)",
        }}
      >
        {children}
      </motion.span>
    </span>
  );
};

export { TextRevealByWord };
