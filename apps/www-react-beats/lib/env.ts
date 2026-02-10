import { z } from "zod";

const envSchema = z.object({
  // Database
  TURSO_DATABASE_URL: z.string().url().optional(),
  TURSO_AUTH_TOKEN: z.string().optional(),

  // Auth
  BETTER_AUTH_SECRET: z.string().min(32, "Auth secret must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),

  // OAuth (optional)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Node env
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

type EnvSchema = z.infer<typeof envSchema>;

function validateEnv(): EnvSchema {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err) => `${err.path.join(".")}: ${err.message}`);
      throw new Error(
        `❌ Invalid environment variables:\n${missingVars.join("\n")}\n\nPlease check your .env.local file.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
