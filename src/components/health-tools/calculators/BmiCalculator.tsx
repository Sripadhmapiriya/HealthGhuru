'use client';

import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { calculateBmi, BmiResult } from '@/lib/health-tools';

export function BmiCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [age, setAge] = useState<string>('28');
  const [sex, setSex] = useState<'male' | 'female'>('male');

  // Metric values
  const [heightCm, setHeightCm] = useState<string>('172');
  const [weightKg, setWeightKg] = useState<string>('68');

  // Imperial values
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('8');
  const [weightLbs, setWeightLbs] = useState<string>('150');

  // Result state
  const [result, setResult] = useState<BmiResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let finalHeightCm = 0;
    let finalWeightKg = 0;

    if (unit === 'metric') {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      if (!h || h < 50 || h > 260) {
        setError('Please enter a realistic height between 50 cm and 260 cm.');
        return;
      }
      if (!w || w < 20 || w > 350) {
        setError('Please enter a realistic weight between 20 kg and 350 kg.');
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
        setError('Please enter a realistic height (e.g. 5 ft 8 in).');
        return;
      }
      if (!lbs || lbs < 40 || lbs > 750) {
        setError('Please enter a realistic weight between 40 lbs and 750 lbs.');
        return;
      }
      finalHeightCm = totalInches * 2.54;
      finalWeightKg = lbs * 0.453592;
    }

    const res = calculateBmi(finalWeightKg, finalHeightCm);
    setResult(res);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setResult(null);
    setHasCalculated(false);
    setError(null);
    setHeightCm('172');
    setWeightKg('68');
    setHeightFeet('5');
    setHeightInches('8');
    setWeightLbs('150');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: Form Inputs ── */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
              Enter Your Measurements
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Select your preferred measurement units below
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
              Metric (kg/cm)
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
              Imperial (lbs/ft)
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
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20'
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
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Age (Years)
            </label>
            <input
              type="number"
              min="2"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white"
              placeholder="e.g. 28"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white pr-12"
                  placeholder="172"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white pr-10"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white pr-10"
                    placeholder="8"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white pr-12"
                  placeholder="68"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white pr-12"
                  placeholder="150"
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
              className="flex-1 bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-700/20 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scale size={16} />
              <span>Calculate BMI</span>
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
          /* Empty / Initial State */
          <div className="h-full min-h-[380px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
              <Scale size={32} />
            </div>
            <h3 className="font-heading font-black text-slate-800 text-lg sm:text-xl mb-1">
              Your BMI Results Will Appear Here
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-normal">
              Enter your height and weight on the left and click{' '}
              <strong className="text-emerald-700">Calculate BMI</strong> to view your clinical index, healthy range, and educational breakdown.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 text-slate-500 text-xs font-medium">
              <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200">
                &bull; Underweight &lt; 18.5
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200">
                &bull; Normal 18.5 – 24.9
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200">
                &bull; Overweight 25.0 – 29.9
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200">
                &bull; Obesity &ge; 30.0
              </span>
            </div>
          </div>
        ) : (
          /* Live Results Card */
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Primary Score Hero */}
            <div className="bg-gradient-to-br from-white via-white to-emerald-50/40 rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Calculated Result
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="font-heading text-4xl sm:text-5xl font-black text-[#1A2E1A] tracking-tight">
                      {result.bmi}
                    </span>
                    <span className="text-sm font-bold text-slate-500">kg/m²</span>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-xl border text-sm font-bold ${result.categoryColor}`}>
                  {result.category}
                </div>
              </div>

              {/* BMI Spectrum Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                  <span>Underweight (&lt;18.5)</span>
                  <span className="text-emerald-700 font-bold">Healthy (18.5–24.9)</span>
                  <span>Overweight (25–29.9)</span>
                  <span>Obese (30+)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="w-[18.5%] bg-amber-300" title="Underweight" />
                  <div className="w-[25%] bg-emerald-500" title="Healthy weight" />
                  <div className="w-[20%] bg-orange-400" title="Overweight" />
                  <div className="w-[36.5%] bg-rose-500" title="Obese" />
                </div>
              </div>

              {/* Healthy Weight Range */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-emerald-950">
                    Estimated Healthy Weight Range for your height:
                  </span>
                </div>
                <span className="text-sm font-black text-emerald-900 shrink-0">
                  {result.healthyWeightMinKg} – {result.healthyWeightMaxKg} kg
                </span>
              </div>

              {result.asianRiskNote && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 text-amber-700 mt-0.5" />
                  <span>{result.asianRiskNote}</span>
                </div>
              )}
            </div>

            {/* Next Recommended Health Steps / Synergy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/health-tools/calorie-calculator"
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-xs transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Next Recommended Tool
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Calorie Needs Calculator &rarr;
                  </h4>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    Calculate maintenance and deficit calories
                  </p>
                </div>
              </Link>

              <Link
                href="/health-tools/ideal-weight-calculator"
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-xs transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Clinical Comparison
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Ideal Weight Calculator &rarr;
                  </h4>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    Compare Devine and Robinson formulas
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
