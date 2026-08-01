import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | null | undefined;

function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    limiter = null;
    return limiter;
  }

  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    prefix: "hom",
  });
  return limiter;
}

/**
 * Returns true if the request should proceed. Fails open (returns true)
 * when Upstash isn't configured, so local dev works without it.
 */
export async function checkRateLimit(
  key: string,
): Promise<{ success: boolean; remaining: number }> {
  const rl = getLimiter();
  if (!rl) return { success: true, remaining: Infinity };

  const result = await rl.limit(key);
  return { success: result.success, remaining: result.remaining };
}
