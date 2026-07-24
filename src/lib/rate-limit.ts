const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900_000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX ?? 100);

export function rateLimit(key: string, { windowMs = WINDOW_MS, max = MAX_REQUESTS }: { windowMs?: number; max?: number } = {}) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1 };
  }
  if (entry.count >= max) return { success: false, remaining: 0 };
  entry.count += 1;
  return { success: true, remaining: max - entry.count };
}

export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
