/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { Zap, AlertCircle } from 'lucide-react';

interface FlashItem {
  id: string;
  title: string;
  slug: string;
  source_name?: string;
}

const DEFAULT_FLASH_UPDATES: FlashItem[] = [
  { id: '1', title: 'FDA grants accelerated approval for novel HER2-targeted oncology conjugate therapy', slug: 'new-research-early-cancer-detection-microrna', source_name: 'FDA Bulletin' },
  { id: '2', title: 'WHO releases global guidance on maternal micronutrient thresholds in postpartum recovery', slug: 'who-releases-global-guidance-maternal-iron-postpartum', source_name: 'WHO' },
  { id: '3', title: 'American College of Cardiology updates coronary calcium screening guidelines for adults 35-55', slug: 'cardiovascular-study-explores-novel-biomarkers-plaque', source_name: 'ACC' },
  { id: '4', title: 'Harvard neuroimaging trial links 5-minute physiological sigh breathwork to 38% cortisol reduction', slug: 'neuroimaging-confirms-mindful-breathwork-cortisol-reduction', source_name: 'Harvard Med' },
];

export function FlashUpdatesStrip({ updates }: { updates?: FlashItem[] }) {
  const items = updates && updates.length > 0 ? updates : DEFAULT_FLASH_UPDATES;

  return (
    <div className="bg-emerald-50/70 text-slate-800 border-b border-emerald-200/70 py-1.5 px-4 overflow-hidden text-xs">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto flex items-center gap-3">
        {/* Flash Label */}
        <div className="flex items-center gap-1.5 shrink-0 font-mono font-bold text-[10px] tracking-wider text-white uppercase bg-[#f06d2f] px-2.5 py-0.5 rounded shadow-xs">
          <Zap size={10} className="text-white fill-white" />
          <span>FLASH UPDATES</span>
        </div>

        {/* Marquee ticker container */}
        <div className="flex-1 overflow-x-auto scrollbar-none whitespace-nowrap flex items-center gap-6 text-[11px] font-heading font-medium">
          {items.map((item, idx) => (
            <div key={item.id + idx} className="inline-flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBF2DB]" />
              <Link
                href={`/article/${item.slug}`}
                className="text-slate-700 hover:text-[#16A34A] hover:underline transition-colors"
              >
                {item.title}
              </Link>
              {item.source_name && (
                <span className="text-[10px] font-mono text-slate-400">({item.source_name})</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
