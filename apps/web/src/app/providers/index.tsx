import type { ReactNode } from 'react';
import { TanstackQueryProvider } from './tanstack-query';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return <TanstackQueryProvider>{children}</TanstackQueryProvider>;
}
