/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

// GET single news item for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [item] = await sql`
      SELECT 
        i.*,
        a.author_credential,
        a.blocks
      FROM content_items i
      LEFT JOIN articles a ON i.id = a.id
      WHERE i.id = ${id}::uuid AND i.deleted_at IS NULL
    `;

    if (!item) {
      return NextResponse.json({ success: false, error: 'News item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update news item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const {
      title,
      subtitle,
      category,
      language,
      location,
      excerpt,
      content,
      heroImageUrl,
      isBreaking,
      status,
      tags,
    } = body;

    if (!title || !excerpt) {
      return NextResponse.json({ success: false, error: 'Title and Excerpt are mandatory' }, { status: 400 });
    }

    // 1. Update articles table
    const paragraphs = (content || '')
      .split('\n\n')
      .map((p: string) => p.trim())
      .filter(Boolean);

    const blocks = paragraphs.map((text: string, idx: number) => ({
      type: 'paragraph',
      id: String(idx + 1),
      text,
    }));

    await sql`
      UPDATE articles
      SET
        title = ${title},
        category = ${category || 'General Health'},
        excerpt = ${excerpt},
        hero_image_url = ${heroImageUrl || null},
        status = ${status || 'published'},
        tags = ${tags || []},
        blocks = ${JSON.stringify(blocks)}::jsonb,
        updated_at = NOW()
      WHERE id = ${id}::uuid
    `;

    // 2. Update content_items table
    const [existingItem] = await sql`SELECT slug, raw_metadata FROM content_items WHERE id = ${id}::uuid`;
    let rawMeta = {};
    try {
      rawMeta = typeof existingItem?.raw_metadata === 'string'
        ? JSON.parse(existingItem.raw_metadata)
        : existingItem?.raw_metadata || {};
    } catch {
      rawMeta = {};
    }

    const updatedRawMetadata = {
      ...rawMeta,
      subtitle: subtitle || '',
      location: location || '',
    };

    const [updatedContent] = await sql`
      UPDATE content_items
      SET
        title = ${title},
        category = ${category || 'General Health'},
        language = ${language || 'en'},
        excerpt = ${excerpt},
        description = ${content || excerpt},
        image_url = ${heroImageUrl || null},
        status = ${status || 'published'},
        is_breaking = ${Boolean(isBreaking)},
        raw_metadata = ${JSON.stringify(updatedRawMetadata)}::jsonb,
        updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `;

    // 3. Cache revalidation
    try {
      revalidatePath('/');
      revalidatePath('/latest');
      if (updatedContent?.category) {
        const catSlug = updatedContent.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        revalidatePath(`/category/${catSlug}`);
      }
      if (updatedContent?.slug) {
        revalidatePath(`/article/${updatedContent.slug}`);
      }
      revalidatePath('/admin/all-news');
      revalidatePath('/admin/content');
    } catch (revalErr) {
      console.warn('Revalidation warning:', revalErr);
    }

    return NextResponse.json({ success: true, item: updatedContent });
  } catch (error: any) {
    console.error('Error updating news item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Delete news item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [item] = await sql`SELECT slug, category FROM content_items WHERE id = ${id}::uuid`;

    // Soft delete or hard delete in both tables
    await sql`UPDATE content_items SET deleted_at = NOW(), status = 'archived' WHERE id = ${id}::uuid`;
    await sql`UPDATE articles SET deleted_at = NOW(), status = 'archived' WHERE id = ${id}::uuid`;

    // Real-time cache revalidation
    try {
      revalidatePath('/');
      revalidatePath('/latest');
      if (item?.category) {
        const catSlug = item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        revalidatePath(`/category/${catSlug}`);
      }
      if (item?.slug) {
        revalidatePath(`/article/${item.slug}`);
      }
      revalidatePath('/admin/all-news');
      revalidatePath('/admin/content');
    } catch (revalErr) {
      console.warn('Revalidation warning on delete:', revalErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting news item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
