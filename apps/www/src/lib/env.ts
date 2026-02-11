import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  BETTER_AUTH_SECRET: z.string().min(1).optional(),
  BETTER_AUTH_WEBHOOK_SECRET: z.string().min(1).optional(),
  SOCKET_SECRET: z.string().min(1).optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
  ALGOLIA_ADMIN_KEY: z.string().min(1).optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("DX"),
  NEXT_PUBLIC_SOCKET_URL: z.string().url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: z.string().min(1).optional(),
});

const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_WEBHOOK_SECRET: process.env.BETTER_AUTH_WEBHOOK_SECRET,
  SOCKET_SECRET: process.env.SOCKET_SECRET,
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  ALGOLIA_ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
};

// Safe parse so we don't crash immediately during build if vars are missing,
// but we can check `env.success` or similar if we wanted to enforce strictly.
// For now, we'll try to parse and export the typed env.
// Note: In Next.js middleware or edge, this might behave differently.
// A robust env validation usually throws on invalid env.

const parsedServer = serverEnvSchema.safeParse(processEnv);
const parsedClient = clientEnvSchema.safeParse(processEnv);

if (!parsedServer.success) {
  console.error(
    "❌ Invalid server environment variables:",
    parsedServer.error.flatten().fieldErrors,
  );
  // throw new Error("Invalid server environment variables");
}

if (!parsedClient.success) {
  console.error(
    "❌ Invalid client environment variables:",
    parsedClient.error.flatten().fieldErrors,
  );
  // throw new Error("Invalid client environment variables");
}

export const env = {
  ...parsedServer.data,
  ...parsedClient.data,
} as z.infer<typeof serverEnvSchema> & z.infer<typeof clientEnvSchema>;
