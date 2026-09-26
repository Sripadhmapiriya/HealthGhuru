export interface HealthToolItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  shortDescription: string;
  href: string;
  iconName: string;
  color: string;
  badge: string;
  relatedCategory: string; // for fetching related articles from content_items
  tags: string[];
}

export interface RelatedToolArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  reading_time?: number;
  published_at: string;
}

export interface RelatedToolVideo {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  subcategory: string | null;
  duration_seconds: number | null;
  canonical_url: string | null;
  is_short?: boolean;
}

export const HEALTH_TOOLS: HealthToolItem[] = [
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    shortName: 'BMI',
    category: 'Body Composition',
    shortDescription: 'Calculate your Body Mass Index using your height and weight.',
    description:
      'Evaluate your Body Mass Index (BMI) using verified clinical WHO and Asian-specific cutoffs to understand your weight-to-height ratio.',
    href: '/health-tools/bmi-calculator',
    iconName: 'Scale',
    color: 'from-emerald-600 to-teal-500',
    badge: 'Clinical Standard',
    relatedCategory: 'nutrition',
    tags: ['Weight Management', 'Cardiology', 'Body Composition'],
  },
  {
    id: 'bmr-calculator',
    slug: 'bmr-calculator',
    name: 'BMR Calculator',
    shortName: 'BMR',
    category: 'Metabolism',
    shortDescription: 'Estimate your Basal Metabolic Rate using the Mifflin-St Jeor equation.',
    description:
      'Determine the minimum daily calories your body burns at complete physical rest to sustain essential biological functions.',
    href: '/health-tools/bmr-calculator',
    iconName: 'Flame',
    color: 'from-orange-500 to-amber-500',
    badge: 'Mifflin-St Jeor',
    relatedCategory: 'nutrition',
    tags: ['Metabolism', 'Energy Expenditure', 'Nutrition'],
  },
  {
    id: 'calorie-calculator',
    slug: 'calorie-calculator',
    name: 'Calorie Calculator',
    shortName: 'Calories',
    category: 'Energy Balance',
    shortDescription: 'Calculate your estimated daily calorie needs based on physical activity.',
    description:
      'Compute your Total Daily Energy Expenditure (TDEE) and personalized calorie targets for maintenance, healthy fat loss, or muscle gain.',
    href: '/health-tools/calorie-calculator',
    iconName: 'Calculator',
    color: 'from-emerald-700 to-emerald-500',
    badge: 'TDEE Formula',
    relatedCategory: 'fitness',
    tags: ['Calorie Needs', 'Fitness', 'Weight Control'],
  },
  {
    id: 'water-intake-calculator',
    slug: 'water-intake-calculator',
    name: 'Water Intake Calculator',
    shortName: 'Hydration',
    category: 'Hydration & Renal',
    shortDescription: 'Estimate your daily fluid and hydration needs based on weight and activity.',
    description:
      'Calculate customized daily fluid goals factoring in body mass, exercise intensity, and ambient climate conditions.',
    href: '/health-tools/water-intake-calculator',
    iconName: 'Droplet',
    color: 'from-cyan-600 to-blue-500',
    badge: 'Hydration Guideline',
    relatedCategory: 'nutrition',
    tags: ['Hydration', 'Renal Health', 'Daily Routine'],
  },
  {
    id: 'ideal-weight-calculator',
    slug: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    shortName: 'Ideal Weight',
    category: 'Body Composition',
    shortDescription: 'Find your healthy weight range based on height and clinical formulas.',
    description:
      'Discover your estimated healthy weight range using the Devine, Robinson, and BMI standard methodologies instead of an arbitrary single number.',
    href: '/health-tools/ideal-weight-calculator',
    iconName: 'Heart',
    color: 'from-rose-500 to-pink-500',
    badge: 'Multi-Formula Range',
    relatedCategory: 'fitness',
    tags: ['Healthy Weight', 'Cardiometabolic', 'Longevity'],
  },
  {
    id: 'heart-rate-calculator',
    slug: 'heart-rate-calculator',
    name: 'Heart Rate Calculator',
    shortName: 'Heart Rate',
    category: 'Cardiovascular',
    shortDescription: 'Calculate your target heart rate training zones and aerobic thresholds.',
    description:
      'Determine your maximum heart rate and customized training zones from active recovery up to peak anaerobic cardiovascular capacity.',
    href: '/health-tools/heart-rate-calculator',
    iconName: 'Activity',
    color: 'from-red-600 to-rose-500',
    badge: 'Cardio Training',
    relatedCategory: 'heart',
    tags: ['Cardiology', 'Endurance', 'Heart Health'],
  },
  {
    id: 'sleep-calculator',
    slug: 'sleep-calculator',
    name: 'Sleep Calculator',
    shortName: 'Sleep Cycles',
    category: 'Neurology & Sleep',
    shortDescription: 'Calculate optimal bedtimes and wake times based on 90-minute sleep cycles.',
    description:
      'Optimize sleep architecture by synchronizing your sleep schedule with natural 90-minute REM/NREM circadian sleep cycles.',
    href: '/health-tools/sleep-calculator',
    iconName: 'Moon',
    color: 'from-indigo-600 to-purple-600',
    badge: 'Circadian Rhythm',
    relatedCategory: 'sleep',
    tags: ['Sleep Cycles', 'Circadian Health', 'Recovery'],
  },
  {
    id: 'pregnancy-due-date',
    slug: 'pregnancy-due-date',
    name: 'Pregnancy Due Date Calculator',
    shortName: 'Due Date',
    category: "Maternal Health",
    shortDescription: 'Estimate your due date, current gestational age, and pregnancy trimesters.',
    description:
      "Estimate your child's expected arrival date using Naegele's rule, track your current gestational week, and view key developmental milestones.",
    href: '/health-tools/pregnancy-due-date',
    iconName: 'Baby',
    color: 'from-purple-600 to-pink-500',
    badge: "Naegele's Rule",
    relatedCategory: 'womens-health',
    tags: ['Maternal Health', 'Obstetrics', 'Pregnancy'],
  },
  {
    id: 'nutrition-calculator',
    slug: 'nutrition-calculator',
    name: 'Nutrition Calculator',
    shortName: 'Macros',
    category: 'Clinical Nutrition',
    shortDescription: 'Estimate your daily macronutrient breakdown (protein, carbs, and fats).',
    description:
      'Calculate personalized daily targets for calories, protein, carbohydrates, healthy fats, and dietary fiber based on your wellness goals.',
    href: '/health-tools/nutrition-calculator',
    iconName: 'Utensils',
    color: 'from-emerald-600 to-green-600',
    badge: 'Macronutrient Split',
    relatedCategory: 'nutrition',
    tags: ['Nutrition', 'Dietetics', 'Macronutrients'],
  },
];

