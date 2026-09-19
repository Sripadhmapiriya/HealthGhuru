import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { CategoriesClient, CategoryItem } from './CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const categories = await sql`
    WITH counts AS (
      SELECT LOWER(category) as cat, COUNT(*)::int as count
      FROM content_items
      WHERE deleted_at IS NULL
      GROUP BY LOWER(category)
    )
    SELECT 
      c.id,
      c.name,
      c.slug,
      c.description,
      c.icon_name,
      c.display_order,
      c.is_enabled,
      c.created_at,
      COALESCE(counts.count, 0) as item_count
    FROM content_categories c
    LEFT JOIN counts ON LOWER(c.name) = counts.cat
    ORDER BY c.display_order ASC, c.name ASC
  `;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <CategoriesClient initialCategories={categories as unknown as CategoryItem[]} />
    </div>
  );
}
