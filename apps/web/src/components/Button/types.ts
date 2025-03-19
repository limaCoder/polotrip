import { ComponentProps, ReactNode } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  children: ReactNode;
  className?: string;
}

export type { ButtonProps };