// ─────────────────────────────────────────────────────────────
// SCIENTIFIC CALCULATION FORMULAS
// ─────────────────────────────────────────────────────────────

/**
 * 1. BMI Calculation
 * BMI = weight (kg) / [height (m)]^2
 */
export interface BmiResult {
  bmi: number;
  category: string;
  categoryColor: string;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  asianRiskNote: string;
  primeRatio: number; // BMI / 25
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal weight';
  let categoryColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = 'text-amber-700 bg-amber-50 border-amber-300';
  } else if (bmi <= 24.9) {
    category = 'Normal / Healthy weight';
    categoryColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    categoryColor = 'text-orange-700 bg-orange-50 border-orange-300';
  } else if (bmi <= 34.9) {
    category = 'Obesity (Class I)';
    categoryColor = 'text-rose-700 bg-rose-50 border-rose-300';
  } else if (bmi <= 39.9) {
    category = 'Obesity (Class II - Moderate)';
    categoryColor = 'text-rose-800 bg-rose-100 border-rose-400';
  } else {
    category = 'Severe Obesity (Class III)';
    categoryColor = 'text-red-900 bg-red-100 border-red-500';
  }

  const healthyWeightMinKg = parseFloat((18.5 * heightM * heightM).toFixed(1));
  const healthyWeightMaxKg = parseFloat((24.9 * heightM * heightM).toFixed(1));

  return {
    bmi,
    category,
    categoryColor,
    healthyWeightMinKg,
    healthyWeightMaxKg,
    asianRiskNote:
      bmi >= 23.0 && bmi < 25.0
        ? 'Note: According to WHO South Asian criteria, a BMI ≥ 23.0 carries increased cardiometabolic and insulin resistance risk.'
        : '',
    primeRatio: parseFloat((bmi / 25).toFixed(2)),
  };
}

