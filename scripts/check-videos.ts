import 'dotenv/config';
import { sql } from '../src/lib/db';

async function main() {
  const videos = await sql`
    SELECT id, title, slug, content_type, subcategory, duration_seconds, video_id, status, published_at
    FROM content_items
    WHERE content_type = 'video'
    ORDER BY published_at DESC
  `;

  console.log(`\n=== Videos in DB (${videos.length} total) ===`);
  videos.forEach((v: any, i: number) => {
    console.log(`${i + 1}. [${v.subcategory || 'video'}] ${v.title} (ID: ${v.video_id}) -> /video/${v.slug}`);
  });
  
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
