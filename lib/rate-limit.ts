/**
 * Minimal in-memory rate limiter (sliding window).
 * Good enough for a single-instance deployment (Vercel serverless resets are
 * acceptable for v1). For multi-instance scale, move to Upstash/Redis.
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export function rateLimit(
  key: string,
  maxRequests: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };

  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

  if (bucket.timestamps.length >= maxRequests) {
    buckets.set(key, bucket);
    const oldest = bucket.timestamps[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + WINDOW_MS - now) / 1000)
    );
    return { allowed: false, retryAfterSeconds };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Extract a rate-limit key from the request (IP first, auth id second). */
export function rateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

/** Occasionally prune stale buckets to avoid unbounded memory growth. */
setInterval(
  () => {
    const now = Date.now();
    buckets.forEach((bucket, key) => {
      bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);
      if (bucket.timestamps.length === 0) buckets.delete(key);
    });
  },
  30 * 60 * 1000
).unref?.();
