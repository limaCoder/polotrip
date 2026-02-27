/** biome-ignore-all lint/suspicious/noArrayIndexKey: biome does not support indexOf */
"use client";

import { motion, stagger, useAnimate } from "motion/react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  tag = "span",
  immediate = false,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  tag?: "span" | "h1" | "p";
  immediate?: boolean;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words?.split(" ");

  useEffect(() => {
    if (immediate) return;
    animate(
      tag,
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [animate, duration, filter, tag, immediate]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          if (tag === "h1") {
            return (
              <motion.h1
                className={cn(
                  "inline font-heading",
                  immediate ? "opacity-100" : "opacity-0"
                )}
                key={word + idx}
                style={{
                  filter: filter && !immediate ? "blur(10px)" : "none",
                }}
              >
                {word}{" "}
              </motion.h1>
            );
          }

          if (tag === "p") {
            return (
              <motion.p
                className={cn(
                  "mt-6 inline font-title_three",
                  immediate ? "opacity-100" : "opacity-0"
                )}
                key={word + idx}
                style={{
                  filter: filter && !immediate ? "blur(10px)" : "none",
                }}
              >
                {word}{" "}
              </motion.p>
            );
          }

          return (
            <motion.span
              className="inline font-heading text-gradient-primary opacity-0"
              key={word + idx}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div>{renderWords()}</div>
      </div>
    </div>
  );
};
