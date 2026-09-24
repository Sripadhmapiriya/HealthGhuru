/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { Microscope, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface MedicalResearchSectionProps {
  researchItems: any[];
}

export function MedicalResearchSection({ researchItems }: MedicalResearchSectionProps) {
  if (!researchItems || researchItems.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-12 bg-white">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Logo Gradient Underline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3.5 mb-7 relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-500/20 text-[#16A34A] text-[11px] font-heading font-black uppercase tracking-wider mb-2.5 shadow-2xs">
              <Sparkles size={11} className="text-[#f06d2f]" />
              <span>Evidence-Based Medicine</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-2.5 h-7 rounded-full bg-gradient-to-b from-[#16A34A] to-[#22C55E] shrink-0" />
              <div className="flex items-center gap-2.5">
                <Microscope size={22} className="text-[#16A34A]" />
                <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight uppercase">
                  MEDICAL RESEARCH & CLINICAL DISCOVERIES
                </h2>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-3xl leading-relaxed">
              Peer-reviewed clinical trial readouts, pharmacology updates, and genomic breakthroughs
            </p>
          </div>

          <Link
            href="/research"
            className="group inline-flex items-center gap-2 text-xs font-heading font-bold text-[#16A34A] hover:text-white transition-all duration-300 py-2 px-4.5 rounded-full bg-white hover:bg-gradient-to-r hover:from-[#16A34A] hover:to-[#22C55E] border border-emerald-500/30 hover:border-transparent hover:shadow-md hover:shadow-emerald-500/20 shrink-0 self-start md:self-end"
          >
            <span>All Research Papers</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          {/* Dual-Gradient Glowing Divider Line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f] rounded-full" />
        </div>

        {/* 3-Column Clinical Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchItems.slice(0, 3).map((item, index) => {
            const slug = item.slug || `research-${index}`;
            return (
              <article
                key={item.id || index}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-emerald-500/50 shadow-2xs hover:shadow-card-brand hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Journal Badge & Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-black bg-gradient-to-r from-[#16A34A] to-[#f06d2f] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                      {item.source_name || "CLINICAL STUDY"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-medium">
                      {item.published_at ? "Recent Trial" : "2026"}
                    </span>
                  </div>

                  <Link href={`/article/${slug}`} className="block">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-3 mt-2.5 leading-relaxed">
                    {item.excerpt || item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <ShieldCheck size={14} className="text-[#16A34A]" />
                    <span>Peer-Reviewed</span>
                  </div>
                  <Link
                    href={`/article/${slug}`}
                    className="text-[#f06d2f] group-hover:text-[#16A34A] font-heading font-black inline-flex items-center gap-1 group-hover:translate-x-1 transition-all"
                  >
                    <span>Read Analysis</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
