/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSubscription } from '@/lib/hooks/useSubscription';

interface TopStoriesGridProps {
  featuredStory: any;
  topStories: any[];
  trendingStories: any[];
}

export function TopStoriesGrid({
  featuredStory,
  topStories,
  trendingStories,
}: TopStoriesGridProps) {
  const { isSubscribed } = useSubscription();
  // Fallbacks if data is still loading or empty
  const fallbackFeatured = {
    title: "New Research Offers Fresh Insights Into Early Cancer Detection via MicroRNA Blood Panels",
    slug: "new-research-early-cancer-detection-microrna",
    category: "CANCER",
    excerpt: "A landmark multi-centre clinical trial spanning 12,000 participants validates 89% sensitivity in pinpointing stage-1 malignancies through specialized circulating microRNA signatures.",
    image_url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    published_at: "2 hours ago",
    source_name: "National Cancer Institute Journal",
    author_name: "Dr. Rohini Ramanathan",
  };

  const primary = featuredStory || fallbackFeatured;
  const targetSlug = primary.slug || "new-research-early-cancer-detection-microrna";

  return (
    <section className="w-full py-6 sm:py-8 bg-surface">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* News Portal Section Header with Brand Gradient Underline */}
        <div className="flex items-center justify-between pb-3.5 mb-6 relative">
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-gradient-to-r from-[#16A34A] to-[#f06d2f]" />
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 uppercase tracking-wide">
              TOP STORIES & ANALYSIS
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 hidden sm:inline">
            UPDATED CONTINUOUSLY • CLINICALLY REVIEWED
          </span>
          {/* Gradient underline */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f] rounded-full" />
        </div>

        {/* 3-Column Desktop News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN (Cols 1-5): Large Featured Hero Story */}
          <div className="lg:col-span-5 flex flex-col">
            <Link
              href={`/article/${targetSlug}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-emerald-500/20 shadow-xs hover:shadow-lg transition-all duration-300"
            >
              {/* Hero Image with Top Story badge overlay */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
                {primary.image_url ? (
                  <Image
                    src={primary.image_url}
                    alt={primary.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-[#16A34A] font-heading font-bold">
                    HealthGhuru Featured Story
                  </div>
                )}
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                {/* Badges */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#f06d2f] to-[#ea580c] text-white text-[10px] font-heading font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    TOP STORY
                  </span>
                  {primary.category && (
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-heading font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20">
                      {primary.category}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-[11px] font-mono">
                  <span className="font-semibold">{primary.source_name || "HealthGhuru Bureau"}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Just now</span>
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl md:text-2xl text-slate-900 group-hover:text-[#16A34A] transition-colors leading-tight mb-2.5">
                    {primary.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                    {primary.excerpt || primary.description || primary.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#16A34A]" />
                    <span className="text-xs font-medium text-slate-500">
                      {primary.author_name || "Medical Editorial Board"}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#f06d2f] group-hover:translate-x-1 transition-transform">
                    <span>Full Coverage</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* MIDDLE COLUMN (Cols 6-8): Top Stories List */}
          <div className="lg:col-span-4 flex flex-col divide-y divide-gray-200/80 bg-white rounded-2xl p-4 sm:p-5 border border-emerald-500/20 shadow-xs">
            <div className="pb-3 mb-2 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#16A34A]">
                Featured Headlines
              </h3>
              <span className="text-[11px] text-gray-400 font-mono">LATEST EDITIONS</span>
            </div>

            {topStories && topStories.slice(0, 4).map((story, index) => {
              const slug = story.slug || `story-${index}`;
              return (
                <article key={story.id || index} className="py-3.5 first:pt-2 last:pb-1 group">
                  <Link href={`/article/${slug}`} className="flex gap-3">
                    {story.image_url && (
                      <div className="relative w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                        <Image
                          src={story.image_url}
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      {story.category && (
                        <span className="text-[10px] font-heading font-extrabold text-[#f06d2f] uppercase tracking-wider">
                          {story.category}
                        </span>
                      )}
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                        {story.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="truncate">{story.source_name || "Health Bureau"}</span>
                        <span>•</span>
                        <span className="shrink-0">3h ago</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {/* RIGHT COLUMN (Cols 9-12): TRENDING 🔥 01-05 */}
          <div className="lg:col-span-3 flex flex-col bg-white text-slate-900 rounded-2xl p-5 shadow-xs border border-emerald-500/20">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-[#f06d2f] fill-[#f06d2f]" />
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-900">
                  TRENDING 🔥
                </h3>
              </div>
              <Link
                href="/trending"
                className="text-[10px] font-mono font-bold text-[#16A34A] hover:text-[#15803D] uppercase tracking-wider"
              >
                VIEW ALL
              </Link>
            </div>

            {/* Numbered Stories 01 to 05 */}
            <div className="divide-y divide-gray-100 space-y-3">
              {trendingStories && trendingStories.slice(0, 5).map((story, index) => {
                const rank = String(index + 1).padStart(2, '0');
                const slug = story.slug || `trending-${index}`;
                return (
                  <Link
                    key={story.id || index}
                    href={`/article/${slug}`}
                    className="pt-3 first:pt-0 block group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Big Bold Rank Number */}
                      <span className="font-display font-black text-2xl sm:text-3xl text-emerald-600/50 group-hover:text-[#f06d2f] transition-colors leading-none shrink-0 w-8">
                        {rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        {story.category && (
                          <span className="text-[10px] font-mono uppercase font-bold text-[#f06d2f]">
                            {story.category}
                          </span>
                        )}
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug mt-0.5">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                          <span>{story.view_count ? `${story.view_count} reads` : '4.2k reads'}</span>
                          <span>•</span>
                          <span>Trending</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Sidebar Promo Ad card inside trending box */}
            {isSubscribed ? (
              <div className="mt-5 pt-4 border-t border-gray-100 bg-emerald-50/70 rounded-xl p-3 text-center border border-emerald-200/60">
                <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-800 font-bold block mb-1">
                  VIP CLINICAL DIGEST
                </span>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Ad-Free Priority Medical Access Active
                </p>
              </div>
            ) : (
              <div className="mt-5 pt-4 border-t border-gray-100 bg-emerald-50/70 rounded-xl p-3 text-center border border-emerald-200/60">
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#16A34A] font-bold block mb-1">
                  NEWSLETTER BRIEFING
                </span>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Daily Doctor-Curated Health Digest
                </p>
                <Link
                  href="/subscribe"
                  className="inline-block mt-2 text-[11px] font-bold text-[#f06d2f] hover:underline"
                >
                  Subscribe Free →
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
