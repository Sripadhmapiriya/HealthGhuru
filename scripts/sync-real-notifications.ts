import 'dotenv/config';
import { sql } from '../src/lib/db';

async function syncRealArticles() {
  console.log('🔄 Syncing real published articles to notifications table...');

  // Fetch the latest 15 published articles from content_items that don't have notifications yet
  const items = await sql`
    SELECT c.id, c.title, c.excerpt, c.slug, c.category, c.is_breaking, c.published_at
    FROM content_items c
    LEFT JOIN notifications n ON n.link_url = '/article/' || c.slug
    WHERE c.status = 'published' AND c.deleted_at IS NULL AND n.id IS NULL
    ORDER BY c.published_at DESC
    LIMIT 20
  `;

  console.log(`Found ${items.length} real published articles to convert to notifications.`);

  for (const item of items) {
    const isBreaking = item.is_breaking;
    const cat = (item.category || '').toLowerCase();
    
    let type = 'article';
    let priority = 'normal';
    let icon = 'Heart';

    if (isBreaking) {
      type = 'breaking';
      priority = 'high';
      icon = 'AlertTriangle';
    } else if (cat.includes('nutrition') || cat.includes('sleep') || cat.includes('fitness')) {
      type = 'health_tip';
      priority = 'normal';
      icon = 'Sparkles';
    } else if (cat.includes('cancer') || cat.includes('heart') || cat.includes('research')) {
      type = 'alert';
      priority = 'high';
      icon = 'Flame';
    }

    const message = item.excerpt && item.excerpt.trim().length > 10
      ? item.excerpt.trim()
      : `Latest clinical insights and expert-reviewed findings in ${item.category || 'Health & Wellness'}.`;

    await sql`
      INSERT INTO notifications (
        title,
        message,
        type,
        audience,
        link_url,
        icon,
        priority,
        is_broadcast,
        is_read,
        created_at
      ) VALUES (
        ${item.title.trim()},
        ${message},
        ${type},
        'all',
        ${'/article/' + item.slug},
        ${icon},
        ${priority},
        TRUE,
        FALSE,
        ${item.published_at || new Date().toISOString()}::timestamptz
      )
    `;
    console.log(`✅ Created notification for: "${item.title}"`);
  }

  // Clean up old static mock notifications
  await sql`
    DELETE FROM notifications 
    WHERE title IN ('Hydration & Seasonal Wellness Alert', 'Welcome to HealthGhuru 2.0')
  `;

  const allNotifs = await sql`
    SELECT id, title, type, audience, link_url, created_at 
    FROM notifications 
    WHERE audience = 'all' 
    ORDER BY created_at DESC 
    LIMIT 10
  `;
  console.log('\nTop active public notifications now:');
  allNotifs.forEach((n: any, idx: number) => {
    console.log(`${idx + 1}. [${n.type.toUpperCase()}] ${n.title} -> ${n.link_url} (${n.created_at})`);
  });
}

syncRealArticles().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
