/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Filter, ShieldCheck, Flame, BookOpen, Layers, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate, getSafeImageUrl } from '@/lib/utils';

interface LatestNewsFeedProps {
  initialItems: any[];
}

const CATEGORY_FILTERS = [
  "All",
  "Cancer",
  "Heart",
  "Diabetes",
  "Women's Health",
  "Pediatrics",
  "Mental Health",
  "Fitness",
  "Nutrition",
  "Medical Research"
];

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Most Read", value: "most_read" },
  { label: "Trending", value: "trending" }
];

export function LatestNewsFeed({ initialItems }: LatestNewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(8);

  // Filter items
  const filtered = initialItems.filter((item) => {
    if (selectedCategory === "All") return true;
    const cat = (item.category || "").toLowerCase();
    const target = selectedCategory.toLowerCase();
    return cat.includes(target) || target.includes(cat);
  });

  // Sort items
  const sorted = [...filtered].sort((a, b) => {
    if (selectedSort === "most_read") {
      return (b.view_count || 0) - (a.view_count || 0);
    }
    if (selectedSort === "trending") {
      return (b.click_count || 0) - (a.click_count || 0);
    }
    return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
  });

  const displayedItems = sorted.slice(0, visibleCount);

  return (
    <section className="w-full py-8 sm:py-12 bg-transparent border-t border-[#16A34A]/20">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Subtitle with Brand Gradient Underline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 relative gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#16A34A] font-extrabold">
                REAL-TIME CLINICAL WIRE
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              LATEST HEALTH NEWS &amp; ANALYSIS
            </h2>
          </div>

          {/* Sort Tabs (Latest, Most Read, Trending) */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-emerald-500/20 shadow-xs shrink-0">
            {SORT_OPTIONS.map((sort) => (
              <button
                key={sort.value}
                onClick={() => setSelectedSort(sort.value)}
                className={`text-xs font-heading font-bold px-3.5 py-1.5 rounded-xl transition-all ${
                  selectedSort === sort.value
                    ? "bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white shadow-xs font-bold scale-[1.02]"
                    : "text-slate-600 hover:text-[#16A34A] hover:bg-emerald-50/70"
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>

          {/* Dual-Tone Gradient Underline */}
          <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f] rounded-full shadow-xs" />
        </div>

        {/* Data-Driven Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-6 border-b border-emerald-500/20">
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 mr-1 shrink-0">
            <Filter size={13} className="text-[#16A34A]" />
            <span>Filter:</span>
          </span>
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(8);
              }}
              className={`text-xs font-heading font-bold whitespace-nowrap px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#ea580c] via-[#f06d2f] to-[#f59e0b] text-white shadow-md shadow-orange-500/30 scale-[1.05]"
                  : "bg-white text-slate-700 hover:bg-emerald-50 hover:text-[#16A34A] border-2 border-emerald-100 hover:border-emerald-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Responsive News Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item, index) => {
              const slug = item.slug || `news-${index}`;
              const imageSrc = getSafeImageUrl(item.image_url, item.category);
              const catLower = (item.category || '').toLowerCase();
              return (
                <motion.article
                  key={item.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: (index % 6) * 0.05 }}
                  className="group bg-white hover:bg-gradient-to-br hover:from-white hover:via-emerald-50/25 hover:to-orange-50/20 rounded-2xl p-4 sm:p-5 border-2 border-emerald-500/20 hover:border-[#16A34A]/60 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail Image with Fixed Aspect Ratio */}
                    <Link href={`/article/${slug}`} className="relative w-full sm:w-44 sm:h-36 aspect-[16/10] sm:aspect-auto rounded-xl overflow-hidden shrink-0 bg-slate-100 border-2 border-emerald-100/80 block">
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 176px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </Link>

                    {/* Story Metadata & Text */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          {item.category && (
                            <span className={`text-[10px] font-heading font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              catLower.includes('cancer')
                                ? 'brand-pill-cancer'
                                : catLower.includes('heart')
                                ? 'brand-pill-heart'
                                : catLower.includes('diabetes')
                                ? 'brand-pill-diabetes'
                                : catLower.includes('mental')
                                ? 'brand-pill-mental'
                                : catLower.includes('women')
                                ? 'brand-pill-womens'
                                : catLower.includes('pediatric')
                                ? 'brand-pill-pediatrics'
                                : catLower.includes('nutrition')
                                ? 'brand-pill-nutrition'
                                : catLower.includes('ayurveda')
                                ? 'brand-pill-ayurveda'
                                : catLower.includes('fitness')
                                ? 'brand-pill-fitness'
                                : 'bg-orange-50 text-[#f06d2f] border border-orange-200'
                            }`}>
                              {item.category}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1" suppressHydrationWarning>
                            <Clock size={11} />
                            {item.published_at ? formatDate(item.published_at) : 'Recent'}
                          </span>
                        </div>

                        <Link href={`/article/${slug}`}>
                          <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                          {item.excerpt || item.description || item.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer / Meta info */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5 min-w-0 max-w-[60%]">
                      <ShieldCheck size={13} className="text-[#16A34A] shrink-0" />
                      <span className="truncate text-slate-700 font-medium">{item.source_name || "HealthGuru Editorial"}</span>
                    </div>
                    <Link
                      href={`/article/${slug}`}
                      className="inline-flex items-center gap-1 text-[#f06d2f] hover:text-[#e05a1b] font-heading font-bold group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Full Report</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {visibleCount < sorted.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f] hover:brightness-110 text-white font-heading font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Load More Health News</span>
              <Layers size={14} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
