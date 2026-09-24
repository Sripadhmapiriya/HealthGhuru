/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Award, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Flame, 
  Sparkles,
  Eye
} from 'lucide-react';
import { getSafeImageUrl } from '@/lib/utils';

interface EditorsPicksMostReadProps {
  editorPicks: any[];
  mostRead: any[];
  title?: string;
  mostReadTitle?: string;
  displayViewsBadge?: boolean;
}

const DEFAULT_EDITOR_PICKS = [
  {
    id: 'ep-1',
    title: 'Eat Well, Live Better: Evidence-Based Nutritional Protocols for Longevity',
    slug: 'eat-well-live-better-nutrition',
    excerpt: 'Simple yet clinically verified dietary adjustments that substantially lower systemic inflammation and support metabolic longevity.',
    image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    category: 'NUTRITION',
    source_name: 'HealthGhuru Editorial',
    read_time: '4 min read',
  },
  {
    id: 'ep-2',
    title: 'Better Sleep, Better Health: The Circadian Biology of Restorative Nights',
    slug: 'better-sleep-better-health-circadian-biology',
    excerpt: 'How core temperature regulation, evening blue-light attenuation, and sleep hygiene safeguard neurocognitive resilience.',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    category: 'SLEEP SCIENCE',
    source_name: 'Circadian Medicine Wire',
    read_time: '5 min read',
  },
  {
    id: 'ep-3',
    title: 'HealthGhuru Monthly Clinical Digest: Breakthroughs in Preventive Medicine',
    slug: 'healthghuru-clinical-digest-metabolic-health',
    excerpt: 'Evaluating continuous biomarker tracking, insulin sensitivity protocols, and postprandial exercise timing in adults.',
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    category: 'PERIODICAL',
    source_name: 'Special Clinical Edition',
    read_time: '6 min read',
  },
  {
    id: 'ep-4',
    title: 'AI Diagnostic Breakthrough: New AI Model Detects Early Cardiac Arrhythmias With 99% Accuracy',
    slug: 'ai-diagnostic-breakthrough-early-cardiac-arrhythmias',
    excerpt: 'Cardiologists validate deep-learning ECG analysis detecting subclinical micro-ischemia months before symptom onset.',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    category: 'CARDIOLOGY',
    source_name: 'Digital Health Frontier',
    read_time: '4 min read',
  },
];

const DEFAULT_MOST_READ = [
  {
    id: 'mr-1',
    title: 'Fermented Foods vs Synthetic Probiotics: Microbiome Diversity Study Shows Surprising Results',
    slug: 'fermented-foods-vs-synthetic-probiotics',
    category: 'NUTRITION',
    view_count: '6.4k',
    read_time: '5 min read',
  },
  {
    id: 'mr-2',
    title: 'Zone-2 Aerobic Conditioning Proven To Maximize Mitochondrial Density and Insulin Sensitivity',
    slug: 'zone-2-aerobic-conditioning-mitochondrial-density',
    category: 'FITNESS',
    view_count: '5.8k',
    read_time: '4 min read',
  },
  {
    id: 'mr-3',
    title: 'Neuroimaging Confirms Mindful Breathwork and Vagal Nerve Stimulation Reduce Cortisol By 38%',
    slug: 'mindful-breathwork-vagal-nerve-cortisol-reduction',
    category: 'MENTAL HEALTH',
    view_count: '5.1k',
    read_time: '6 min read',
  },
  {
    id: 'mr-4',
    title: 'Pediatric Screen Time Thresholds Correlated With Deep Sleep Latency and Cognitive Attention',
    slug: 'pediatric-screen-time-thresholds-deep-sleep',
    category: 'PEDIATRICS',
    view_count: '4.7k',
    read_time: '5 min read',
  },
  {
    id: 'mr-5',
    title: 'WHO Releases Global Guidance on Maternal Iron Deficiency and Postpartum Mental Wellness',
    slug: 'who-global-guidance-maternal-iron-deficiency',
    category: "WOMEN'S HEALTH",
    view_count: '4.2k',
    read_time: '4 min read',
  },
];

