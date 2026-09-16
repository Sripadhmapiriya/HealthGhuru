const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const sql = neon(process.env.DATABASE_URL);

async function inspect() {
  const row = await sql`SELECT id, title, is_active, status, payment_status FROM advertisements WHERE title = 'gfhfdgd'`;
  console.log('gfhfdgd row:', row);
}

inspect().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
