// scripts/create-wallet-table.js
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('🔄 Creating user_wallets table...');

  await sql`
    CREATE TABLE IF NOT EXISTS user_wallets (
      email TEXT PRIMARY KEY,
      balance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('✅ Created user_wallets table!');
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
