import 'dotenv/config';
import { sql } from '../src/lib/db';

async function main() {
  const missing = await sql`
    SELECT c.id, c.title, c.excerpt, c.slug, c.category, c.is_breaking, c.published_at
    FROM content_items c
    LEFT JOIN notifications n ON n.link_url = '/article/' || c.slug
    WHERE c.status = 'published' AND c.deleted_at IS NULL AND n.id IS NULL
    ORDER BY c.published_at DESC
  `;
  console.log('Unsynced real articles:', missing.length);
  missing.slice(0, 10).forEach((m: any) => console.log(m.title, '-> /article/' + m.slug));
}

main().catch(console.error);
