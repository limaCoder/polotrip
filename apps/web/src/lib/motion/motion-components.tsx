'use client';

import { motion, MotionProps } from 'motion/react';
import { cn } from '@/lib/cn';

export const MotionDiv = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.div {...props} className={cn(className)}>
      {children}
    </motion.div>
  );
};

export const MotionSection = ({
  children,
  className,
  id,
  ...props
}: { children: React.ReactNode; className?: string; id?: string } & MotionProps) => {
  return (
    <motion.section {...props} className={cn(className)} id={id}>
      {children}
    </motion.section>
  );
};

export const MotionListItem = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.li {...props} className={cn(className)}>
      {children}
    </motion.li>
  );
};

export const MotionHeadlineOne = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.h1 {...props} className={cn(className)}>
      {children}
    </motion.h1>
  );
};

export const MotionHeadlineTwo = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.h2 {...props} className={cn(className)}>
      {children}
    </motion.h2>
  );
};

export const MotionHeadlineThree = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.h3 {...props} className={cn(className)}>
      {children}
    </motion.h3>
  );
};

export const MotionHeadlineFour = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.h4 {...props} className={cn(className)}>
      {children}
    </motion.h4>
  );
};

export const MotionHeadlineFive = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.h5 {...props} className={cn(className)}>
      {children}
    </motion.h5>
  );
};

export const MotionParagraph = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.p {...props} className={cn(className)}>
      {children}
    </motion.p>
  );
};

export const MotionSpan = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.span {...props} className={cn(className)}>
      {children}
    </motion.span>
  );
};

export const MotionButton = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.button {...props} className={cn(className)}>
      {children}
    </motion.button>
  );
};

export const MotionForm = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & MotionProps) => {
  return (
    <motion.form {...props} className={cn(className)}>
      {children}
    </motion.form>
  );
};
