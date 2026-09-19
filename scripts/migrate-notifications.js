const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('🚀 Running Notifications System Database Migration...');

  // 1. Create notifications table
  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL DEFAULT 'info',
      audience VARCHAR(50) NOT NULL DEFAULT 'all',
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      link_url TEXT,
      icon VARCHAR(50),
      priority VARCHAR(20) NOT NULL DEFAULT 'normal',
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      is_broadcast BOOLEAN NOT NULL DEFAULT FALSE,
      expires_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by UUID REFERENCES users(id) ON DELETE SET NULL
    );
  `;

  // 2. Create user_notification_status table (for tracking read/dismissed state per user on broadcast items)
  await sql`
    CREATE TABLE IF NOT EXISTS user_notification_status (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      is_read BOOLEAN NOT NULL DEFAULT TRUE,
      read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
      UNIQUE(notification_id, user_id)
    );
  `;

  // 3. Create indexes
  await sql`
    CREATE INDEX IF NOT EXISTS idx_notifications_audience ON notifications(audience);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_user_notif_status_user ON user_notification_status(user_id);
  `;

  console.log('✅ notifications & user_notification_status tables ready');

  // 4. Seed initial notifications if empty
  const countRes = await sql`SELECT COUNT(*)::int as count FROM notifications`;
  const count = Number(countRes[0]?.count || 0);

  if (count === 0) {
    console.log('🌱 Seeding initial sample notifications...');

    // Public website broadcast alert
    await sql`
      INSERT INTO notifications (
        title, message, type, audience, link_url, icon, priority, is_broadcast
      ) VALUES (
        'Welcome to HealthGhuru 2.0',
        'Explore our new interactive Health Check tools, expert-reviewed articles, and customizable wellness goals.',
        'info',
        'all',
        '/',
        'Sparkles',
        'normal',
        TRUE
      );
    `;

    // Public breaking health advisory
    await sql`
      INSERT INTO notifications (
        title, message, type, audience, link_url, icon, priority, is_broadcast
      ) VALUES (
        'Hydration & Seasonal Wellness Alert',
        'New research confirms drinking adequate electrolyte-rich fluids significantly improves daytime energy and metabolic resilience.',
        'breaking',
        'all',
        '/category/nutrition',
        'Heart',
        'high',
        TRUE
      );
    `;

    // Admin initial system notification
    await sql`
      INSERT INTO notifications (
        title, message, type, audience, link_url, icon, priority
      ) VALUES (
        'Admin Console Notification Center Initialized',
        'You will receive live alerts here whenever new contact queries, advertising campaign proposals, or review queue drafts arrive.',
        'system',
        'admin',
        '/admin',
        'ShieldCheck',
        'normal'
      );
    `;

    console.log('✅ Sample notifications seeded successfully');
  }

  console.log('🎉 Notification migration completed successfully!');
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Notification migration failed:', err);
    process.exit(1);
  });
