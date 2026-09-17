'use client';

import React, { useState } from 'react';
import { SponsoredTariffView } from './SponsoredTariffView';
import { FeaturedSponsoredHero } from './FeaturedSponsoredHero';
import { SponsoredListingClient } from './SponsoredListingClient';
import { SponsoredEditorialSidebar } from './SponsoredEditorialSidebar';
import { SponsoredArticleWithSponsor } from '@/lib/types/sponsored';
import { Tag, BookOpen, ShieldCheck } from 'lucide-react';

interface SponsoredPageWrapperProps {
  featuredArticle: SponsoredArticleWithSponsor | null;
  initialArticles: SponsoredArticleWithSponsor[];
  initialTotal: number;
  initialTotalPages: number;
  trendingItems: any[];
  mostReadItems: any[];
}

export function SponsoredPageWrapper({
  featuredArticle,
  initialArticles,
  initialTotal,
  initialTotalPages,
  trendingItems,
  mostReadItems,
}: SponsoredPageWrapperProps) {
  // Tabs: 'tariff' (Packages & Rates as shown in screenshots) or 'articles' (Published Stories)
  const [activeTab, setActiveTab] = useState<'tariff' | 'articles'>('tariff');

  return (
    <div className="space-y-8 sm:space-y-10">
      
      {/* ── View Switcher Tab Bar ── */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center p-1.5 bg-emerald-100/60 rounded-2xl border border-emerald-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('tariff')}
            className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'tariff'
                ? 'bg-white text-[#16A34A] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Tag size={15} className={activeTab === 'tariff' ? 'text-[#f06d2f]' : 'text-gray-400'} />
            <span>Commercial Rates &amp; Packages</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'articles'
                ? 'bg-white text-[#16A34A] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen size={15} className={activeTab === 'articles' ? 'text-[#16A34A]' : 'text-gray-400'} />
            <span>Browse Published Stories ({initialTotal})</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: Commercial Packages & Rates (Matching Screenshots) ── */}
      {activeTab === 'tariff' && (
        <SponsoredTariffView onSwitchToArticles={() => setActiveTab('articles')} />
      )}

      {/* ── TAB 2: Published Partner Stories (Editorial Newsfeed Grid) ── */}
      {activeTab === 'articles' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Editorial Disclaimer notice */}
          <div className="bg-white border border-emerald-200/90 rounded-2xl p-4 text-xs text-gray-600 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold text-[#16A34A] uppercase tracking-wider text-[11px] block">
                  EDITORIAL TRANSPARENCY · PARTNER CONTENT
                </span>
                <p className="text-gray-600 leading-normal">
                  All articles listed below are published in partnership with certified hospitals, healthcare organizations, and clinicians.
                </p>
              </div>
            </div>
          </div>

          {/* Featured Hero Story */}
          {featuredArticle && <FeaturedSponsoredHero article={featuredArticle} />}

          {/* 2-Column Grid: Articles + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <SponsoredListingClient
                initialArticles={initialArticles}
                initialTotal={initialTotal}
                initialTotalPages={initialTotalPages}
              />
            </div>

            <div className="lg:col-span-4">
              <SponsoredEditorialSidebar
                trendingItems={trendingItems}
                mostReadItems={mostReadItems}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
