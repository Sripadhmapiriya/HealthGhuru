const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const sql = neon(process.env.DATABASE_URL);

async function test() {
  console.log('--- TESTING ACTIVE ADS FETCH ---');
  const activeAds = await sql`SELECT id, title, placement, is_active FROM advertisements WHERE is_active = true`;
  console.log('Active ads count:', activeAds.length);

  const pendingAds = await sql`SELECT id, title, placement, is_active, status FROM advertisements WHERE is_active = false OR status = 'pending'`;
  console.log('Pending ads count:', pendingAds.length);
  console.log(pendingAds);
}

test().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
