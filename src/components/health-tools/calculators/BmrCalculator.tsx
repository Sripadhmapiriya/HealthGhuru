'use client';

import React, { useState } from 'react';
import {
  Flame,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { calculateBmr } from '@/lib/health-tools';

export function BmrCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [age, setAge] = useState<string>('30');
  const [sex, setSex] = useState<'male' | 'female'>('male');

  // Metric values
  const [heightCm, setHeightCm] = useState<string>('175');
  const [weightKg, setWeightKg] = useState<string>('72');

  // Imperial values
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('9');
  const [weightLbs, setWeightLbs] = useState<string>('158');

  // Result state
  const [bmr, setBmr] = useState<number | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const a = parseInt(age, 10);
    if (!a || a < 10 || a > 115) {
      setError('Please provide an age between 10 and 115.');
      return;
    }

    let finalHeightCm = 0;
    let finalWeightKg = 0;

    if (unit === 'metric') {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      if (!h || h < 60 || h > 260) {
        setError('Please enter a realistic height between 60 cm and 260 cm.');
        return;
      }
      if (!w || w < 25 || w > 350) {
        setError('Please enter a realistic weight between 25 kg and 350 kg.');
        return;
      }
      finalHeightCm = h;
      finalWeightKg = w;
    } else {
      const ft = parseFloat(heightFeet) || 0;
      const inch = parseFloat(heightInches) || 0;
      const totalInches = ft * 12 + inch;
      const lbs = parseFloat(weightLbs);

      if (totalInches < 24 || totalInches > 100) {
        setError('Please enter a realistic height (e.g. 5 ft 9 in).');
        return;
      }
      if (!lbs || lbs < 50 || lbs > 750) {
        setError('Please enter a realistic weight between 50 lbs and 750 lbs.');
        return;
      }
      finalHeightCm = totalInches * 2.54;
      finalWeightKg = lbs * 0.453592;
    }

    const calculated = calculateBmr(finalWeightKg, finalHeightCm, a, sex);
    setBmr(calculated);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setBmr(null);
    setHasCalculated(false);
    setError(null);
    setAge('30');
    setHeightCm('175');
    setWeightKg('72');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: Form Inputs ── */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
              Metabolic Inputs
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Mifflin-St Jeor clinical equations
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
              Metric
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
              Imperial
            </button>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="space-y-5">
          {/* Sex Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Biological Sex
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSex('male')}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all text-center ${
                  sex === 'male'
                    ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setSex('female')}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all text-center ${
                  sex === 'female'
                    ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Age Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Age (Years)
            </label>
            <input
              type="number"
              min="10"
              max="115"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
              placeholder="30"
            />
          </div>

          {/* Height Input */}
          {unit === 'metric' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Height (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white pr-12"
                  placeholder="175"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                  cm
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Height
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white pr-10"
                    placeholder="5"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">
                    ft
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white pr-10"
                    placeholder="9"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">
                    in
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Weight Input */}
          {unit === 'metric' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white pr-12"
                  placeholder="72"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                  kg
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Weight (lbs)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white pr-12"
                  placeholder="158"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                  lbs
                </span>
              </div>
            </div>
          )}

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
              className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-orange-700/20 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame size={16} />
              <span>Calculate BMR</span>
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
        {!hasCalculated || bmr === null ? (
          <div className="h-full min-h-[380px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center mb-4 shadow-xs">
              <Flame size={32} />
            </div>
            <h3 className="font-heading font-black text-slate-800 text-lg sm:text-xl mb-1">
              Estimated Basal Metabolic Rate
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-normal">
              Provide your details and click <strong className="text-orange-600">Calculate BMR</strong> to discover your daily baseline resting energy expenditure.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Primary Score Hero */}
            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Estimated Basal Metabolic Rate
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-heading text-4xl sm:text-5xl font-black text-orange-950 tracking-tight">
                      {bmr.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-orange-700">kcal / day</span>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-900 text-xs font-bold">
                  Resting Baseline
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                This estimate represents the calories your body consumes purely to stay alive at complete rest (breathing, cell renewal, circulation, and thermoregulation).
              </p>

              {/* Activity Level Extrapolation preview */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Projected Daily Burn by Activity Level
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Sedentary (1.2x)</span>
                    <span className="font-bold text-slate-900">{Math.round(bmr * 1.2)} kcal</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Light Exercise (1.375x)</span>
                    <span className="font-bold text-slate-900">{Math.round(bmr * 1.375)} kcal</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Moderate (1.55x)</span>
                    <span className="font-bold text-slate-900">{Math.round(bmr * 1.55)} kcal</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Very Active (1.725x)</span>
                    <span className="font-bold text-slate-900">{Math.round(bmr * 1.725)} kcal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seamless bridge to Calorie Calculator */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Ready for Next Step?</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Calculate Your Total Daily Calorie Needs
                </h4>
                <p className="text-xs text-emerald-100/90 font-normal">
                  Factor in your exercise routine and set goals for weight maintenance, healthy fat loss, or muscle gain.
                </p>
              </div>

              <Link
                href="/health-tools/calorie-calculator"
                className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                <span>Go to Calorie Tool</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
