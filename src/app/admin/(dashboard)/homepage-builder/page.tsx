import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { getDefaultHomepageConfig, HomepageBuilderConfig } from '@/lib/types/homepage-builder';
import { HomepageBuilderClient } from './HomepageBuilderClient';

export const dynamic = 'force-dynamic';

export default async function HomepageBuilderPage() {
  await requireAdmin();

  // Ensure site_settings exists
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Fetch active configuration
  const rows = await sql`
    SELECT value FROM site_settings WHERE key = 'homepage_builder_config' LIMIT 1
  `;

  let initialConfig: HomepageBuilderConfig;
  if (rows.length > 0 && rows[0].value) {
    try {
      initialConfig = JSON.parse(rows[0].value);
    } catch {
      initialConfig = getDefaultHomepageConfig();
    }
  } else {
    initialConfig = getDefaultHomepageConfig();
  }

  // Fetch published news and shorts for selectors
  const [articles, shorts] = await Promise.all([
    sql`
      SELECT id, title, slug, category, image_url, published_at, view_count
      FROM content_items
      WHERE status = 'published' AND deleted_at IS NULL
      ORDER BY published_at DESC
      LIMIT 100
    `,
    sql`
      SELECT id, title, slug, category, image_url, published_at, view_count, subcategory
      FROM content_items
      WHERE content_type = 'video' AND status = 'published' AND deleted_at IS NULL
      ORDER BY published_at DESC
      LIMIT 50
    `,
  ]);

  return (
    <HomepageBuilderClient
      initialConfig={initialConfig}
      articles={articles as any}
      shorts={shorts as any}
    />
  );
}
