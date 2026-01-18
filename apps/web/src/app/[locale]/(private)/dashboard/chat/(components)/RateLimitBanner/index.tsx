"use client";

import { AlertCircle, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { RateLimitBannerProps } from "./types";
import { formatTimeUntilReset } from "./utils";

export function RateLimitBanner({
  remaining,
  limit,
  resetAt,
  timeUntilReset,
  isLimited,
}: RateLimitBannerProps) {
  const t = useTranslations("Chat.rate_limit");
  const [formattedTime, setFormattedTime] = useState(
    formatTimeUntilReset(timeUntilReset)
  );

  useEffect(() => {
    if (!timeUntilReset || timeUntilReset <= 0) {
      setFormattedTime("");
      return;
    }

    const updateTime = () => {
      setFormattedTime(formatTimeUntilReset(timeUntilReset));
    };

    updateTime();
    const interval = setInterval(updateTime, 60_000);

    return () => clearInterval(interval);
  }, [timeUntilReset]);

  if (remaining >= 5 && !isLimited) {
    return null;
  }

  const progress = (remaining / limit) * 100;
  const isWarning = remaining > 0 && remaining < 5;
  const isError = isLimited || remaining === 0;

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        isError
          ? "border-destructive bg-destructive/10"
          : "border-yellow-500/50 bg-yellow-500/10"
      )}
    >
      <div className="flex items-start gap-3">
        {isError ? (
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
        ) : (
          <Clock className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" />
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p
              className={cn(
                "font-medium text-sm",
                isError
                  ? "text-destructive"
                  : "text-yellow-600 dark:text-yellow-500"
              )}
            >
              {(() => {
                if (isLimited) return t("limit_reached");
                if (isWarning) return t("almost_limit");
                return t("title");
              })()}
            </p>
            <span
              className={cn(
                "font-bold text-sm",
                isError
                  ? "text-destructive"
                  : "text-yellow-600 dark:text-yellow-500"
              )}
            >
              {t("daily_limit", { current: remaining, limit })}
            </span>
          </div>

          {remaining > 0 && (
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    (() => {
                      if (isError) return "bg-destructive";
                      if (isWarning) return "bg-yellow-500";
                      return "bg-primary";
                    })()
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                {remaining === 1
                  ? t("prompts_remaining_one")
                  : t("prompts_remaining", { count: remaining })}
              </p>
            </div>
          )}

          {isLimited && resetAt && (
            <p className="text-muted-foreground text-xs">
              {formattedTime
                ? t("resets_at", { time: formattedTime })
                : t("resets_tomorrow")}
            </p>
          )}

          {isLimited && (
            <p className="text-muted-foreground text-xs">
              {t("try_again_later")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
