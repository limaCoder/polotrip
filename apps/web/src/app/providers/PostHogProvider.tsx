"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

/**
 * PostHog PageView tracker (official Next.js App Router integration)
 * Ref: https://posthog.com/docs/libraries/next-js
 */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url += `?${searchParams.toString()}`;
      }
      // PostHog captures automatically, but we capture it manually to add custom properties
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const optOutFromStorage =
      localStorage.getItem("posthog_opt_out") === "true";
    const hasDeclinedCookie = document.cookie.includes(
      "cookieConsent=declined"
    );
    const hasAcceptedCookie = document.cookie.includes("cookieConsent=true");

    const shouldOptOut =
      optOutFromStorage || hasDeclinedCookie || !hasAcceptedCookie;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2025-05-24",
      capture_pageview: false,
      capture_pageleave: true,
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
      opt_out_capturing_by_default: shouldOptOut,
      capture_performance: false,
    });

    if (shouldOptOut) {
      localStorage.setItem("posthog_opt_out", "true");
      posthog.opt_out_capturing();
    } else if (hasAcceptedCookie) {
      localStorage.setItem("posthog_opt_out", "false");
      posthog.opt_in_capturing();
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
