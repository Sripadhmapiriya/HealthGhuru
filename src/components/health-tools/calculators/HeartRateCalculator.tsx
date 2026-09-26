'use client';

import React, { useState } from 'react';
import {
  Activity,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HeartPulse,
  Info,
} from 'lucide-react';
import { calculateHeartRate, HeartRateResult } from '@/lib/health-tools';

export function HeartRateCalculator() {
  const [age, setAge] = useState<string>('32');
  const [restingHr, setRestingHr] = useState<string>('65');
  const [useRestingHr, setUseRestingHr] = useState<boolean>(true);

  // Result state
  const [result, setResult] = useState<HeartRateResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const a = parseInt(age, 10);
    if (!a || a < 10 || a > 105) {
      setError('Please provide an age between 10 and 105.');
      return;
    }

    let rHr: number | undefined = undefined;
    if (useRestingHr) {
      const parsedR = parseInt(restingHr, 10);
      if (parsedR && (parsedR < 35 || parsedR > 130)) {
        setError('Please enter a realistic resting heart rate between 35 and 130 bpm.');
        return;
      }
      rHr = parsedR;
    }

    const calculated = calculateHeartRate(a, rHr);
    setResult(calculated);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setResult(null);
    setHasCalculated(false);
    setError(null);
    setAge('32');
    setRestingHr('65');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: Form Inputs ── */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-6">
        <div>
          <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
            Cardiovascular Inputs
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Tanaka & Karvonen Target Heart Rate Zone formulas
          </p>
        </div>

        <form onSubmit={handleCalculate} className="space-y-5">
          {/* Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Age (Years)
            </label>
            <input
              type="number"
              min="10"
              max="105"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-transparent text-sm bg-white"
              placeholder="32"
            />
          </div>

          {/* Resting Heart Rate Toggle & Input */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Include Resting Heart Rate (Karvonen Reserve)?
              </label>
              <input
                type="checkbox"
                checked={useRestingHr}
                onChange={(e) => setUseRestingHr(e.target.checked)}
                className="w-4 h-4 text-[#f06d2f] rounded-sm border-gray-300 focus:ring-[#f06d2f]"
              />
            </div>

            {useRestingHr && (
              <div className="relative">
                <input
                  type="number"
                  min="35"
                  max="130"
                  value={restingHr}
                  onChange={(e) => setRestingHr(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-transparent text-sm bg-white pr-14"
                  placeholder="65"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                  bpm
                </span>
                <p className="text-[11px] text-slate-500 mt-1 font-normal">
                  Tip: Measure resting pulse immediately after waking up before getting out of bed.
                </p>
              </div>
            )}
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
              className="flex-1 bg-gradient-to-r from-[#f06d2f] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-orange-700/20 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Activity size={16} />
              <span>Calculate Heart Rate Zones</span>
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
              <HeartPulse size={32} />
            </div>
            <h3 className="font-heading font-black text-slate-800 text-lg sm:text-xl mb-1">
              Your Aerobic &amp; Training Zones
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-normal">
              Enter your age and resting pulse to determine your maximum estimated heart rate and personalized Zones 1 through 5.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Primary Max HR Hero */}
            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Estimated Maximum Heart Rate (HRmax)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-heading text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                      {result.maxHeartRate}
                    </span>
                    <span className="text-sm font-bold text-[#f06d2f]">bpm</span>
                    <span className="text-xs text-slate-500 ml-2 font-medium">
                      (Tanaka: {result.tanakaMaxHr} bpm)
                    </span>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-900 text-xs font-bold">
                  {result.restingHr ? `Resting: ${result.restingHr} bpm` : 'Standard HRmax'}
                </div>
              </div>

              {/* 5 Heart Rate Zones Cards */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Target Training Zones (5-Zone Model)
                </span>

                <div className="space-y-2">
                  {result.zones.map((zone, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${zone.color}`}>
                            {zone.name}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{zone.range}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">{zone.benefit}</p>
                      </div>
                      <div className="font-mono font-black text-sm text-slate-900 shrink-0 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-center">
                        {zone.minBpm} – {zone.maxBpm} bpm
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Practical Cardio Strategy Box */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900">
                <Info size={16} className="text-[#f06d2f] shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Zone 2 Training for Mitochondrial Longevity
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Cardiologists and sports physiologists recommend accumulating 150 to 180 minutes weekly in <strong>Zone 2 (60%–70% intensity)</strong>. Exercising at this conversational pace maximizes lipid oxidation (fat-burning) and enhances cardiac stroke volume without exhausting central nervous recovery.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
