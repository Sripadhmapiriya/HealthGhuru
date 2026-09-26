import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { HEALTH_TOOLS, HealthToolItem } from '@/lib/health-tools';
import { getRelatedArticlesForTool, getRelatedVideosForTool } from '@/lib/health-tools/server';
import { CalculatorLayout } from '@/components/health-tools/CalculatorLayout';

// Calculators
import { BmiCalculator } from '@/components/health-tools/calculators/BmiCalculator';
import { BmrCalculator } from '@/components/health-tools/calculators/BmrCalculator';
import { CalorieCalculator } from '@/components/health-tools/calculators/CalorieCalculator';
import { WaterIntakeCalculator } from '@/components/health-tools/calculators/WaterIntakeCalculator';
import { IdealWeightCalculator } from '@/components/health-tools/calculators/IdealWeightCalculator';
import { HeartRateCalculator } from '@/components/health-tools/calculators/HeartRateCalculator';
import { SleepCalculator } from '@/components/health-tools/calculators/SleepCalculator';
import { PregnancyDueDateCalculator } from '@/components/health-tools/calculators/PregnancyDueDateCalculator';
import { NutritionCalculator } from '@/components/health-tools/calculators/NutritionCalculator';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return HEALTH_TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = HEALTH_TOOLS.find((t) => t.slug === params.slug);
  if (!tool) {
    return {
      title: 'Health Tool Not Found | HealthGuru',
    };
  }

  return {
    title: `${tool.name} | Health Tools | HealthGuru`,
    description: tool.description,
  };
}

interface ToolContentDetails {
  formulaTitle: string;
  formulaDescription: string;
  formulaBullets: string[];
  limitations: string[];
  component: React.ComponentType;
}

