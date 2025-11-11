import { Redis } from "@upstash/redis";
import { env } from "@/env";

class RedisService {
  private readonly redis: Redis | null;
  private readonly DEFAULT_TTL_SECONDS = 900;

  constructor() {
    this.redis = this.initializeRedis();
  }

  private initializeRedis(): Redis | null {
    try {
      if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
        return new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        });
      }
      return null;
    } catch {
      return null;
    }
  }

  private isEnabled(): boolean {
    return this.redis !== null;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled()) return null;

    try {
      const data = await this.redis!.get(key);
      return data as T | null;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.isEnabled()) return;

    try {
      const ttlToUse = ttl ?? this.DEFAULT_TTL_SECONDS;
      await this.redis!.set(key, value, { ex: ttlToUse });
    } catch {
      // Cache write failed, fail silently
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isEnabled()) return;

    try {
      await this.redis!.del(key);
    } catch {
      // Cache deletion failed, fail silently
    }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.isEnabled()) return;

    try {
      let cursor = 0;

      do {
        const [nextCursor, keys] = await this.redis!.scan(cursor, {
          match: pattern,
          count: 100,
        });

        cursor = Number(nextCursor);

        if (keys.length > 0) {
          await this.redis!.del(...keys);
        }
      } while (cursor !== 0);
    } catch {
      // Cache pattern deletion failed, fail silently
    }
  }
}

export const redisService = new RedisService();