/**
 * 2. BMR Calculation (Mifflin-St Jeor Equation)
 * Men:   (10 * kg) + (6.25 * cm) - (5 * age) + 5
 * Women: (10 * kg) + (6.25 * cm) - (5 * age) - 161
 */
export function calculateBmr(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female'
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === 'male' ? base + 5 : base - 161;
  return Math.round(bmr);
}

/**
 * 3. Calorie & TDEE Calculation
 */
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { label: string; factor: number; desc: string }> = {
  sedentary: { label: 'Sedentary', factor: 1.2, desc: 'Little to no exercise, desk job' },
  light: { label: 'Lightly Active', factor: 1.375, desc: 'Light exercise / sports 1–3 days/week' },
  moderate: { label: 'Moderately Active', factor: 1.55, desc: 'Moderate exercise 3–5 days/week' },
  very_active: { label: 'Very Active', factor: 1.725, desc: 'Hard exercise 6–7 days/week' },
  extra_active: { label: 'Extra Active', factor: 1.9, desc: 'Heavy physical labor or twice-a-day training' },
};

export interface CalorieResult {
  bmr: number;
  maintenanceCalories: number;
  mildWeightLossCalories: number; // -250 kcal (0.25 kg/wk)
  weightLossCalories: number; // -500 kcal (0.5 kg/wk)
  mildWeightGainCalories: number; // +250 kcal
  weightGainCalories: number; // +500 kcal
}

export function calculateCalories(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female',
  activity: ActivityLevel
): CalorieResult {
  const bmr = calculateBmr(weightKg, heightCm, age, sex);
  const factor = ACTIVITY_MULTIPLIERS[activity].factor;
  const maintenance = Math.round(bmr * factor);

  return {
    bmr,
    maintenanceCalories: maintenance,
    mildWeightLossCalories: Math.max(1200, maintenance - 250),
    weightLossCalories: Math.max(1200, maintenance - 500),
    mildWeightGainCalories: maintenance + 250,
    weightGainCalories: maintenance + 500,
  };
}

/**
 * 4. Water Intake Calculation
 * Baseline: 35 ml per kg of body weight
 * Exercise adjustment: +350 ml per 30 minutes of exercise
 * Climate adjustment: +350 ml for hot/humid
 */
export interface WaterIntakeResult {
  totalMl: number;
  liters: number;
  glasses: number; // 240ml standard glass
  baselineMl: number;
  activityAddonMl: number;
  climateAddonMl: number;
}

export function calculateWaterIntake(
  weightKg: number,
  exerciseMinutesPerDay = 30,
  isHotClimate = false
): WaterIntakeResult {
  const baseline = Math.round(weightKg * 35);
  const exerciseAddon = Math.round((exerciseMinutesPerDay / 30) * 350);
  const climateAddon = isHotClimate ? 350 : 0;
  const totalMl = baseline + exerciseAddon + climateAddon;

  return {
    totalMl,
    liters: parseFloat((totalMl / 1000).toFixed(1)),
    glasses: Math.round(totalMl / 240),
    baselineMl: baseline,
    activityAddonMl: exerciseAddon,
    climateAddonMl: climateAddon,
  };
}

/**
 * 5. Ideal Weight Range Calculation
 * Uses BMI (18.5 - 24.9) and Devine/Robinson formulas to present a healthy clinical spectrum
 */
