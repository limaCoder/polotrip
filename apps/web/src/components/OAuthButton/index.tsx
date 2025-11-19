"use client";

import { Check, Copy, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Button as UiButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [showWebViewDialog, setShowWebViewDialog] = useState(false);

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
            capture("sign_in_webview_detected", {
              provider,
              locale,
              userAgent:
                typeof window !== "undefined"
                  ? window.navigator.userAgent
                  : "unknown",
            });

            openInExternalBrowser(window.location.href);

            setShowWebViewDialog(true);

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

      <WebViewDialog
        currentUrl={typeof window !== "undefined" ? window.location.href : ""}
        onOpenChange={setShowWebViewDialog}
        open={showWebViewDialog}
      />
    </Button>
  );
}

function WebViewDialog({
  open,
  onOpenChange,
  currentUrl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUrl: string;
}) {
  const [linkCopied, setLinkCopied] = useState(false);
  const t = useTranslations("SignIn");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setLinkCopied(true);
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setLinkCopied(true);
        setTimeout(() => {
          setLinkCopied(false);
        }, 2000);
      } catch {
        // Ignore
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("webview_dialog_title")}</DialogTitle>
          <DialogDescription>
            {t("webview_dialog_description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted p-3">
            <p className="break-all font-mono text-sm">{currentUrl}</p>
          </div>
          <p className="text-muted-foreground text-sm">
            {t("webview_dialog_open_manually")}
          </p>
        </div>
        <DialogFooter>
          <UiButton
            className="w-full"
            onClick={handleCopyLink}
            type="button"
            variant="outline"
          >
            {linkCopied ? (
              <>
                <Check className="mr-2 size-4" />
                {t("webview_dialog_link_copied")}
              </>
            ) : (
              <>
                <Copy className="mr-2 size-4" />
                {t("webview_dialog_copy_link")}
              </>
            )}
          </UiButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
