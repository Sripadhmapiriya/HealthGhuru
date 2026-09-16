import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let articles;
    if (slug) {
      articles = await sql`
        SELECT * FROM sponsored_articles
        WHERE is_active = TRUE
          AND article_slug = ${slug}
          AND (start_date IS NULL OR start_date <= CURRENT_DATE)
          AND (end_date IS NULL OR end_date >= CURRENT_DATE)
        ORDER BY created_at DESC
        LIMIT 1
      `;
    } else {
      articles = await sql`
        SELECT * FROM sponsored_articles
        WHERE is_active = TRUE
          AND (start_date IS NULL OR start_date <= CURRENT_DATE)
          AND (end_date IS NULL OR end_date >= CURRENT_DATE)
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    console.error('Error fetching sponsored articles (public):', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
