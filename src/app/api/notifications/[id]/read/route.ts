/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth.config';
import { sql } from '@/lib/db';

export async function PATCH(
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

    const userId = session?.user?.id;
    const isAdmin = session?.user?.role === 'admin';

    // If admin is viewing, or single-user notification targeted directly
    if (isAdmin) {
      await sql`
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ${id}::uuid
      `;
    }

    if (userId) {
      // Record read status in user_notification_status
      await sql`
        INSERT INTO user_notification_status (notification_id, user_id, is_read, read_at)
        VALUES (${id}::uuid, ${userId}::uuid, TRUE, NOW())
        ON CONFLICT (notification_id, user_id)
        DO UPDATE SET is_read = TRUE, read_at = NOW();
      `;

      // Also update notification directly if direct user_id match
      await sql`
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ${id}::uuid AND user_id = ${userId}::uuid
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
