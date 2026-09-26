'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  Play,
  Film,
  Video,
  Scale,
  Flame,
  Calculator,
  Droplet,
  Heart,
  Activity,
  Moon,
  Baby,
  Utensils,
} from 'lucide-react';
import { HealthToolItem } from '@/lib/health-tools';
import { RelatedToolArticle, RelatedToolVideo } from '@/lib/health-tools/server';
import { SubscriberHealthToolGate } from './SubscriberHealthToolGate';

const TOOL_ICON_MAP: Record<string, any> = {
  Scale,
  Flame,
  Calculator,
  Droplet,
  Heart,
  Activity,
  Moon,
  Baby,
  Utensils,
};

interface CalculatorLayoutProps {
  tool: HealthToolItem;
  children: React.ReactNode;
  formulaTitle: string;
  formulaDescription: string;
  formulaBullets?: string[];
  limitations?: string[];
  relatedArticles: RelatedToolArticle[];
  relatedVideos?: RelatedToolVideo[];
  allTools: HealthToolItem[];
}

export function CalculatorLayout({
  tool,
  children,
  formulaTitle,
  formulaDescription,
  formulaBullets = [],
  limitations = [],
  relatedArticles = [],
  relatedVideos = [],
  allTools,
}: CalculatorLayoutProps) {
  const IconComponent = TOOL_ICON_MAP[tool.iconName] || Sparkles;
  const otherTools = allTools.filter((t) => t.id !== tool.id).slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-slate-50/70 pb-20">
      {/* ── Breadcrumb & Top Bar (Logo Themed) ── */}
      <div className="bg-white border-b border-gray-200/80 py-3">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider overflow-x-auto scrollbar-none whitespace-nowrap">
              <Link href="/" className="hover:text-[#16A34A] transition-colors shrink-0">
                Home
              </Link>
              <span className="shrink-0 text-slate-300">/</span>
              <Link href="/health-tools" className="hover:text-[#16A34A] transition-colors shrink-0">
                Health Tools
              </Link>
              <span className="shrink-0 text-slate-300">/</span>
              <span className="text-[#16A34A] font-extrabold shrink-0">{tool.name}</span>
            </div>

            <Link
              href="/health-tools"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:text-[#15803D] transition-colors shrink-0"
            >
              <ArrowLeft size={13} />
              <span className="hidden xs:inline">All 9 Calculators</span>
              <span className="xs:hidden">All</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Hero Header in Logo Theme (#16A34A Emerald Green & #f06d2f Warm Orange) ── */}
      <div className="bg-gradient-to-b from-white via-white to-emerald-50/40 border-b border-emerald-900/10 py-8 sm:py-12 relative overflow-hidden">
        {/* Subtle decorative glow in logo colors */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#16A34A]/5 to-[#f06d2f]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/80 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <IconComponent size={14} className="text-[#16A34A]" />
              <span>{tool.category} &bull; {tool.badge}</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A2E1A] tracking-tight">
              {tool.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {tool.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-white text-slate-600 text-[11px] font-semibold border border-slate-200 shadow-2xs"
                >
                  #{tag}
                </span>
              ))}
              <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-[#f06d2f] text-[11px] font-bold border border-orange-200 shadow-2xs">
                Official HealthGhuru Tool
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Calculator Interactive Container ── */}
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 -mt-4 sm:-mt-6">
        <div className="mb-10 sm:mb-12">
          <SubscriberHealthToolGate toolName={tool.name} category={tool.category}>
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-xl shadow-emerald-950/5 p-4 sm:p-7 lg:p-10">
              {children}
            </div>
          </SubscriberHealthToolGate>
        </div>

        {/* ── Medical Disclaimer Box ── */}
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 mb-12 flex items-start gap-3.5 shadow-2xs">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <ShieldAlert size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wide">
              Important Clinical & Educational Notice
            </h4>
            <p className="text-xs sm:text-[13px] text-amber-900/90 leading-relaxed font-normal">
              This health tool is engineered exclusively for general wellness, fitness, and educational orientation. Calculations are estimates based on standard population formulas and do not constitute personalized medical evaluation, diagnosis, prescription, or clinical treatment. Always consult certified physicians or registered dietitians before initiating significant dietary, fitness, or therapeutic changes.
            </p>
          </div>
        </div>

        {/* ── Scientific Explanation & Clinical Methodology ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-[#044E3B]">
              <Info size={18} className="text-[#16A34A]" />
              <h3 className="font-heading font-black text-lg text-slate-900 tracking-tight">
                {formulaTitle}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {formulaDescription}
            </p>
            {formulaBullets.length > 0 && (
              <ul className="space-y-2 pt-2 border-t border-gray-100">
                {formulaBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="text-[#16A34A] font-bold">&bull;</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-[#f06d2f]">
              <ShieldAlert size={18} />
              <h3 className="font-heading font-black text-lg text-slate-900 tracking-tight">
                Limitations & Considerations
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              While clinical formulas provide valuable reference ranges, biological individuality plays a critical role in human physiology.
            </p>
            {limitations.length > 0 && (
              <ul className="space-y-2 pt-2 border-t border-gray-100">
                {limitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="text-[#f06d2f] font-bold">&bull;</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── RELATED HEALTHGURU VIDEOS SECTION (User Reference & Visual Guides) ── */}
        {relatedVideos && relatedVideos.length > 0 && (
          <div className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#f06d2f]">
                  Visual Medical Intelligence
                </span>
                <h3 className="font-heading text-2xl font-black text-slate-900 tracking-tight">
                  Related HealthGuru Video Guides & Demos
                </h3>
              </div>
              <Link
                href="/videos"
                className="text-xs font-bold text-[#16A34A] hover:text-[#15803D] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Browse All Videos & Shorts</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedVideos.map((vid) => {
                const durationFormatted = vid.duration_seconds
                  ? `${Math.floor(vid.duration_seconds / 60)}:${(vid.duration_seconds % 60).toString().padStart(2, '0')}`
                  : null;

                return (
                  <Link
                    key={vid.id}
                    href={`/video/${vid.slug}`}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col relative"
                  >
                    {/* Video Thumbnail with Play Button Overlay */}
                    <div className="aspect-[16/10] relative bg-slate-900 overflow-hidden">
                      {vid.image_url ? (
                        <Image
                          src={vid.image_url}
                          alt={vid.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900 to-slate-900 text-white font-bold text-xs p-4 text-center">
                          HealthGhuru Video Explainer
                        </div>
                      )}

                      {/* Dark Gradient Overlay for Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold uppercase text-white tracking-wider border border-white/10">
                          {vid.category}
                        </span>
                        {vid.is_short && (
                          <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-[9px] font-black uppercase text-white tracking-wider">
                            Short
                          </span>
                        )}
                      </div>

                      {/* Duration Badge */}
                      {durationFormatted && (
                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-mono font-bold text-white">
                          {durationFormatted}
                        </span>
                      )}

                      {/* Centered Glowing Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#f06d2f] text-white flex items-center justify-center shadow-lg shadow-orange-950/40 group-hover:scale-115 group-hover:bg-[#ea580c] transition-all duration-300">
                          <Play size={20} className="fill-white translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                      <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                        {vid.title}
                      </h4>

                      {vid.excerpt && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                          {vid.excerpt}
                        </p>
                      )}

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <Film size={12} />
                          <span>Video Guide</span>
                        </span>
                        <span className="font-bold text-[#f06d2f] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>Watch Now</span>
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Related HealthGuru Clinical Articles (from Neon DB) ── */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#16A34A]">
                  Evidence-Based Reading
                </span>
                <h3 className="font-heading text-2xl font-black text-slate-900 tracking-tight">
                  Related Clinical Articles & Insights
                </h3>
              </div>
              <Link
                href={`/category/${tool.relatedCategory}`}
                className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View More in {tool.category}</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/article/${art.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] relative bg-slate-100 overflow-hidden">
                    {art.image_url ? (
                      <Image
                        src={art.image_url}
                        alt={art.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-xs">
                        HealthGhuru Clinical Article
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                    {art.excerpt && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                        {art.excerpt}
                      </p>
                    )}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{art.reading_time || 4} min read</span>
                      </span>
                      <span className="font-bold text-[#16A34A] group-hover:translate-x-0.5 transition-transform">
                        Read Guide &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Explore Other Health Tools ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#f06d2f]">
                Interactive Suite
              </span>
              <h3 className="font-heading text-2xl font-black text-slate-900 tracking-tight">
                Explore More Health Tools
              </h3>
            </div>
            <Link
              href="/health-tools"
              className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1"
            >
              <span>View All 9 Tools</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherTools.map((t) => {
              const OtherIcon = TOOL_ICON_MAP[t.iconName] || Sparkles;
              return (
                <Link
                  key={t.id}
                  href={t.href}
                  className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs hover:shadow-md hover:border-[#16A34A] hover:scale-[1.02] transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#044E3B] flex items-center justify-center text-white shadow-sm shadow-emerald-900/20">
                      <OtherIcon size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        {t.category}
                      </span>
                      <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-[#16A34A] transition-colors">
                        {t.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {t.shortDescription}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#16A34A] mt-3">
                    <span>Use Calculator</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
