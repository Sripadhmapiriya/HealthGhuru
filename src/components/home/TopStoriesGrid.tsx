/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { getSafeImageUrl, formatTimeAgo, formatDate } from '@/lib/utils';

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

  // Fallbacks if data is still loading or empty matching Image 1
  const fallbackFeatured = {
    title: "Eat Well, Live Better",
    subtitle: "Simple nutrition changes that make a big difference in your health",
    slug: "eat-well-live-better-simple-nutrition-changes",
    category: "Nutrition",
    excerpt: "Discover easy, practical food choices to boost your energy, strengthen your immune system and support long-term wellness.",
    description: "Discover easy, practical food choices to boost your energy, strengthen your immune system and support long-term wellness.",
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85",
    published_at: new Date().toISOString(),
    source_name: "HealthGhuru Bureau",
    author_name: "Medically Reviewed",
  };

  const primary = featuredStory || fallbackFeatured;
  const targetSlug = primary.slug || "eat-well-live-better-simple-nutrition-changes";

  // Sanitize image URL: replace screenshots or localhost URLs with healthy salad bowl image from Image 1
  const rawImageUrl = primary.image_url || "";
  const isScreenshotOrBad =
    !rawImageUrl ||
    rawImageUrl.toLowerCase().includes("screenshot") ||
    rawImageUrl.includes("localhost") ||
    rawImageUrl.includes("127.0.0.1");

  const heroImageUrl = isScreenshotOrBad
    ? "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85"
    : getSafeImageUrl(
        primary.image_url,
        primary.category,
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85"
      );

  return (
    <section className="w-full pt-3 sm:pt-4 pb-8 sm:pb-10">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* News Portal Section Header with Brand Gradient Underline */}
        <div className="flex items-center justify-between pb-3.5 mb-6 relative">
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-md bg-gradient-to-br from-[#16A34A] via-[#22c55e] to-[#f06d2f] shadow-sm shadow-emerald-600/30 flex items-center justify-center text-white text-[9px] font-black">✦</span>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 uppercase tracking-wide">
              {title || "TOP STORIES & ANALYSIS"}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 hidden sm:inline">
            UPDATED CONTINUOUSLY • CLINICALLY REVIEWED
          </span>
          {/* Dual-Gradient underline */}
          <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f] rounded-full shadow-xs" />
        </div>

        {/* 3-Column Desktop News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN (Cols 1-6): Large Featured Hero Story + 2 Sub-Story Briefs */}
          <div className="lg:col-span-6 flex flex-col">
            {/* HERO BREAKING / TOP STORY CARD (Format matched to Image 1) */}
            <Link
              href={`/article/${targetSlug}`}
              className="group relative block w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/80"
            >
              {/* Full Bleed Image with Clear, Vivid Lighting */}
              <div className="relative min-h-[400px] sm:min-h-[460px] lg:min-h-[500px] w-full overflow-hidden">
                <Image
                  src={heroImageUrl}
                  alt={primary.title || "Health and Wellness"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                  unoptimized
                />
                {/* Lighter, bottom-focused gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-50% to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

                {/* Card Content Anchored to Bottom */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-7 md:p-9">
                  {/* Badge: Orange rounded-full pill */}
                  <div className="mb-2 sm:mb-3">
                    <span className="inline-block bg-[#f06d2f] text-white text-[11px] sm:text-sm font-heading font-extrabold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md shadow-orange-950/40">
                      {primary.category || "Nutrition"}
                    </span>
                  </div>

                  {/* Headline & Description Content */}
                  <div className="mb-3 sm:mb-4 max-w-2xl">
                    <h3 className="font-heading font-black text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-white tracking-tight leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] group-hover:text-emerald-300 transition-colors">
                      {primary.title}
                    </h3>
                    {(primary.subtitle || primary.excerpt) && (
                      <p className="font-heading font-bold text-xs sm:text-base md:text-lg text-white/95 mt-1.5 sm:mt-2.5 line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {primary.subtitle || primary.excerpt}
                      </p>
                    )}
                    {(primary.description || primary.summary) && (
                      <p className="text-xs sm:text-sm text-slate-100 font-medium mt-1 sm:mt-2 leading-relaxed line-clamp-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] hidden xs:block">
                        {primary.description || primary.summary}
                      </p>
                    )}
                  </div>

                  {/* Bottom Row */}
                  <div className="pt-3 sm:pt-4 border-t border-white/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-100 flex-wrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                        <span>Medically Reviewed</span>
                      </span>
                      <span className="text-white/60">|</span>
                      <span className="flex items-center gap-1 text-slate-200">
                        <Clock size={12} className="text-amber-400 shrink-0" />
                        <span>Updated: {formatDate(primary.published_at || new Date())}</span>
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-[#f06d2f] hover:bg-[#ea580c] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-heading font-bold text-xs sm:text-sm shadow-lg shadow-orange-950/30 group-hover:shadow-orange-600/50 transition-all duration-300 group-hover:translate-x-0.5">
                      <span>Read More</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* 2 Sub-Story Briefs directly below Hero to balance Left Column height */}
            {heroSubStories && heroSubStories.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {heroSubStories.slice(0, 2).map((sub: any, idx: number) => {
                  const subSlug = sub.slug || `brief-${idx}`;
                  const defaultSubImages = [
                    "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&q=80",
                    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80",
                  ];
                  const rawSubImg = sub.image_url || "";
                  const subImage = (!rawSubImg || rawSubImg.toLowerCase().includes("screenshot") || rawSubImg.includes("localhost"))
                    ? defaultSubImages[idx % defaultSubImages.length]
                    : getSafeImageUrl(sub.image_url, sub.category, defaultSubImages[idx % defaultSubImages.length]);

                  return (
                    <Link
                      key={sub.id || idx}
                      href={`/article/${subSlug}`}
                      className="group bg-white p-3 rounded-2xl border border-gray-200/90 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all duration-300 flex items-center gap-3"
                    >
                      <div className="relative w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={subImage}
                          alt={sub.title}
                          fill
                          sizes="96px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <span className={`text-[10px] font-heading font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            sub.category?.toLowerCase() === 'sleep'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.category?.toLowerCase() === 'mental health' || sub.category?.toLowerCase() === 'mental'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-orange-100 text-[#ea580c]'
                          }`}>
                            {sub.category || (idx === 0 ? "Sleep" : "Mental Health")}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-1 leading-snug">
                          {sub.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {sub.excerpt || sub.description || "Evidence-based clinical health guidance."}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                          {formatDate(sub.published_at || new Date())}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* MIDDLE COLUMN (Cols 7-9): Top Stories List with Lush Emerald Gradient Header */}
          <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-md shadow-emerald-950/5 hover:shadow-lg transition-shadow">
            {/* Lush Emerald Header Banner */}
            <div className="bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#0D5C3A] text-white px-4 py-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" />
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                  Featured Headlines
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white/20 text-emerald-100 px-2.5 py-0.5 rounded-full border border-white/25">
                LATEST EDITIONS
              </span>
            </div>

            <div className="p-4 sm:p-5 flex flex-col divide-y divide-gray-100">
              {topStories && topStories.slice(0, 5).map((story, index) => {
                const slug = story.slug || `story-${index}`;
                return (
                  <article key={story.id || index} className="py-3.5 first:pt-1 last:pb-1 group">
                    <Link href={`/article/${slug}`} className="flex gap-3 hover:bg-emerald-50/50 p-1.5 -mx-1.5 rounded-xl transition-all">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-emerald-100">
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
                            <span className="bg-red-600 text-white text-[9px] font-heading font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                              BREAKING
                            </span>
                          )}
                          {story.category && (
                            <span className="text-[10px] font-heading font-extrabold text-[#ea580c] bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {story.category}
                            </span>
                          )}
                        </div>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
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
          </div>


          {/* RIGHT COLUMN (Cols 9-12): TRENDING 🔥 with Fiery Sunset Orange Gradient Header */}
          <div className="lg:col-span-3 flex flex-col bg-white text-slate-900 rounded-2xl overflow-hidden shadow-md shadow-orange-950/5 border-2 border-orange-500/30 hover:shadow-lg transition-shadow">
            {/* Fiery Sunset Header Banner */}
            <div className="bg-gradient-to-r from-[#ea580c] via-[#f06d2f] to-[#f59e0b] text-white px-4 py-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Flame size={17} className="text-amber-200 fill-amber-200 animate-bounce" style={{ animationDuration: '2s' }} />
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                  TRENDING 🔥
                </h3>
              </div>
              <Link
                href="/trending"
                className="text-[10px] font-mono font-black bg-white/20 hover:bg-white/30 text-white uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-white/25 transition-colors"
              >
                VIEW ALL
              </Link>
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
              {/* Numbered Stories 01 to 05 */}
              <div className="divide-y divide-gray-100 space-y-3">
                {trendingStories && trendingStories.slice(0, 5).map((story, index) => {
                  const rank = String(index + 1).padStart(2, '0');
                  const slug = story.slug || `trending-${index}`;
                  return (
                    <Link
                      key={story.id || index}
                      href={`/article/${slug}`}
                      className="pt-3 first:pt-0 block group cursor-pointer hover:bg-orange-50/40 p-1.5 -mx-1.5 rounded-xl transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {/* Big Bold Rank Number Leaderboard Badge */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-display font-black text-sm sm:text-base leading-none shadow-2xs group-hover:scale-110 transition-transform ${
                          index === 0
                            ? "bg-gradient-to-br from-red-500 via-[#ea580c] to-[#f06d2f] text-white shadow-orange-500/30"
                            : index === 1
                            ? "bg-gradient-to-br from-[#ea580c] to-amber-500 text-white shadow-amber-500/25"
                            : index === 2
                            ? "bg-gradient-to-br from-[#16A34A] to-emerald-600 text-white shadow-emerald-500/25"
                            : index === 3
                            ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-blue-500/25"
                            : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-purple-500/25"
                        }`}>
                          {rank}
                        </div>
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
                            <span className="text-[#f06d2f] font-semibold">Trending</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Sidebar Promo Ad card inside trending box with dual brand gradient */}
              {isSubscribed ? (
                <div className="mt-5 pt-4 border-t border-gray-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 rounded-xl p-3 text-center border border-emerald-300/40">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-800 font-bold block mb-1">
                    VIP CLINICAL DIGEST
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    Ad-Free Priority Medical Access Active
                  </p>
                </div>
              ) : (
                <div className="mt-5 pt-4 border-t border-gray-100 bg-gradient-to-br from-emerald-50 via-white to-orange-50 rounded-xl p-3 text-center border-2 border-emerald-200/80 shadow-xs hover:border-[#f06d2f]/60 transition-colors">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#16A34A] font-extrabold block mb-1">
                    NEWSLETTER BRIEFING
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    Daily Doctor-Curated Health Digest
                  </p>
                  <Link
                    href="/subscribe"
                    className="inline-block mt-2 text-[11px] font-black text-[#f06d2f] hover:text-[#ea580c] hover:underline"
                  >
                    Subscribe Free →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
