/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { getSafeImageUrl, formatTimeAgo } from '@/lib/utils';

interface TopStoriesGridProps {
  featuredStory: any;
  heroSubStories?: any[];
  topStories: any[];
  trendingStories: any[];
  title?: string;
}

export function TopStoriesGrid({
  featuredStory,
  heroSubStories = [],
  topStories,
  trendingStories,
  title,
}: TopStoriesGridProps) {
  const { isSubscribed } = useSubscription();

  // Tick relative timestamps every 60s so "Just now" updates in real time
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fallbacks if data is still loading or empty
  const fallbackFeatured = {
    title: "New Research Offers Fresh Insights Into Early Cancer Detection via MicroRNA Blood Panels",
    slug: "new-research-early-cancer-detection-microrna",
    category: "CANCER",
    excerpt: "A landmark multi-centre clinical trial spanning 12,000 participants validates 89% sensitivity in pinpointing stage-1 malignancies through specialized circulating microRNA signatures.",
    image_url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    published_at: new Date().toISOString(),
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
            <span className="w-3.5 h-3.5 rounded-xs bg-[#CBF2DB]" />
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 uppercase tracking-wide">
              {title || "TOP STORIES & ANALYSIS"}
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 hidden sm:inline">
            UPDATED CONTINUOUSLY • CLINICALLY REVIEWED
          </span>
          {/* Mint Green underline */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#CBF2DB] rounded-full" />
        </div>

        {/* 3-Column Desktop News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN (Cols 1-5): Large Featured Hero Story + 2 Sub-Story Briefs */}
          <div className="lg:col-span-5 flex flex-col">
            <Link
              href={`/article/${targetSlug}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-emerald-500/20 shadow-xs hover:shadow-lg transition-all duration-300"
            >
              {/* Hero Image with Top Story badge overlay */}
              <div className="relative aspect-[16/9] w-full min-h-[220px] sm:min-h-[260px] overflow-hidden bg-slate-950">
                <Image
                  src={getSafeImageUrl(
                    primary.image_url,
                    primary.category,
                    "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80"
                  )}
                  alt={primary.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  unoptimized
                />
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                {/* Badges */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  {primary.is_breaking ? (
                    <span className="bg-red-600 text-white text-[10px] font-heading font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      BREAKING NEWS
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-[#f06d2f] to-[#ea580c] text-white text-[10px] font-heading font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      TOP STORY
                    </span>
                  )}
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
                    <span>{formatTimeAgo(primary.published_at)}</span>
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg md:text-xl text-slate-900 group-hover:text-[#16A34A] transition-colors leading-tight mb-2">
                    {primary.title}
                  </h3>
                  {(primary.excerpt || primary.description || primary.summary) && (
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3">
                      {primary.excerpt || primary.description || primary.summary}
                    </p>
                  )}
                </div>

                <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#16A34A]" />
                    <span className="text-xs font-medium text-slate-500">
                      {primary.author_name || "Medical Editorial Board"}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#f06d2f] group-hover:translate-x-1 transition-transform">
                    <span>Full Coverage</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>

            {/* 2 Sub-Story Briefs directly below Hero to balance Left Column height */}
            {heroSubStories && heroSubStories.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {heroSubStories.slice(0, 2).map((sub: any, idx: number) => {
                  const subSlug = sub.slug || `brief-${idx}`;
                  return (
                    <Link
                      key={sub.id || idx}
                      href={`/article/${subSlug}`}
                      className="group bg-white p-3.5 rounded-xl border border-emerald-500/20 shadow-2xs hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                          {sub.is_breaking ? (
                            <span className="bg-red-600 text-white text-[9px] font-heading font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                              BREAKING
                            </span>
                          ) : (
                            <span className="text-[10px] font-heading font-extrabold text-[#f06d2f] uppercase tracking-wider">
                              {sub.category || "Health"}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-mono">• {formatTimeAgo(sub.published_at)}</span>
                        </div>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                          {sub.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-[#16A34A] group-hover:text-emerald-700 flex items-center gap-1 mt-2.5 transition-colors">
                        <span>Read brief</span>
                        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* MIDDLE COLUMN (Cols 6-8): Top Stories List (5 items to balance column height) */}
          <div className="lg:col-span-4 flex flex-col divide-y divide-gray-200/80 bg-white rounded-2xl p-4 sm:p-5 border border-emerald-500/20 shadow-xs">
            <div className="pb-3 mb-2 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#16A34A]">
                Featured Headlines
              </h3>
              <span className="text-[11px] text-gray-400 font-mono">LATEST EDITIONS</span>
            </div>

            {topStories && topStories.slice(0, 5).map((story, index) => {
              const slug = story.slug || `story-${index}`;
              return (
                <article key={story.id || index} className="py-3.5 first:pt-2 last:pb-1 group">
                  <Link href={`/article/${slug}`} className="flex gap-3">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                      <Image
                        src={getSafeImageUrl(story.image_url, story.category)}
                        alt={story.title}
                        fill
                        sizes="96px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {story.is_breaking && (
                          <span className="bg-red-600 text-white text-[9px] font-heading font-black px-1.5 py-0.2 rounded uppercase tracking-wider animate-pulse">
                            BREAKING
                          </span>
                        )}
                        {story.category && (
                          <span className="text-[10px] font-heading font-extrabold text-[#f06d2f] uppercase tracking-wider">
                            {story.category}
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                        {story.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="truncate">{story.source_name || "Health Bureau"}</span>
                        <span>•</span>
                        <span className="shrink-0">{formatTimeAgo(story.published_at)}</span>
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
