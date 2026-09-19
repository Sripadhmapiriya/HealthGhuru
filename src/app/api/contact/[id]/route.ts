/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';

// ADMIN ONLY: Update query status / notes
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = params.id;
    const body = await req.json();
    const { status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: { message: 'Query ID is required' } }, { status: 400 });
    }

    const newStatus = (status && typeof status === 'string') ? status.toLowerCase().trim() : 'reviewed';
    const notes = typeof adminNotes === 'string' ? adminNotes : null;

    if (notes !== null) {
      await sql`
        UPDATE contact_queries
        SET 
          status = ${newStatus},
          admin_notes = ${notes},
          updated_at = NOW()
        WHERE id = ${id}::uuid
      `;
    } else {
      await sql`
        UPDATE contact_queries
        SET 
          status = ${newStatus},
          updated_at = NOW()
        WHERE id = ${id}::uuid
      `;
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error: any) {
    console.error('Error updating contact query status:', error);
    const code = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message || 'Failed to update status' } }, { status: code });
  }
}

// ADMIN ONLY: Delete query
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = params.id;

    if (!id) {
      return NextResponse.json({ success: false, error: { message: 'Query ID is required' } }, { status: 400 });
    }

    await sql`DELETE FROM contact_queries WHERE id = ${id}::uuid`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting contact query:', error);
    const code = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message || 'Failed to delete query' } }, { status: code });
  }
}
