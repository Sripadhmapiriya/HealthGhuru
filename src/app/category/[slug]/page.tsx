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
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { getSafeImageUrl, formatDate } from '@/lib/utils';
import { CategoryClientView } from './CategoryClientView';

export const dynamic = 'force-dynamic';

interface CategoryVisualConfig {
  image: string;
  orb1: string;
  orb2: string;
  accentBar: string;
  badgeBorder: string;
}

const CATEGORY_VISUALS: Record<string, CategoryVisualConfig> = {
  fitness: {
    image: '/images/glass_fitness.png',
    orb1: 'from-emerald-200/50 via-teal-100/35 to-transparent',
    orb2: 'from-amber-100/40 via-orange-100/25 to-transparent',
    accentBar: 'from-emerald-500 to-[#f06d2f]',
    badgeBorder: 'from-emerald-400/35 via-emerald-200/40 to-orange-300/30',
  },
  nutrition: {
    image: '/images/glass_nutrition.png',
    orb1: 'from-lime-200/50 via-emerald-100/35 to-transparent',
    orb2: 'from-amber-100/40 via-yellow-100/25 to-transparent',
    accentBar: 'from-lime-500 to-amber-500',
    badgeBorder: 'from-lime-400/35 via-emerald-200/40 to-amber-300/30',
  },
  heart: {
    image: '/images/glass_heart.png',
    orb1: 'from-rose-200/50 via-red-100/35 to-transparent',
    orb2: 'from-emerald-100/40 via-teal-100/25 to-transparent',
    accentBar: 'from-rose-500 to-emerald-500',
    badgeBorder: 'from-rose-400/35 via-pink-200/40 to-emerald-300/30',
  },
  'mental-health': {
    image: '/images/glass_mental_health.png',
    orb1: 'from-indigo-200/50 via-purple-100/35 to-transparent',
    orb2: 'from-emerald-100/40 via-sky-100/25 to-transparent',
    accentBar: 'from-indigo-500 to-emerald-500',
    badgeBorder: 'from-indigo-400/35 via-purple-200/40 to-emerald-300/30',
  },
  sleep: {
    image: '/images/glass_mental_health.png',
    orb1: 'from-blue-200/50 via-indigo-100/35 to-transparent',
    orb2: 'from-teal-100/40 via-emerald-100/25 to-transparent',
    accentBar: 'from-blue-500 to-teal-500',
    badgeBorder: 'from-blue-400/35 via-indigo-200/40 to-teal-300/30',
  },
  cancer: {
    image: '/images/glass_research_dna.png',
    orb1: 'from-teal-200/50 via-cyan-100/35 to-transparent',
    orb2: 'from-emerald-100/40 via-indigo-100/25 to-transparent',
    accentBar: 'from-teal-500 to-emerald-600',
    badgeBorder: 'from-teal-400/35 via-cyan-200/40 to-emerald-300/30',
  },
  diabetes: {
    image: '/images/glass_nutrition.png',
    orb1: 'from-sky-200/50 via-teal-100/35 to-transparent',
    orb2: 'from-emerald-100/40 via-blue-100/25 to-transparent',
    accentBar: 'from-sky-500 to-emerald-500',
    badgeBorder: 'from-sky-400/35 via-teal-200/40 to-emerald-300/30',
  },
  'womens-health': {
    image: '/images/glass_health_emblem.png',
    orb1: 'from-pink-200/50 via-rose-100/35 to-transparent',
    orb2: 'from-emerald-100/40 via-amber-100/25 to-transparent',
    accentBar: 'from-pink-500 to-emerald-500',
    badgeBorder: 'from-pink-400/35 via-rose-200/40 to-emerald-300/30',
  },
  pediatrics: {
    image: '/images/glass_health_emblem.png',
    orb1: 'from-emerald-200/50 via-cyan-100/35 to-transparent',
    orb2: 'from-amber-100/40 via-orange-100/25 to-transparent',
    accentBar: 'from-emerald-500 to-amber-500',
    badgeBorder: 'from-emerald-400/35 via-cyan-200/40 to-amber-300/30',
  },
  research: {
    image: '/images/glass_research_dna.png',
    orb1: 'from-cyan-200/50 via-emerald-100/35 to-transparent',
    orb2: 'from-blue-100/40 via-indigo-100/25 to-transparent',
    accentBar: 'from-cyan-500 to-emerald-500',
    badgeBorder: 'from-cyan-400/35 via-emerald-200/40 to-teal-300/30',
  },
};

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

  const visualConfig = CATEGORY_VISUALS[params.slug.toLowerCase()] || {
    image: '/images/glass_health_emblem.png',
    orb1: 'from-emerald-200/50 via-teal-100/35 to-transparent',
    orb2: 'from-amber-100/40 via-orange-100/25 to-transparent',
    accentBar: 'from-emerald-500 to-[#f06d2f]',
    badgeBorder: 'from-emerald-400/35 via-emerald-200/40 to-orange-300/30',
  };

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

        {/* Category Header Banner with Glassmorphism, 3D Glass Transparent Image & Hover Animations */}
        <div className="group relative bg-white/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/80 ring-1 ring-emerald-500/20 shadow-[0_12px_40px_rgba(22,163,74,0.08)] hover:shadow-[0_25px_65px_-10px_rgba(22,163,74,0.2)] hover:border-emerald-400/50 transition-all duration-500 mb-8 overflow-hidden">
          
          {/* Top Glass Specular Reflection Lines */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
          <div className="absolute top-0 left-12 right-12 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent pointer-events-none group-hover:via-emerald-400 transition-colors duration-500" />

          {/* Ambient Glowing Glass Orbs shining from behind with bespoke category colors */}
          <div className={`absolute top-0 right-1/4 w-[480px] h-[480px] bg-gradient-to-br ${visualConfig.orb1} rounded-full blur-3xl pointer-events-none -mr-24 -mt-24 group-hover:scale-120 group-hover:opacity-90 transition-all duration-700`} />
          <div className={`absolute bottom-0 left-10 w-80 h-80 bg-gradient-to-tr ${visualConfig.orb2} rounded-full blur-3xl pointer-events-none -mb-20 group-hover:scale-110 transition-transform duration-700`} />

          {/* Subtle Glass Frost Texture / Watermark */}
          <div 
            className="absolute inset-0 opacity-[0.035] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#16a34a 1.2px, transparent 1.2px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* 3D Glass Transparent Image Floating Inside Section (Unique Per Category) */}
          <div className="flex absolute -right-6 sm:right-6 md:right-12 lg:right-72 xl:right-80 top-1/2 -translate-y-1/2 w-36 h-36 sm:w-44 sm:h-44 lg:w-56 lg:h-56 pointer-events-none z-0 items-center justify-center opacity-35 sm:opacity-85 lg:opacity-95 group-hover:opacity-100 transition-all duration-700">
            <div className="relative w-full h-full animate-float transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
              {/* Soft Refractive Light Ring around Glass Emblem */}
              <div className="absolute inset-4 bg-gradient-to-br from-emerald-400/25 via-teal-300/20 to-amber-300/15 rounded-full blur-2xl pointer-events-none" />
              <Image
                src={visualConfig.image}
                alt={`${categoryName} 3D Glass Emblem`}
                fill
                className="object-contain drop-shadow-[0_20px_35px_rgba(22,163,74,0.22)]"
                priority
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-3xl">
              {/* Frosted Glass Header Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-emerald-500/25 mb-3.5 shadow-2xs group-hover:bg-white/95 group-hover:border-emerald-500/40 transition-all duration-300">
                <span className="w-2 h-4 rounded-full bg-gradient-to-b from-[#f06d2f] to-[#ea580c] shadow-[0_0_8px_rgba(240,109,47,0.5)]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#16A34A] font-extrabold flex items-center gap-2">
                  <span>HEALTHGHURU EDITORIAL TOPIC HUB</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </span>
              </div>

              {/* Title with accent bar */}
              <div className="space-y-2">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] group-hover:text-emerald-950 transition-colors duration-300">
                  {categoryName.toUpperCase()}
                </h1>
                <div className={`w-14 h-1 bg-gradient-to-r ${visualConfig.accentBar} rounded-full group-hover:w-24 transition-all duration-500`} />
              </div>

              <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Evidence-based reporting, clinical research breakthroughs, doctor interviews,
                and validated wellness guides in {categoryName}.
              </p>

              {/* Frosted Glass Interactive Pills with Micro-Animations */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
                <div className="group/chip inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-emerald-50/90 backdrop-blur-md border border-emerald-200/90 hover:border-emerald-400 text-emerald-800 font-bold transition-all duration-200 hover:scale-105 hover:shadow-xs cursor-default">
                  <Sparkles size={13} className="text-[#16A34A] group-hover/chip:rotate-12 transition-transform duration-300" />
                  <span>{items.length}+ Articles Available</span>
                </div>
                <div className="group/chip inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-slate-100/90 backdrop-blur-md border border-slate-200 hover:border-slate-300 text-slate-700 font-medium transition-all duration-200 hover:scale-105 hover:shadow-xs cursor-default">
                  <Clock size={13} className="text-slate-500 group-hover/chip:rotate-45 transition-transform duration-300" />
                  <span>Updated Daily</span>
                </div>
                <div className="group/chip inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-orange-50/90 backdrop-blur-md border border-orange-200 hover:border-orange-300 text-[#ea580c] font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xs cursor-default">
                  <Activity size={13} className="text-[#f06d2f] group-hover/chip:scale-110 transition-transform duration-300" />
                  <span>Clinically Sourced</span>
                </div>
              </div>
            </div>

            {/* Medically Verified Badge Card with Pure Glassmorphic Styling */}
            <div className={`relative group/badge p-[1.5px] rounded-2xl bg-gradient-to-br ${visualConfig.badgeBorder} hover:from-emerald-500 hover:via-emerald-400 hover:to-orange-400 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1.5 shrink-0 cursor-default`}>
              <div className="relative flex items-center gap-4 bg-white/75 hover:bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-[15px] border border-white/80 shadow-[0_8px_30px_rgba(22,163,74,0.06)] overflow-hidden transition-all duration-300">
                {/* Light Sweep Sheen Animation across Card on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                {/* Shield Icon with Ambient Glow */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-emerald-400/25 rounded-2xl blur-md group-hover/badge:bg-emerald-500/40 transition-all duration-300" />
                  <div className="relative p-3 rounded-xl bg-white/90 backdrop-blur-md text-[#16A34A] border border-white shadow-xs group-hover/badge:scale-110 group-hover/badge:rotate-3 transition-all duration-300">
                    <ShieldCheck size={28} className="stroke-[2.2]" />
                  </div>
                </div>

                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-extrabold text-slate-900 text-sm tracking-tight group-hover/badge:text-[#16A34A] transition-colors">
                      Medically Verified Hub
                    </p>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5 font-normal">
                    Reviewed by board-certified physicians
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300/70 px-2.5 py-0.5 rounded-full shadow-2xs group-hover/badge:bg-emerald-200/90 transition-colors">
                      <CheckCircle2 size={11} className="text-emerald-700" />
                      ISO / Peer-Review Standards
                    </span>
                  </div>
                </div>
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
