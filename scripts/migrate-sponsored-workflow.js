const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('Migrating sponsored_articles table columns...');
  const statements = [
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS company_name VARCHAR(255)`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS assigned_reporter VARCHAR(255) DEFAULT 'Unassigned'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS package_name VARCHAR(255) DEFAULT 'Clinical Brand Story'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS package_price VARCHAR(100) DEFAULT '₹20,000'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS placement VARCHAR(100) DEFAULT 'homepage_sponsored'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS video_url TEXT`,
    `UPDATE sponsored_articles SET company_name = COALESCE(company_name, advertiser_name, SPLIT_PART(title, ':', 1), 'HealthGhuru Partner') WHERE company_name IS NULL OR company_name = ''`,
    `UPDATE sponsored_articles SET placement = 'homepage_sponsored' WHERE placement IS NULL OR placement = ''`,
    `UPDATE sponsored_articles SET package_name = 'Clinical Brand Story' WHERE package_name IS NULL OR package_name = ''`,
    `UPDATE sponsored_articles SET package_price = '₹20,000' WHERE package_price IS NULL OR package_price = ''`,
    `UPDATE sponsored_articles SET assigned_reporter = 'Unassigned' WHERE assigned_reporter IS NULL OR assigned_reporter = ''`
  ];

  for (const stmt of statements) {
    await sql.query(stmt);
  }

  console.log('Migration completed successfully.');
}

migrate().catch(console.error);
