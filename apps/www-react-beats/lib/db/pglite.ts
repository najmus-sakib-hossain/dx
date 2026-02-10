import { PGlite } from "@electric-sql/pglite";

// Browser-side PostgreSQL database
let pgliteInstance: PGlite | null = null;

export async function getPGlite() {
  if (typeof window === "undefined") {
    throw new Error("PGlite can only be used in the browser");
  }

  if (!pgliteInstance) {
    pgliteInstance = new PGlite();

    // Initialize tables
    await pgliteInstance.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  return pgliteInstance;
}
