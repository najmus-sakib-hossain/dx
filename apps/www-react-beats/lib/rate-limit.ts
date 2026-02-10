interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique tokens per interval
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export class RateLimitError extends Error {
  constructor(public retryAfter: number) {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (identifier: string): { success: boolean; remaining: number; reset: number } => {
      const now = Date.now();
      const tokenData = store.get(identifier);

      if (!tokenData || now > tokenData.resetTime) {
        // Create new or reset expired token
        store.set(identifier, {
          count: 1,
          resetTime: now + config.interval,
        });
        return {
          success: true,
          remaining: config.uniqueTokenPerInterval - 1,
          reset: now + config.interval,
        };
      }

      if (tokenData.count >= config.uniqueTokenPerInterval) {
        return {
          success: false,
          remaining: 0,
          reset: tokenData.resetTime,
        };
      }

      tokenData.count++;
      return {
        success: true,
        remaining: config.uniqueTokenPerInterval - tokenData.count,
        reset: tokenData.resetTime,
      };
    },
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 60000); // Cleanup every minute
