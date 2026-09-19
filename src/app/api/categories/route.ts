/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const categories = await sql`
      WITH counts AS (
        SELECT LOWER(category) as cat_lower, COUNT(*)::int as count
        FROM content_items
        WHERE deleted_at IS NULL
        GROUP BY LOWER(category)
      )
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.icon_name,
        c.display_order,
        c.is_enabled,
        c.created_at,
        COALESCE(counts.count, 0) as item_count
      FROM content_categories c
      LEFT JOIN counts ON LOWER(c.name) = counts.cat_lower
      ORDER BY c.display_order ASC, c.name ASC
    `;

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { name, slug, description, iconName, displayOrder, isEnabled } = body;
    if (!name || !slug) {
      return NextResponse.json({ success: false, error: { message: 'Name and slug are required' } }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const newId = randomUUID();

    await sql`
      INSERT INTO content_categories (
        id, name, slug, description, icon_name, display_order, is_enabled
      ) VALUES (
        ${newId}::uuid,
        ${name.trim()},
        ${cleanSlug},
        ${description || null},
        ${iconName || 'Tag'},
        ${Number(displayOrder) || 0},
        ${isEnabled !== undefined ? Boolean(isEnabled) : true}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        icon_name = EXCLUDED.icon_name,
        display_order = EXCLUDED.display_order,
        is_enabled = EXCLUDED.is_enabled;
    `;

    return NextResponse.json({ success: true, id: newId });
  } catch (error: any) {
    const code = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: code });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, name, slug, description, iconName, displayOrder, isEnabled } = body;

    if (!id || !name || !slug) {
      return NextResponse.json({ success: false, error: { message: 'ID, name, and slug are required' } }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    await sql`
      UPDATE content_categories
      SET 
        name = ${name.trim()},
        slug = ${cleanSlug},
        description = ${description || null},
        icon_name = ${iconName || 'Tag'},
        display_order = ${Number(displayOrder) || 0},
        is_enabled = ${isEnabled !== undefined ? Boolean(isEnabled) : true}
      WHERE id = ${id}::uuid
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const code = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: code });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: { message: 'Category ID is required' } }, { status: 400 });
    }

    // First detach any sources using this category_id
    await sql`UPDATE content_sources SET category_id = NULL WHERE category_id = ${id}::uuid`;

    // Delete category
    await sql`DELETE FROM content_categories WHERE id = ${id}::uuid`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const code = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: code });
  }
}
