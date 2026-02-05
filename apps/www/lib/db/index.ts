import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "../env";
import { DatabaseError } from "../errors";
import { logger } from "../logger";
import * as schema from "./schema";

function createDatabaseClient() {
  try {
    // Use Turso in production, local SQLite in development
    const url = env.TURSO_DATABASE_URL || "file:local.db";
    const authToken = env.TURSO_AUTH_TOKEN;

    logger.info("Initializing database connection", { url: url.replace(/:[^:]*@/, ":***@") });

    const client = createClient({
      url,
      authToken,
    });

    return drizzle(client, { schema });
  } catch (error) {
    logger.error("Failed to initialize database", error);
    throw new DatabaseError("Database initialization failed");
  }
}

export const db = createDatabaseClient();
