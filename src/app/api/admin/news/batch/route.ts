/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { action, ids } = body;

    if (action === 'delete_selected' && Array.isArray(ids) && ids.length > 0) {
      await sql`
        UPDATE content_items
        SET deleted_at = NOW(), status = 'archived'
        WHERE id = ANY(${ids}::uuid[])
      `;

      await sql`
        UPDATE articles
        SET deleted_at = NOW(), status = 'archived'
        WHERE id = ANY(${ids}::uuid[])
      `;

      // Revalidate paths
      try {
        revalidatePath('/');
        revalidatePath('/latest');
        revalidatePath('/admin/all-news');
        revalidatePath('/admin/content');
      } catch (err) {
        console.warn('Revalidation warning:', err);
      }

      return NextResponse.json({ success: true, count: ids.length });
    }

    if (action === 'delete_today') {
      const deletedItems = await sql`
        UPDATE content_items
        SET deleted_at = NOW(), status = 'archived'
        WHERE deleted_at IS NULL
          AND published_at >= CURRENT_DATE
          AND published_at < CURRENT_DATE + INTERVAL '1 day'
        RETURNING id
      `;

      if (deletedItems.length > 0) {
        const deletedIds = deletedItems.map((item: any) => item.id);
        await sql`
          UPDATE articles
          SET deleted_at = NOW(), status = 'archived'
          WHERE id = ANY(${deletedIds}::uuid[])
        `;
      }

      try {
        revalidatePath('/');
        revalidatePath('/latest');
        revalidatePath('/admin/all-news');
        revalidatePath('/admin/content');
      } catch (err) {
        console.warn('Revalidation warning:', err);
      }

      return NextResponse.json({ success: true, count: deletedItems.length });
    }

    return NextResponse.json({ success: false, error: 'Invalid batch action or empty IDs' }, { status: 400 });
  } catch (error: any) {
    console.error('Batch news action error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
