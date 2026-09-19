const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('🚀 Running Media Assets Database Migration...');

  await sql`
    CREATE TABLE IF NOT EXISTS media_assets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      url TEXT NOT NULL UNIQUE,
      mime_type VARCHAR(100) NOT NULL,
      media_type VARCHAR(50) NOT NULL DEFAULT 'image',
      file_size BIGINT NOT NULL DEFAULT 0,
      width INTEGER,
      height INTEGER,
      title VARCHAR(255),
      alt_text TEXT,
      caption TEXT,
      tags TEXT[] DEFAULT '{}',
      uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_media_assets_type ON media_assets(media_type);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_media_assets_created ON media_assets(created_at DESC);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_media_assets_size ON media_assets(file_size);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_media_assets_url ON media_assets(url);
  `;

  console.log('✅ media_assets table & indexes created successfully!');
}

migrate()
  .then(() => {
    console.log('🎉 Migration completed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });
