const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function runMigration() {
  console.log('Running email_settings migration...');

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS email_settings (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
        smtp_host VARCHAR(255) DEFAULT 'smtp.gmail.com',
        smtp_port INT DEFAULT 465,
        smtp_secure BOOLEAN DEFAULT true,
        smtp_user VARCHAR(255) DEFAULT '',
        smtp_pass VARCHAR(255) DEFAULT '',
        from_name VARCHAR(255) DEFAULT 'HealthGhuru Desk',
        from_email VARCHAR(255) DEFAULT 'notifications@healthghuru.com',
        admin_notification_email VARCHAR(255) DEFAULT 'admin@healthghuru.com',
        notify_on_sponsorship BOOLEAN DEFAULT true,
        notify_on_ad_campaign BOOLEAN DEFAULT true,
        notify_on_subscription BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('Table email_settings created or already exists.');

    // Seed default record if not present
    await sql`
      INSERT INTO email_settings (
        id,
        smtp_host,
        smtp_port,
        smtp_secure,
        smtp_user,
        smtp_pass,
        from_name,
        from_email,
        admin_notification_email,
        notify_on_sponsorship,
        notify_on_ad_campaign,
        notify_on_subscription
      ) VALUES (
        'default',
        'smtp.gmail.com',
        465,
        true,
        '',
        '',
        'HealthGhuru Desk',
        'notifications@healthghuru.com',
        'admin@healthghuru.com',
        true,
        true,
        true
      )
      ON CONFLICT (id) DO NOTHING;
    `;

    console.log('Default email_settings seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
