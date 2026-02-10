'use client';

import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;
let pg: PGlite | null = null;
let initPromise: Promise<ReturnType<typeof drizzle>> | null = null;

export async function getDb(): Promise<ReturnType<typeof drizzle> | null> {
  if (typeof window === 'undefined') return null;
  if (db) return db;

  // Prevent concurrent initialization
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Initialize PGlite with IndexedDB persistence
      pg = new PGlite('idb://dx-icons-db');

      // Wait for PGlite to be ready (handled implicitly by exec, but safer with explicit check)
      await pg.waitReady;

      // Create tables if they don't exist
      await pg.exec(`
        CREATE TABLE IF NOT EXISTS icon_packs (
          name TEXT PRIMARY KEY,
          icon_count INTEGER NOT NULL,
          icons TEXT NOT NULL,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS icon_cache (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          expires_at TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS favorites (
          id SERIAL PRIMARY KEY,
          svg_id INTEGER NOT NULL UNIQUE,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          route TEXT NOT NULL,
          wordmark TEXT,
          brand_url TEXT,
          url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
        
        CREATE INDEX IF NOT EXISTS idx_favorites_svg_id ON favorites(svg_id);
      `);

      db = drizzle(pg, { schema });
      return db;
    } catch (error) {
      // Reset state so we can try again
      initPromise = null;
      pg = null;
      db = null;
      console.error('Failed to initialize PGlite:', error);
      throw error;
    }
  })();

  return initPromise;
}

export async function getRawPg(): Promise<PGlite | null> {
  if (typeof window === 'undefined') return null;
  await getDb();
  return pg;
}

export async function clearCache() {
  const database = await getDb();
  if (!database) return;
  await database.delete(schema.iconPacks);
  await database.delete(schema.iconCache);
}
