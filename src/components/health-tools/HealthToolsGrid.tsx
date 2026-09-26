'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Search,
  X,
  Scale,
  Flame,
  Calculator,
  Droplet,
  Heart,
  Activity,
  Moon,
  Baby,
  Utensils,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  Lock,
} from 'lucide-react';
import { HEALTH_TOOLS, HealthToolItem } from '@/lib/health-tools';
import { useSubscription } from '@/lib/hooks/useSubscription';

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

// Category filter tabs
const CATEGORY_TABS = [
  { id: 'all', label: 'All Tools (9)' },
  { id: 'body', label: 'Body & Weight', match: ['bmi-calculator', 'ideal-weight-calculator', 'water-intake-calculator'] },
  { id: 'metabolism', label: 'Metabolism & Calories', match: ['bmr-calculator', 'calorie-calculator', 'nutrition-calculator'] },
  { id: 'vitality', label: 'Cardio & Sleep', match: ['heart-rate-calculator', 'sleep-calculator'] },
  { id: 'maternal', label: 'Maternal Health', match: ['pregnancy-due-date'] },
];

// Rich preview specs for each tool - Styled to HealthGuru Logo Theme (Emerald Green #16A34A & Sunset Orange #f06d2f)
interface ToolVisualSpec {
  gradient: string;
  glowColor: string;
  borderColor: string;
  btnGradient: string;
  btnHoverGradient: string;
  btnShadow: string;
  actionText: string;
  accentBadge: string;
  previewType: 'bmi_bar' | 'bmr_stat' | 'calorie_pills' | 'water_drops' | 'weight_compare' | 'heart_wave' | 'sleep_cycles' | 'pregnancy_bar' | 'macro_split';
  previewDetails: string[];
}

