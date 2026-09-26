/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Microscope, ShieldCheck, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { getSafeImageUrl } from '@/lib/utils';

interface MedicalResearchSectionProps {
  researchItems: any[];
}

export function MedicalResearchSection({ researchItems }: MedicalResearchSectionProps) {
  if (!researchItems || researchItems.length === 0) return null;

  return (
    <section className="group/research w-full my-6 sm:my-8 relative overflow-hidden rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_4px_30px_rgba(22,163,74,0.06)] hover:shadow-[0_16px_40px_rgba(22,163,74,0.1)] hover:border-emerald-500/25 transition-all duration-500 p-5 sm:p-7 lg:p-9">
      {/* Specular Top Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent pointer-events-none" />

      {/* Ambient Gradient Glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-teal-100/40 via-emerald-50/20 to-transparent rounded-full blur-3xl pointer-events-none group-hover/research:scale-110 transition-transform duration-700" />

      {/* Decorative 3D Glass DNA Image - Contained Safely Inside Card Boundary */}
      <div className="hidden lg:flex absolute right-6 top-6 w-28 h-28 xl:w-32 xl:h-32 pointer-events-none z-0 items-center justify-center opacity-25 group-hover/research:opacity-50 group-hover/research:scale-105 transition-all duration-700">
        <Image
          src="/images/glass_research_dna.png"
          alt="Medical Research DNA"
          fill
          className="object-contain drop-shadow-[0_10px_20px_rgba(20,184,166,0.15)]"
        />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <div className="pb-5 mb-8 relative border-b border-emerald-500/15">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {/* Evidence-Based Medicine Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-500/25 text-[#16A34A] text-[11px] font-heading font-black uppercase tracking-wider mb-2.5 shadow-2xs">
                <Sparkles size={11} className="text-[#16A34A]" />
                <span>Evidence-Based Medicine</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-semibold normal-case">Peer-Reviewed Trials</span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-7 rounded-full bg-gradient-to-b from-[#16A34A] to-[#22C55E] shrink-0" />
                <div className="flex items-center gap-2.5">
                  <Microscope size={24} className="text-[#16A34A]" />
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
                    MEDICAL RESEARCH & CLINICAL DISCOVERIES
                  </h2>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-3xl leading-relaxed">
                Peer-reviewed clinical trial readouts, pharmacology updates, and genomic breakthroughs
              </p>
            </div>

            {/* All Research Papers Button */}
            <Link
              href="/research"
              className="group/btn relative z-10 inline-flex items-center gap-2 text-xs font-heading font-bold text-[#16A34A] hover:text-white transition-all duration-300 py-2.5 px-5 rounded-full bg-white hover:bg-gradient-to-r hover:from-[#16A34A] hover:to-[#22C55E] border border-emerald-500/30 hover:border-transparent hover:shadow-md hover:shadow-emerald-500/20 shrink-0 self-start md:self-end"
            >
              <span>All Research Papers</span>
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Dual-Gradient Glowing Divider Line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-teal-400/40 rounded-full" />
        </div>

        {/* 3-Column Clinical Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchItems.slice(0, 3).map((item, index) => {
            const slug = item.slug || `research-${index}`;
            const safeCover = getSafeImageUrl(
              item.image_url,
              'medical',
              'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80'
            );

            return (
              <article
                key={item.id || index}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-emerald-500/50 shadow-2xs hover:shadow-card-brand hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group/card"
              >
                {/* Thumbnail Banner with Journal Badge & Metadata */}
                <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={safeCover}
                    alt={item.title || 'Clinical Research'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500 opacity-90 group-hover/card:opacity-100"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Journal Pill */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="text-[10px] font-mono font-bold bg-slate-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {item.source_name || "CLINICAL STUDY"}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Bar */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white/95 text-[11px] font-mono">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>Peer-Reviewed</span>
                    </span>
                    <span className="text-slate-300 text-[10px]">
                      {item.published_at ? "Recent Trial" : "2026"}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/article/${slug}`} className="block">
                      <h3 className="font-heading font-bold text-base text-slate-900 group-hover/card:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed font-normal">
                      {item.excerpt || item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400 font-medium flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      {item.read_time || "4 min read"}
                    </span>
                    <Link
                      href={`/article/${slug}`}
                      className="inline-flex items-center gap-1 text-xs font-heading font-black text-[#16A34A] group-hover/card:text-emerald-700 transition-colors group-hover/card:translate-x-1"
                    >
                      <span>Read Analysis</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
