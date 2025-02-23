import { cn } from '@/lib/cn';
import { ComponentProps, ReactNode } from 'react';

interface ButtonProps extends ComponentProps<'a'> {
  href: string;
  children: ReactNode;
  className?: string;
}

export function Button({ href, className = '', children, ...rest }: ButtonProps) {
  return (
    <a
      {...rest}
      href={href}
      className={cn(
        `flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-4 text-center rounded-[10px] transition-all hover:brightness-110 font-bold`,
        className,
      )}
    >
      {children}
    </a>
  );
}