const TOOL_SPECS: Record<string, ToolVisualSpec> = {
  'bmi-calculator': {
    gradient: 'from-[#16A34A] via-emerald-600 to-[#044E3B]',
    glowColor: 'hover:shadow-emerald-500/20',
    borderColor: 'hover:border-[#16A34A]',
    btnGradient: 'bg-gradient-to-r from-[#16A34A] to-emerald-700',
    btnHoverGradient: 'hover:from-emerald-700 hover:to-emerald-800',
    btnShadow: 'shadow-emerald-600/25',
    actionText: 'Calculate BMI',
    accentBadge: 'WHO Clinical Standard',
    previewType: 'bmi_bar',
    previewDetails: ['Underweight <18.5', 'Normal 18.5–24.9', 'Overweight 25+'],
  },
  'bmr-calculator': {
    gradient: 'from-[#f06d2f] via-amber-500 to-[#ea580c]',
    glowColor: 'hover:shadow-orange-500/20',
    borderColor: 'hover:border-[#f06d2f]',
    btnGradient: 'bg-gradient-to-r from-[#f06d2f] to-[#ea580c]',
    btnHoverGradient: 'hover:from-[#ea580c] hover:to-[#c2410c]',
    btnShadow: 'shadow-orange-600/25',
    actionText: 'Calculate BMR',
    accentBadge: 'Mifflin-St Jeor Formula',
    previewType: 'bmr_stat',
    previewDetails: ['Resting Calories', '60–75% Daily Burn', 'Baseline Rate'],
  },
  'calorie-calculator': {
    gradient: 'from-emerald-700 via-[#16A34A] to-teal-700',
    glowColor: 'hover:shadow-emerald-500/20',
    borderColor: 'hover:border-[#16A34A]',
    btnGradient: 'bg-gradient-to-r from-[#16A34A] to-teal-700',
    btnHoverGradient: 'hover:from-emerald-700 hover:to-teal-800',
    btnShadow: 'shadow-emerald-700/25',
    actionText: 'Calculate Calories',
    accentBadge: 'TDEE Multiplier',
    previewType: 'calorie_pills',
    previewDetails: ['Maintenance', '-500 kcal Deficit', '+500 kcal Surplus'],
  },
  'water-intake-calculator': {
    gradient: 'from-teal-600 via-emerald-600 to-[#044E3B]',
    glowColor: 'hover:shadow-teal-500/20',
    borderColor: 'hover:border-teal-500',
    btnGradient: 'bg-gradient-to-r from-emerald-600 to-teal-700',
    btnHoverGradient: 'hover:from-emerald-700 hover:to-teal-800',
    btnShadow: 'shadow-teal-600/25',
    actionText: 'Calculate Water Intake',
    accentBadge: 'Hydration Guidelines',
    previewType: 'water_drops',
    previewDetails: ['35 ml / kg Weight', '+350 ml Exercise', 'Liters & Glasses'],
  },
  'ideal-weight-calculator': {
    gradient: 'from-[#f06d2f] via-orange-500 to-amber-600',
    glowColor: 'hover:shadow-orange-500/20',
    borderColor: 'hover:border-[#f06d2f]',
    btnGradient: 'bg-gradient-to-r from-[#f06d2f] to-amber-600',
    btnHoverGradient: 'hover:from-[#ea580c] hover:to-amber-700',
    btnShadow: 'shadow-orange-600/25',
    actionText: 'Calculate Ideal Weight',
    accentBadge: 'Multi-Formula Range',
    previewType: 'weight_compare',
    previewDetails: ['Devine (1974)', 'Robinson (1983)', 'BMI 18.5–24.9 Corridor'],
  },
  'heart-rate-calculator': {
    gradient: 'from-[#f06d2f] via-rose-600 to-red-600',
    glowColor: 'hover:shadow-orange-500/20',
    borderColor: 'hover:border-[#f06d2f]',
    btnGradient: 'bg-gradient-to-r from-[#f06d2f] to-rose-600',
    btnHoverGradient: 'hover:from-[#ea580c] hover:to-rose-700',
    btnShadow: 'shadow-orange-600/25',
    actionText: 'Calculate Heart Rate',
    accentBadge: 'Cardio Training Zones',
    previewType: 'heart_wave',
    previewDetails: ['Zones 1 to 5', 'Tanaka Formula', 'Karvonen Heart Reserve'],
  },
  'sleep-calculator': {
    gradient: 'from-[#044E3B] via-emerald-800 to-teal-900',
    glowColor: 'hover:shadow-emerald-500/20',
    borderColor: 'hover:border-emerald-600',
    btnGradient: 'bg-gradient-to-r from-[#044E3B] to-emerald-700',
    btnHoverGradient: 'hover:from-emerald-800 hover:to-emerald-900',
    btnShadow: 'shadow-emerald-900/30',
    actionText: 'Calculate Sleep Cycles',
    accentBadge: 'Circadian Architecture',
    previewType: 'sleep_cycles',
    previewDetails: ['90-Min REM Cycles', '14-Min Sleep Latency', 'Sleep Now Alarm'],
  },
  'pregnancy-due-date': {
    gradient: 'from-[#f06d2f] via-amber-500 to-[#16A34A]',
    glowColor: 'hover:shadow-orange-500/20',
    borderColor: 'hover:border-[#f06d2f]',
    btnGradient: 'bg-gradient-to-r from-[#f06d2f] to-[#16A34A]',
    btnHoverGradient: 'hover:from-[#ea580c] hover:to-[#15803D]',
    btnShadow: 'shadow-orange-600/25',
    actionText: 'Calculate Due Date',
    accentBadge: "Naegele's 280-Day Rule",
    previewType: 'pregnancy_bar',
    previewDetails: ['Weeks & Days Age', 'Trimesters 1–3', 'Ultrasound Milestones'],
  },
  'nutrition-calculator': {
    gradient: 'from-[#16A34A] via-emerald-600 to-[#f06d2f]',
    glowColor: 'hover:shadow-emerald-500/20',
    borderColor: 'hover:border-[#16A34A]',
    btnGradient: 'bg-gradient-to-r from-[#16A34A] to-[#f06d2f]',
    btnHoverGradient: 'hover:from-[#15803D] hover:to-[#ea580c]',
    btnShadow: 'shadow-emerald-700/25',
    actionText: 'Calculate Macros',
    accentBadge: 'Macronutrient Split',
    previewType: 'macro_split',
    previewDetails: ['Protein (4 kcal/g)', 'Carbs (4 kcal/g)', 'Fats (9 kcal/g)'],
  },
};

