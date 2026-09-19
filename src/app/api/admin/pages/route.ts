/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';

// ADMIN ONLY: Fetch all website pages
export async function GET() {
  try {
    await requireAdmin();
    const pages = await sql`
      SELECT 
        id, slug, title, subtitle, content, meta_description, published_by,
        created_at, updated_at, published_at
      FROM website_pages
      ORDER BY created_at ASC
    `;

    return NextResponse.json({ success: true, pages });
  } catch (error: any) {
    const code = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: code });
  }
}
