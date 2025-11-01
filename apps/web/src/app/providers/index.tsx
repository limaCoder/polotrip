import type { ReactNode } from 'react';
import { TanstackQueryProvider } from './tanstack-query';
import { PostHogProvider } from './PostHogProvider';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <PostHogProvider>
      <TanstackQueryProvider>{children}</TanstackQueryProvider>
    </PostHogProvider>
  );
}
