'use client';

import React, { useState } from 'react';
import {
  Moon,
  Sun,
  RotateCcw,
  Sparkles,
  Clock,
  Bed,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { calculateSleepCycles, SleepSuggestion } from '@/lib/health-tools';

export function SleepCalculator() {
  const [mode, setMode] = useState<'wake_at' | 'sleep_at'>('wake_at');
  const [targetTime, setTargetTime] = useState<string>('06:30');

  // Result state
  const [suggestions, setSuggestions] = useState<SleepSuggestion[] | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const results = calculateSleepCycles(targetTime, mode);
    setSuggestions(results);
    setHasCalculated(true);
  };

  const handleSleepNow = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentClock = `${hh}:${mm}`;
    setMode('sleep_at');
    setTargetTime(currentClock);
    const results = calculateSleepCycles(currentClock, 'sleep_at');
    setSuggestions(results);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setSuggestions(null);
    setHasCalculated(false);
    setTargetTime('06:30');
    setMode('wake_at');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: Form Inputs ── */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-6">
        <div>
          <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
            Circadian Rhythm Planner
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Synchronize sleep schedules with natural 90-minute REM cycles
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('wake_at')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'wake_at'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sun size={14} className="text-[#f06d2f]" />
            <span>I want to wake up at</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('sleep_at')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'sleep_at'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Moon size={14} className="text-[#16A34A]" />
            <span>I plan to sleep at</span>
          </button>
        </div>

        <form onSubmit={handleCalculate} className="space-y-5">
          {/* Target Time Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {mode === 'wake_at' ? 'Desired Wake-Up Time' : 'Scheduled Bedtime'}
            </label>
            <div className="relative">
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-black text-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent bg-white tracking-wider"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-normal">
              Includes an average 14-minute sleep latency (time required to fall asleep).
            </p>
          </div>

          {/* Quick Action: Sleep Right Now */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Bed size={15} className="text-[#16A34A]" />
                <span>Going to bed right now?</span>
              </div>
              <p className="text-[11px] text-emerald-900/80">
                Find the best times to set your alarm tonight.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSleepNow}
              className="px-3.5 py-1.5 rounded-lg bg-[#f06d2f] hover:bg-[#ea580c] text-white text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer"
            >
              Sleep Now
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#044E3B] to-emerald-700 hover:from-emerald-800 hover:to-emerald-900 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-950/20 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Moon size={16} />
              <span>
                {mode === 'wake_at' ? 'Calculate Optimal Bedtimes' : 'Calculate Optimal Wake Times'}
              </span>
            </button>

            {hasCalculated && (
              <button
                type="button"
                onClick={handleReset}
                className="p-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                title="Reset calculation"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Right Column: Dynamic Results ── */}
      <div className="lg:col-span-6 xl:col-span-7">
        {!hasCalculated || !suggestions ? (
          <div className="h-full min-h-[380px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
              <Clock size={32} />
            </div>
            <h3 className="font-heading font-black text-slate-800 text-lg sm:text-xl mb-1">
              Optimal Sleep Cycle Windows
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-normal">
              Waking up in the middle of a deep sleep cycle causes morning grogginess (sleep inertia). Choose your time to see optimal sleep intervals.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Header info */}
            <div className="bg-gradient-to-br from-white via-white to-emerald-50/40 rounded-2xl border border-gray-200 p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {mode === 'wake_at' ? 'To Wake Refreshed At:' : 'If You Go To Sleep At:'}
                  </span>
                  <div className="font-heading text-3xl font-black text-slate-900 mt-0.5">
                    {targetTime}
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-bold">
                  {mode === 'wake_at' ? 'Bedtime Schedule' : 'Wake-Up Schedule'}
                </div>
              </div>

              {/* Cycle Cards */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  {mode === 'wake_at'
                    ? 'Recommended Times to Fall Asleep:'
                    : 'Recommended Times to Set Your Alarm:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border ${item.badgeColor} transition-all space-y-1.5`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{item.quality}</span>
                        <span className="text-[11px] font-semibold opacity-75">
                          {item.cycles} cycles ({item.durationHours} hrs)
                        </span>
                      </div>
                      <div className="font-heading text-2xl font-black tracking-tight">
                        {item.timeStr}
                      </div>
                      <p className="text-[10px] opacity-80 font-normal">
                        {item.cycles === 5 || item.cycles === 6
                          ? 'Complete cellular repair, cognitive consolidation, and REM dreaming.'
                          : 'Sufficient recovery for busy days without grogginess.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Science note */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Info size={15} className="text-[#16A34A]" />
                <span>Why Sleep Architecture Matters</span>
              </div>
              <p className="leading-relaxed font-normal">
                A human sleep cycle transitions from light sleep (N1/N2) through deep delta-wave sleep (N3) into rapid-eye movement (REM). Awakening at the end of a complete 90-minute cycle ensures cortisol gently awakens you rather than an alarm jolting you out of deep delta restorative sleep.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
