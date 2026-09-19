import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { ContactQueriesClient, ContactQuery } from './ContactQueriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminContactQueriesPage() {
  await requireAdmin();

  const [queries, countsRes] = await Promise.all([
    sql`
      SELECT *
      FROM contact_queries
      ORDER BY created_at DESC
      LIMIT 200
    `,
    sql`
      SELECT 
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'unread' OR status = 'pending')::int as unread,
        COUNT(*) FILTER (WHERE status = 'reviewed' OR status = 'read')::int as reviewed,
        COUNT(*) FILTER (WHERE status = 'replied')::int as replied
      FROM contact_queries
    `,
  ]);

  const rawCounts = countsRes[0] || {};
  const counts = {
    total: Number(rawCounts.total) || 0,
    unread: Number(rawCounts.unread) || 0,
    reviewed: Number(rawCounts.reviewed) || 0,
    replied: Number(rawCounts.replied) || 0,
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <ContactQueriesClient initialQueries={queries as unknown as ContactQuery[]} counts={counts} />
    </div>
  );
}
