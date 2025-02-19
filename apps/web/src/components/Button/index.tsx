import { cn } from '@/lib/cn';
import React, { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'a'> {
  text: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Button({ text, href, icon, className = '', ...rest }: ButtonProps) {
  return (
    <a
      {...rest}
      href={href}
      className={cn(
        `flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-4 text-center rounded-[10px] transition-all hover:brightness-110 font-bold`,
        className,
      )}
    >
      {text}
      {icon && <span>{icon}</span>}
    </a>
  );
}
