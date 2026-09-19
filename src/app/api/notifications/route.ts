/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth.config';
import { requireAdmin } from '@/lib/auth/session';
import {
  getAdminNotifications,
  getUserNotifications,
  createNotification,
} from '@/lib/notifications-server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope'); // 'admin' or 'user' or default auto-detect

    // If scope is explicitly requested as admin or user has admin role and requested admin scope
    if (scope === 'admin' || (session?.user?.role === 'admin' && scope !== 'user')) {
      // If asking for admin notifications, verify admin role
      if (session?.user?.role === 'admin') {
        const data = await getAdminNotifications();
        return NextResponse.json({ success: true, ...data });
      }
    }

    // Otherwise return public / user notifications
    const userId = session?.user?.id || null;
    const data = await getUserNotifications(userId);
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error('Error in GET /api/notifications:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only administrators can broadcast or create custom notifications
    const adminUser = await requireAdmin();
    const body = await req.json();

    const {
      title,
      message,
      type = 'info',
      audience = 'all',
      userId,
      linkUrl,
      icon,
      priority = 'normal',
      expiresAt,
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: { message: 'Title and message are required' } },
        { status: 400 }
      );
    }

    const created = await createNotification({
      title,
      message,
      type,
      audience,
      userId: audience === 'user' ? userId : null,
      linkUrl,
      icon,
      priority,
      expiresAt: expiresAt || null,
      createdBy: (adminUser as any)?.id || null,
    });

    if (!created) {
      return NextResponse.json(
        { success: false, error: { message: 'Failed to create notification' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, notification: created });
  } catch (error: any) {
    console.error('Error in POST /api/notifications:', error);
    const statusCode = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: statusCode }
    );
  }
}
