require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function testLatency() {
  console.log('Testing connection to:', process.env.DATABASE_URL.split('@')[1]);
  
  // 1. Single query (cold)
  let t0 = Date.now();
  await sql`SELECT 1`;
  console.log('1. First query (cold):', Date.now() - t0, 'ms');

  // 2. Single query (warm)
  t0 = Date.now();
  await sql`SELECT 1`;
  console.log('2. Second query (warm):', Date.now() - t0, 'ms');

  // 3. 22 parallel queries like homepage
  t0 = Date.now();
  const promises = [];
  for (let i = 0; i < 22; i++) {
    promises.push(sql`SELECT 1`);
  }
  await Promise.all(promises);
  console.log('3. 22 parallel SELECT 1 queries:', Date.now() - t0, 'ms');

  // 4. Test actual content_items query
  t0 = Date.now();
  const items = await sql`SELECT id, title, slug FROM content_items WHERE status = 'published' AND deleted_at IS NULL LIMIT 20`;
  console.log('4. Query 20 content items:', Date.now() - t0, 'ms', `(fetched ${items.length} items)`);

  // 5. Test notification sync query
  t0 = Date.now();
  await sql`
    SELECT c.title
    FROM content_items c
    LEFT JOIN notifications n ON n.link_url = '/article/' || c.slug
    WHERE c.status = 'published' AND c.deleted_at IS NULL AND n.id IS NULL
    ORDER BY c.published_at DESC
    LIMIT 10
  `;
  console.log('5. Notification join query:', Date.now() - t0, 'ms');
}

testLatency().catch(console.error);
