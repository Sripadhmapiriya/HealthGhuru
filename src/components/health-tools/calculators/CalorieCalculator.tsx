'use client';

import React, { useState } from 'react';
import {
  Calculator,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Minus,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import {
  calculateCalories,
  CalorieResult,
  ActivityLevel,
  ACTIVITY_MULTIPLIERS,
} from '@/lib/health-tools';

export function CalorieCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [age, setAge] = useState<string>('28');
  const [sex, setSex] = useState<'male' | 'female'>('female');

  // Metric values
  const [heightCm, setHeightCm] = useState<string>('165');
  const [weightKg, setWeightKg] = useState<string>('62');

  // Imperial values
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('5');
  const [weightLbs, setWeightLbs] = useState<string>('136');

  // Activity
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  // Result state
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const a = parseInt(age, 10);
    if (!a || a < 14 || a > 110) {
      setError('Please enter an age between 14 and 110.');
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
      if (!w || w < 30 || w > 350) {
        setError('Please enter a realistic weight between 30 kg and 350 kg.');
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
        setError('Please enter a realistic height (e.g. 5 ft 5 in).');
        return;
      }
      if (!lbs || lbs < 60 || lbs > 750) {
        setError('Please enter a realistic weight between 60 lbs and 750 lbs.');
        return;
      }
      finalHeightCm = totalInches * 2.54;
      finalWeightKg = lbs * 0.453592;
    }

    const calculated = calculateCalories(finalWeightKg, finalHeightCm, a, sex, activity);
    setResult(calculated);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setResult(null);
    setHasCalculated(false);
    setError(null);
    setAge('28');
    setHeightCm('165');
    setWeightKg('62');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: Form Inputs ── */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
              Calorie Parameters
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Based on Mifflin-St Jeor TDEE formula
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

        {/* Link to calculate BMR first */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-950">
            <Info size={15} className="text-emerald-700 shrink-0" />
            <span>Unsure about your baseline resting burn?</span>
          </div>
          <Link
            href="/health-tools/bmr-calculator"
            className="font-bold text-[#16A34A] hover:text-[#15803D] shrink-0 underline ml-2"
          >
            Calculate BMR first &rarr;
          </Link>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          {/* Sex Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Biological Sex
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSex('male')}
                className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all text-center ${
                  sex === 'male'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setSex('female')}
                className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all text-center ${
                  sex === 'female'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Age (Years)
            </label>
            <input
              type="number"
              min="14"
              max="110"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white"
              placeholder="28"
            />
          </div>

          {/* Height */}
          {unit === 'metric' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Height (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white pr-12"
                  placeholder="165"
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">
                  cm
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Height
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white pr-10"
                    placeholder="5"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                    ft
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white pr-10"
                    placeholder="5"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                    in
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Weight */}
          {unit === 'metric' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white pr-12"
                  placeholder="62"
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">
                  kg
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Weight (lbs)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white pr-12"
                  placeholder="136"
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">
                  lbs
                </span>
              </div>
            </div>
          )}

          {/* Activity Level Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Daily Physical Activity Level
            </label>
            <div className="space-y-2">
              {(
                Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]
              ).map((lvl) => {
                const item = ACTIVITY_MULTIPLIERS[lvl];
                const isSelected = activity === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setActivity(lvl)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{item.desc}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 ml-2">
                      {item.factor}x
                    </span>
                  </button>
                );
              })}
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
              className="flex-1 bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-700/20 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator size={16} />
              <span>Calculate Daily Calories</span>
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
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mb-4 shadow-xs">
              <Calculator size={32} />
            </div>
            <h3 className="font-heading font-black text-slate-800 text-lg sm:text-xl mb-1">
              Estimated Daily Calorie Needs
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-normal">
              Select your activity level and measurements to view your daily caloric requirements for weight maintenance, healthy fat loss, and muscle gain.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Primary Maintenance Card */}
            <div className="bg-gradient-to-br from-white via-white to-emerald-50/50 rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Estimated Daily Maintenance (TDEE)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-heading text-4xl sm:text-5xl font-black text-[#1A2E1A] tracking-tight">
                      {result.maintenanceCalories.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-slate-500">calories / day</span>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                  <Minus size={14} className="text-emerald-700" />
                  <span>Zero Weight Change</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                To maintain your current weight at your selected activity level, consume approximately <strong>{result.maintenanceCalories.toLocaleString()} calories/day</strong>.
              </p>
            </div>

            {/* Target Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Fat Loss */}
              <div className="p-4 rounded-xl bg-white border border-rose-100 hover:border-rose-300 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <TrendingDown size={14} />
                    <span>Healthy Fat Loss</span>
                  </span>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    -0.5 kg / wk
                  </span>
                </div>
                <div className="font-heading text-2xl font-black text-rose-950">
                  {result.weightLossCalories.toLocaleString()} <span className="text-xs font-medium text-slate-500">kcal/day</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  A balanced 500 kcal deficit preserves lean muscle mass while metabolizing body fat.
                </p>
              </div>

              {/* Mild Fat Loss */}
              <div className="p-4 rounded-xl bg-white border border-amber-100 hover:border-amber-300 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <TrendingDown size={14} />
                    <span>Mild Weight Loss</span>
                  </span>
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    -0.25 kg / wk
                  </span>
                </div>
                <div className="font-heading text-2xl font-black text-amber-950">
                  {result.mildWeightLossCalories.toLocaleString()} <span className="text-xs font-medium text-slate-500">kcal/day</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Gentle 250 kcal deficit with minimal metabolic adaptation or hunger stress.
                </p>
              </div>

              {/* Muscle Gain */}
              <div className="p-4 rounded-xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <TrendingUp size={14} />
                    <span>Muscle / Weight Gain</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    +0.5 kg / wk
                  </span>
                </div>
                <div className="font-heading text-2xl font-black text-emerald-950">
                  {result.weightGainCalories.toLocaleString()} <span className="text-xs font-medium text-slate-500">kcal/day</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Supports progressive resistance training and muscular hypertrophy.
                </p>
              </div>

              {/* Lean Mass */}
              <div className="p-4 rounded-xl bg-white border border-teal-100 hover:border-teal-300 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                    <TrendingUp size={14} />
                    <span>Lean Bulking</span>
                  </span>
                  <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                    +0.25 kg / wk
                  </span>
                </div>
                <div className="font-heading text-2xl font-black text-teal-950">
                  {result.mildWeightGainCalories.toLocaleString()} <span className="text-xs font-medium text-slate-500">kcal/day</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Controlled surplus designed to minimize unwanted adipose tissue accumulation.
                </p>
              </div>
            </div>

            {/* Next Recommended Tool */}
            <Link
              href="/health-tools/nutrition-calculator"
              className="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-xs transition-all group flex items-center justify-between block"
            >
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Next Step: Macronutrient Split
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Convert these calories into Protein, Carbs, and Fats &rarr;
                </h4>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  See exact daily gram targets for optimal recovery and satiety.
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
