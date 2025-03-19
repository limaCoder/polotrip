import { cn } from '@/lib/cn';
import { ButtonProps } from './types';

export function Button({ className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      type="button"
      className={cn(
        `flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-4 text-center rounded-[10px] transition-all hover:brightness-110 font-bold`,
        className,
      )}
    >
      {children}
    </button>
  );
}
