import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SponsoredArticlesClient } from './SponsoredArticlesClient';
import { SponsoredArticle } from '@/lib/types/advertisement';

export const dynamic = 'force-dynamic';

export default async function SponsoredArticlesPage() {
  await requireAdmin();

  let articles: SponsoredArticle[] = [];
  try {
    const rows = await sql`
      SELECT * FROM sponsored_articles
      ORDER BY created_at DESC
    `;
    articles = rows as SponsoredArticle[];
  } catch {
    // Table may not exist yet — user needs to run migration
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <ScrollReveal>
        <SectionHeader
          title="Sponsored Articles"
          eyebrow="Advertisements · Sponsored Content"
          subtitle="Link HealthGhuru articles to hospital and doctor sponsors. A 'Sponsored by' badge will appear on the article page."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        {articles === null ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <h3 className="font-heading font-bold text-red-700 mb-2">⚠️ Database Tables Missing</h3>
            <p className="text-sm text-red-600">
              Run the migration script first:{' '}
              <code className="bg-red-100 px-2 py-0.5 rounded font-mono text-xs">scripts/migrate-ads-v2.sql</code>
            </p>
          </div>
        ) : (
          <SponsoredArticlesClient initialArticles={articles} />
        )}
      </ScrollReveal>
    </div>
  );
}
