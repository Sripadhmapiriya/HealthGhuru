'use client';

import React from 'react';
import Link from 'next/link';
import {
  Lock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Activity,
  Droplet,
  Moon,
  Utensils,
  LogIn,
} from 'lucide-react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { useAuthModal } from '@/context/AuthModalContext';

interface SubscriberHealthToolGateProps {
  toolName: string;
  category: string;
  children: React.ReactNode;
}

export function SubscriberHealthToolGate({
  toolName,
  category,
  children,
}: SubscriberHealthToolGateProps) {
  const { isSubscribed, isLoading, status } = useSubscription();
  const { openLoginModal } = useAuthModal();

  // Loading skeleton while verifying membership
  if (isLoading) {
    return (
      <div className="w-full min-h-[360px] flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-slate-200 animate-pulse space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-200" />
        <div className="h-5 w-48 bg-slate-200 rounded-md" />
        <div className="h-4 w-72 bg-slate-200 rounded-md" />
      </div>
    );
  }

  // If user is a verified subscriber, show the full calculator and the subscriber routine manager
  if (isSubscribed) {
    return (
      <div className="space-y-8">
        {/* Verified Subscriber Access Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
            <Sparkles size={15} className="text-[#16A34A]" />
            <span>HealthGhuru Subscriber Access: Unlocked &amp; Active</span>
          </div>
          <span className="text-emerald-800 font-medium">
            Manage your daily body routine with unlimited calculator access
          </span>
        </div>

        {/* The Full Calculator */}
        {children}

        {/* ── Daily Body Routine Manager (For Subscribed Users) ── */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#044E3B] via-[#064e3b] to-[#0d3b2e] text-white border border-emerald-500/30 shadow-xl shadow-emerald-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#f06d2f]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f06d2f] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                <Activity size={13} />
                <span>Subscriber Daily Routine Manager</span>
              </div>
              <span className="text-[11px] text-emerald-200 font-mono">
                Daily Wellness Protocol
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
                Your Daily Body Routine Checklist
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-normal">
                Use your calculation results to structure your day for peak cellular energy, sustained metabolism, and restorative sleep.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {/* Routine Item 1 */}
              <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-400/20 space-y-1">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-bold">
                  <Droplet size={15} />
                  <span>Morning Hydration</span>
                </div>
                <p className="text-[11px] text-emerald-100/80 font-normal">
                  Drink 500 ml plain water upon waking to replenish nocturnal respiratory losses.
                </p>
              </div>

              {/* Routine Item 2 */}
              <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-400/20 space-y-1">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <Utensils size={15} />
                  <span>Calorie &amp; Macro Fuel</span>
                </div>
                <p className="text-[11px] text-emerald-100/80 font-normal">
                  Distribute target protein evenly across meals for muscle recovery and satiety.
                </p>
              </div>

              {/* Routine Item 3 */}
              <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-400/20 space-y-1">
                <div className="flex items-center gap-2 text-[#f06d2f] text-xs font-bold">
                  <Activity size={15} />
                  <span>Cardio Movement</span>
                </div>
                <p className="text-[11px] text-emerald-100/80 font-normal">
                  Target 30 minutes in Zone 2 aerobic heart rate for maximum mitochondrial lipid burn.
                </p>
              </div>

              {/* Routine Item 4 */}
              <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-400/20 space-y-1">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                  <Moon size={15} />
                  <span>Circadian Sleep Lock</span>
                </div>
                <p className="text-[11px] text-emerald-100/80 font-normal">
                  Commit to 5 complete 90-min cycles (7.5h) with 14-min sleep latency cushion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Unsubscribed State: Sleek Logo-Themed Paywall Gate ──
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-slate-50/70 to-emerald-50/30 border-2 border-[#16A34A]/30 shadow-xl shadow-emerald-950/5 p-6 sm:p-10 lg:p-12 text-center">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-[#16A34A]/10 to-[#f06d2f]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="h-1.5 w-full bg-gradient-to-r from-[#16A34A] via-emerald-400 to-[#f06d2f] absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        {/* Top Lock Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200 text-xs font-black uppercase tracking-wider shadow-2xs">
          <Lock size={14} className="text-[#f06d2f]" />
          <span>Subscriber-Exclusive Health Tool</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-2.5">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Subscribe To Unlock {toolName} &amp; Manage Your Daily Body Routine
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            This clinical calculator and all 9 interactive wellness tools are exclusively enabled for HealthGhuru members. Subscribe today to calculate your personalized metrics and structure your daily health routine.
          </p>
        </div>

        {/* Included Subscriber Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left py-2">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-[#16A34A] text-xs font-bold">
              <CheckCircle2 size={16} />
              <span>All 9 Calculators</span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              BMI, BMR, Calorie Deficits, Hydration, Sleep, Macros &amp; Due Date.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-[#f06d2f] text-xs font-bold">
              <CheckCircle2 size={16} />
              <span>Daily Routine Tracker</span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Sync daily targets for hydration, deficit calories, workouts &amp; bedtimes.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 size={16} />
              <span>100% Ad-Free Access</span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Full access to clinical reports, research digests &amp; PDF magazine editions.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/subscribe"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#f06d2f] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-heading font-black text-sm sm:text-base tracking-wide shadow-lg shadow-orange-700/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Subscribe to Unlock (From ₹129)</span>
            <ArrowRight size={18} />
          </Link>

          {status !== 'authenticated' && (
            <button
              type="button"
              onClick={() => openLoginModal({ initialMode: 'signin' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-heading font-bold text-sm tracking-wide transition-all cursor-pointer shadow-2xs"
            >
              <LogIn size={16} />
              <span>Already a Member? Sign In</span>
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400 font-normal">
          Instant activation via UPI QR (GPay, PhonePe, Paytm) &amp; Cards. Cancel anytime with one click.
        </p>
      </div>
    </div>
  );
}