export function HealthToolsGrid() {
  const { isSubscribed } = useSubscription();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter tools based on active tab and live search
  const filteredTools = useMemo(() => {
    return HEALTH_TOOLS.filter((tool) => {
      // Tab filter
      if (activeTab !== 'all') {
        const tabObj = CATEGORY_TABS.find((t) => t.id === activeTab);
        if (tabObj?.match && !tabObj.match.includes(tool.id)) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = tool.name.toLowerCase().includes(query);
        const matchesDesc = tool.description.toLowerCase().includes(query);
        const matchesCat = tool.category.toLowerCase().includes(query);
        const matchesTags = tool.tags.some((tag) => tag.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesCat || matchesTags;
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-8">
      {/* ── Filter & Search Control Panel ── */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center overflow-x-auto scrollbar-none w-full md:w-auto gap-1.5 p-1 bg-slate-100 rounded-xl">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search calculators (e.g. BMI, Sleep)..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent bg-slate-50/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Results Counter Banner ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500 font-semibold">
        <span>
          Showing <strong className="text-slate-900">{filteredTools.length}</strong> of{' '}
          {HEALTH_TOOLS.length} Clinical Calculators
        </span>
        {isSubscribed ? (
          <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <Sparkles size={14} className="text-[#16A34A]" />
            <span>Subscriber Pass Active &bull; Daily Routine Manager Unlocked</span>
          </span>
        ) : (
          <Link
            href="/subscribe"
            className="flex items-center gap-1.5 text-[#f06d2f] hover:underline font-bold"
          >
            <Lock size={13} />
            <span>Subscriber-Only Feature &bull; Plans from ₹129</span>
          </Link>
        )}
      </div>

      {/* ── Attractive Responsive Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredTools.map((tool) => {
          const Icon = TOOL_ICON_MAP[tool.iconName] || Sparkles;
          const spec = TOOL_SPECS[tool.id] || {
            gradient: 'from-emerald-600 to-teal-600',
            glowColor: 'hover:shadow-emerald-500/15',
            borderColor: 'hover:border-emerald-400',
            btnGradient: 'bg-[#16A34A]',
            btnHoverGradient: 'hover:bg-[#15803D]',
            btnShadow: 'shadow-emerald-600/25',
            actionText: 'Use Calculator',
            accentBadge: tool.badge,
            previewType: 'bmi_bar',
            previewDetails: [],
          };

          return (
            <div
              key={tool.id}
              className={`group bg-white rounded-3xl border border-gray-200/90 ${spec.borderColor} p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${spec.glowColor} hover:-translate-y-1.5 relative overflow-hidden`}
            >
              {/* Top Accent Gradient Line with Shimmer */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${spec.gradient}`}
              />

              {/* Decorative Subtle Corner Glow */}
              <div
                className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br ${spec.gradient} opacity-5 group-hover:opacity-15 blur-xl transition-opacity pointer-events-none`}
              />

              <div className="space-y-4">
                {/* 1. Header: Icon & Clinical Tag */}
                <div className="flex items-start justify-between gap-3">
                  {/* Vibrant Squircle Icon Container */}
                  <div
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${spec.gradient} text-white flex items-center justify-center shadow-lg ${spec.btnShadow} group-hover:scale-110 group-hover:rotate-1 transition-all duration-300 shrink-0`}
                  >
                    <Icon size={26} className="text-white drop-shadow-xs" />
                  </div>

                  {/* Badge */}
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 shrink-0 shadow-2xs group-hover:bg-slate-200/80 transition-colors">
                    {spec.accentBadge}
                  </span>
                </div>

                {/* 2. Category & Tool Title */}
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                    {tool.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 group-hover:text-[#16A34A] transition-colors mt-0.5 tracking-tight">
                    {tool.name}
                  </h3>
                </div>

                {/* 3. Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal min-h-[40px]">
                  {tool.shortDescription}
                </p>

                {/* 4. Rich Tailored Mini Preview Component for visual WOW factor */}
                <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-100 group-hover:border-slate-200 transition-colors space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Zap size={12} className="text-amber-500" />
                      <span>Key Metrics Covered:</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">
                      Instant Formula
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {spec.previewDetails.map((detail, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[10.5px] font-medium shadow-2xs"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>

                  {/* Visual spectrum preview bar for BMI */}
                  {spec.previewType === 'bmi_bar' && (
                    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden flex mt-1">
                      <div className="w-[20%] bg-amber-400" title="Underweight" />
                      <div className="w-[30%] bg-emerald-500" title="Healthy" />
                      <div className="w-[25%] bg-orange-400" title="Overweight" />
                      <div className="w-[25%] bg-rose-500" title="Obese" />
                    </div>
                  )}

                  {/* Visual wave for Heart Rate */}
                  {spec.previewType === 'heart_wave' && (
                    <div className="flex items-center gap-1 text-[10px] text-red-600 font-semibold pt-0.5">
                      <Activity size={13} className="animate-pulse" />
                      <span>5 Targeted Zones (50% – 100% VO2 Max)</span>
                    </div>
                  )}

                  {/* Sleep 90-min icon preview */}
                  {spec.previewType === 'sleep_cycles' && (
                    <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-semibold pt-0.5">
                      <Moon size={13} />
                      <span>REM / NREM Sleep Architecture</span>
                    </div>
                  )}

                  {/* Water drop preview */}
                  {spec.previewType === 'water_drops' && (
                    <div className="flex items-center gap-1 text-[10px] text-cyan-700 font-semibold pt-0.5">
                      <Droplet size={13} />
                      <span>Body Mass + Sweat Rate Calibration</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Bottom Action Button */}
              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center">
                <Link
                  href={tool.href}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-heading font-black text-xs sm:text-sm tracking-wide ${spec.btnGradient} ${spec.btnHoverGradient} shadow-md ${spec.btnShadow} hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer group/btn`}
                >
                  {!isSubscribed && <Lock size={14} className="text-white/80 shrink-0" />}
                  <span>{spec.actionText}</span>
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1.5 transition-transform duration-200"
                  />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── High-Impact Logo-Themed Subscription & Daily Routine Showcase Section ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#044E3B] via-[#065F46] to-[#044E3B] p-6 sm:p-10 text-white shadow-xl shadow-emerald-950/20 border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#f06d2f]/20 via-emerald-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f06d2f] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
              <Sparkles size={13} />
              <span>Subscriber Exclusive Wellness Suite</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Unlock All 9 Clinical Health Tools &amp; Master Your Daily Body Routine
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              When you subscribe to HealthGhuru, all 9 clinical calculators are permanently unlocked. Plus, gain instant access to our Daily Body Routine Manager — synchronizing your morning hydration, calorie &amp; macronutrient fuel, cardio heart rate zones, and circadian sleep architecture.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                <CheckCircle2 size={15} className="text-[#16A34A] shrink-0" />
                <span>9 Clinical Calculators</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                <CheckCircle2 size={15} className="text-[#16A34A] shrink-0" />
                <span>Daily Body Routine</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                <CheckCircle2 size={15} className="text-[#16A34A] shrink-0" />
                <span>Sleep Alarms &amp; Zones</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                <CheckCircle2 size={15} className="text-[#16A34A] shrink-0" />
                <span>Zero Ads &amp; Premium Guides</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-64">
            {isSubscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-900/80 border border-emerald-400/30 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <CheckCircle2 size={15} className="text-[#16A34A]" />
                  <span>Subscription Active</span>
                </div>
                <p className="text-[11px] text-emerald-200/80">
                  You have full unlimited access to all tools and routine checklists.
                </p>
              </div>
            ) : (
              <>
                <Link
                  href="/subscribe"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#f06d2f] hover:bg-[#ea580c] text-white font-heading font-black text-sm tracking-wide shadow-lg shadow-orange-950/20 active:scale-[0.98] transition-all cursor-pointer text-center group"
                >
                  <span>Subscribe To Unlock</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <p className="text-center text-[11px] text-emerald-200/80">
                  Plans start from ₹129/month &bull; Cancel anytime
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {filteredTools.length === 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <p className="text-slate-500 text-sm font-medium">
            No health tools matched your search query &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveTab('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200 transition-colors cursor-pointer"
          >
            Clear Filters & View All Tools
          </button>
        </div>
      )}
    </div>
  );
}

