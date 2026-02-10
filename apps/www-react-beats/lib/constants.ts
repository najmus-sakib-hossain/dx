export const APP_NAME = "Modern Stack";
export const APP_DESCRIPTION =
  "Next.js 16 with React Query, Framer Motion, Drizzle ORM, Zustand, Better Auth, PGlite, Spline, and shadcn/ui";

// Rate limiting
export const RATE_LIMIT = {
  API: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 100, // 100 requests per minute
  },
  AUTH: {
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
  },
};

// Validation limits
export const VALIDATION_LIMITS = {
  POST_TITLE_MAX: 200,
  POST_BODY_MAX: 10000,
  NOTE_TITLE_MAX: 200,
  NOTE_CONTENT_MAX: 5000,
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 100,
};

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};
