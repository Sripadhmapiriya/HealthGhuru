'use client';

import React, { useState } from 'react';
import {
  Droplet,
  RotateCcw,
  Sparkles,
  Sun,
  Activity,
  AlertCircle,
  GlassWater,
  CheckCircle2,
} from 'lucide-react';
import { calculateWaterIntake, WaterIntakeResult } from '@/lib/health-tools';

export function WaterIntakeCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState<string>('70');
  const [weightLbs, setWeightLbs] = useState<string>('154');
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(30);
  const [isHotClimate, setIsHotClimate] = useState<boolean>(false);

  // Result state
  const [result, setResult] = useState<WaterIntakeResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let finalWeightKg = 0;
    if (unit === 'metric') {
      const w = parseFloat(weightKg);
      if (!w || w < 20 || w > 300) {
        setError('Please enter a weight between 20 kg and 300 kg.');
        return;
      }
      finalWeightKg = w;
    } else {
      const lbs = parseFloat(weightLbs);
      if (!lbs || lbs < 45 || lbs > 660) {
        setError('Please enter a weight between 45 lbs and 660 lbs.');
        return;
      }
      finalWeightKg = lbs * 0.453592;
    }

    const calculated = calculateWaterIntake(finalWeightKg, exerciseMinutes, isHotClimate);
    setResult(calculated);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setResult(null);
    setHasCalculated(false);
    setError(null);
    setWeightKg('70');
    setWeightLbs('154');
    setExerciseMinutes(30);
    setIsHotClimate(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: Form Inputs ── */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
              Hydration Factors
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Clinical 35 ml/kg baseline guideline
            </p>
          </div>

          {/* Unit Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setUnit('metric')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unit === 'metric'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Metric (kg)
            </button>
            <button
              type="button"
              onClick={() => setUnit('imperial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unit === 'imperial'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Imperial (lbs)
            </button>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="space-y-5">
          {/* Weight Input */}
          {unit === 'metric' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Body Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm bg-white pr-12"
                  placeholder="70"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                  kg
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Body Weight (lbs)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm bg-white pr-12"
                  placeholder="154"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                  lbs
                </span>
              </div>
            </div>
          )}

          {/* Daily Exercise Minutes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Daily Physical Activity (Minutes)
              </label>
              <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                {exerciseMinutes} mins / day
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="15"
              value={exerciseMinutes}
              onChange={(e) => setExerciseMinutes(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
              <span>0 min</span>
              <span>45 min</span>
              <span>90 min</span>
              <span>180 min</span>
            </div>
          </div>

          {/* Climate Condition Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Environmental Climate
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsHotClimate(false)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2.5 ${
                  !isHotClimate
                    ? 'border-cyan-600 bg-cyan-50/70 text-cyan-950 ring-2 ring-cyan-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Droplet size={16} className="text-cyan-600 shrink-0" />
                <div>
                  <div>Moderate / Temperate</div>
                  <div className="text-[10px] text-slate-500 font-normal">Normal perspiration</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsHotClimate(true)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2.5 ${
                  isHotClimate
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Sun size={16} className="text-amber-600 shrink-0" />
                <div>
                  <div>Hot / Tropical Climate</div>
                  <div className="text-[10px] text-slate-500 font-normal">+350 ml sweat offset</div>
                </div>
              </button>
            </div>
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
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-700/20 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Droplet size={16} />
              <span>Calculate Daily Water Goal</span>
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
            <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
              <Droplet size={32} />
            </div>
            <h3 className="font-heading font-black text-slate-800 text-lg sm:text-xl mb-1">
              Estimated Daily Fluid Goal
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-normal">
              Enter your body weight, workout habits, and environmental exposure to calculate your general daily fluid requirement.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50 duration-300">

            {/* Primary Result Hero */}
            <div className="bg-gradient-to-br from-white via-white to-cyan-50/40 rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Estimated Daily Fluid Goal
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-heading text-4xl sm:text-5xl font-black text-cyan-950 tracking-tight">
                      {result.liters}
                    </span>
                    <span className="text-lg font-bold text-cyan-700">Liters / day</span>
                    <span className="text-xs font-semibold text-slate-500 ml-1">
                      ({result.totalMl.toLocaleString()} ml)
                    </span>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-900 text-xs font-bold flex items-center gap-1.5">
                  <GlassWater size={15} className="text-cyan-700" />
                  <span>≈ {result.glasses} standard glasses</span>
                </div>
              </div>

              {/* Water Breakdown Elements */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Hydration Source Breakdown
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Baseline Needs</span>
                    <span className="font-bold text-slate-900 text-sm">{result.baselineMl} ml</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Exercise Replacement</span>
                    <span className="font-bold text-cyan-700 text-sm">+{result.activityAddonMl} ml</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Climate Offset</span>
                    <span className="font-bold text-amber-700 text-sm">+{result.climateAddonMl} ml</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Hydration Guidelines */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Clinical Hydration Tips
              </h4>
              <div className="space-y-2 text-xs text-slate-600 font-normal">
                <p>
                  &bull; <strong>Fluid variety:</strong> Approximately 20% of daily hydration naturally comes from water-dense foods (fruits, cucumbers, soups), while 80% is derived from water, herbal teas, and electrolytes.
                </p>
                <p>
                  &bull; <strong>Urine color check:</strong> Pale straw or clear-yellow urine indicates optimal hydration. Dark amber signifies a need to hydrate promptly.
                </p>
                <p>
                  &bull; <strong>Renal / Cardiac conditions:</strong> Patients with heart failure, kidney disease, or on diuretic therapies should always follow their physician’s fluid restriction limits.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
