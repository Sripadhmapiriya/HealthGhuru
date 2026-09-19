/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth.config';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope');

    const isAdmin = session?.user?.role === 'admin';
    const userId = session?.user?.id;

    if (scope === 'admin' || (isAdmin && scope !== 'user')) {
      if (isAdmin) {
        // Mark all admin audience notifications as read
        await sql`
          UPDATE notifications
          SET is_read = TRUE
          WHERE audience IN ('admin', 'all') AND is_read = FALSE
        `;
        return NextResponse.json({ success: true, scope: 'admin' });
      }
    }

    if (userId) {
      // Mark all user notifications as read
      // 1. Direct user notifications
      await sql`
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = ${userId}::uuid AND is_read = FALSE
      `;

      // 2. Broadcast notifications: insert read statuses for all unread broadcasts
      await sql`
        INSERT INTO user_notification_status (notification_id, user_id, is_read, read_at)
        SELECT n.id, ${userId}::uuid, TRUE, NOW()
        FROM notifications n
        WHERE n.audience IN ('all', 'users')
        ON CONFLICT (notification_id, user_id)
        DO UPDATE SET is_read = TRUE, read_at = NOW();
      `;

      return NextResponse.json({ success: true, scope: 'user' });
    }

    return NextResponse.json({ success: true, scope: 'guest' });
  } catch (error: any) {
    console.error('Error in mark-all-read:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
