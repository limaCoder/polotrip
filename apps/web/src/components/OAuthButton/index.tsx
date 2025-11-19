"use client";

import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { usePostHog } from "@/hooks/usePostHog";
import { signIn } from "@/lib/auth/client";
import { env } from "@/lib/env";
import { isWebView, openInExternalBrowser } from "@/utils/detectWebView";
import type { OAuthButtonProps } from "./types";

export function OAuthButton({
  provider,
  children,
  ...props
}: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const locale = params?.locale as string;
  const { capture } = usePostHog();

  return (
    <Button
      className="w-full items-center justify-center rounded-lg border border-gray-400 px-6 py-2 font-normal hover:bg-gray-50 dark:hover:bg-transparent dark:hover:brightness-75"
      onClick={async () => {
        setIsLoading(true);

        capture("sign_in_started", {
          provider,
          locale,
        });

        try {
          if (isWebView()) {
            const callbackURL = encodeURIComponent(
              `${env.NEXT_PUBLIC_WEB_URL}/${locale}/dashboard`
            );
            const authUrl = `${env.NEXT_PUBLIC_WEB_URL}/api/v1/auth/social/${provider}?callbackURL=${callbackURL}`;

            capture("sign_in_webview_detected", {
              provider,
              locale,
              userAgent:
                typeof window !== "undefined"
                  ? window.navigator.userAgent
                  : "unknown",
            });

            openInExternalBrowser(authUrl);
            setIsLoading(false);
            return;
          }

          await signIn.social({
            provider,
            callbackURL: `${env.NEXT_PUBLIC_WEB_URL}/${locale}/dashboard`,
          });

          capture("sign_in_completed", {
            provider,
            locale,
          });
        } catch (error) {
          capture("sign_in_failed", {
            provider,
            locale,
            error_message:
              error instanceof Error ? error.message : "Unknown error",
          });
          setIsLoading(false);
        }
      }}
      type="button"
      {...props}
    >
      {children}

      {isLoading ? <Loader2 className="size-5 animate-spin" /> : null}
    </Button>
  );
}
