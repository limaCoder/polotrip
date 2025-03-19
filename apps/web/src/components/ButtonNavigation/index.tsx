import { cn } from '@/lib/cn';
import { ButtonNavigationProps } from './types';

export function ButtonNavigation({
  href,
  className = '',
  children,
  ...rest
}: ButtonNavigationProps) {
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
