const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const sql = neon(process.env.DATABASE_URL);

async function check() {
  const reqs = await sql`SELECT * FROM campaign_requests`;
  console.log('--- CAMPAIGN REQUESTS (' + reqs.length + ') ---');
  console.log(JSON.stringify(reqs, null, 2));

  const ads = await sql`SELECT id, title, advertiser_name, status, is_active FROM advertisements`;
  console.log('--- ADVERTISEMENTS (' + ads.length + ') ---');
  console.log(JSON.stringify(ads, null, 2));
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
