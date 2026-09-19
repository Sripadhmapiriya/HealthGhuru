import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { UnifiedContentClient } from './UnifiedContentClient';
import { Plus, CheckSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  await requireAdmin();

  // Run lightweight projected queries in parallel (avoid fetching huge full bodies / embeddings)
  const [items, categories, sources] = await Promise.all([
    sql`
      SELECT 
        i.id,
        i.title,
        i.slug,
        i.content_type,
        i.category,
        i.status,
        i.is_breaking,
        i.is_featured,
        i.is_trending,
        i.is_external,
        i.canonical_url,
        i.published_at,
        i.author_name,
        s.name as source_name,
        s.type as source_type
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 100
    `,
    sql`SELECT id, name FROM content_categories ORDER BY display_order ASC, name ASC`,
    sql`SELECT id, name FROM content_sources ORDER BY name ASC`
  ]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <AdminPageHeader
        tag="Editorial Wire"
        title="Content Management"
        subtitle="Manage, filter, verify, and publish HealthGhuru original articles alongside syndicated health news, videos, and clinical research."
        actions={
          <>
            <Link 
              href="/admin/review-queue"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-heading font-bold shadow-2xs transition-all"
            >
              <CheckSquare size={15} className="text-[#16A34A]" />
              <span>Review Queue</span>
            </Link>
            <Link 
              href="/admin/content/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#f06d2f] hover:bg-[#e05a1b] text-white text-xs font-heading font-bold shadow-md hover:shadow-orange-500/20 active:scale-98 transition-all"
            >
              <Plus size={16} />
              <span>Write Original Article</span>
            </Link>
          </>
        }
      />

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden p-4 sm:p-5">
        <UnifiedContentClient initialItems={items} categories={categories} sources={sources} />
      </div>
    </div>
  );
}
