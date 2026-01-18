export type RateLimitBannerProps = {
  remaining: number;
  limit: number;
  resetAt: Date | null;
  timeUntilReset: number | null;
  isLimited: boolean;
};
