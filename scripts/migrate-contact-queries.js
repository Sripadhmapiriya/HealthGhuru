const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Ensuring contact_queries table and language column exist...');
  await sql`
    CREATE TABLE IF NOT EXISTS contact_queries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'General Inquiry',
      language VARCHAR(50) DEFAULT 'English',
      status VARCHAR(50) DEFAULT 'unread',
      admin_notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // Add column if table already exists without language
  await sql`
    ALTER TABLE contact_queries 
    ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English';
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_contact_queries_status ON contact_queries(status);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_contact_queries_created_at ON contact_queries(created_at DESC);
  `;

  // Check existing count and seed if empty
  const [row] = await sql`SELECT COUNT(*)::int as count FROM contact_queries`;
  if (row.count === 0) {
    console.log('Seeding initial reference contact queries...');
    await sql`
      INSERT INTO contact_queries (name, email, language, subject, message, status, created_at)
      VALUES 
        ('sharika', 'shaarika.rajan@gmail.com', 'English', 'Clinical Research Feedback', 'I would like to inquire about the latest clinical study cited in the Cardiology breakthroughs section.', 'reviewed', NOW() - INTERVAL '1 hour'),
        ('sangeethapriya', 'sangee@gmail.com', 'Tamil', 'Hospital Partnership Query', 'வணக்கம், We would like to list our medical diagnostic center in Chennai on HealthGhuru directory.', 'reviewed', NOW() - INTERVAL '5 hours'),
        ('sharika', 'shaarika.rajan@gmail.com', 'Tamil', 'Editorial Clarification', 'Can you provide the peer-reviewed sources for the diabetes nutritional guidelines published yesterday?', 'reviewed', NOW() - INTERVAL '1 day'),
        ('sangeethapriya', 'ivywind2003@gmail.com', 'Tamil', 'VIP Health Subscription', 'Interested in the corporate wellness and doctor consultancy subscription packages for our team.', 'reviewed', NOW() - INTERVAL '3 days');
    `;
    console.log('Seeded 4 reference contact queries.');
  }

  console.log('contact_queries table migration completed successfully!');
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
