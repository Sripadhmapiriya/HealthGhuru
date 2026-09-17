/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { sql } from '@/lib/db';
import { Sparkles, Radio, Newspaper } from 'lucide-react';
import { LatestFeedClient } from './LatestFeedClient';
import { HealthDisclaimer } from '@/components/media/HealthDisclaimer';
import { BreakingNewsTicker } from '@/components/media/BreakingNewsTicker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Latest Health News & Clinical Feeds | HealthGhuru',
  description: 'Real-time chronological timeline of the newest health news, clinical breakthroughs, research discoveries, and verified wellness updates.',
};

export default async function LatestFeedPage() {
  const [breakingItems, items] = await Promise.all([
    sql`
      SELECT id, title, slug, category, canonical_url, is_external,
             (SELECT name FROM content_sources WHERE id = content_items.source_id) as source_name
      FROM content_items
      WHERE is_breaking = TRUE AND status = 'published' AND deleted_at IS NULL
      ORDER BY published_at DESC
      LIMIT 6
    `,
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 50
    `,
  ]);

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-20">
      {/* Breaking News Ticker */}
      {breakingItems.length > 0 && <BreakingNewsTicker items={breakingItems} />}

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        {/* Page Hero Header with Live Pulse Badge */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-emerald-500/20 shadow-xs relative overflow-hidden">
          {/* Ambient decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#16A34A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#f06d2f]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>LIVE CLINICAL WIRE • REAL-TIME FEED</span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
                Latest Health News &amp; Clinical Insights
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Chronological real-time stream of peer-reviewed findings, medical breaking reports, cardiology, oncology, pediatric updates, and healthy living guides.
              </p>
            </div>

            {/* Quick Stats Pill Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-[#16A34A] flex items-center justify-center font-bold">
                <Newspaper size={24} />
              </div>
              <div className="text-xs font-mono">
                <p className="text-slate-500 uppercase tracking-wider text-[10px]">Active Stream</p>
                <p className="font-bold text-slate-900 text-sm">{items.length}+ Stories Loaded</p>
              </div>
            </div>
          </div>

          {/* Bottom Brand Gradient Line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f]" />
        </div>

        {/* Interactive Client Stream Grid (Category Tabs, Format Filter, Search, Staggered Grid) */}
        <LatestFeedClient initialItems={items} />

        {/* Health Medical Disclaimer */}
        <HealthDisclaimer />
      </div>
    </div>
  );
}
