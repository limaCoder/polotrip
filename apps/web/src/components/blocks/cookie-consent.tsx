/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: cognitive complexity is used for the cookie consent component */
/** biome-ignore-all lint/suspicious/noConsole: console.error is used for debugging */
/** biome-ignore-all lint/nursery/noReactForwardRef: biome does not support forwardRef */
"use client";

import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import posthog from "posthog-js";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { setCookie } from "@/lib/cookies";

interface CookieConsentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "small" | "mini";
  demo?: boolean;
  onAcceptCallback?: () => void;
  onDeclineCallback?: () => void;
  description?: string;
  learnMoreHref?: string;
}

const CookieConsent = React.forwardRef<HTMLDivElement, CookieConsentProps>(
  (
    {
      variant = "default",
      demo = false,
      onAcceptCallback = () => {},
      onDeclineCallback = () => {},
      className,
      description,
      learnMoreHref,
      ...props
    },
    ref
  ) => {
    const t = useTranslations("CookieConsent");
    const [isOpen, setIsOpen] = React.useState(false);
    const [hide, setHide] = React.useState(false);

    const finalDescription = description || t("description");
    const finalLearnMoreHref = learnMoreHref || "/privacy-policy";

    const handleAccept = React.useCallback(() => {
      setIsOpen(false);
      const expiresDate = new Date("Fri, 31 Dec 9999 23:59:59 GMT");
      setCookie("cookieConsent", "true", expiresDate);
      localStorage.setItem("posthog_opt_out", "false");

      if (typeof posthog !== "undefined" && posthog) {
        posthog.opt_in_capturing();
      }

      setTimeout(() => {
        setHide(true);
      }, 700);
      onAcceptCallback();
    }, [onAcceptCallback]);

    const handleDecline = React.useCallback(() => {
      setIsOpen(false);
      const expiresDate = new Date("Fri, 31 Dec 9999 23:59:59 GMT");
      setCookie("cookieConsent", "declined", expiresDate);
      localStorage.setItem("posthog_opt_out", "true");

      if (typeof posthog !== "undefined" && posthog) {
        posthog.opt_out_capturing();
        posthog.reset();
      }

      setTimeout(() => {
        setHide(true);
      }, 700);
      onDeclineCallback();
    }, [onDeclineCallback]);

    React.useEffect(() => {
      try {
        const hasConsent = document.cookie.includes("cookieConsent=true");
        const hasDeclined = document.cookie.includes("cookieConsent=declined");

        if ((hasConsent || hasDeclined) && !demo) {
          setIsOpen(false);
          setTimeout(() => {
            setHide(true);
          }, 700);

          // Sync PostHog opt-out status based on cookie
          if (hasDeclined) {
            localStorage.setItem("posthog_opt_out", "true");
            if (typeof posthog !== "undefined" && posthog) {
              posthog.opt_out_capturing();
            }
          } else if (hasConsent) {
            localStorage.setItem("posthog_opt_out", "false");
            if (typeof posthog !== "undefined" && posthog) {
              posthog.opt_in_capturing();
            }
          }
        } else {
          setIsOpen(true);
        }
      } catch (error) {
        console.warn("Cookie consent error:", error);
      }
    }, [demo]);

    if (hide) return null;

    const containerClasses = cn(
      "fixed z-50 transition-all duration-700",
      isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
      className
    );

    const commonWrapperProps = {
      ref,
      className: cn(
        containerClasses,
        variant === "mini"
          ? "right-0 bottom-4 left-0 w-full sm:left-4 sm:max-w-3xl"
          : "right-0 bottom-0 left-0 w-full sm:bottom-4 sm:left-4 sm:max-w-md"
      ),
      ...props,
    };

    if (variant === "default") {
      return (
        <div {...commonWrapperProps}>
          <Card className="m-3 bg-background shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{t("title")}</CardTitle>
              <Cookie className="h-5 w-5" />
            </CardHeader>
            <CardContent className="space-y-2">
              <CardDescription className="text-sm">
                {finalDescription}
              </CardDescription>
              <p className="text-muted-foreground text-xs">
                {t("by_accepting")}
              </p>
              <a
                className="text-primary text-xs underline underline-offset-4 hover:no-underline"
                href={finalLearnMoreHref}
              >
                {t("learn_more")}
              </a>
            </CardContent>
            <CardFooter className="flex gap-2 pt-2">
              <Button
                className="flex-1 bg-yellow hover:bg-yellow/80"
                onClick={handleDecline}
              >
                {t("decline_button")}
              </Button>
              <Button className="flex-1 text-white" onClick={handleAccept}>
                {t("accept_button")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (variant === "small") {
      return (
        <div {...commonWrapperProps}>
          <Card className="m-3 bg-background shadow-lg">
            <CardHeader className="flex h-0 flex-row items-center justify-between space-y-0 px-4 pb-2">
              <CardTitle className="text-base">{t("title")}</CardTitle>
              <Cookie className="h-4 w-4" />
            </CardHeader>
            <CardContent className="px-4 pt-0 pb-2">
              <CardDescription className="text-sm">
                {finalDescription}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex h-0 gap-2 px-4 py-2">
              <Button
                className="flex-1 rounded-full bg-yellow hover:bg-yellow/80"
                onClick={handleDecline}
                size="sm"
              >
                {t("decline_button")}
              </Button>
              <Button
                className="flex-1 rounded-full text-white"
                onClick={handleAccept}
                size="sm"
              >
                {t("accept_button")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    if (variant === "mini") {
      return (
        <div {...commonWrapperProps}>
          <Card className="mx-3 bg-background p-0 py-3 shadow-lg">
            <CardContent className="grid gap-4 p-0 px-3.5 sm:flex">
              <CardDescription className="flex-1 text-xs sm:text-sm">
                {finalDescription}
              </CardDescription>
              <div className="flex items-center justify-end gap-2 sm:gap-3">
                <Button
                  className="h-7 bg-yellow text-xs hover:bg-yellow/80"
                  onClick={handleDecline}
                  size="sm"
                >
                  {t("decline_button")}
                  <span className="sr-only sm:hidden">
                    {t("decline_button")}
                  </span>
                </Button>
                <Button
                  className="h-7 text-white text-xs"
                  onClick={handleAccept}
                  size="sm"
                >
                  {t("accept_button")}
                  <span className="sr-only sm:hidden">
                    {t("accept_button")}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  }
);

CookieConsent.displayName = "CookieConsent";
export { CookieConsent };
export default CookieConsent;