const TOOL_DETAILS_MAP: Record<string, ToolContentDetails> = {
  'bmi-calculator': {
    formulaTitle: 'Body Mass Index (BMI) Clinical Methodology',
    formulaDescription:
      'Body Mass Index (BMI) is a standardized screening metric established by the World Health Organization (WHO) that compares an individual’s body mass relative to their height squared. The formula is expressed as:',
    formulaBullets: [
      'Standard Formula: BMI = weight (kg) ÷ [height (m)]²',
      'WHO International Cutoffs: Underweight (<18.5), Normal (18.5–24.9), Overweight (25.0–29.9), Class I Obesity (30.0–34.9), Class II (35.0–39.9), Class III (≥40.0).',
      'Asian & South Asian Cutoffs: Due to higher risks of visceral adiposity, diabetes, and cardiovascular complications at lower BMI levels, WHO and Asian health authorities establish overweight at ≥23.0 and obesity at ≥27.5.',
    ],
    limitations: [
      'Does not distinguish between lean skeletal muscle mass, bone density, and adipose fat tissue.',
      'Athletes, bodybuilders, and pregnant individuals will often yield misleadingly high BMI values.',
      'Sarcopenic elderly individuals may have a "normal" BMI despite dangerous loss of skeletal muscle mass.',
      'Should always be evaluated in conjunction with waist circumference and lipid panels.',
    ],
    component: BmiCalculator,
  },

  'bmr-calculator': {
    formulaTitle: 'Mifflin-St Jeor Basal Metabolic Formula',
    formulaDescription:
      'Basal Metabolic Rate (BMR) represents the minimum number of calories your body burns while performing basic, life-sustaining biological functions at rest (such as cellular repair, circulation, breathing, and temperature maintenance).',
    formulaBullets: [
      'Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5',
      'Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161',
      'Endorsed by the Academy of Nutrition and Dietetics as the most reliable predictive formula for non-obese and obese adults.',
      'Accounts for approximately 60% to 75% of your total daily caloric expenditure.',
    ],
    limitations: [
      'Equation estimates assume average body composition and do not directly measure lean muscle mass percentage.',
      'Individuals with exceptionally high muscle mass burn more calories at rest than standard equations predict.',
      'Endocrine disorders (hypothyroidism, Cushing syndrome) significantly alter real-world resting metabolic rate.',
      'Direct measurement requires clinical indirect calorimetry in an overnight fasting laboratory environment.',
    ],
    component: BmrCalculator,
  },

  'calorie-calculator': {
    formulaTitle: 'Total Daily Energy Expenditure (TDEE) Methodology',
    formulaDescription:
      'Your daily calorie requirements are governed by Total Daily Energy Expenditure (TDEE). TDEE integrates your Basal Metabolic Rate with physical movement and Non-Exercise Activity Thermogenesis (NEAT).',
    formulaBullets: [
      'TDEE = BMR × Physical Activity Multiplier (1.2 to 1.9).',
      'Maintenance: Zero caloric deficit/surplus maintains weight balance.',
      'Weight Loss (Deficit): A controlled deficit of 250–500 kcal/day targets healthy, sustainable fat reduction of 0.25–0.5 kg weekly without severe muscle wasting.',
      'Hypertrophy (Surplus): A caloric surplus of 250–500 kcal/day paired with resistance exercise stimulates protein synthesis.',
    ],
    limitations: [
      'Activity multipliers are approximations; daily steps, fidgeting, and sleep quality create variance.',
      'Prolonged extreme deficits trigger adaptive thermogenesis (metabolic slowdown).',
      'Deficits should not reduce daily intake below 1,200 kcal for women or 1,500 kcal for men without medical supervision.',
    ],
    component: CalorieCalculator,
  },

  'water-intake-calculator': {
    formulaTitle: 'Clinical Fluid Replacement & Hydration Formula',
    formulaDescription:
      'Adequate hydration supports cellular nutrient transport, renal filtration, thermoregulation, and joint lubrication. The standard physiological guideline calculates baseline fluid requirements per kilogram of body mass.',
    formulaBullets: [
      'Baseline Need: 35 ml per kilogram of body weight per day.',
      'Exercise Offset: An additional 350 ml of water per 30 minutes of moderate-to-vigorous physical activity to replenish sweat loss.',
      'Climate Offset: Hot, humid, or high-altitude environments increase trans-epidermal evaporation, warranting +350 ml to +500 ml adjustments.',
    ],
    limitations: [
      'Patients with chronic kidney disease (CKD), congestive heart failure (CHF), or liver cirrhosis must strictly adhere to physician-prescribed fluid restrictions.',
      'Over-hydration without electrolyte balance can lead to hyponatremia (water intoxication).',
      'Caffeinated and alcoholic beverages can have mild diuretic effects requiring additional plain water intake.',
    ],
    component: WaterIntakeCalculator,
  },

  'ideal-weight-calculator': {
    formulaTitle: 'Devine & Robinson Anthropometric Formulations',
    formulaDescription:
      'Rather than fixating on a single arbitrary weight number, clinical medicine uses comparative mathematical models alongside WHO healthy BMI bands (18.5–24.9) to delineate an optimal cardiometabolic weight corridor.',
    formulaBullets: [
      'Devine Formula (Men): 50.0 kg + 2.3 kg per inch over 5 feet stature.',
      'Devine Formula (Women): 45.5 kg + 2.3 kg per inch over 5 feet stature.',
      'Robinson Formula (Men): 52.0 kg + 1.9 kg per inch over 5 feet stature.',
      'Robinson Formula (Women): 49.0 kg + 1.7 kg per inch over 5 feet stature.',
    ],
    limitations: [
      'Developed historically for pharmacokinetics and dosage standardization rather than holistic wellness.',
      'Assumes uniform bone structure and body frame sizing without accounting for musculoskeletal development.',
      'Waist-to-hip ratio and visceral adiposity distribution are often more predictive of cardiometabolic health than absolute weight.',
    ],
    component: IdealWeightCalculator,
  },

  'heart-rate-calculator': {
    formulaTitle: 'Tanaka & Karvonen Target Heart Rate Equations',
    formulaDescription:
      'Cardiorespiratory fitness relies on targeted cardiovascular training zones. The classical (220 - age) formula has been refined with Tanaka’s empirical regression model and the Karvonen Heart Rate Reserve (HRR) method.',
    formulaBullets: [
      'Tanaka Formula: HRmax = 208 - (0.7 × Age).',
      'Karvonen Reserve: Target HR = [(HRmax - HRrest) × % Intensity] + HRrest.',
      'Zone 1 (50–60%): Active recovery and aerobic warm-up.',
      'Zone 2 (60–70%): Mitochondrial biogenesis and maximum lipid oxidation.',
      'Zone 3 (70–80%): Aerobic endurance and stroke volume expansion.',
      'Zone 4 (80–90%): Lactate clearance and threshold tolerance.',
      'Zone 5 (90–100%): Maximal neuromuscular and anaerobic VO2 peak.',
    ],
    limitations: [
      'Cardiovascular medications like beta-blockers and calcium channel blockers significantly suppress heart rate.',
      'Dehydration, high caffeine consumption, ambient heat, and psychological stress elevate resting pulse.',
      'Individuals with arrhythmia or cardiovascular history should consult a cardiologist before Zone 4 or 5 interval training.',
    ],
    component: HeartRateCalculator,
  },

  'sleep-calculator': {
    formulaTitle: 'Ultradian 90-Minute Sleep Architecture',
    formulaDescription:
      'Human nocturnal sleep naturally cycles through distinct physiological phases: Non-REM Stage 1 (light), Stage 2 (spindles), Stage 3 (slow-wave restorative delta), and Rapid Eye Movement (REM).',
    formulaBullets: [
      'Cycle Length: One complete NREM/REM cycle lasts approximately 90 minutes.',
      'Sleep Latency: The average healthy human takes 10 to 20 minutes (median 14 minutes) to transition from wakefulness to sleep.',
      '5 to 6 Cycles (7.5 to 9 Hours): Clinical benchmark recommended by the National Sleep Foundation for cognitive consolidation and immune regeneration.',
    ],
    limitations: [
      'Individual cycle length can vary between 70 and 110 minutes based on genetics, age, and sleep debt.',
      'Alcohol, sedatives, and sleep apnea disrupt normal REM cycle transitions.',
      'Maintaining consistent bedtimes and wake times (circadian alignment) is as critical as cycle count.',
    ],
    component: SleepCalculator,
  },

  'pregnancy-due-date': {
    formulaTitle: "Naegele's Obstetric Gestational Rule",
    formulaDescription:
      "Naegele's rule is the standard clinical convention for calculating an estimated date of delivery (EDD) based on a 280-day (40-week) human gestational duration measured from the first day of the last menstrual period (LMP).",
    formulaBullets: [
      'Classic Formula: EDD = LMP + 1 year - 3 months + 7 days (adjusted for non-28 day cycles).',
      'Conception Window: Typically occurs 14 days after LMP in standard cycles.',
      'Trimester Milestones: 1st Trimester (Weeks 1–13), 2nd Trimester (Weeks 14–27), 3rd Trimester (Weeks 28–40+).',
    ],
    limitations: [
      'Only approximately 4% of births occur precisely on the calculated estimated due date.',
      'Irregular menstrual cycles, polycystic ovarian syndrome (PCOS), or recent contraceptive use introduce estimation errors.',
      'First-trimester crown-rump length (CRL) ultrasound scan performed by an obstetrician remains the definitive gold standard for clinical pregnancy dating.',
    ],
    component: PregnancyDueDateCalculator,
  },

  'nutrition-calculator': {
    formulaTitle: 'Macronutrient Energy Density & Distribution',
    formulaDescription:
      'Human energy metabolism is fueled by three primary macronutrients, each with specific energetic densities established in nutritional biochemistry:',
    formulaBullets: [
      'Protein: 4 kcal per gram (essential for enzymatic function, immune health, and muscular repair).',
      'Carbohydrates: 4 kcal per gram (primary glycogen source for central nervous system and high-intensity glycolytic training).',
      'Dietary Fats: 9 kcal per gram (critical for steroid hormone synthesis, cellular membranes, and fat-soluble vitamin absorption).',
      'Dietary Fiber: Recommended 14 grams per 1,000 kcal to maintain glycemic stability and microbiome diversity.',
    ],
    limitations: [
      'Macronutrient splits should be customized for specific metabolic conditions (e.g., ketogenic, diabetic, or renal protocols).',
      'Whole-food nutrient density and micronutrient intake (vitamins and minerals) are as vital as raw macronutrient gram totals.',
      'Chronic kidney disease patients may require restricted protein intake under medical supervision.',
    ],
    component: NutritionCalculator,
  },
};

export default async function IndividualToolPage({ params }: PageProps) {
  const tool = HEALTH_TOOLS.find((t) => t.slug === params.slug);
  if (!tool) {
    notFound();
  }

  const details = TOOL_DETAILS_MAP[tool.slug];
  if (!details) {
    notFound();
  }

  const CalculatorComponent = details.component;

  // Concurrently fetch real related articles and related videos from Neon DB
  const [relatedArticles, relatedVideos] = await Promise.all([
    getRelatedArticlesForTool(tool.relatedCategory, 3),
    getRelatedVideosForTool(tool.relatedCategory, 3),
  ]);

  return (
    <CalculatorLayout
      tool={tool}
      formulaTitle={details.formulaTitle}
      formulaDescription={details.formulaDescription}
      formulaBullets={details.formulaBullets}
      limitations={details.limitations}
      relatedArticles={relatedArticles}
      relatedVideos={relatedVideos}
      allTools={HEALTH_TOOLS}
    >
      <CalculatorComponent />
    </CalculatorLayout>
  );
}

