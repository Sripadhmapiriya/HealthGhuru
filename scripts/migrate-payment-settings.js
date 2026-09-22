const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migratePaymentSettings() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('Creating payment_settings table...');
  await sql.query(`
    CREATE TABLE IF NOT EXISTS payment_settings (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
      razorpay_enabled BOOLEAN DEFAULT FALSE,
      upi_qr_enabled BOOLEAN DEFAULT TRUE,
      business_upi_id VARCHAR(255) DEFAULT 'manishmadhava91@okicici',
      razorpay_key_id VARCHAR(255) DEFAULT '',
      razorpay_key_secret VARCHAR(255) DEFAULT '',
      gst_rate NUMERIC DEFAULT 18,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await sql.query(`
    INSERT INTO payment_settings (id, razorpay_enabled, upi_qr_enabled, business_upi_id, razorpay_key_id, razorpay_key_secret, gst_rate)
    VALUES ('default', FALSE, TRUE, 'manishmadhava91@okicici', '', '', 18)
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log('Payment settings table ready.');
}

migratePaymentSettings().catch(console.error);
