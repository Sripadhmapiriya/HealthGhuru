// scripts/create-campaign-table.js
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function run() {
  await sql`
    CREATE TABLE IF NOT EXISTS campaign_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      advertiser_name TEXT NOT NULL,
      advertiser_type TEXT CHECK (advertiser_type IN ('hospital','doctor','clinic','pharmacy')),
      contact_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      contact_phone TEXT,
      campaign_title TEXT NOT NULL,
      target_url TEXT NOT NULL,
      placement TEXT NOT NULL,
      duration_plan TEXT NOT NULL DEFAULT 'weekly',
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      banner_image_url TEXT,
      base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
      gst_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      payment_method TEXT DEFAULT 'upi',
      payment_status TEXT DEFAULT 'pending',
      payment_reference TEXT,
      status TEXT DEFAULT 'pending',
      admin_notes TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('campaign_requests table created');
  await sql`CREATE INDEX IF NOT EXISTS idx_campaign_requests_email ON campaign_requests(contact_email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_campaign_requests_status ON campaign_requests(status)`;
  console.log('Done! campaign_requests table is ready.');
}

run().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1); });
