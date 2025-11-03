import { cn } from "@/lib/cn";
import type { ButtonProps } from "./types";

export function Button({ className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "flex items-center gap-2 rounded-[10px] px-4 py-2 text-center font-bold transition-all hover:brightness-110 sm:px-6 sm:py-4",
        className
      )}
    >
      {children}
    </button>
  );
}
