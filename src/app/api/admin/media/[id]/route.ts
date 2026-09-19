/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    const result = await sql`
      SELECT * FROM media_assets WHERE id = ${id}::uuid LIMIT 1
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Media asset not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, asset: result[0] });
  } catch (error: any) {
    const statusCode = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: statusCode });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;
    const body = await req.json();

    const { title, alt_text, caption, tags } = body;

    const updated = await sql`
      UPDATE media_assets
      SET 
        title = COALESCE(${title}, title),
        alt_text = COALESCE(${alt_text}, alt_text),
        caption = COALESCE(${caption}, caption),
        tags = COALESCE(${tags ? tags : null}::text[], tags),
        updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `;

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Media asset not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, asset: updated[0] });
  } catch (error: any) {
    const statusCode = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: statusCode });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    const result = await sql`
      DELETE FROM media_assets 
      WHERE id = ${id}::uuid 
      RETURNING id, url, filename
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Media asset not found' } },
        { status: 404 }
      );
    }

    const asset = result[0];
    if (asset.url && asset.url.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', 'uploads', asset.filename);
      try {
        await unlink(filePath);
      } catch {
        // file may already be removed
      }
    }

    return NextResponse.json({ success: true, id: asset.id });
  } catch (error: any) {
    const statusCode = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: statusCode });
  }
}
