'use client';

import { cn } from '@/lib/cn';
import { ButtonNavigationProps } from './types';
import { Link } from '@/i18n/routing';

export function ButtonNavigation({
  href,
  className = '',
  children,
  ...rest
}: ButtonNavigationProps) {
  return (
    <Link
      {...rest}
      href={href}
      className={cn(
        `flex items-center justify-center gap-2 px-4 py-4 text-center rounded-[10px] transition-all ease-in-out duration-300 hover:brightness-110 font-bold`,
        className,
      )}
    >
      {children}
    </Link>
  );
}
