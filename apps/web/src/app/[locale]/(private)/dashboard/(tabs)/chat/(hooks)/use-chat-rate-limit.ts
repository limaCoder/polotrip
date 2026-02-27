"use client";

import { useEffect, useState } from "react";

const DETAILS_REGEX = /"details":\s*({[^}]+(?:"[^}]+":\s*"[^}]+")*[^}]*})/;
const SIMPLE_DETAILS_REGEX =
  /"remaining":\s*(\d+).*"limit":\s*(\d+).*"resetAt":\s*"([^"]+)"/;

type RateLimitInfo = {
  remaining: number;
  limit: number;
  resetAt: Date | null;
  isLimited: boolean;
  timeUntilReset: number | null;
};

function getTomorrowMidnight(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export function useChatRateLimit(error: Error | null): RateLimitInfo {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    remaining: 15,
    limit: 15,
    resetAt: null,
    isLimited: false,
    timeUntilReset: null,
  });

  useEffect(() => {
    if (!error) {
      setRateLimitInfo({
        remaining: 15,
        limit: 15,
        resetAt: null,
        isLimited: false,
        timeUntilReset: null,
      });
      return;
    }

    const errorMessage = error.message || "";
    const errorString = JSON.stringify(error);
    const errorAny = error as { cause?: unknown; response?: unknown };

    const isRateLimitError =
      errorMessage.includes("limite") ||
      errorMessage.includes("limit") ||
      errorMessage.includes("429") ||
      errorString.includes("CHAT_RATE_LIMIT_EXCEEDED") ||
      errorString.includes("TOO_MANY_REQUESTS") ||
      errorString.includes("429");

    if (!isRateLimitError) {
      return;
    }

    try {
      let details: {
        remaining?: number;
        limit?: number;
        resetAt?: string;
      } = {};

      if (errorAny.cause && typeof errorAny.cause === "object") {
        const causeAny = errorAny.cause as {
          error?: { details?: unknown };
          response?: { error?: { details?: unknown } };
        };

        if (
          causeAny.error?.details &&
          typeof causeAny.error.details === "object"
        ) {
          const errorDetails = causeAny.error.details as {
            remaining?: number;
            limit?: number;
            resetAt?: string;
          };
          details = {
            remaining: errorDetails.remaining ?? 0,
            limit: errorDetails.limit ?? 15,
            resetAt: errorDetails.resetAt,
          };
        }

        if (
          causeAny.response?.error?.details &&
          typeof causeAny.response.error.details === "object"
        ) {
          const responseDetails = causeAny.response.error.details as {
            remaining?: number;
            limit?: number;
            resetAt?: string;
          };
          details = {
            remaining: responseDetails.remaining ?? details.remaining ?? 0,
            limit: responseDetails.limit ?? details.limit ?? 15,
            resetAt: responseDetails.resetAt ?? details.resetAt,
          };
        }
      }

      const hasDetailsFromCause =
        details.remaining !== undefined || details.limit !== undefined;

      if (errorString.includes("details") && !hasDetailsFromCause) {
        const detailsMatch = errorString.match(DETAILS_REGEX);
        if (detailsMatch) {
          try {
            const parsed = JSON.parse(detailsMatch[1]) as {
              remaining?: number;
              limit?: number;
              resetAt?: string;
            };
            details = {
              remaining: parsed.remaining ?? details.remaining ?? 0,
              limit: parsed.limit ?? details.limit ?? 15,
              resetAt: parsed.resetAt ?? details.resetAt,
            };
          } catch {
            const simpleMatch = errorString.match(SIMPLE_DETAILS_REGEX);
            if (simpleMatch) {
              details = {
                remaining: Number(simpleMatch[1]) ?? details.remaining ?? 0,
                limit: Number(simpleMatch[2]) ?? details.limit ?? 15,
                resetAt: simpleMatch[3] ?? details.resetAt,
              };
            }
          }
        }
      }

      const remaining = details.remaining ?? 0;
      const limit = details.limit ?? 15;
      const resetAt = details.resetAt
        ? new Date(details.resetAt)
        : getTomorrowMidnight();

      const now = new Date();
      const timeUntilReset = Math.max(0, resetAt.getTime() - now.getTime());

      setRateLimitInfo({
        remaining,
        limit,
        resetAt,
        isLimited: remaining === 0,
        timeUntilReset: timeUntilReset > 0 ? timeUntilReset : null,
      });
    } catch {
      const resetAt = getTomorrowMidnight();
      const now = new Date();
      const timeUntilReset = Math.max(0, resetAt.getTime() - now.getTime());

      setRateLimitInfo({
        remaining: 0,
        limit: 15,
        resetAt,
        isLimited: true,
        timeUntilReset: timeUntilReset > 0 ? timeUntilReset : null,
      });
    }
  }, [error]);

  useEffect(() => {
    if (!rateLimitInfo.timeUntilReset || rateLimitInfo.timeUntilReset <= 0) {
      return;
    }

    const interval = setInterval(() => {
      if (!rateLimitInfo.resetAt) return;

      const now = new Date();
      const timeUntilReset = Math.max(
        0,
        rateLimitInfo.resetAt.getTime() - now.getTime()
      );

      setRateLimitInfo((prev) => ({
        ...prev,
        timeUntilReset: timeUntilReset > 0 ? timeUntilReset : null,
        isLimited: timeUntilReset > 0 && prev.remaining === 0,
      }));

      if (timeUntilReset <= 0) {
        setRateLimitInfo((prev) => ({
          ...prev,
          remaining: 15,
          limit: 15,
          isLimited: false,
          timeUntilReset: null,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimitInfo.resetAt, rateLimitInfo.timeUntilReset]);

  return rateLimitInfo;
}
