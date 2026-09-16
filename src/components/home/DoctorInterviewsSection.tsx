/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, ShieldCheck, Stethoscope, Video, ArrowRight } from 'lucide-react';

interface DoctorInterviewsSectionProps {
  interviews: any[];
}

export function DoctorInterviewsSection({ interviews }: DoctorInterviewsSectionProps) {
  if (!interviews || interviews.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-10 bg-[#F5FAF5] border-t border-b border-[#2E7D32]/15">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#2E7D32]">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#f06d2f]" />
            <div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1B5E20] uppercase tracking-wide">
                EXPERT DOCTOR INTERVIEWS
              </h2>
              <p className="text-xs text-[#4A6741] font-medium hidden sm:block">
                In-depth clinical discussions with verified chief consultants and department heads
              </p>
            </div>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#1B5E20] hover:text-[#f06d2f] transition-colors"
          >
            <span>View All Doctors</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 3-Column Interview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.slice(0, 3).map((item, index) => {
            const slug = item.slug || `interview-${index}`;
            return (
              <div
                key={item.id || index}
                className="bg-white rounded-2xl overflow-hidden border border-[#2E7D32]/20 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Video / Cover Image with Play Overlay */}
                <div className="relative aspect-[16/9] w-full bg-gray-900 overflow-hidden">
                  {item.cover_image_url && (
                    <Image
                      src={item.cover_image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      unoptimized
                    />
                  )}
                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Play Button Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#f06d2f] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={20} className="fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase border border-white/20">
                      {item.category || "Cardiology"}
                    </span>
                  </div>
                </div>

                {/* Content & Doctor Profile Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Doctor Info Pill */}
                    <div className="flex items-center gap-2.5 mb-3">
                      {item.doctor_photo && (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#2E7D32] shrink-0">
                          <Image
                            src={item.doctor_photo}
                            alt={item.doctor_name || "Doctor"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="font-heading font-bold text-xs text-[#1A2E1A] truncate">
                            {item.doctor_name || "Dr. Arvind Deshmukh"}
                          </h4>
                          <ShieldCheck size={13} className="text-[#2E7D32] shrink-0" />
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium truncate">
                          {item.doctor_specialization || "Interventional Cardiologist"} • {item.hospital_name || "Apex Hospital"}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                      "{item.title}"
                    </h3>

                    <p className="text-xs text-[#4A6741] line-clamp-2 mt-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-gray-400">
                      Video & Transcript
                    </span>
                    <Link
                      href={`/interviews/${slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#f06d2f] hover:underline"
                    >
                      <span>Watch Interview</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
