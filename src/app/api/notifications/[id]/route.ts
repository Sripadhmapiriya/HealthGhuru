/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth.config';
import { sql } from '@/lib/db';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: 'Notification ID is required' } },
        { status: 400 }
      );
    }

    const isAdmin = session?.user?.role === 'admin';
    const userId = session?.user?.id;

    if (isAdmin) {
      // Admin can delete notification record directly
      await sql`
        DELETE FROM notifications WHERE id = ${id}::uuid
      `;
      return NextResponse.json({ success: true, deleted: true });
    }

    if (userId) {
      // User dismisses notification
      await sql`
        INSERT INTO user_notification_status (notification_id, user_id, is_read, is_dismissed)
        VALUES (${id}::uuid, ${userId}::uuid, TRUE, TRUE)
        ON CONFLICT (notification_id, user_id)
        DO UPDATE SET is_dismissed = TRUE, is_read = TRUE;
      `;
      return NextResponse.json({ success: true, dismissed: true });
    }

    return NextResponse.json(
      { success: false, error: { message: 'Unauthorized' } },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
