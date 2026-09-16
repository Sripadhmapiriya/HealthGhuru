import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      article_title,
      article_slug,
      advertiser_name,
      advertiser_type,
      advertiser_logo_url,
      sponsor_label,
      cta_text,
      cta_url,
      is_active,
      start_date,
      end_date,
    } = body;

    const result = await sql`
      UPDATE sponsored_articles
      SET
        article_title = COALESCE(${article_title}, article_title),
        article_slug = COALESCE(${article_slug}, article_slug),
        advertiser_name = COALESCE(${advertiser_name}, advertiser_name),
        advertiser_type = ${advertiser_type !== undefined ? advertiser_type : sql`advertiser_type`},
        advertiser_logo_url = ${advertiser_logo_url !== undefined ? advertiser_logo_url : sql`advertiser_logo_url`},
        sponsor_label = COALESCE(${sponsor_label}, sponsor_label),
        cta_text = COALESCE(${cta_text}, cta_text),
        cta_url = ${cta_url !== undefined ? cta_url : sql`cta_url`},
        is_active = COALESCE(${is_active}, is_active),
        start_date = ${start_date !== undefined ? start_date : sql`start_date`},
        end_date = ${end_date !== undefined ? end_date : sql`end_date`},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}::uuid
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: 'Sponsored article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, article: result[0] });
  } catch (error: any) {
    console.error('Error updating sponsored article:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sql`
      DELETE FROM sponsored_articles WHERE id = ${params.id}::uuid
    `;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting sponsored article:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