export interface IdealWeightResult {
  minHealthyKg: number;
  maxHealthyKg: number;
  minHealthyLbs: number;
  maxHealthyLbs: number;
  devineKg: number;
  robinsonKg: number;
}

export function calculateIdealWeight(heightCm: number, sex: 'male' | 'female'): IdealWeightResult {
  const heightM = heightCm / 100;
  const heightInches = heightCm / 2.54;
  const inchesOver5Ft = Math.max(0, heightInches - 60);

  // Devine formula
  const devineKg =
    sex === 'male' ? 50.0 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;

  // Robinson formula
  const robinsonKg =
    sex === 'male' ? 52.0 + 1.9 * inchesOver5Ft : 49.0 + 1.7 * inchesOver5Ft;

  const minBmiKg = 18.5 * heightM * heightM;
  const maxBmiKg = 24.9 * heightM * heightM;

  const minHealthyKg = parseFloat(Math.min(minBmiKg, devineKg, robinsonKg).toFixed(1));
  const maxHealthyKg = parseFloat(Math.max(maxBmiKg, devineKg, robinsonKg).toFixed(1));

  return {
    minHealthyKg,
    maxHealthyKg,
    minHealthyLbs: Math.round(minHealthyKg * 2.20462),
    maxHealthyLbs: Math.round(maxHealthyKg * 2.20462),
    devineKg: parseFloat(devineKg.toFixed(1)),
    robinsonKg: parseFloat(robinsonKg.toFixed(1)),
  };
}

/**
 * 6. Heart Rate Zones Calculation
 * Max HR = 220 - age (Tanaka formula fallback: 208 - 0.7 * age)
 */
export interface HeartRateZone {
  name: string;
  range: string;
  minBpm: number;
  maxBpm: number;
  percentage: string;
  benefit: string;
  color: string;
}

export interface HeartRateResult {
  maxHeartRate: number;
  tanakaMaxHr: number;
  restingHr?: number;
  zones: HeartRateZone[];
}

export function calculateHeartRate(age: number, restingHr?: number): HeartRateResult {
  const maxHr = Math.max(120, 220 - age);
  const tanaka = Math.round(208 - 0.7 * age);

  // Karvonen formula if resting HR provided, otherwise simple percentage of Max HR
  const getBpm = (pct: number) => {
    if (restingHr && restingHr > 40 && restingHr < 110) {
      return Math.round(((maxHr - restingHr) * pct) + restingHr);
    }
    return Math.round(maxHr * pct);
  };

  const zones: HeartRateZone[] = [
    {
      name: 'Zone 1: Active Recovery & Warm-Up',
      percentage: '50% – 60%',
      minBpm: getBpm(0.5),
      maxBpm: getBpm(0.6),
      range: `${getBpm(0.5)} – ${getBpm(0.6)} bpm`,
      benefit: 'Stimulates blood flow, accelerates lactic acid clearance, active recovery.',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    },
    {
      name: 'Zone 2: Aerobic Base & Fat Oxidation',
      percentage: '60% – 70%',
      minBpm: getBpm(0.6),
      maxBpm: getBpm(0.7),
      range: `${getBpm(0.6)} – ${getBpm(0.7)} bpm`,
      benefit: 'Optimizes mitochondrial density, capillary growth, and maximum fat burning.',
      color: 'bg-teal-50 text-teal-800 border-teal-300',
    },
    {
      name: 'Zone 3: Aerobic Fitness & Tempo',
      percentage: '70% – 80%',
      minBpm: getBpm(0.7),
      maxBpm: getBpm(0.8),
      range: `${getBpm(0.7)} – ${getBpm(0.8)} bpm`,
      benefit: 'Improves cardiovascular endurance, lung ventilation, and metabolic efficiency.',
      color: 'bg-amber-50 text-amber-800 border-amber-300',
    },
    {
      name: 'Zone 4: Anaerobic Threshold',
      percentage: '80% – 90%',
      minBpm: getBpm(0.8),
      maxBpm: getBpm(0.9),
      range: `${getBpm(0.8)} – ${getBpm(0.9)} bpm`,
      benefit: 'Pushes lactate threshold, enhances high-speed capacity and sprint power.',
      color: 'bg-orange-50 text-orange-800 border-orange-300',
    },
    {
      name: 'Zone 5: Maximum VO2 Peak',
      percentage: '90% – 100%',
      minBpm: getBpm(0.9),
      maxBpm: maxHr,
      range: `${getBpm(0.9)} – ${maxHr} bpm`,
      benefit: 'Develops neuromotor speed, peak anaerobic capacity (short intervals only).',
      color: 'bg-rose-50 text-rose-800 border-rose-300',
    },
  ];

  return {
    maxHeartRate: maxHr,
    tanakaMaxHr: tanaka,
    restingHr,
    zones,
  };
}

