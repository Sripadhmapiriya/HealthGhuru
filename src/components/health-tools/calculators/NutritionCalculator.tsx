'use client';

import React, { useState } from 'react';
import {
  Utensils,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Apple,
  Dumbbell,
  Heart,
  Droplet,
} from 'lucide-react';
import {
  calculateNutritionMacros,
  NutritionResult,
  NutritionGoal,
  ActivityLevel,
  ACTIVITY_MULTIPLIERS,
} from '@/lib/health-tools';

export function NutritionCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [age, setAge] = useState<string>('28');
  const [sex, setSex] = useState<'male' | 'female'>('female');

  // Metric
  const [heightCm, setHeightCm] = useState<string>('168');
  const [weightKg, setWeightKg] = useState<string>('64');

  // Imperial
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('6');
  const [weightLbs, setWeightLbs] = useState<string>('140');

  // Activity & Goal
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<NutritionGoal>('maintenance');

  // Result state
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const a = parseInt(age, 10);
    if (!a || a < 14 || a > 110) {
      setError('Please provide an age between 14 and 110.');
      return;
    }

    let finalHeightCm = 0;
    let finalWeightKg = 0;

    if (unit === 'metric') {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      if (!h || h < 60 || h > 260) {
        setError('Please enter a height between 60 cm and 260 cm.');
        return;
      }
      if (!w || w < 30 || w > 350) {
        setError('Please enter a weight between 30 kg and 350 kg.');
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
        setError('Please enter a realistic height (e.g. 5 ft 6 in).');
        return;
      }
      if (!lbs || lbs < 60 || lbs > 750) {
        setError('Please enter a realistic weight between 60 lbs and 750 lbs.');
        return;
      }
      finalHeightCm = totalInches * 2.54;
      finalWeightKg = lbs * 0.453592;
    }

    const calculated = calculateNutritionMacros(
      finalWeightKg,
      finalHeightCm,
      a,
      sex,
      activity,
      goal
    );
    setResult(calculated);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setResult(null);
    setHasCalculated(false);
    setError(null);
    setAge('28');
    setHeightCm('168');
    setWeightKg('64');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left Column: Form Inputs ── */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
              Nutritional Profile
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Personalized macronutrient distribution (Protein, Carbs, Fat)
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

          {/* Age & Height */}
          <div className="grid grid-cols-2 gap-3">
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white"
                placeholder="28"
              />
            </div>

            {unit === 'metric' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white"
                  placeholder="168"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Height (ft/in)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className="w-full px-2 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold text-center text-sm bg-white"
                    placeholder="5"
                  />
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full px-2 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold text-center text-sm bg-white"
                    placeholder="6"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Current Weight ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            {unit === 'metric' ? (
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white"
                placeholder="64"
              />
            ) : (
              <input
                type="number"
                step="0.5"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm bg-white"
                placeholder="140"
              />
            )}
          </div>

          {/* Dietary Goal Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Primary Wellness & Body Goal
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGoal('maintenance')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                  goal === 'maintenance'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>Maintenance</div>
                <div className="text-[10px] text-slate-500 font-normal">Balanced 50/25/25 split</div>
              </button>

              <button
                type="button"
                onClick={() => setGoal('fat_loss')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                  goal === 'fat_loss'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>Fat Loss</div>
                <div className="text-[10px] text-slate-500 font-normal">High protein (35%) for satiety</div>
              </button>

              <button
                type="button"
                onClick={() => setGoal('muscle_gain')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                  goal === 'muscle_gain'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>Muscle Gain</div>
                <div className="text-[10px] text-slate-500 font-normal">Hypertrophy fuel surplus</div>
              </button>

              <button
                type="button"
                onClick={() => setGoal('mediterranean')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                  goal === 'mediterranean'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>Cardio / Longevity</div>
                <div className="text-[10px] text-slate-500 font-normal">Mediterranean lipid balance</div>
              </button>
            </div>
          </div>

          {/* Activity Level Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            >
              {(
                Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]
              ).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {ACTIVITY_MULTIPLIERS[lvl].label} ({ACTIVITY_MULTIPLIERS[lvl].desc})
                </option>
              ))}
            </select>
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
              <Utensils size={16} />
              <span>Calculate Daily Macros</span>
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
              <Utensils size={32} />
            </div>
            <h3 className="font-heading font-black text-slate-800 text-lg sm:text-xl mb-1">
              Personalized Macronutrient Target
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-normal">
              Provide your details on the left to see your recommended daily distribution of Protein, Carbohydrates, Healthy Fats, and Dietary Fiber.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Primary Calorie Target Banner */}
            <div className="bg-gradient-to-br from-white via-white to-emerald-50/50 rounded-2xl border border-gray-200 p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Target Daily Energy
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-heading text-4xl sm:text-5xl font-black text-[#1A2E1A] tracking-tight">
                      {result.calories.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-slate-500">calories / day</span>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                  Goal: {goal.replace('_', ' ')}
                </div>
              </div>

              {/* Macro Trio Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Protein */}
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span>Protein</span>
                    <span className="text-[11px] font-mono opacity-80">{result.proteinPercent}%</span>
                  </div>
                  <div className="font-heading text-3xl font-black text-blue-950">
                    {result.proteinGrams}g
                  </div>
                  <p className="text-[11px] text-blue-800 font-normal">
                    {result.proteinCalories} kcal (4 kcal/g)
                  </p>
                </div>

                {/* Carbohydrates */}
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>Carbs</span>
                    <span className="text-[11px] font-mono opacity-80">{result.carbsPercent}%</span>
                  </div>
                  <div className="font-heading text-3xl font-black text-amber-950">
                    {result.carbsGrams}g
                  </div>
                  <p className="text-[11px] text-amber-800 font-normal">
                    {result.carbsCalories} kcal (4 kcal/g)
                  </p>
                </div>

                {/* Healthy Fats */}
                <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                    <span>Fats</span>
                    <span className="text-[11px] font-mono opacity-80">{result.fatPercent}%</span>
                  </div>
                  <div className="font-heading text-3xl font-black text-rose-950">
                    {result.fatGrams}g
                  </div>
                  <p className="text-[11px] text-rose-800 font-normal">
                    {result.fatCalories} kcal (9 kcal/g)
                  </p>
                </div>
              </div>

              {/* Micronutrients / Fiber Support */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Apple size={15} className="text-emerald-600 shrink-0" />
                  <span>
                    Minimum Dietary Fiber Goal: <strong>{result.fiberGrams}g / day</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Droplet size={15} className="text-cyan-600 shrink-0" />
                  <span>
                    Baseline Fluid: <strong>{result.waterGoalLiters} L / day</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
