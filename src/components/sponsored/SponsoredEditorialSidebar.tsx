import React from 'react';
import Link from 'next/link';
import { TrendingUp, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

interface EditorialSidebarItem {
  id: string;
  title: string;
  slug: string;
  category?: string;
  views_count?: number;
  published_at?: string;
}

interface SponsoredEditorialSidebarProps {
  trendingItems?: EditorialSidebarItem[];
  mostReadItems?: EditorialSidebarItem[];
}

// Curated fallbacks in case database has fewer items
const DEFAULT_TRENDING: EditorialSidebarItem[] = [
  {
    id: 't1',
    title: 'Breakthrough Immunotherapy Clinical Trial Yields 85% Response in Solid Tumors',
    slug: 'breakthrough-immunotherapy-clinical-trial-solid-tumors',
    category: 'Cancer',
  },
  {
    id: 't2',
    title: 'New ESC Guidelines: Early Statin Intervention in Moderate Cardiovascular Risk',
    slug: 'esc-guidelines-early-statin-intervention-cardiovascular-risk',
    category: 'Heart',
  },
  {
    id: 't3',
    title: 'Continuous Glucose Monitoring in Non-Diabetics: Clinical Evidence and Real Utility',
    slug: 'cgm-non-diabetics-clinical-evidence-utility',
    category: 'Diabetes',
  },
  {
    id: 't4',
    title: 'Pediatric Screen Time Linked to Myopia Surge: Ophthalmology Advisory 2026',
    slug: 'pediatric-screen-time-myopia-surge-ophthalmology',
    category: 'Pediatrics',
  },
  {
    id: 't5',
    title: 'Neurobiology of Chronic Anxiety: How Cortisol Alters Hippocampal Synapses',
    slug: 'neurobiology-chronic-anxiety-cortisol-synapses',
    category: 'Mental Health',
  },
];

const DEFAULT_MOST_READ: EditorialSidebarItem[] = [
  {
    id: 'm1',
    title: 'The 10-Minute Morning Routine That Naturally Regulates Blood Pressure',
    slug: 'morning-routine-naturally-regulates-blood-pressure',
    category: 'Heart',
  },
  {
    id: 'm2',
    title: 'Understanding Fatty Liver Disease (MASLD): Why Diet Beats Supplements Every Time',
    slug: 'understanding-fatty-liver-disease-masld-diet',
    category: 'Nutrition',
  },
  {
    id: 'm3',
    title: 'Vitamin D & K2 Synergy: Why Calcium Supplements Need Co-Factors',
    slug: 'vitamin-d-k2-synergy-calcium-absorption',
    category: 'Preventive Care',
  },
  {
    id: 'm4',
    title: 'Zone 2 Cardio: The Exact Heart Rate Training Protocol for Mitochondrial Health',
    slug: 'zone-2-cardio-heart-rate-mitochondrial-health',
    category: 'Fitness',
  },
  {
    id: 'm5',
    title: 'Signs Your Thyroid May Be Underactive Even If Your TSH Is "Normal"',
    slug: 'signs-underactive-thyroid-normal-tsh',
    category: 'Women’s Health',
  },
];

export function SponsoredEditorialSidebar({
  trendingItems = [],
  mostReadItems = [],
}: SponsoredEditorialSidebarProps) {
  const trending = trendingItems.length >= 3 ? trendingItems.slice(0, 5) : DEFAULT_TRENDING;
  const mostRead = mostReadItems.length >= 3 ? mostReadItems.slice(0, 5) : DEFAULT_MOST_READ;

  return (
    <aside className="space-y-8" aria-label="Editorial Health Stories">
      
      {/* ── 1. TRENDING HEALTH (Editorial) ── */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#16A34A]" />
            <h3 className="font-heading font-bold text-sm tracking-wider uppercase text-gray-900">
              TRENDING HEALTH
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-50 text-[#16A34A] px-2 py-0.5 rounded-full uppercase">
            Editorial
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {trending.map((item, idx) => (
            <Link
              key={item.id || idx}
              href={`/article/${item.slug}`}
              className="flex items-start gap-3 py-3 group hover:bg-emerald-50/40 -mx-2 px-2 rounded-lg transition-colors"
            >
              <span className="font-mono font-bold text-base text-[#16A34A]/50 group-hover:text-[#16A34A] transition-colors shrink-0 w-6">
                0{idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                {item.category && (
                  <span className="text-[10px] font-heading font-bold text-[#16A34A] uppercase block mb-1">
                    {item.category}
                  </span>
                )}
                <h4 className="text-xs font-heading font-bold text-gray-800 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 2. MOST READ STORIES ── */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[#f06d2f]" />
            <h3 className="font-heading font-bold text-sm tracking-wider uppercase text-gray-900">
              MOST READ
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-orange-50 text-[#f06d2f] px-2 py-0.5 rounded-full uppercase">
            Top Reads
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {mostRead.map((item, idx) => (
            <Link
              key={item.id || idx}
              href={`/article/${item.slug}`}
              className="flex items-start gap-3 py-3 group hover:bg-orange-50/40 -mx-2 px-2 rounded-lg transition-colors"
            >
              <span className="font-mono font-bold text-base text-[#f06d2f]/50 group-hover:text-[#f06d2f] transition-colors shrink-0 w-6">
                0{idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                {item.category && (
                  <span className="text-[10px] font-heading font-bold text-[#f06d2f] uppercase block mb-1">
                    {item.category}
                  </span>
                )}
                <h4 className="text-xs font-heading font-bold text-gray-800 group-hover:text-[#f06d2f] transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 3. Commercial Advisory Notice Card ── */}
      <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/80 p-5 text-xs text-gray-600">
        <h4 className="font-heading font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
          <span>Are You a Healthcare Provider?</span>
        </h4>
        <p className="leading-relaxed mb-3 text-gray-600">
          Publish verified medical insights, clinical research, or hospital awareness campaigns to HealthGhuru’s engaged reader community.
        </p>
        <Link
          href="/advertise"
          className="inline-flex items-center gap-1.5 font-heading font-bold text-xs text-[#16A34A] hover:underline"
        >
          <span>Partner With HealthGhuru</span>
          <ArrowRight size={13} />
        </Link>
      </div>

    </aside>
  );
}
