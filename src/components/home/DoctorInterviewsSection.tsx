/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, ShieldCheck, Stethoscope, ArrowRight, Sparkles } from 'lucide-react';
import { getSafeImageUrl } from '@/lib/utils';

interface DoctorInterviewsSectionProps {
  interviews: any[];
}

export function DoctorInterviewsSection({ interviews }: DoctorInterviewsSectionProps) {
  if (!interviews || interviews.length === 0) return null;

  return (
    <section className="group/interviews w-full my-6 sm:my-8 relative overflow-hidden rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_4px_30px_rgba(22,163,74,0.06)] hover:shadow-[0_16px_40px_rgba(22,163,74,0.1)] hover:border-emerald-500/25 transition-all duration-500 p-5 sm:p-7 lg:p-9">
      {/* Specular Top Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />

      {/* Ambient Consultation Glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-rose-100/35 via-emerald-50/20 to-transparent rounded-full blur-3xl pointer-events-none group-hover/interviews:scale-110 transition-transform duration-700" />

      {/* Decorative 3D Glass Heart Image - Contained Safely Inside Card Boundary */}
      <div className="hidden lg:flex absolute right-6 top-6 w-28 h-28 xl:w-32 xl:h-32 pointer-events-none z-0 items-center justify-center opacity-25 group-hover/interviews:opacity-50 group-hover/interviews:scale-105 transition-all duration-700">
        <Image
          src="/images/glass_heart.png"
          alt="Doctor Interviews"
          fill
          className="object-contain drop-shadow-[0_10px_20px_rgba(22,163,74,0.15)]"
        />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <div className="pb-5 mb-8 relative border-b border-emerald-500/15">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {/* Clinical Perspectives Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-500/25 text-[#16A34A] text-[11px] font-heading font-black uppercase tracking-wider mb-2.5 shadow-2xs">
                <Sparkles size={11} className="text-[#16A34A]" />
                <span>Clinical Perspectives</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-semibold normal-case">Verified Specialists</span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-7 rounded-full bg-gradient-to-b from-[#16A34A] to-[#22C55E] shrink-0" />
                <div className="flex items-center gap-2.5">
                  <Stethoscope size={24} className="text-[#16A34A]" />
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
                    EXPERT DOCTOR INTERVIEWS
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-3xl leading-relaxed">
                In-depth clinical discussions with verified chief consultants and medical department heads
              </p>
            </div>

            {/* View All Doctors Button */}
            <Link
              href="/doctors"
              className="group/btn relative z-10 inline-flex items-center gap-2 text-xs font-heading font-bold text-[#16A34A] hover:text-white transition-all duration-300 py-2.5 px-5 rounded-full bg-white hover:bg-gradient-to-r hover:from-[#16A34A] hover:to-[#22C55E] border border-emerald-500/30 hover:border-transparent hover:shadow-md hover:shadow-emerald-500/20 shrink-0 self-start md:self-end"
            >
              <span>View All Doctors</span>
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Dual-Gradient Glowing Divider Line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-rose-400/30 rounded-full" />
        </div>

        {/* 3-Column Interview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.slice(0, 3).map((item, index) => {
            const slug = item.slug || `interview-${index}`;
            const safeCover = getSafeImageUrl(item.cover_image_url, item.category || 'medical');
            const safeDocPhoto = getSafeImageUrl(item.doctor_photo, 'medical', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80');
            return (
              <div
                key={item.id || index}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-emerald-500/50 shadow-2xs hover:shadow-card-brand hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group/card"
              >
                {/* Video / Cover Image with Play Overlay */}
                <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={safeCover}
                    alt={item.title || 'Doctor Interview'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500 opacity-90 group-hover/card:opacity-100"
                    unoptimized
                  />
                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Play Button Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#16A34A] to-[#22C55E] text-white flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform duration-300">
                      <Play size={18} className="fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="bg-slate-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[9.5px] font-heading font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      {item.category || "Cardiology"}
                    </span>
                  </div>
                </div>

                {/* Content & Doctor Profile Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Doctor Info Pill */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/40 shrink-0 shadow-2xs">
                        <Image
                          src={safeDocPhoto}
                          alt={item.doctor_name || "Doctor"}
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {item.doctor_name || "Dr. Arvind Deshmukh"}
                          </h4>
                          <ShieldCheck size={14} className="text-[#16A34A] shrink-0" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium truncate">
                          {item.doctor_specialization || "Chief Consultant"} • {item.hospital_name || "Premier Healthcare"}
                        </p>
                      </div>
                    </div>

                    <Link href={`/interviews/${slug}`} className="block">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover/card:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                        &ldquo;{item.title}&rdquo;
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400 font-medium">
                      Video &amp; Transcript
                    </span>
                    <Link
                      href={`/interviews/${slug}`}
                      className="inline-flex items-center gap-1 text-xs font-heading font-bold text-[#16A34A] group-hover/card:text-emerald-700 transition-colors group-hover/card:translate-x-1"
                    >
                      <span>Watch Interview</span>
                      <ArrowRight size={13} />
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
