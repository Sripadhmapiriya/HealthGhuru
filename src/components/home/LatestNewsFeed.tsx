/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Filter, ShieldCheck, Flame, BookOpen, Layers } from 'lucide-react';

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
    <section className="w-full py-8 sm:py-10 bg-white border-t border-b border-[#2E7D32]/15">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Subtitle with Brand Gradient Underline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 relative gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-[#CBF2DB]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#16A34A] font-bold">
                REAL-TIME CLINICAL WIRE
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              LATEST HEALTH NEWS
            </h2>
          </div>

          {/* Sort Tabs (Latest, Most Read, Trending) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-emerald-500/20 shrink-0">
            {SORT_OPTIONS.map((sort) => (
              <button
                key={sort.value}
                onClick={() => setSelectedSort(sort.value)}
                className={`text-xs font-heading font-bold px-3 py-1.5 rounded-lg transition-all ${
                  selectedSort === sort.value
                    ? "bg-[#16A34A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>

          {/* Mint Green Underline */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#CBF2DB] rounded-full" />
        </div>

        {/* Data-Driven Category Filters Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-4 mb-6 border-b border-gray-100">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-400 mr-2 shrink-0">
            <Filter size={13} />
            <span>Filter:</span>
          </span>
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-heading font-semibold whitespace-nowrap px-3.5 py-1.5 rounded-full transition-all ${
                selectedCategory === cat
                  ? "bg-[#16A34A] text-white shadow-xs font-bold"
                  : "bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-500/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column News Feed Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedItems.map((item, index) => {
            const slug = item.slug || `news-${index}`;
            return (
              <article
                key={item.id || index}
                className="group bg-white hover:bg-emerald-50/20 rounded-2xl p-4 sm:p-5 border border-emerald-500/20 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail Image */}
                  {item.image_url && (
                    <div className="relative w-full sm:w-36 sm:h-32 aspect-[16/10] sm:aspect-auto rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Story Metadata & Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {item.category && (
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#f06d2f] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                          {item.category}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.published_at ? "Today" : "Recent"}
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

                {/* Footer / Meta info */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#16A34A]" />
                    <span className="truncate">{item.source_name || "HealthGhuru Editorial"}</span>
                  </div>
                  <Link
                    href={`/article/${slug}`}
                    className="inline-flex items-center gap-1 text-[#f06d2f] font-bold group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Load More Button */}
        {visibleCount < sorted.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
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
