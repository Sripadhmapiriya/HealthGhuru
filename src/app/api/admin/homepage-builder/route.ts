import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth/auth.config';
import { getDefaultHomepageConfig, HomepageBuilderConfig } from '@/lib/types/homepage-builder';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure site_settings table exists
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const rows = await sql`
      SELECT value FROM site_settings WHERE key = 'homepage_builder_config' LIMIT 1
    `;

    let config: HomepageBuilderConfig;
    if (rows.length > 0 && rows[0].value) {
      try {
        config = JSON.parse(rows[0].value);
      } catch {
        config = getDefaultHomepageConfig();
      }
    } else {
      config = getDefaultHomepageConfig();
    }

    // Fetch published content for pickers
    const [publishedNews, publishedShorts] = await Promise.all([
      sql`
        SELECT id, title, slug, category, image_url, published_at, view_count, is_editor_pick, is_featured, is_trending
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

    return NextResponse.json({
      success: true,
      config,
      articles: publishedNews,
      shorts: publishedShorts,
    });
  } catch (error: any) {
    console.error('Error fetching homepage builder config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body: HomepageBuilderConfig = await req.json();
    const serialized = JSON.stringify({
      ...body,
      updatedAt: new Date().toISOString(),
    });

    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('homepage_builder_config', ${serialized}, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({
      success: true,
      message: 'Homepage configuration saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving homepage builder config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save configuration' },
      { status: 500 }
    );
  }
}
