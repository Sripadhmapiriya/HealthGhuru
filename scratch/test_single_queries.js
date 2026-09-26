require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function testSingleQueries() {
  const poolerUrl = process.env.DATABASE_URL;
  const directUrl = poolerUrl.replace('-pooler', '');

  const sqlPooler = neon(poolerUrl);
  const sqlDirect = neon(directUrl);

  console.log('--- WITH POOLER (CURRENT) ---');
  let t = Date.now();
  await sqlPooler`SELECT role FROM users LIMIT 1`;
  console.log('User role check:', Date.now() - t, 'ms');

  t = Date.now();
  await sqlPooler`SELECT count(*) FROM content_items WHERE status = 'published' AND deleted_at IS NULL`;
  console.log('Count content items:', Date.now() - t, 'ms');

  console.log('\n--- WITH DIRECT (OPTIMIZED) ---');
  t = Date.now();
  await sqlDirect`SELECT role FROM users LIMIT 1`;
  console.log('User role check:', Date.now() - t, 'ms');

  t = Date.now();
  await sqlDirect`SELECT count(*) FROM content_items WHERE status = 'published' AND deleted_at IS NULL`;
  console.log('Count content items:', Date.now() - t, 'ms');
}

testSingleQueries().catch(console.error);
