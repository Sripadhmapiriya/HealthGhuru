/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = params.id;
    const body = await req.json();
    const { name, slug, description, iconName, displayOrder, isEnabled } = body;

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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = params.id;

    if (!id) {
      return NextResponse.json({ success: false, error: { message: 'Category ID is required' } }, { status: 400 });
    }

    // Detach sources referencing this category
    await sql`UPDATE content_sources SET category_id = NULL WHERE category_id = ${id}::uuid`;

    // Delete category
    await sql`DELETE FROM content_categories WHERE id = ${id}::uuid`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const code = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: code });
  }
}
