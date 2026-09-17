/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { sql } from '@/lib/db';
import { BreakingNewsTicker } from '@/components/media/BreakingNewsTicker';
import { SponsorRequestForm } from './SponsorRequestForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sponsor Request Portal | HealthGhuru',
  description:
    'Submit your business or healthcare event details. Our editorial and reporting team will draft your coverage and publish upon approval.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SponsorRequestPage() {
  // Fetch breaking news for ticker matching screenshot 2
  let breakingItems: any[] = [];
  try {
    breakingItems = await sql`
      SELECT id, title, slug, category
      FROM content_items
      WHERE is_breaking = TRUE AND status = 'published' AND deleted_at IS NULL
      ORDER BY published_at DESC
      LIMIT 6
    `;
  } catch (err) {
    console.error('Failed to load breaking items for sponsor portal:', err);
  }

  return (
    <div className="min-h-screen bg-[#F5FAF5]">
      {/* 1. Global Breaking News Ticker (Matching Screenshot 2) */}
      {breakingItems.length > 0 && <BreakingNewsTicker items={breakingItems} />}

      {/* 2. Top Nav Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <Link
          href="/sponsored-articles"
          className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-gray-600 hover:text-[#16A34A] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Sponsored Services &amp; Pricing</span>
        </Link>
      </div>

      {/* 3. Main Form Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl border border-emerald-100 p-12 text-center text-sm text-gray-500 shadow-xs">
              <div className="w-8 h-8 border-3 border-emerald-200 border-t-[#16A34A] rounded-full animate-spin mx-auto mb-3" />
              Loading Sponsor Portal...
            </div>
          }
        >
          <SponsorRequestForm />
        </Suspense>
      </main>
    </div>
  );
}