/**
 * 7. Sleep Calculator
 * Sleep architecture: 90-minute REM/NREM cycles + 14 minutes latency
 */
export interface SleepSuggestion {
  timeStr: string;
  cycles: number;
  durationHours: number;
  quality: 'Optimal' | 'Recommended' | 'Sufficient' | 'Minimum';
  badgeColor: string;
}

export function calculateSleepCycles(
  targetTimeStr: string,
  mode: 'wake_at' | 'sleep_at'
): SleepSuggestion[] {
  // Parse targetTimeStr (HH:MM in 24h format)
  const [hours, minutes] = targetTimeStr.split(':').map(Number);
  const targetDate = new Date();
  targetDate.setHours(hours, minutes, 0, 0);

  const cycleMinutes = 90;
  const fallAsleepBufferMinutes = 14;

  const cycleCounts = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h

  const suggestions: SleepSuggestion[] = cycleCounts.map((cycles) => {
    const totalMinutes = cycles * cycleMinutes + fallAsleepBufferMinutes;
    const calcDate = new Date(targetDate);

    if (mode === 'wake_at') {
      // Subtract to find bedtime
      calcDate.setMinutes(calcDate.getMinutes() - totalMinutes);
    } else {
      // Add to find wake time
      calcDate.setMinutes(calcDate.getMinutes() + totalMinutes);
    }

    const timeFormatted = calcDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    let quality: 'Optimal' | 'Recommended' | 'Sufficient' | 'Minimum' = 'Sufficient';
    let badgeColor = 'bg-slate-100 text-slate-800 border-slate-300';

    if (cycles === 6) {
      quality = 'Optimal';
      badgeColor = 'bg-purple-100 text-purple-900 border-purple-300';
    } else if (cycles === 5) {
      quality = 'Recommended';
      badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    } else if (cycles === 4) {
      quality = 'Sufficient';
      badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
    } else {
      quality = 'Minimum';
      badgeColor = 'bg-orange-100 text-orange-900 border-orange-300';
    }

    return {
      timeStr: timeFormatted,
      cycles,
      durationHours: cycles * 1.5,
      quality,
      badgeColor,
    };
  });

  return suggestions;
}

/**
 * 8. Pregnancy Due Date Calculator
 * Naegele's Rule: LMP + 280 days (40 weeks) + (CycleLength - 28)
 */
export interface PregnancyDueDateResult {
  dueDate: Date;
  dueDateFormatted: string;
  conceptionDateFormatted: string;
  currentWeeks: number;
  currentDays: number;
  trimester: 1 | 2 | 3;
  trimesterLabel: string;
  milestones: { label: string; date: string; week: number }[];
  percentCompleted: number;
}

