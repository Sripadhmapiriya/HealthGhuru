'use client';

import React, { useState } from 'react';
import {
  Baby,
  RotateCcw,
  Sparkles,
  Calendar,
  AlertCircle,
  Clock,
  Heart,
  ShieldAlert,
} from 'lucide-react';
import {
  calculatePregnancyDueDate,
  PregnancyDueDateResult,
} from '@/lib/health-tools';

export function PregnancyDueDateCalculator() {
  // Default to 8 weeks ago for a realistic demonstration
  const getDefaultLmp = () => {
    const d = new Date();
    d.setDate(d.getDate() - 56);
    return d.toISOString().split('T')[0];
  };

  const [lmpDate, setLmpDate] = useState<string>(getDefaultLmp());
  const [cycleLength, setCycleLength] = useState<string>('28');

  // Result state
  const [result, setResult] = useState<PregnancyDueDateResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!lmpDate) {
      setError('Please select the first day of your last menstrual period (LMP).');
      return;
    }

    const cl = parseInt(cycleLength, 10);
    if (!cl || cl < 20 || cl > 45) {
      setError('Please enter a cycle length between 20 and 45 days.');
      return;
    }

    const calculated = calculatePregnancyDueDate(lmpDate, cl);
    if (!calculated) {
      setError('Could not calculate due date from provided date.');
      return;
    }

    setResult(calculated);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setResult(null);
    setHasCalculated(false);
    setError(null);
    setLmpDate(getDefaultLmp());
    setCycleLength('28');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: Form Inputs ── */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-6">
        <div>
          <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
            Gestational Timeline Inputs
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Naegele's rule adjusted for menstrual cycle duration
          </p>
        </div>

        <form onSubmit={handleCalculate} className="space-y-5">
          {/* First day of LMP */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              First Day of Last Menstrual Period (LMP)
            </label>
            <div className="relative">
              <input
                type="date"
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-transparent text-sm bg-white"
              />
            </div>
          </div>

          {/* Average Cycle Length */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Average Cycle Length (Days)
              </label>
              <span className="text-xs font-bold text-[#f06d2f] bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                {cycleLength} days
              </span>
            </div>
            <input
              type="number"
              min="20"
              max="45"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-transparent text-sm bg-white"
              placeholder="28"
            />
            <p className="text-[11px] text-slate-500 mt-1 font-normal">
              Standard clinical reference is 28 days. Adjust if your typical cycle is longer or shorter.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs font-medium">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#f06d2f] to-[#16A34A] hover:from-[#ea580c] hover:to-[#15803D] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-orange-700/20 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Baby size={16} />
              <span>Calculate Estimated Due Date</span>
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
        {!hasCalculated || !result ? (
          <div className="h-full min-h-[380px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-100/80 text-[#f06d2f] flex items-center justify-center mb-4 shadow-xs">
              <Baby size={32} />
            </div>
            <h3 className="font-heading font-black text-slate-800 text-lg sm:text-xl mb-1">
              Estimated Due Date &amp; Trimester
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-normal">
              Enter your last menstrual period date to estimate your due date, current gestational age in weeks/days, and clinical ultrasound timeline.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Primary Due Date Hero */}
            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Estimated Due Date (EDD)
                  </span>
                  <div className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    {result.dueDateFormatted}
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-900 text-xs font-bold">
                  {result.trimesterLabel}
                </div>
              </div>

              {/* Current Gestational Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    Current Gestational Age: {result.currentWeeks} weeks, {result.currentDays} days
                  </span>
                  <span className="font-mono text-[#f06d2f] font-bold">
                    {result.percentCompleted}% of 40 weeks
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f06d2f] to-[#16A34A] rounded-full transition-all duration-500"
                    style={{ width: `${result.percentCompleted}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950 flex items-center justify-between">
                <span>Estimated Conception Window:</span>
                <strong className="font-semibold text-slate-900">{result.conceptionDateFormatted}</strong>
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Key Clinical Milestones
              </span>

              <div className="space-y-2">
                {result.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                        W{m.week}
                      </span>
                      <span className="font-semibold text-slate-800">{m.label}</span>
                    </div>
                    <span className="font-mono text-slate-500 font-medium text-[11px]">
                      {m.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
