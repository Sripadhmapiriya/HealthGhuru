require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function testParallel() {
  const poolerUrl = process.env.DATABASE_URL;
  const directUrl = poolerUrl.replace('-pooler', '');

  console.log('Testing 22 queries with Pooler URL...');
  const sqlPooler = neon(poolerUrl);
  let t = Date.now();
  await Promise.all(Array.from({ length: 22 }, () => sqlPooler`SELECT 1`));
  console.log('Pooler 22 queries:', Date.now() - t, 'ms');

  console.log('Testing 22 queries with Direct URL...');
  const sqlDirect = neon(directUrl);
  t = Date.now();
  await Promise.all(Array.from({ length: 22 }, () => sqlDirect`SELECT 1`));
  console.log('Direct 22 queries:', Date.now() - t, 'ms');
}

testParallel().catch(console.error);
