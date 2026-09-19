/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { evaluateSourceHealth } from '@/lib/ingestion/health';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SourcesClient } from './SourcesClient';

export const dynamic = 'force-dynamic';

export default async function AdminSourcesPage() {
  await requireAdmin();

  const [sources, categories] = await Promise.all([
    sql`
      SELECT s.*, c.name as category_name
      FROM content_sources s
      LEFT JOIN content_categories c ON s.category_id = c.id
      ORDER BY s.priority ASC, s.name ASC
    `,
    sql`
      SELECT id, name, slug FROM content_categories ORDER BY display_order ASC, name ASC
    `
  ]);

  const enrichedSources = sources.map((s: any) => ({
    ...s,
    healthStatus: evaluateSourceHealth(s),
  }));

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <AdminPageHeader
        tag="Ingestion Engine"
        title="Content Sources & Adapters"
        subtitle="Configure external RSS medical feeds, YouTube channels, Clinical News APIs, and automated syndication endpoints."
      />

      <div className="w-full">
        <SourcesClient initialSources={enrichedSources} categories={categories} />
      </div>
    </div>
  );
}
