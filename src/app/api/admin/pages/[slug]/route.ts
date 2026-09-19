/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

// ADMIN ONLY: Get single page content
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdmin();
    const { slug } = await params;

    const rows = await sql`
      SELECT 
        id, slug, title, subtitle, content, meta_description, published_by,
        created_at, updated_at, published_at
      FROM website_pages
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: { message: 'Page not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, page: rows[0] });
  } catch (error: any) {
    const code = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: code });
  }
}

// ADMIN ONLY: Update and publish single page content
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await requireAdmin();
    const { slug } = await params;
    const body = await req.json();
    const { title, subtitle, content, metaDescription } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: { message: 'Page slug is required' } }, { status: 400 });
    }
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ success: false, error: { message: 'Page content is required' } }, { status: 400 });
    }

    const publisher = session.user?.name || 'Super Admin';

    const [updatedPage] = await sql`
      UPDATE website_pages
      SET 
        title = COALESCE(${title}, title),
        subtitle = COALESCE(${subtitle}, subtitle),
        content = ${content},
        meta_description = COALESCE(${metaDescription}, meta_description),
        published_by = ${publisher},
        updated_at = NOW(),
        published_at = NOW()
      WHERE slug = ${slug}
      RETURNING *
    `;

    if (!updatedPage) {
      return NextResponse.json({ success: false, error: { message: 'Page not found for update' } }, { status: 404 });
    }

    // Revalidate public cache paths
    try {
      if (slug === 'about-us') revalidatePath('/about');
      if (slug === 'privacy-policy') revalidatePath('/privacy');
      if (slug === 'terms-and-conditions') revalidatePath('/terms');
      if (slug === 'disclaimer') revalidatePath('/disclaimer');
      if (slug === 'contact-us') revalidatePath('/contact');
      if (slug === 'advertise-with-us') revalidatePath('/advertise');
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: `${updatedPage.title} published successfully.`,
      page: updatedPage,
    });
  } catch (error: any) {
    console.error('Error updating website page:', error);
    const code = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message || 'Failed to update page' } }, { status: code });
  }
}
