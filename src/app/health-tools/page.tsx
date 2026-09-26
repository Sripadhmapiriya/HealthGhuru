import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldAlert, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';
import { HealthToolsGrid } from '@/components/health-tools/HealthToolsGrid';

export const metadata: Metadata = {
  title: 'Health Tools & Calculators | HealthGuru',
  description:
    'Simple tools to help you understand and manage your health. Evidence-based BMI, BMR, Calorie, Hydration, Sleep, and Heart Rate calculators.',
};

export default function HealthToolsLandingPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50/70 pb-20">
      {/* ── Breadcrumb Bar ── */}
      <div className="bg-white border-b border-gray-200/80 py-3">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Link href="/" className="hover:text-[#16A34A] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#16A34A] font-bold">Health Tools</span>
          </div>
        </div>
      </div>

      {/* ── Hero Section (Logo Themed: Emerald Green #16A34A & Sunset Orange #f06d2f) ── */}
      <section className="bg-gradient-to-b from-white via-white to-emerald-50/50 border-b border-emerald-900/10 py-10 sm:py-14 relative overflow-hidden">
        {/* Subtle dual-color ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#16A34A]/8 to-[#f06d2f]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-xs font-bold uppercase tracking-wider shadow-2xs">
                <HeartPulse size={14} className="text-[#16A34A]" />
                <span>Evidence-Based Clinical Calculators</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#f06d2f] border border-orange-200 text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles size={13} className="text-[#f06d2f]" />
                <span>HealthGhuru Interactive Suite</span>
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A2E1A] tracking-tight">
              Health<span className="text-[#f06d2f]">Tools</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-700 leading-relaxed font-semibold">
              Simple tools to help you understand and manage your health.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              Explore 9 free, scientifically-grounded calculators covering body composition, metabolic expenditure, cardiovascular training zones, circadian sleep architecture, and gestational timelines.
            </p>
          </div>
        </div>
      </section>


      {/* ── Main Tools Interactive Grid Container ── */}
      <section className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
        <HealthToolsGrid />

        {/* ── Medical Disclaimer Banner ── */}
        <div className="mt-14 bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-2xs">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <ShieldAlert size={22} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wider">
              Educational &amp; Informational Health Notice
            </h3>
            <p className="text-xs sm:text-[13px] text-amber-900/90 leading-relaxed font-normal">
              HealthGuru health tools provide general educational estimates based on established clinical and physiological formulas (such as Mifflin-St Jeor, Naegele&apos;s rule, and WHO BMI categories). They do not provide medical diagnoses, treatment plans, or personalized prescriptions. Always consult a qualified physician or registered dietitian for individualized health evaluations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
