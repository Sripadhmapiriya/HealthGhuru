const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const sql = neon(process.env.DATABASE_URL);

async function setPending() {
  await sql`
    UPDATE advertisements
    SET is_active = false,
        status = 'pending',
        payment_status = 'pending'
    WHERE title = 'gfhfdgd';
  `;

  await sql`
    UPDATE campaign_requests
    SET status = 'pending',
        payment_status = 'pending'
    WHERE campaign_title = 'gfhfdgd';
  `;

  console.log('✅ Successfully set gfhfdgd to Pending Review status!');
}

setPending().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
