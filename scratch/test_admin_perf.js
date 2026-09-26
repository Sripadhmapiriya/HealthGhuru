require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function testAll() {
  console.log('Testing Admin Dashboard queries...');
  let t = Date.now();
  const [totalContent, totalArticles, activeSources, totalUsers, totalCategories, chartDataRaw, recentIngestions] = await Promise.all([
    sql`SELECT count(*) FROM content_items WHERE status = 'published' AND deleted_at IS NULL`,
    sql`SELECT count(*) FROM content_items WHERE content_type = 'article' AND status = 'published' AND deleted_at IS NULL`,
    sql`SELECT count(*) FROM content_sources WHERE enabled = TRUE`,
    sql`SELECT count(*) FROM users`,
    sql`SELECT count(*) FROM content_categories WHERE is_enabled = TRUE`,
    sql`
      SELECT DATE(published_at) as date, COUNT(*) as count
      FROM content_items
      WHERE published_at >= CURRENT_DATE - INTERVAL '30 days' AND deleted_at IS NULL
      GROUP BY DATE(published_at)
      ORDER BY DATE(published_at) ASC
    `,
    sql`
      SELECT id, title, category, published_at, source_name, content_type
      FROM (
        SELECT i.id, i.title, i.category, i.published_at, i.content_type,
               COALESCE(s.name, 'HealthGuru Wire') as source_name
        FROM content_items i
        LEFT JOIN content_sources s ON i.source_id = s.id
        WHERE i.status = 'published' AND i.deleted_at IS NULL
        ORDER BY i.published_at DESC
        LIMIT 5
      ) r
    `,
  ]);
  console.log('Admin Dashboard queries took:', Date.now() - t, 'ms');

  // Test admin notifications query
  t = Date.now();
  const notifs = await sql`
    SELECT id, title, message, type, audience, link_url, icon, priority, is_read, created_at
    FROM notifications
    WHERE audience IN ('admin', 'all')
      AND (expires_at IS NULL OR expires_at > NOW())
    ORDER BY created_at DESC
    LIMIT 40
  `;
  console.log('Admin notification query took:', Date.now() - t, 'ms', `(${notifs.length} items)`);

  // Test session DB check
  t = Date.now();
  const user = await sql`SELECT role FROM users LIMIT 1`;
  console.log('Session user role check took:', Date.now() - t, 'ms');
}

testAll().catch(console.error);
