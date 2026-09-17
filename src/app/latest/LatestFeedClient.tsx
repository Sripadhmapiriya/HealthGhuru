'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, Layers, ArrowUpDown, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentCard } from '@/components/media/ContentCard';

interface LatestFeedClientProps {
  initialItems: any[];
}

const CATEGORY_TABS = [
  'All Categories',
  'Cancer',
  'Heart',
  'Diabetes',
  "Women's Health",
  'Pediatrics',
  'Mental Health',
  'Fitness',
  'Nutrition',
  'Ayurveda',
  'Medical Research',
];

const FORMAT_TABS = [
  { label: 'All Formats', value: 'all' },
  { label: 'Articles & Reports', value: 'article' },
  { label: 'Medical News', value: 'news' },
  { label: 'Videos & Shorts', value: 'video' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Trending', value: 'trending' },
];

export function LatestFeedClient({ initialItems }: LatestFeedClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== 'All Categories') {
        const itemCat = (item.category || '').toLowerCase();
        const target = selectedCategory.toLowerCase();
        if (!itemCat.includes(target) && !target.includes(itemCat)) {
          return false;
        }
      }

      // 2. Format Filter
      if (selectedFormat !== 'all') {
        if (selectedFormat === 'video' && item.content_type !== 'video') return false;
        if (selectedFormat === 'article' && item.content_type !== 'article') return false;
        if (selectedFormat === 'news' && item.content_type !== 'news') return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = (item.title || '').toLowerCase().includes(query);
        const excerptMatch = (item.excerpt || item.description || '').toLowerCase().includes(query);
        const sourceMatch = (item.source_name || item.author_name || '').toLowerCase().includes(query);
        const catMatch = (item.category || '').toLowerCase().includes(query);
        if (!titleMatch && !excerptMatch && !sourceMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }, [initialItems, selectedCategory, selectedFormat, searchQuery]);

  // Sort
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (selectedSort === 'popular') {
        return (b.view_count || 0) - (a.view_count || 0);
      }
      if (selectedSort === 'trending') {
        return (b.click_count || 0) - (a.click_count || 0);
      }
      return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
    });
  }, [filteredItems, selectedSort]);

  const displayedItems = sortedItems.slice(0, visibleCount);

  const resetFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedFormat('all');
    setSelectedSort('newest');
    setSearchQuery('');
    setVisibleCount(12);
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Interactive Control Panel (Search, Format Tabs, Sort) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-500/20 shadow-sm space-y-5">
        {/* Top Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search latest health stories, topics, doctors, or research..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A] focus:bg-white transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Format Tabs & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Format Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {FORMAT_TABS.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => {
                    setSelectedFormat(fmt.value);
                    setVisibleCount(12);
                  }}
                  className={`text-xs font-heading font-bold px-3.5 py-2 rounded-xl transition-all ${
                    selectedFormat === fmt.value
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {SORT_OPTIONS.map((sort) => (
                <button
                  key={sort.value}
                  onClick={() => setSelectedSort(sort.value)}
                  className={`text-xs font-heading font-bold px-3 py-2 rounded-xl transition-all ${
                    selectedSort === sort.value
                      ? 'bg-[#f06d2f] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Scrollable with gradient indicator) */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
            <Filter size={13} className="text-[#16A34A]" />
            <span>Category:</span>
          </span>

          {CATEGORY_TABS.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(12);
                }}
                className={`text-xs font-heading font-bold whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#16A34A] to-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                    : 'bg-white text-slate-700 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-500/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Results Header Summary */}
      <div className="flex items-center justify-between px-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Showing <strong className="text-slate-900">{displayedItems.length}</strong> of{' '}
            <strong className="text-slate-900">{sortedItems.length}</strong> verified health stories
          </span>
        </div>

        {(selectedCategory !== 'All Categories' || selectedFormat !== 'all' || searchQuery) && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-[#f06d2f] hover:underline font-bold"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* 3. Fully Responsive Content Grid (1 col mobile, 2 col sm/md, 3 col lg, 4 col xl) */}
      {displayedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-[#f06d2f] mx-auto flex items-center justify-center">
            <Search size={28} />
          </div>
          <h3 className="font-heading font-extrabold text-xl text-slate-900">No Matching Health Stories</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            We couldn’t find any articles matching your search query or active category filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-heading font-bold shadow-md transition-all"
          >
            Clear All Filters &amp; Reload Feed
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {displayedItems.map((item, idx) => (
            <ContentCard key={item.id || idx} item={item} priority={idx < 4} />
          ))}
        </div>
      )}

      {/* 4. Load More Button with Smooth Animated State */}
      {visibleCount < sortedItems.length && (
        <div className="mt-12 text-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-heading font-bold text-sm text-white bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f] hover:brightness-110 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Load More Health Stories</span>
            <Layers size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
