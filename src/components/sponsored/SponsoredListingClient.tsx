'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { SponsoredArticleWithSponsor } from '@/lib/types/sponsored';
import { SponsoredArticleCard } from './SponsoredArticleCard';
import { SponsoredFilterBar } from './SponsoredFilterBar';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface SponsoredListingClientProps {
  initialArticles: SponsoredArticleWithSponsor[];
  initialTotal: number;
  initialTotalPages: number;
}

export function SponsoredListingClient({
  initialArticles,
  initialTotal,
  initialTotalPages,
}: SponsoredListingClientProps) {
  const [articles, setArticles] = useState<SponsoredArticleWithSponsor[]>(initialArticles);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPage] = useState(1);

  const [sponsorType, setSponsorType] = useState('All');
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch when filters or page change
  useEffect(() => {
    // If it's initial render with default filters, skip re-fetching
    if (
      page === 1 &&
      sponsorType === 'All' &&
      category === 'All' &&
      debouncedSearch === '' &&
      sortBy === 'latest' &&
      articles === initialArticles
    ) {
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (sponsorType !== 'All') params.set('sponsor_type', sponsorType);
    if (category !== 'All') params.set('category', category);
    if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
    if (sortBy) params.set('sort', sortBy);
    params.set('page', page.toString());
    params.set('limit', '9');

    fetch(`/api/sponsored-articles?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load sponsored articles');
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          startTransition(() => {
            setArticles(data.articles || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
          });
        } else {
          setError(data.error || 'Could not fetch articles');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sponsorType, category, debouncedSearch, sortBy, page, initialArticles]);

  const handleReset = () => {
    setSponsorType('All');
    setCategory('All');
    setSearchQuery('');
    setSortBy('latest');
    setPage(1);
  };

  return (
    <div>
      {/* Interactive Filter Bar */}
      <SponsoredFilterBar
        selectedSponsorType={sponsorType}
        selectedCategory={category}
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSponsorTypeChange={(t) => {
          setSponsorType(t);
          setPage(1);
        }}
        onCategoryChange={(c) => {
          setCategory(c);
          setPage(1);
        }}
        onSearchChange={setSearchQuery}
        onSortChange={(s) => {
          setSortBy(s);
          setPage(1);
        }}
        onReset={handleReset}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <h3 className="font-heading font-bold text-sm tracking-wider uppercase text-gray-900">
            LATEST SPONSORED ARTICLES
          </h3>
          <span className="text-xs text-gray-400 font-mono">({total})</span>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-emerald-100 p-4 space-y-3"
            >
              <div className="w-full aspect-[16/10] bg-emerald-50 rounded-xl" />
              <div className="h-4 bg-emerald-50 rounded-md w-1/3" />
              <div className="h-5 bg-emerald-100/70 rounded-md w-4/5" />
              <div className="h-3 bg-gray-100 rounded-md w-full" />
              <div className="h-3 bg-gray-100 rounded-md w-2/3" />
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <div className="h-4 bg-emerald-50 rounded-full w-24" />
                <div className="h-4 bg-orange-50 rounded-md w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center my-6">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h4 className="font-heading font-bold text-gray-900 text-base mb-1">
            Sponsored articles couldn’t be loaded
          </h4>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-heading font-bold hover:bg-[#15803D] transition-colors"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      ) : articles.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-dashed border-emerald-200 p-12 text-center my-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto mb-3">
            <Sparkles size={24} />
          </div>
          <h4 className="font-heading font-bold text-gray-900 text-lg mb-1">
            No sponsored health articles found
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
            There are currently no partner stories matching your selected filter criteria.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-heading font-bold hover:bg-[#15803D] transition-colors"
            >
              Clear All Filters
            </button>
            <Link
              href="/latest"
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-heading font-semibold hover:bg-gray-200 transition-colors"
            >
              Explore Latest Health News →
            </Link>
          </div>
        </div>
      ) : (
        /* Card Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article) => (
            <SponsoredArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && !error && (
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-emerald-100">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-heading font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-600">
            <span>Page</span>
            <span className="font-bold text-gray-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {page}
            </span>
            <span>of</span>
            <span className="font-bold text-gray-900">{totalPages}</span>
          </div>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-heading font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
