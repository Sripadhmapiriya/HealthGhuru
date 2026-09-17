/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { AllNewsClient } from './AllNewsClient';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'All News - News Management | HealthGhuru CMS',
};

export default async function AllNewsPage({
  searchParams,
}: {
  searchParams?: { status?: string; filter?: string };
}) {
  await requireAdmin();

  // Fetch news articles from content_items
  const [items, countRes] = await Promise.all([
    sql`
      SELECT 
        id,
        title,
        slug,
        category,
        language,
        excerpt,
        description,
        image_url,
        published_at,
        is_breaking,
        status,
        raw_metadata
      FROM content_items
      WHERE deleted_at IS NULL
      ORDER BY published_at DESC NULLS LAST
      LIMIT 120
    `,
    sql`
      SELECT count(*) as total
      FROM content_items
      WHERE deleted_at IS NULL
    `,
  ]);

  const totalCount = parseInt(countRes[0]?.total || '0', 10);

  return (
    <div className="py-2">
      <AllNewsClient initialNews={items as any} totalCount={totalCount} />
    </div>
  );
}