export function calculatePregnancyDueDate(
  lmpDateString: string,
  cycleLengthDays = 28
): PregnancyDueDateResult | null {
  const lmp = new Date(lmpDateString);
  if (isNaN(lmp.getTime())) return null;

  const cycleAdjustment = cycleLengthDays - 28;
  const totalDays = 280 + cycleAdjustment;

  const dueDate = new Date(lmp);
  dueDate.setDate(dueDate.getDate() + totalDays);

  const conceptionDate = new Date(lmp);
  conceptionDate.setDate(conceptionDate.getDate() + 14 + cycleAdjustment);

  const today = new Date();
  const diffTime = today.getTime() - lmp.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  const currentWeeks = Math.floor(diffDays / 7);
  const currentDays = diffDays % 7;

  let trimester: 1 | 2 | 3 = 1;
  let trimesterLabel = 'First Trimester (Weeks 1 – 13)';
  if (currentWeeks >= 14 && currentWeeks <= 27) {
    trimester = 2;
    trimesterLabel = 'Second Trimester (Weeks 14 – 27)';
  } else if (currentWeeks >= 28) {
    trimester = 3;
    trimesterLabel = 'Third Trimester (Weeks 28 – 40+)';
  }

  const percentCompleted = Math.min(100, Math.round((diffDays / totalDays) * 100));

  const addWeeks = (w: number) => {
    const d = new Date(lmp);
    d.setDate(d.getDate() + w * 7);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return {
    dueDate,
    dueDateFormatted: dueDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    conceptionDateFormatted: conceptionDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    currentWeeks,
    currentDays,
    trimester,
    trimesterLabel,
    percentCompleted,
    milestones: [
      { label: 'End of 1st Trimester', date: addWeeks(13), week: 13 },
      { label: 'Anatomy / Anomaly Ultrasound Scan', date: addWeeks(19), week: 19 },
      { label: 'Viability Milestone', date: addWeeks(24), week: 24 },
      { label: 'Start of 3rd Trimester', date: addWeeks(28), week: 28 },
      { label: 'Early Term', date: addWeeks(37), week: 37 },
      { label: 'Estimated Due Date (40 Weeks)', date: addWeeks(40), week: 40 },
    ],
  };
}

/**
 * 9. Nutrition & Macronutrient Calculator
 */
export type NutritionGoal = 'maintenance' | 'fat_loss' | 'muscle_gain' | 'mediterranean';

export interface NutritionResult {
  calories: number;
  proteinGrams: number;
  proteinCalories: number;
  proteinPercent: number;
  carbsGrams: number;
  carbsCalories: number;
  carbsPercent: number;
  fatGrams: number;
  fatCalories: number;
  fatPercent: number;
  fiberGrams: number;
  waterGoalLiters: number;
}

export function calculateNutritionMacros(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female',
  activity: ActivityLevel,
  goal: NutritionGoal
): NutritionResult {
  const calorieData = calculateCalories(weightKg, heightCm, age, sex, activity);
  let targetCalories = calorieData.maintenanceCalories;
  let pPct = 25;
  let cPct = 50;
  let fPct = 25;

  if (goal === 'fat_loss') {
    targetCalories = calorieData.weightLossCalories;
    pPct = 35; // higher protein for muscle retention
    cPct = 35;
    fPct = 30;
  } else if (goal === 'muscle_gain') {
    targetCalories = calorieData.weightGainCalories;
    pPct = 30;
    cPct = 45;
    fPct = 25;
  } else if (goal === 'mediterranean') {
    targetCalories = calorieData.maintenanceCalories;
    pPct = 20;
    cPct = 45;
    fPct = 35; // higher healthy mono/polyunsaturated fats
  }

  const proteinCalories = Math.round(targetCalories * (pPct / 100));
  const carbsCalories = Math.round(targetCalories * (cPct / 100));
  const fatCalories = Math.round(targetCalories * (fPct / 100));

  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);
  const fiberGrams = Math.round((targetCalories / 1000) * 14); // 14g per 1000 kcal

  return {
    calories: targetCalories,
    proteinGrams,
    proteinCalories,
    proteinPercent: pPct,
    carbsGrams,
    carbsCalories,
    carbsPercent: cPct,
    fatGrams,
    fatCalories,
    fatPercent: fPct,
    fiberGrams,
    waterGoalLiters: parseFloat((weightKg * 0.035).toFixed(1)),
  };
}
