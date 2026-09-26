/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { sql } from '@/lib/db';
import {
  AppNotification,
  NotificationType,
  NotificationAudience,
  NotificationPriority,
} from '@/lib/notifications';

interface CreateNotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  audience?: NotificationAudience;
  userId?: string | null;
  linkUrl?: string | null;
  icon?: string | null;
  priority?: NotificationPriority;
  isBroadcast?: boolean;
  expiresAt?: string | null;
  createdBy?: string | null;
}

/**
 * Creates a notification in the database
 */
export async function createNotification(opts: CreateNotificationOptions): Promise<AppNotification | null> {
  try {
    const isBroadcast = opts.isBroadcast ?? (opts.audience === 'all' || opts.audience === 'users');

    const result = await sql`
      INSERT INTO notifications (
        title,
        message,
        type,
        audience,
        user_id,
        link_url,
        icon,
        priority,
        is_broadcast,
        expires_at,
        created_by
      ) VALUES (
        ${opts.title.trim()},
        ${opts.message.trim()},
        ${opts.type || 'info'},
        ${opts.audience || 'all'},
        ${opts.userId ? opts.userId : null}::uuid,
        ${opts.linkUrl || null},
        ${opts.icon || null},
        ${opts.priority || 'normal'},
        ${isBroadcast},
        ${opts.expiresAt ? opts.expiresAt : null}::timestamptz,
        ${opts.createdBy ? opts.createdBy : null}::uuid
      )
      RETURNING *
    `;

    return (result[0] as unknown as AppNotification) || null;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}

/**
 * Shortcut helper to create an admin console alert
 */
export async function createAdminNotification(
  title: string,
  message: string,
  linkUrl?: string,
  type: NotificationType = 'system',
  priority: NotificationPriority = 'normal',
  icon?: string
): Promise<AppNotification | null> {
  return createNotification({
    title,
    message,
    type,
    audience: 'admin',
    linkUrl,
    priority,
    icon: icon || (type === 'contact' ? 'Mail' : type === 'campaign' ? 'Megaphone' : 'ShieldCheck'),
  });
}

/**
 * Fetch notifications for an Admin user
 */
export async function getAdminNotifications(limit = 40): Promise<{
  notifications: AppNotification[];
  unreadCount: number;
}> {
  const items = await sql`
    SELECT 
      id,
      title,
      message,
      type,
      audience,
      user_id,
      link_url,
      icon,
      priority,
      is_read,
      is_broadcast,
      expires_at,
      created_at,
      created_by
    FROM notifications
    WHERE audience IN ('admin', 'all')
      AND (expires_at IS NULL OR expires_at > NOW())
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  const unreadRes = await sql`
    SELECT COUNT(*)::int as unread_count
    FROM notifications
    WHERE audience IN ('admin', 'all')
      AND is_read = FALSE
      AND (expires_at IS NULL OR expires_at > NOW())
  `;

  return {
    notifications: items as unknown as AppNotification[],
    unreadCount: Number(unreadRes[0]?.unread_count || 0),
  };
}

// Throttle broadcast notification auto-sync to avoid running expensive joins on every GET poll
let lastArticleSyncTime = 0;
const ARTICLE_SYNC_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

export async function syncArticleBroadcasts(): Promise<void> {
  const now = Date.now();
  if (now - lastArticleSyncTime < ARTICLE_SYNC_INTERVAL_MS) {
    return;
  }
  lastArticleSyncTime = now;

  try {
    await sql`
      INSERT INTO notifications (
        title, message, type, audience, link_url, icon, priority, is_broadcast, is_read, created_at
      )
      SELECT 
        c.title,
        COALESCE(NULLIF(TRIM(c.excerpt), ''), 'Latest clinical insights and expert-reviewed findings in Health & Wellness.'),
        CASE 
          WHEN c.is_breaking THEN 'breaking'
          WHEN LOWER(c.category) LIKE '%nutrition%' OR LOWER(c.category) LIKE '%sleep%' OR LOWER(c.category) LIKE '%fitness%' THEN 'health_tip'
          WHEN LOWER(c.category) LIKE '%cancer%' OR LOWER(c.category) LIKE '%heart%' OR LOWER(c.category) LIKE '%research%' THEN 'alert'
          ELSE 'article'
        END,
        'all',
        '/article/' || c.slug,
        CASE 
          WHEN c.is_breaking THEN 'AlertTriangle'
          WHEN LOWER(c.category) LIKE '%nutrition%' OR LOWER(c.category) LIKE '%sleep%' THEN 'Sparkles'
          WHEN LOWER(c.category) LIKE '%cancer%' OR LOWER(c.category) LIKE '%heart%' THEN 'Flame'
          ELSE 'Heart'
        END,
        CASE WHEN c.is_breaking THEN 'high' ELSE 'normal' END,
        TRUE,
        FALSE,
        COALESCE(c.published_at, CURRENT_TIMESTAMP)
      FROM content_items c
      LEFT JOIN notifications n ON n.link_url = '/article/' || c.slug
      WHERE c.status = 'published' AND c.deleted_at IS NULL AND n.id IS NULL
      ORDER BY c.published_at DESC
      LIMIT 10
      ON CONFLICT DO NOTHING
    `;
  } catch {
    // Non-blocking
  }
}

/**
 * Fetch notifications for a Public / Authenticated User
 */
export async function getUserNotifications(
  userId?: string | null,
  limit = 30
): Promise<{
  notifications: AppNotification[];
  unreadCount: number;
}> {
  // Run broadcast sync only if interval elapsed (zero overhead on frequent client polls)
  await syncArticleBroadcasts();

  if (!userId) {
    // Guest visitor: fetch active public broadcasts
    const items = await sql`
      SELECT 
        id,
        title,
        message,
        type,
        audience,
        user_id,
        link_url,
        icon,
        priority,
        is_read,
        is_broadcast,
        expires_at,
        created_at
      FROM notifications
      WHERE audience = 'all'
        AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return {
      notifications: items as unknown as AppNotification[],
      unreadCount: items.length,
    };
  }

  // Authenticated user: union of (user_id specific) and (broadcasts 'all', 'users')
  const items = await sql`
    SELECT 
      n.id,
      n.title,
      n.message,
      n.type,
      n.audience,
      n.user_id,
      n.link_url,
      n.icon,
      n.priority,
      COALESCE(s.is_read, n.is_read, FALSE) as is_read,
      n.is_broadcast,
      n.expires_at,
      n.created_at
    FROM notifications n
    LEFT JOIN user_notification_status s 
      ON n.id = s.notification_id AND s.user_id = ${userId}::uuid
    WHERE (
      n.user_id = ${userId}::uuid OR
      n.audience IN ('all', 'users')
    )
    AND (s.is_dismissed IS NULL OR s.is_dismissed = FALSE)
    AND (n.expires_at IS NULL OR n.expires_at > NOW())
    ORDER BY n.created_at DESC
    LIMIT ${limit}
  `;

  const unreadRes = await sql`
    SELECT COUNT(*)::int as unread_count
    FROM notifications n
    LEFT JOIN user_notification_status s 
      ON n.id = s.notification_id AND s.user_id = ${userId}::uuid
    WHERE (
      n.user_id = ${userId}::uuid OR
      n.audience IN ('all', 'users')
    )
    AND COALESCE(s.is_read, n.is_read, FALSE) = FALSE
    AND (s.is_dismissed IS NULL OR s.is_dismissed = FALSE)
    AND (n.expires_at IS NULL OR n.expires_at > NOW())
  `;

  return {
    notifications: items as unknown as AppNotification[],
    unreadCount: Number(unreadRes[0]?.unread_count || 0),
  };
}
