/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Download, ArrowRight, Sparkles } from 'lucide-react';
import { getSafeImageUrl } from '@/lib/utils';

interface HealthMagazinesSectionProps {
  magazines: any[];
}

export function HealthMagazinesSection({ magazines }: HealthMagazinesSectionProps) {
  const sampleMags = magazines && magazines.length > 0 ? magazines : [
    {
      id: "mag-1",
      title: "HealthGhuru Clinical Review: Oncology Breakthroughs",
      issue: "Vol. 14 • Q3 2026",
      cover_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
      slug: "oncology-breakthroughs-q3-2026"
    },
    {
      id: "mag-2",
      title: "Cardiovascular Prevention & Arterial Health Digest",
      issue: "Special Issue • August 2026",
      cover_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
      slug: "cardiovascular-prevention-2026"
    },
    {
      id: "mag-3",
      title: "Pediatric Wellness & Developmental Milestones",
      issue: "Quarterly Edition • 2026",
      cover_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
      slug: "pediatric-wellness-2026"
    },
    {
      id: "mag-4",
      title: "Integrative Nutrition & Metabolic Flexibility",
      issue: "Spring Edition • 2026",
      cover_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
      slug: "integrative-nutrition-2026"
    }
  ];

  return (
    <section className="w-full py-8 sm:py-10 bg-[#F5FAF5] border-t border-b border-[#2E7D32]/15">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#2E7D32]">
          <div className="flex items-center gap-2.5">
            <BookOpen size={20} className="text-[#1B5E20]" />
            <div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A2E1A] uppercase tracking-wide">
                DIGITAL HEALTH MAGAZINES
              </h2>
              <p className="text-xs text-[#4A6741] font-medium hidden sm:block">
                Quarterly clinical digests and patient wellness journals in high-resolution PDF format
              </p>
            </div>
          </div>
          <Link
            href="/magazines"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#1B5E20] hover:text-[#f06d2f] transition-colors"
          >
            <span>View All Editions</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 4 Magazine Covers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {sampleMags.slice(0, 4).map((mag, i) => (
            <div
              key={mag.id || i}
              className="group bg-white rounded-2xl p-3 border border-[#2E7D32]/15 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-200 mb-3 shadow-sm">
                <Image
                  src={getSafeImageUrl(mag.cover_url || mag.image_url, 'magazine', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80')}
                  alt={mag.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-bold font-heading inline-flex items-center gap-1">
                    <span>Read Issue</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#f06d2f] font-bold uppercase tracking-wider block">
                  {mag.issue || "Digital Digest"}
                </span>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug mt-1">
                  {mag.title}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>PDF Download</span>
                <Link
                  href="/magazines"
                  className="text-[#1B5E20] font-bold hover:text-[#f06d2f] inline-flex items-center gap-1"
                >
                  <Download size={11} />
                  <span>View</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
