/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// PUBLIC: Get published website page content by slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const rows = await sql`
      SELECT 
        slug, title, subtitle, content, meta_description, published_by,
        updated_at, published_at
      FROM website_pages
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, page: rows[0] });
  } catch (error: any) {
    console.error('Error fetching public website page:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch page' },
      { status: 500 }
    );
  }
}
