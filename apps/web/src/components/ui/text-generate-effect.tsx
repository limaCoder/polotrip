'use client';

import { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'motion/react';
import { cn } from '@/lib/cn';

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  tag = 'span',
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  tag?: 'span' | 'h1' | 'p';
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words?.split(' ');

  useEffect(() => {
    animate(
      tag,
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none',
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      },
    );
  }, [animate, duration, filter, tag]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          if (tag === 'h1') {
            return (
              <motion.h1
                key={word + idx}
                className="font-heading text-gradient-primary opacity-0 inline"
                style={{
                  filter: filter ? 'blur(10px)' : 'none',
                }}
              >
                {word}{' '}
              </motion.h1>
            );
          }

          if (tag === 'p') {
            return (
              <motion.p
                key={word + idx}
                className="mt-6 font-title_three opacity-0 inline"
                style={{
                  filter: filter ? 'blur(10px)' : 'none',
                }}
              >
                {word}{' '}
              </motion.p>
            );
          }

          return (
            <motion.span
              key={word + idx}
              className="font-heading text-gradient-primary opacity-0 inline"
            >
              {word}{' '}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn('font-bold', className)}>
      <div className="mt-4">
        <div>{renderWords()}</div>
      </div>
    </div>
  );
};
