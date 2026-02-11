// Placeholder DB setup - to be replaced with Midday's implementation
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/dx";
const client = postgres(connectionString);
export const db = drizzle(client);
