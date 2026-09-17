const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const sql = neon(process.env.DATABASE_URL);

async function test() {
  const articles = await sql`
    SELECT sa.id, sa.title, sa.slug, sa.category, sa.status, sa.is_featured, s.name as sponsor_name
    FROM sponsored_articles sa
    LEFT JOIN sponsors s ON sa.sponsor_id = s.id
    ORDER BY sa.created_at ASC
  `;
  console.log(`Found ${articles.length} sponsored articles:`);
  console.table(articles);
}

test().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
