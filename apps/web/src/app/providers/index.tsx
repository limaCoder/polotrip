import { type ReactNode, Suspense } from "react";
import { PostHogProvider } from "./PostHogProvider";
import { TanstackQueryProvider } from "./tanstack-query";
import { ThemeProvider } from "./theme-provider";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Suspense>
        <PostHogProvider>
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </PostHogProvider>
      </Suspense>
    </ThemeProvider>
  );
}
