import { getRawPg } from './db/client';
import type { iSVG } from '@/types/svg';

interface FavoriteRow {
  svg_id: number;
  title: string;
  category: string;
  route: string;
  wordmark: string | null;
  brand_url: string | null;
  url: string;
}

export async function getFavorites(): Promise<iSVG[]> {
  const db = await getRawPg();
  if (!db) return [];

  const result = await db.query<FavoriteRow>('SELECT * FROM favorites ORDER BY created_at DESC');

  return (result.rows || []).map((row) => {
    // Helper to safely parse JSON or return the value if it's already an object or invalid string
    const safeParse = (val: string | null) => {
      if (!val) return null;
      try {
        // If it's already an object/array (some drivers do this), return it
        if (typeof val !== 'string') return val;
        // If it's a string that looks like a JSON string, parse it
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    };

    return {
      id: Number(row.svg_id),
      title: row.title,
      category: safeParse(row.category) || [],
      route: safeParse(row.route) || '',
      wordmark: row.wordmark ? safeParse(row.wordmark) : undefined,
      brandUrl: row.brand_url || undefined,
      url: row.url,
    };
  });
}

export async function addFavorite(svg: iSVG): Promise<void> {
  const db = await getRawPg();
  if (!db) return;

  await db.query(
    `INSERT INTO favorites (svg_id, title, category, route, wordmark, brand_url, url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (svg_id) DO NOTHING`,
    [
      svg.id,
      svg.title,
      JSON.stringify(svg.category),
      JSON.stringify(svg.route),
      svg.wordmark ? JSON.stringify(svg.wordmark) : null,
      svg.brandUrl || null,
      svg.url,
    ]
  );
}

export async function removeFavorite(svgId: number): Promise<void> {
  const db = await getRawPg();
  if (!db) return;

  await db.query('DELETE FROM favorites WHERE svg_id = $1', [svgId]);
}

export async function isFavorite(svgId: number): Promise<boolean> {
  const db = await getRawPg();
  if (!db) return false;

  const result = await db.query<{ count: string | number }>(
    'SELECT COUNT(*) as count FROM favorites WHERE svg_id = $1',
    [svgId]
  );
  if (!result.rows || result.rows.length === 0) return false;
  const count = result.rows[0].count;
  return (typeof count === 'string' ? parseInt(count) : count) > 0;
}

export async function clearAllFavorites(): Promise<void> {
  const db = await getRawPg();
  if (!db) return;

  await db.query('DELETE FROM favorites');
}

export async function getFavoritesCount(): Promise<number> {
  const db = await getRawPg();
  if (!db) return 0;

  const result = await db.query<{ count: string | number }>(
    'SELECT COUNT(*) as count FROM favorites'
  );
  if (!result.rows || result.rows.length === 0) return 0;
  const count = result.rows[0].count;
  return typeof count === 'string' ? parseInt(count) : count;
}