export function EditorsPicksMostRead({
  editorPicks,
  mostRead,
  title,
  mostReadTitle,
  displayViewsBadge = true,
}: EditorsPicksMostReadProps) {
  // Merge live items with curated defaults so both sides are full and high-impact
  const finalEditorPicks = useMemo(() => {
    const list = [...(editorPicks || [])];
    for (const item of DEFAULT_EDITOR_PICKS) {
      if (list.length >= 4) break;
      if (!list.some((existing) => existing.slug === item.slug || existing.title === item.title)) {
        list.push(item);
      }
    }
    return list.slice(0, 4);
  }, [editorPicks]);

  const finalMostRead = useMemo(() => {
    const list = [...(mostRead || [])];
    for (const item of DEFAULT_MOST_READ) {
      if (list.length >= 5) break;
      if (!list.some((existing) => existing.slug === item.slug || existing.title === item.title)) {
        list.push(item);
      }
    }
    return list.slice(0, 5);
  }, [mostRead]);

  return (
    <section className="w-full py-8 sm:py-12 bg-white">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ============================================================== */}
          {/* LEFT 7 COLS: EDITOR'S PICKS (Styled with HealthGhuru Logo Theme) */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Header: Title with Logo Gradient Underline & Curated Pill */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-6 relative">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-7 rounded-full bg-gradient-to-b from-[#16A34A] to-[#22C55E] shrink-0" />
                <div className="flex items-center gap-2">
                  <Award size={22} className="text-[#f06d2f]" />
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight uppercase">
                    {title ? (
                      title
                    ) : (
                      <>
                        <span className="text-[#16A34A]">EDITOR&apos;S</span>{' '}
                        <span className="text-[#f06d2f]">PICKS</span>
                      </>
                    )}
                  </h2>
                </div>
              </div>

              {/* Curated Editorial Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-500/20 text-[#16A34A] text-[11px] font-heading font-black uppercase tracking-wider shadow-2xs">
                <Sparkles size={11} className="text-[#f06d2f]" />
                <span>Curated Editorial</span>
              </div>

              {/* Brand Dual-Gradient Underline */}
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f] rounded-full" />
            </div>

            {/* 2x2 Grid: 4 Editor's Choice Story Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {finalEditorPicks.map((story, i) => {
                const slug = story.slug || `editor-pick-${i}`;
                const category = story.category || story.subcategory || 'HEALTH';
                const image = story.image_url || DEFAULT_EDITOR_PICKS[i % DEFAULT_EDITOR_PICKS.length].image_url;

                return (
                  <article
                    key={story.id || i}
                    className="group bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 hover:border-emerald-500/50 shadow-2xs hover:shadow-card-brand hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail with Logo-Themed Category Pill */}
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 bg-slate-900 shadow-2xs">
                        <Image
                          src={getSafeImageUrl(image, category)}
                          alt={story.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          unoptimized
                        />
                        
                        {/* Gradient Vignette for Depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

                        {/* Logo-Theme Dual-Gradient Category Badge */}
                        <div className="absolute top-2.5 left-2.5 pointer-events-none">
                          <span className="bg-gradient-to-r from-[#16A34A] to-[#f06d2f] text-white text-[9.5px] font-heading font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                            {category}
                          </span>
                        </div>

                        {/* Read Time on Image Corner */}
                        <div className="absolute bottom-2 right-2 pointer-events-none">
                          <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                            <Clock size={9} className="text-emerald-400" />
                            <span>{story.read_time || '4m read'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <Link href={`/article/${slug}`} className="block">
                        <h3 className="font-heading font-bold text-xs sm:text-[13.5px] text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                          {story.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {story.excerpt || story.description}
                      </p>
                    </div>

                    {/* Card Footer: Verified Source & Logo-Themed CTA */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1 text-slate-500 font-medium truncate">
                        <ShieldCheck size={12} className="text-[#16A34A] shrink-0" />
                        <span className="truncate">{story.source_name || "Special Report"}</span>
                      </div>
                      <Link 
                        href={`/article/${slug}`} 
                        className="text-[#f06d2f] group-hover:text-[#16A34A] font-heading font-black group-hover:translate-x-1 transition-all inline-flex items-center gap-1 shrink-0"
                      >
                        <span>Read</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT 5 COLS: MOST READ THIS WEEK (Ranked 01 - 05)              */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 flex flex-col bg-gradient-to-b from-white via-white to-emerald-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-500/25 shadow-xs hover:shadow-card-brand transition-all duration-300">
            {/* Header with Flame, Title, and Pulse Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 relative">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#f06d2f] shrink-0">
                  <Flame size={18} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="font-heading font-black text-base sm:text-lg text-slate-900 tracking-tight uppercase">
                    {mostReadTitle || "MOST READ THIS WEEK"}
                  </h2>
                </div>
              </div>

              {/* By Engagement Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-[#16A34A] text-[10px] font-heading font-black uppercase tracking-wider">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#16A34A]"></span>
                </span>
                <span>By Engagement</span>
              </div>

              {/* Header Accent Line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#16A34A] to-[#f06d2f] rounded-full" />
            </div>

            {/* Ranked Articles List 01 - 05 */}
            <div className="divide-y divide-slate-100 space-y-2">
              {finalMostRead.map((story, i) => {
                const rank = String(i + 1).padStart(2, '0');
                const slug = story.slug || `most-read-${i}`;
                const isTop1 = i === 0;

                return (
                  <Link
                    key={story.id || i}
                    href={`/article/${slug}`}
                    className="pt-2.5 first:pt-0 p-2.5 -mx-2 rounded-xl hover:bg-emerald-50/60 hover:border-emerald-200/40 transition-all duration-200 flex items-start gap-3.5 group cursor-pointer"
                  >
                    {/* Rank Number: Top #1 gets glowing orange accent, others emerald gradient */}
                    <span 
                      className={`font-display font-black text-2xl sm:text-3xl leading-none shrink-0 w-8 transition-colors ${
                        isTop1 
                          ? 'text-[#f06d2f] group-hover:scale-110' 
                          : 'text-[#16A34A]/40 group-hover:text-[#f06d2f]'
                      }`}
                    >
                      {rank}
                    </span>

                    {/* Story Details */}
                    <div className="flex-1 min-w-0">
                      {story.category && (
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#f06d2f] group-hover:text-[#16A34A] transition-colors">
                          {story.category}
                        </span>
                      )}
                      
                      <h4 className="font-heading font-bold text-xs sm:text-[13.5px] text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug mt-0.5">
                        {story.title}
                      </h4>

                      {/* Engagement Metrics */}
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-1">
                        {displayViewsBadge && (
                          <>
                            <span className="flex items-center gap-1 text-slate-500 font-mono">
                              <Eye size={10} className="text-[#f06d2f]" />
                              <span>{typeof story.view_count === 'number' ? `${story.view_count} views` : (story.view_count || '5.4k views')}</span>
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span className="flex items-center gap-1 font-mono">
                          <Clock size={10} />
                          <span>{story.read_time || '5 min read'}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
