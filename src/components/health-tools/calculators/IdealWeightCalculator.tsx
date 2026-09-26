'use client';

import React, { useState } from 'react';
import {
  Heart,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { calculateIdealWeight, IdealWeightResult } from '@/lib/health-tools';

export function IdealWeightCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [sex, setSex] = useState<'male' | 'female'>('female');

  // Metric
  const [heightCm, setHeightCm] = useState<string>('165');

  // Imperial
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('5');

  // Result state
  const [result, setResult] = useState<IdealWeightResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let finalHeightCm = 0;
    if (unit === 'metric') {
      const h = parseFloat(heightCm);
      if (!h || h < 100 || h > 250) {
        setError('Please enter a height between 100 cm and 250 cm.');
        return;
      }
      finalHeightCm = h;
    } else {
      const ft = parseFloat(heightFeet) || 0;
      const inch = parseFloat(heightInches) || 0;
      const totalInches = ft * 12 + inch;
      if (totalInches < 40 || totalInches > 95) {
        setError('Please enter a realistic height (e.g. 5 ft 5 in).');
        return;
      }
      finalHeightCm = totalInches * 2.54;
    }

    const calculated = calculateIdealWeight(finalHeightCm, sex);
    setResult(calculated);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setResult(null);
    setHasCalculated(false);
    setError(null);
    setHeightCm('165');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: Form Inputs ── */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
              Anthropometric Details
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Devine, Robinson, and WHO BMI methodologies
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
              Metric (cm)
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
              Imperial (ft/in)
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
                    ? 'border-rose-500 bg-rose-50/70 text-rose-950 ring-2 ring-rose-500/20'
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
                    ? 'border-rose-500 bg-rose-50/70 text-rose-950 ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Height Input */}
          {unit === 'metric' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Stature / Height (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-transparent text-sm bg-white pr-12"
                  placeholder="165"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                  cm
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Stature / Height
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-transparent text-sm bg-white pr-10"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-transparent text-sm bg-white pr-10"
                    placeholder="5"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">
                    in
                  </span>
                </div>
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
              className="flex-1 bg-gradient-to-r from-[#f06d2f] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-orange-700/20 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart size={16} />
              <span>Calculate Healthy Weight Range</span>
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
              <Heart size={32} />
            </div>
            <h3 className="font-heading font-black text-slate-800 text-lg sm:text-xl mb-1">
              Estimated Healthy Weight Range
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-normal">
              Rather than an arbitrary single target number, we calculate a comprehensive healthy spectrum combining WHO body mass criteria with Devine and Robinson formulas.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Primary Spectrum Card */}
            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs">

              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Recommended Healthy Range
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                      {result.minHealthyKg} – {result.maxHealthyKg}
                    </span>
                    <span className="text-lg font-bold text-[#f06d2f]">kg</span>
                    <span className="text-xs font-semibold text-slate-500 ml-1">
                      ({result.minHealthyLbs} – {result.maxHealthyLbs} lbs)
                    </span>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-900 text-xs font-bold">
                  Clinical Spectrum
                </div>
              </div>

              {/* Formula Comparisons */}
              <div className="space-y-2.5 pt-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Estimates Across Recognized Clinical Formulas
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">Devine Formula (1974)</span>
                      <span className="font-black text-[#f06d2f] text-sm">{result.devineKg} kg</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Widely used by clinicians for pharmacokinetic drug dosing and medication clearance.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">Robinson Formula (1983)</span>
                      <span className="font-black text-[#f06d2f] text-sm">{result.robinsonKg} kg</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Refined Devine modification incorporating empirical population stature adjustments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Limitations Box */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900">
                <Info size={16} className="text-[#f06d2f] shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Why A Single "Ideal" Weight Does Not Exist
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Standard formulas assess stature and biological sex, but cannot differentiate between dense musculoskeletal tissue and visceral adipose tissue. Athletes, resistance-trained individuals, and people with broad bone density may weigh more while maintaining optimal metabolic profiles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
