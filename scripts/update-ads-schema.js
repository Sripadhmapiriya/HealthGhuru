// scripts/update-ads-schema.js
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('🔄 Adding missing columns to advertisements table...');

  await sql`
    ALTER TABLE advertisements
      ADD COLUMN IF NOT EXISTS status          TEXT DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS payment_status  TEXT DEFAULT 'paid',
      ADD COLUMN IF NOT EXISTS payment_method  TEXT DEFAULT 'upi',
      ADD COLUMN IF NOT EXISTS priority        TEXT DEFAULT 'medium';
  `;

  // Update existing rows that have null status
  await sql`
    UPDATE advertisements
    SET status = CASE WHEN is_active = TRUE THEN 'active' ELSE 'unpublished' END
    WHERE status IS NULL;
  `;

  console.log('✅ Updated advertisements table schema!');
}

run().then(() => process.exit(0)).catch((err) => {
  console.error('❌ Error updating schema:', err.message);
  process.exit(1);
});
