const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function check() {
  const breaking = await sql`
    SELECT id, title, is_breaking, is_featured, published_at 
    FROM content_items 
    WHERE is_breaking = TRUE AND status = 'published' AND deleted_at IS NULL
    LIMIT 5
  `;
  console.log('Current breaking count:', breaking.length);
  breaking.forEach(b => console.log('Breaking:', b.title, b.published_at));

  const topItems = await sql`
    SELECT i.id, i.title, i.is_breaking, i.is_featured, i.published_at
    FROM content_items i
    WHERE i.status = 'published' AND i.deleted_at IS NULL
    ORDER BY (i.is_breaking::int * 1000 + i.is_featured::int * 50) DESC, i.published_at DESC
    LIMIT 5
  `;
  console.log('\nTop items with new formula:');
  topItems.forEach((t, i) => console.log(`${i+1}. [breaking: ${t.is_breaking}] ${t.title.slice(0, 55)} (${t.published_at})`));
}
check();
