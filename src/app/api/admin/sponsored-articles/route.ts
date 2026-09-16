import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const articles = await sql`
      SELECT * FROM sponsored_articles
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    console.error('Error fetching sponsored articles:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      article_id,
      article_title,
      article_slug,
      advertiser_name,
      advertiser_type,
      advertiser_logo_url,
      sponsor_label = 'Sponsored by',
      cta_text = 'Learn More',
      cta_url,
      is_active = true,
      start_date,
      end_date,
    } = body;

    if (!article_id || !article_title || !article_slug || !advertiser_name) {
      return NextResponse.json(
        { success: false, error: 'Article ID, title, slug, and advertiser name are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO sponsored_articles (
        article_id, article_title, article_slug,
        advertiser_name, advertiser_type, advertiser_logo_url,
        sponsor_label, cta_text, cta_url,
        is_active, start_date, end_date
      ) VALUES (
        ${article_id}, ${article_title}, ${article_slug},
        ${advertiser_name}, ${advertiser_type || null}, ${advertiser_logo_url || null},
        ${sponsor_label}, ${cta_text || 'Learn More'}, ${cta_url || null},
        ${is_active}, ${start_date || null}, ${end_date || null}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, article: result[0] });
  } catch (error: any) {
    console.error('Error creating sponsored article:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
