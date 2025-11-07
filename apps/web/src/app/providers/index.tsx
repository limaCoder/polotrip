import type { ReactNode } from "react";
import { PostHogProvider } from "./PostHogProvider";
import { TanstackQueryProvider } from "./tanstack-query";
import { ThemeProvider } from "./theme-provider";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PostHogProvider>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </PostHogProvider>
    </ThemeProvider>
  );
}
