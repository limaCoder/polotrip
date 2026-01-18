import { redisService } from "@/services/cache/redis-service";

const CHAT_RATE_LIMIT = 15;
const RATE_LIMIT_TTL_SECONDS = 86_400; // 24 hours

export async function checkChatRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  limit: number;
  current: number;
}> {
  const today = new Date().toISOString().split("T")[0];
  const key = `chat:rate-limit:${userId}:${today}`;

  const current = await redisService.increment(key, RATE_LIMIT_TTL_SECONDS);

  const remaining = Math.max(0, CHAT_RATE_LIMIT - current);
  const allowed = current <= CHAT_RATE_LIMIT;

  const resetAt = new Date();
  resetAt.setHours(24, 0, 0, 0);

  return {
    allowed,
    remaining,
    resetAt,
    limit: CHAT_RATE_LIMIT,
    current,
  };
}
