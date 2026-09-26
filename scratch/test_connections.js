require('dotenv').config();
const { neon, Pool } = require('@neondatabase/serverless');

async function testEndpoints() {
  const poolerUrl = process.env.DATABASE_URL;
  // Direct url replaces -pooler with empty
  const directUrl = poolerUrl.replace('-pooler', '');

  console.log('Testing Pooler URL with neon()...');
  const sqlPooler = neon(poolerUrl);
  let t = Date.now();
  await sqlPooler`SELECT 1`;
  console.log('Pooler neon() 1st:', Date.now() - t, 'ms');
  t = Date.now();
  await sqlPooler`SELECT 1`;
  console.log('Pooler neon() 2nd:', Date.now() - t, 'ms');

  console.log('\nTesting Direct URL with neon()...');
  const sqlDirect = neon(directUrl);
  t = Date.now();
  await sqlDirect`SELECT 1`;
  console.log('Direct neon() 1st:', Date.now() - t, 'ms');
  t = Date.now();
  await sqlDirect`SELECT 1`;
  console.log('Direct neon() 2nd:', Date.now() - t, 'ms');

  console.log('\nTesting WebSocket / TCP Pool with Pooler URL...');
  try {
    const pool = new Pool({ connectionString: poolerUrl });
    t = Date.now();
    await pool.query('SELECT 1');
    console.log('Pool 1st query (connect + query):', Date.now() - t, 'ms');
    t = Date.now();
    await pool.query('SELECT 1');
    console.log('Pool 2nd query (reused socket):', Date.now() - t, 'ms');
    t = Date.now();
    await pool.query('SELECT 1');
    console.log('Pool 3rd query (reused socket):', Date.now() - t, 'ms');
    await pool.end();
  } catch (err) {
    console.error('Pool error:', err.message);
  }
}

testEndpoints().catch(console.error);
