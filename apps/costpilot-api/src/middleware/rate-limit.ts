// Simple in-memory rate limiter for Hono
// Tracks request counts per IP. Resets after windowMs.

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

export function rateLimit(max: number = 10, windowMs: number = 60000) {
  return async (c: any, next: any) => {
    const ip = c.req.header("cf-connecting-ip")
      || c.req.header("x-forwarded-for")
      || "unknown";
    const now = Date.now();

    let entry = store.get(ip);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(ip, entry);
    }

    entry.count++;

    if (entry.count > max) {
      return c.json({ error: "Too many requests" }, 429);
    }

    await next();
  };
}
