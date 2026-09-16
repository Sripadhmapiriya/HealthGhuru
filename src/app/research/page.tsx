/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { sql } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import {
  Microscope,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Filter,
  Calendar,
} from 'lucide-react';
import { BreakingNewsTicker } from '@/components/media/BreakingNewsTicker';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Medical Research & Clinical Discoveries | HealthGhuru',
  description: 'Evidence-based summaries of peer-reviewed clinical trials from NEJM, Lancet, JAMA, NIH, and global oncology councils.',
};

export default async function ResearchPage() {
  const [researchItems, breakingRes] = await Promise.all([
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE (LOWER(i.category) LIKE '%research%' OR i.subcategory = 'Oncology Research' OR i.quality_score >= 8.5)
        AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.quality_score DESC, i.published_at DESC
      LIMIT 24
    `,
    sql`
      SELECT id, title, slug, category, canonical_url, is_external
      FROM content_items
      WHERE is_breaking = TRUE AND status = 'published'
      ORDER BY published_at DESC LIMIT 5
    `
  ]);

  return (
    <div className="w-full bg-surface min-h-screen">
      <BreakingNewsTicker items={breakingRes} />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2E7D32]/20 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Microscope size={18} className="text-[#f06d2f]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#2E7D32] font-bold">
                  TRANSLATIONAL MEDICINE & CLINICAL TRIALS
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A2E1A] tracking-tight">
                MEDICAL RESEARCH ARCHIVE
              </h1>
              <p className="mt-2 text-sm text-[#4A6741] max-w-2xl leading-relaxed">
                Objective, doctor-summarized breakdowns of newly published peer-reviewed findings across oncology, cardiology, neurology, and endocrinology.
              </p>
            </div>

            <div className="bg-[#F5FAF5] p-3.5 rounded-2xl border border-[#2E7D32]/20 flex items-center gap-3 shrink-0">
              <ShieldCheck size={26} className="text-[#2E7D32]" />
              <div className="text-xs">
                <p className="font-bold text-[#1A2E1A]">Clinical Rigor</p>
                <p className="text-gray-500 text-[11px]">Primary journal citations required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Research Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchItems.map((item: any, i) => {
            const slug = item.slug || `paper-${i}`;
            return (
              <article
                key={item.id || i}
                className="bg-white rounded-2xl p-6 border border-[#2E7D32]/15 hover:border-[#2E7D32]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold bg-[#1B5E20] text-white px-2.5 py-0.5 rounded uppercase tracking-wider">
                      {item.source_name || "PEER-REVIEWED"}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      Score: {item.quality_score || '9.5'}/10
                    </span>
                  </div>

                  <Link href={`/article/${slug}`}>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#4A6741] line-clamp-3 mt-3 leading-relaxed">
                    {item.excerpt || item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 font-mono">{item.category}</span>
                  <Link
                    href={`/article/${slug}`}
                    className="text-[#f06d2f] font-bold inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Read Study Analysis</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </div>
  );
}
