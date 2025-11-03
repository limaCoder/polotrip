import type { ReactNode } from "react";
import { PostHogProvider } from "./PostHogProvider";
import { TanstackQueryProvider } from "./tanstack-query";

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
