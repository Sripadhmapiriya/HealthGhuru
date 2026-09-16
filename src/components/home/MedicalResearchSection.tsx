/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Microscope, ExternalLink, Bookmark, ShieldCheck, ArrowRight } from 'lucide-react';

interface MedicalResearchSectionProps {
  researchItems: any[];
}

export function MedicalResearchSection({ researchItems }: MedicalResearchSectionProps) {
  if (!researchItems || researchItems.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-10 bg-white border-t border-b border-[#2E7D32]/15">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#2E7D32]">
          <div className="flex items-center gap-2.5">
            <Microscope size={22} className="text-[#1B5E20]" />
            <div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A2E1A] uppercase tracking-wide">
                MEDICAL RESEARCH & CLINICAL DISCOVERIES
              </h2>
              <p className="text-xs text-[#4A6741] font-medium hidden sm:block">
                Peer-reviewed clinical trial readouts, pharmacology updates, and genomic breakthroughs
              </p>
            </div>
          </div>
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#1B5E20] hover:text-[#f06d2f] transition-colors"
          >
            <span>All Research Papers</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 3-Column Clinical Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchItems.slice(0, 3).map((item, index) => {
            const slug = item.slug || `research-${index}`;
            return (
              <article
                key={item.id || index}
                className="bg-[#F5FAF5] rounded-2xl p-5 border border-[#2E7D32]/15 hover:border-[#2E7D32]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Journal Badge & Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold bg-[#1B5E20] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.source_name || "CLINICAL STUDY"}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {item.published_at ? "Recent Trial" : "2026"}
                    </span>
                  </div>

                  <Link href={`/article/${slug}`}>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#4A6741] line-clamp-3 mt-2.5 leading-relaxed">
                    {item.excerpt || item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#2E7D32]/10 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-[#2E7D32] font-semibold">
                    <ShieldCheck size={13} />
                    <span>Peer-Reviewed</span>
                  </div>
                  <Link
                    href={`/article/${slug}`}
                    className="text-[#f06d2f] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Read Analysis</span>
                    <ArrowRight size={11} />
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
