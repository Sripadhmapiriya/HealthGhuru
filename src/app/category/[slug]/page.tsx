/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BreakingNewsTicker } from '@/components/media/BreakingNewsTicker';
import { Clock, ShieldCheck, Flame, ArrowRight, BookOpen, Layers } from 'lucide-react';

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
    description: cats.length > 0 ? cats[0].description : `Latest clinical breakthroughs, treatments, and physician insights in ${name}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const catSlug = params.slug.toLowerCase();
  const searchPattern = `%${catSlug.replace('womens-health', 'women').replace('heart', 'heart')}%`;

  // Fetch Category Items
  const [items, breakingRes, trendingRes] = await Promise.all([
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE (LOWER(i.category) LIKE ${searchPattern} OR LOWER(i.slug) LIKE ${searchPattern})
        AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 20
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
    `
  ]);

  const categoryName = params.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const featuredStory = items[0];
  const listStories = items.slice(1);

  return (
    <div className="w-full bg-surface min-h-screen">
      {/* Breaking News */}
      <BreakingNewsTicker items={breakingRes} />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Category Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2E7D32]/20 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-6 rounded-full bg-[#f06d2f]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#2E7D32] font-bold">
                  HEALTHGHURU EDITORIAL TOPIC HUB
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A2E1A] tracking-tight">
                {categoryName.toUpperCase()}
              </h1>
              <p className="mt-2 text-sm text-[#4A6741] max-w-2xl leading-relaxed">
                Comprehensive news coverage, clinical research findings, expert interviews, and validated prevention guides in {categoryName}.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#F5FAF5] p-3 rounded-2xl border border-[#2E7D32]/20 shrink-0">
              <ShieldCheck size={24} className="text-[#2E7D32]" />
              <div className="text-xs">
                <p className="font-bold text-[#1A2E1A]">Medically Verified</p>
                <p className="text-gray-500 text-[11px]">Reviewed by board-certified physicians</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column News Layout: Feed (Cols 1-8) + Sidebar (Cols 9-12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Category Feed */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Featured Story */}
            {featuredStory && (
              <article className="bg-white rounded-3xl overflow-hidden border border-[#2E7D32]/20 shadow-xs hover:shadow-md transition-all group">
                <div className="relative aspect-[16/9] w-full bg-gray-100">
                  {featuredStory.image_url && (
                    <Image
                      src={featuredStory.image_url}
                      alt={featuredStory.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#f06d2f] text-white text-[11px] font-heading font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      FEATURED IN {categoryName.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <Link href={`/article/${featuredStory.slug}`}>
                    <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors leading-snug">
                      {featuredStory.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-[#4A6741] line-clamp-3 mt-3 leading-relaxed">
                    {featuredStory.excerpt || featuredStory.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-mono">{featuredStory.source_name || "Health Bureau"}</span>
                    <Link
                      href={`/article/${featuredStory.slug}`}
                      className="text-[#f06d2f] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read Full Report</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* List of Other Stories in this Category */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[#2E7D32]">
                <Layers size={18} className="text-[#1B5E20]" />
                <h3 className="font-heading font-extrabold text-base uppercase tracking-wider text-[#1A2E1A]">
                  Latest {categoryName} Stories
                </h3>
              </div>

              {listStories.length > 0 ? (
                listStories.map((story) => (
                  <article
                    key={story.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#2E7D32]/15 hover:border-[#2E7D32]/40 hover:shadow-sm transition-all duration-200 group flex flex-col sm:flex-row gap-4 items-center"
                  >
                    {story.image_url && (
                      <div className="relative w-full sm:w-36 aspect-[16/10] sm:aspect-auto sm:h-28 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                        <Image
                          src={story.image_url}
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-[#f06d2f] font-bold uppercase tracking-wider">
                        {story.subcategory || categoryName}
                      </span>
                      <Link href={`/article/${story.slug}`}>
                        <h4 className="font-heading font-bold text-sm sm:text-base text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug mt-0.5">
                          {story.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-[#4A6741] line-clamp-2 mt-1.5 leading-relaxed">
                        {story.excerpt || story.description}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-2 font-mono">
                        <span>{story.source_name || "HealthGhuru"}</span>
                        <span>•</span>
                        <span>Recent</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
                  <p>No additional stories in this category yet. Stay tuned for new updates!</p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Trending in HealthGhuru */}
            <div className="bg-white rounded-2xl p-5 border border-[#2E7D32]/20 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
                <Flame size={16} className="text-[#f06d2f] fill-[#f06d2f]" />
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1B5E20]">
                  TRENDING ACROSS PLATFORM
                </h3>
              </div>
              <div className="divide-y divide-gray-100 space-y-3">
                {trendingRes.map((tr: any, idx) => (
                  <Link
                    key={tr.id}
                    href={`/article/${tr.slug}`}
                    className="pt-3 first:pt-0 flex items-start gap-3 group cursor-pointer"
                  >
                    <span className="font-display font-bold text-xl text-gray-300 group-hover:text-[#f06d2f] transition-colors leading-none w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-semibold text-xs text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                        {tr.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                        {tr.category || "Health"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Hospital / Clinic Partner Ad Banner */}
            <div className="bg-gradient-to-br from-[#143419] to-[#0f2e15] text-white rounded-2xl p-5 border border-emerald-500/30 shadow-sm">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#ffd6c1] bg-white/10 px-2 py-0.5 rounded block w-fit mb-2">
                SPONSORED HEALTHCARE
              </span>
              <h4 className="font-heading font-bold text-sm text-white leading-snug">
                Advanced Clinical Screenings & Oncology Panels
              </h4>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                Connect with accredited specialty hospitals for early intervention and second opinions.
              </p>
              <Link
                href="/hospitals"
                className="mt-4 block w-full py-2 text-center text-xs font-heading font-bold text-[#1A2E1A] bg-white hover:bg-gray-100 rounded-xl transition-all"
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
