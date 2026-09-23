/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BreakingNewsTicker } from '@/components/media/BreakingNewsTicker';
import {
  Clock,
  ShieldCheck,
  Flame,
  ArrowRight,
  BookOpen,
  Layers,
  ChevronRight,
  Sparkles,
  HeartPulse,
  Share2,
} from 'lucide-react';
import { getSafeImageUrl, formatDate } from '@/lib/utils';
import { CategoryClientView } from './CategoryClientView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cats = await sql`
    SELECT name, description FROM content_categories WHERE slug = ${params.slug} LIMIT 1
  `;
  const name = cats.length > 0 ? cats[0].name : params.slug.replace(/-/g, ' ');
  return {
    title: `${name.toUpperCase()} News, Clinical Research & Updates | HealthGhuru`,
    description:
      cats.length > 0
        ? cats[0].description
        : `Latest clinical breakthroughs, treatments, and physician insights in ${name}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const catSlug = params.slug.toLowerCase();
  const searchPattern = `%${catSlug
    .replace('womens-health', 'women')
    .replace('heart', 'heart')}%`;

  // Fetch Category Items
  const [items, breakingRes, trendingRes] = await Promise.all([
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE (LOWER(i.category) LIKE ${searchPattern} OR LOWER(i.slug) LIKE ${searchPattern})
        AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 24
    `,
    sql`
      SELECT id, title, slug, category, canonical_url, is_external
      FROM content_items
      WHERE is_breaking = TRUE AND status = 'published'
      ORDER BY published_at DESC LIMIT 5
    `,
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY (i.is_trending::int * 5 + i.view_count) DESC
      LIMIT 5
    `,
  ]);

  const categoryName = params.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const featuredStory = items[0];
  const listStories = items.slice(1);

  return (
    <div className="w-full bg-[#f8faf8] min-h-screen">
      {/* Breaking News */}
      <BreakingNewsTicker items={breakingRes} />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#16A34A] transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="text-slate-400 shrink-0" />
          <span className="text-slate-400">Categories</span>
          <ChevronRight size={13} className="text-slate-400 shrink-0" />
          <span className="text-[#16A34A] font-bold">{categoryName}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xs mb-8 relative overflow-hidden">
          {/* Ambient Background Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/70 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#f06d2f] to-[#ea580c]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#16A34A] font-extrabold flex items-center gap-2">
                  <span>HEALTHGHURU EDITORIAL TOPIC HUB</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {categoryName.toUpperCase()}
              </h1>

              <p className="mt-2.5 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Evidence-based reporting, clinical research breakthroughs, doctor interviews,
                and validated wellness guides in {categoryName}.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#16A34A]" />
                  {items.length}+ Articles Available
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-medium">
                  Updated Daily
                </span>
                <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#f06d2f] font-medium">
                  Clinically Sourced
                </span>
              </div>
            </div>

            {/* Medically Verified Badge Card */}
            <div className="flex items-center gap-3.5 bg-gradient-to-br from-[#F5FAF5] to-emerald-50/60 p-4 rounded-2xl border border-emerald-500/25 shrink-0 shadow-xs">
              <div className="p-2.5 rounded-xl bg-white shadow-xs text-[#16A34A] border border-emerald-100">
                <ShieldCheck size={26} />
              </div>
              <div className="text-xs">
                <p className="font-heading font-extrabold text-slate-900 text-sm">
                  Medically Verified Hub
                </p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Reviewed by board-certified physicians
                </p>
                <span className="inline-block mt-1 text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                  ISO / Peer-Review Standards
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column News Layout: Feed (Cols 1-8) + Sticky Sidebar (Cols 9-12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured Hero Story - Modern Magazine Split Layout */}
            {featuredStory && (
              <article className="group bg-white rounded-3xl overflow-hidden border border-emerald-500/25 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                  {/* Hero Image Side */}
                  <div className="md:col-span-7 relative aspect-[16/10] md:aspect-auto md:min-h-[340px] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={getSafeImageUrl(
                        featuredStory.image_url,
                        featuredStory.category || categoryName
                      )}
                      alt={featuredStory.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 550px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-[#f06d2f] to-[#ea580c] text-white text-[11px] font-heading font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                        FEATURED IN {categoryName.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Hero Content Side */}
                  <div className="md:col-span-5 p-6 sm:p-7 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2.5">
                        <span className="text-[#f06d2f] font-bold uppercase">
                          {featuredStory.subcategory || categoryName}
                        </span>
                        <span>•</span>
                        <span>
                          {featuredStory.published_at
                            ? formatDate(featuredStory.published_at)
                            : 'Recent Update'}
                        </span>
                      </div>

                      <Link href={`/article/${featuredStory.slug}`}>
                        <h2 className="font-heading font-extrabold text-lg sm:text-xl md:text-2xl text-slate-900 group-hover:text-[#16A34A] transition-colors leading-snug">
                          {featuredStory.title}
                        </h2>
                      </Link>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mt-3 leading-relaxed">
                        {featuredStory.excerpt ||
                          featuredStory.description ||
                          featuredStory.summary ||
                          'Read the complete clinical investigation, expert opinions, and practical takeaways.'}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-500 font-semibold truncate max-w-[140px]">
                        {featuredStory.source_name || 'HealthGhuru Bureau'}
                      </span>
                      <Link
                        href={`/article/${featuredStory.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-white bg-[#16A34A] hover:bg-[#15803d] px-4 py-2 rounded-xl transition-all shadow-xs"
                      >
                        <span>Read Report</span>
                        <ArrowRight
                          size={13}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Client Interactive Filter & Grid Feed */}
            <CategoryClientView
              stories={listStories}
              categoryName={categoryName}
              categorySlug={params.slug}
            />
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Trending in Platform */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-500/20 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                <div className="p-1 rounded-lg bg-orange-50 text-[#f06d2f]">
                  <Flame size={18} className="fill-[#f06d2f]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">
                    TRENDING ACROSS PLATFORM
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Most read this week</p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {trendingRes.map((tr: any, idx) => (
                  <Link
                    key={tr.id}
                    href={`/article/${tr.slug}`}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5 group cursor-pointer"
                  >
                    <span className="font-display font-black text-2xl text-slate-300 group-hover:text-[#f06d2f] transition-colors leading-none w-7 shrink-0 text-center">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-heading font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                        {tr.category || 'Health'}
                      </span>
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                        {tr.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        {tr.source_name || 'HealthGhuru'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Health Advisory / Quick Tip Box */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-5 sm:p-6 border border-emerald-500/25 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-heading font-bold text-xs uppercase tracking-wider mb-2">
                <HeartPulse size={16} className="text-[#16A34A]" />
                <span>Editorial Advisory</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                Clinical Consensus on {categoryName}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Peer-reviewed nutrition evidence emphasizes whole foods, consistent meal timing,
                and targeted hydration over fad protocols. Consult certified dietitians for
                personalized intervention plans.
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-200/50 flex items-center justify-between text-[11px] font-mono text-emerald-800">
                <span>Verified by MD Board</span>
                <span className="font-bold text-[#16A34A]">HealthGhuru Standard</span>
              </div>
            </div>

            {/* Sponsored Hospital / Healthcare Partner */}
            <div className="bg-gradient-to-br from-[#123318] via-[#0d2812] to-[#081f0c] text-white rounded-3xl p-6 border border-emerald-500/30 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#ffd6c1] bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-3 border border-white/10">
                SPONSORED HEALTHCARE
              </span>
              <h4 className="font-heading font-extrabold text-base text-white leading-snug">
                Advanced Clinical Screenings &amp; Oncology Panels
              </h4>
              <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                Connect directly with certified specialty hospitals for comprehensive diagnostic
                workups and verified second opinions.
              </p>
              <Link
                href="/hospitals"
                className="mt-5 block w-full py-2.5 text-center text-xs font-heading font-bold text-[#123318] bg-white hover:bg-emerald-50 rounded-xl transition-all shadow-sm"
              >
                Browse Accredited Hospitals →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
