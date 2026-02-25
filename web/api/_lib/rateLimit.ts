import type { RateLimitResult } from "./types";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean stale entries every 5 minutes
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

/**
 * Check rate limit for a given key.
 * Uses in-memory map with TTL windows.
 */
export function checkRateLimit(
  key: string,
  maxRequests = 30,
  windowMs = 60_000
): RateLimitResult {
  cleanup();

  const now = Date.now();
  let entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Get rate limit key from request IP and optional wallet address.
 */
export function getRateLimitKey(ip: string, address?: string): string {
  if (address) return `addr:${address.toLowerCase()}`;
  return `ip:${ip}`;
}

/**
 * Apply rate limit headers to response.
 */
export function setRateLimitHeaders(res: any, result: RateLimitResult) {
  res.setHeader("X-RateLimit-Remaining", result.remaining.toString());
  res.setHeader("X-RateLimit-Reset", Math.ceil(result.resetAt / 1000).toString());
}

/**
 * Enforce rate limit. Returns true if allowed, sends 429 if not.
 */
export function enforceRateLimit(
  req: any,
  res: any,
  maxRequests = 30,
  windowMs = 60_000
): boolean {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  const address = req.headers["x-wallet-address"] as string | undefined;
  const key = getRateLimitKey(ip, address);
  const result = checkRateLimit(key, maxRequests, windowMs);

  setRateLimitHeaders(res, result);

  if (!result.allowed) {
    res.status(429).json({
      error: "Too Many Requests",
      message: `Rate limit exceeded. Try again at ${new Date(result.resetAt).toISOString()}`,
      retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
    });
    return false;
  }

  return true;
}
