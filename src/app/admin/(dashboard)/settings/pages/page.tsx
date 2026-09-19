import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { AdminPagesClient } from './AdminPagesClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Website Pages CMS | HealthGhuru Admin',
  description: 'Manage, edit and publish content for all public-facing pages on HealthGhuru.',
};

export default async function AdminPagesPage() {
  await requireAdmin();

  let initialPages: any[] = [];
  try {
    const rows = await sql`
      SELECT 
        id, slug, title, subtitle, content, meta_description, published_by,
        created_at, updated_at, published_at
      FROM website_pages
      ORDER BY 
        CASE slug
          WHEN 'about-us' THEN 1
          WHEN 'privacy-policy' THEN 2
          WHEN 'terms-and-conditions' THEN 3
          WHEN 'disclaimer' THEN 4
          WHEN 'contact-us' THEN 5
          WHEN 'advertise-with-us' THEN 6
          ELSE 7
        END ASC
    `;
    initialPages = rows;
  } catch (err) {
    console.error('Error fetching website pages in admin server component:', err);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AdminPagesClient initialPages={initialPages} />
    </div>
  );
}
