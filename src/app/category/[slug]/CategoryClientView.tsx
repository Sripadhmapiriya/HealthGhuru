/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Filter, Flame, BookOpen, Layers, LayoutGrid, List, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatDate, getSafeImageUrl } from '@/lib/utils';

interface CategoryClientViewProps {
  stories: any[];
  categoryName: string;
  categorySlug: string;
}

export function CategoryClientView({
  stories,
  categoryName,
  categorySlug,
}: CategoryClientViewProps) {
  const [selectedSubcat, setSelectedSubcat] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(12);

  // Extract unique subcategories from stories
  const subcategories = useMemo(() => {
    const set = new Set<string>();
    stories.forEach((s) => {
      if (s.subcategory && typeof s.subcategory === 'string' && s.subcategory.trim()) {
        set.add(s.subcategory.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [stories]);

  // Filter items
  const filteredStories = useMemo(() => {
    return stories.filter((item) => {
      if (selectedSubcat === 'All') return true;
      const sub = (item.subcategory || '').toLowerCase();
      return sub === selectedSubcat.toLowerCase();
    });
  }, [stories, selectedSubcat]);

  // Sort items
  const sortedStories = useMemo(() => {
    const list = [...filteredStories];
    if (sortBy === 'popular') {
      return list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }
    if (sortBy === 'trending') {
      return list.sort(
        (a, b) =>
          ((b.is_trending ? 100 : 0) + (b.click_count || 0)) -
          ((a.is_trending ? 100 : 0) + (a.click_count || 0))
      );
    }
    // 'latest' default
    return list.sort(
      (a, b) =>
        new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime()
    );
  }, [filteredStories, sortBy]);

  const displayedStories = sortedStories.slice(0, visibleCount);

  // Calculate estimated reading time helper
  const getReadTime = (item: any) => {
    const text = `${item.title || ''} ${item.excerpt || ''} ${item.description || ''}`;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(2, Math.ceil(words / 40) + 1);
    return `${minutes} min read`;
  };

  return (
    <div className="space-y-6">
      {/* Control Bar: Title, Filters, Sort & View Toggle */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-500/20 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#16A34A] border border-emerald-200">
              <Layers size={18} />
            </span>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-wide text-slate-900">
                Latest {categoryName} Stories
              </h3>
              <p className="text-xs text-slate-500">
                Showing {sortedStories.length} {sortedStories.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Sort Dropdown / Segment */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              {(
                [
                  { key: 'latest', label: 'Latest' },
                  { key: 'popular', label: 'Popular' },
                  { key: 'trending', label: 'Trending' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSortBy(tab.key)}
                  className={`text-xs font-heading font-bold px-3 py-1.5 rounded-lg transition-all ${
                    sortBy === tab.key
                      ? 'bg-white text-[#16A34A] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="Compact List View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Subcategory Filter Pills */}
        {subcategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="flex items-center gap-1 text-xs font-mono font-bold text-slate-400 shrink-0 mr-1">
              <Filter size={12} className="text-[#16A34A]" />
              <span>Topic:</span>
            </span>
            {subcategories.map((subcat) => {
              const isActive = selectedSubcat === subcat;
              return (
                <button
                  key={subcat}
                  onClick={() => {
                    setSelectedSubcat(subcat);
                    setVisibleCount(12);
                  }}
                  className={`relative text-xs font-heading font-semibold whitespace-nowrap px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#16A34A] to-[#15803d] text-white shadow-xs font-bold ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200/80 hover:border-emerald-300'
                  }`}
                >
                  {subcat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Stories Output: Modern Responsive 2-Column Grid or Refined List */}
      {displayedStories.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedStories.map((story, index) => {
                const slug = story.slug || `story-${index}`;
                // Guaranteed safe image fallback - never leave empty!
                const imageSrc = getSafeImageUrl(
                  story.image_url,
                  story.category || categoryName
                );
                const tag = story.subcategory || story.category || categoryName;

                return (
                  <motion.article
                    key={story.id || index}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, delay: (index % 6) * 0.05 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top Image Container with Badges */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={imageSrc}
                        alt={story.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      {/* Gradient Shadow Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="bg-[#f06d2f] text-white text-[10px] font-heading font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {tag}
                        </span>
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                          <Clock size={10} />
                          {getReadTime(story)}
                        </span>
                      </div>

                      {/* Bottom Source overlay on image */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                        <span className="font-semibold drop-shadow-sm truncate">
                          {story.source_name || 'HealthGhuru Bureau'}
                        </span>
                        <span className="text-white/80 shrink-0 text-[10px]">
                          {story.published_at ? formatDate(story.published_at) : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/article/${slug}`}>
                          <h4 className="font-heading font-bold text-base text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                            {story.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                          {story.excerpt || story.description || story.summary || 'Click to read full clinical analysis and insights.'}
                        </p>
                      </div>

                      {/* Action Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle2 size={13} className="text-[#16A34A]" />
                          <span>Verified</span>
                        </div>
                        <Link
                          href={`/article/${slug}`}
                          className="inline-flex items-center gap-1 text-xs font-heading font-bold text-[#f06d2f] hover:text-[#d9531e] transition-colors"
                        >
                          <span>Read Full Story</span>
                          <ArrowRight
                            size={13}
                            className="group-hover:translate-x-1 transition-transform duration-200"
                          />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Refined Compact List View */
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {displayedStories.map((story, index) => {
                const slug = story.slug || `story-${index}`;
                const imageSrc = getSafeImageUrl(
                  story.image_url,
                  story.category || categoryName
                );
                const tag = story.subcategory || story.category || categoryName;

                return (
                  <motion.article
                    key={story.id || index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, delay: (index % 6) * 0.04 }}
                    className="group bg-white rounded-2xl p-4 sm:p-5 border border-emerald-500/20 hover:border-emerald-500/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row gap-4 items-center"
                  >
                    {/* Thumbnail Image */}
                    <Link
                      href={`/article/${slug}`}
                      className="relative w-full sm:w-48 aspect-[16/10] sm:aspect-auto sm:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80 block"
                    >
                      <Image
                        src={imageSrc}
                        alt={story.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 200px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </Link>

                    {/* Metadata & Text */}
                    <div className="flex-1 min-w-0 w-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#f06d2f] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                            {tag}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock size={11} />
                            {getReadTime(story)}
                          </span>
                        </div>

                        <Link href={`/article/${slug}`}>
                          <h4 className="font-heading font-bold text-base text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                            {story.title}
                          </h4>
                        </Link>

                        <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                          {story.excerpt || story.description || story.summary || 'Click to read full clinical analysis and insights.'}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                          <span className="text-slate-600 font-medium">
                            {story.source_name || 'HealthGhuru'}
                          </span>
                          <span>•</span>
                          <span>{story.published_at ? formatDate(story.published_at) : 'Recent'}</span>
                        </div>

                        <Link
                          href={`/article/${slug}`}
                          className="inline-flex items-center gap-1 font-heading font-bold text-xs text-[#f06d2f] group-hover:text-[#d9531e]"
                        >
                          <span>Read Report</span>
                          <ArrowRight
                            size={13}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-500 border border-slate-200/80 shadow-xs">
          <BookOpen size={36} className="mx-auto text-emerald-500/50 mb-3" />
          <h4 className="font-heading font-bold text-base text-slate-800">
            No articles match this filter
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try switching to another topic or &quot;All&quot; to discover more stories in {categoryName}.
          </p>
          <button
            onClick={() => setSelectedSubcat('All')}
            className="mt-4 px-4 py-2 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-heading font-bold rounded-xl transition-all shadow-xs"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < sortedStories.length && (
        <div className="pt-4 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#16A34A] font-heading font-bold text-xs border border-emerald-500/30 hover:border-emerald-500/60 shadow-xs transition-all duration-200 inline-flex items-center gap-2"
          >
            <Sparkles size={14} />
            <span>Load More {categoryName} Stories</span>
          </button>
        </div>
      )}
    </div>
  );
}
