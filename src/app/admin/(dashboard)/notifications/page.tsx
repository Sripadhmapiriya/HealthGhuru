import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminNotificationsClient } from './AdminNotificationsClient';
import { AppNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
  await requireAdmin();

  // Fetch initial notifications list and counts
  const [items, countsResult] = await Promise.all([
    sql`
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
      ORDER BY created_at DESC
      LIMIT 100
    `,
    sql`
      SELECT 
        COUNT(*)::int as total,
        COUNT(CASE WHEN is_read = FALSE THEN 1 END)::int as unread,
        COUNT(CASE WHEN is_broadcast = TRUE THEN 1 END)::int as broadcasts,
        COUNT(CASE WHEN type IN ('contact', 'campaign') THEN 1 END)::int as leads,
        COUNT(CASE WHEN type IN ('system', 'alert', 'breaking') THEN 1 END)::int as alerts
      FROM notifications
    `,
  ]);

  const rawCounts = countsResult[0] || {};
  const counts = {
    total: Number(rawCounts.total || 0),
    unread: Number(rawCounts.unread || 0),
    broadcasts: Number(rawCounts.broadcasts || 0),
    leads: Number(rawCounts.leads || 0),
    alerts: Number(rawCounts.alerts || 0),
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <AdminPageHeader
        tag="Communications Hub"
        title="Notification Center"
        subtitle="Manage live broadcast health advisories, user announcements, and monitor automated system alerts across HealthGhuru."
      />

      <AdminNotificationsClient
        initialNotifications={items as unknown as AppNotification[]}
        initialCounts={counts}
      />
    </div>
  );
}
