import Link from 'next/link';
import { Calculator, Moon, Stethoscope, Scale, Droplet, ArrowRight, ShieldAlert, Heart, Activity } from 'lucide-react';

export const metadata = {
  title: 'Clinical Health Tools & Calculators | HealthGhuru',
  description: 'Evidence-based health calculators, sleep cycle optimizers, calorie target calculators, and AI health symptom guidance.',
};

const TOOLS = [
  {
    title: 'Macro & Calorie Target Calculator',
    description: 'Calculate your daily Total Daily Energy Expenditure (TDEE) and macronutrient distribution for cardiovascular health and weight management.',
    icon: <Calculator className="w-7 h-7 text-white" />,
    href: '/tools/macro-calculator',
    color: 'from-emerald-600 to-teal-500',
    tag: 'Metabolic Health'
  },
  {
    title: 'Circadian Sleep Cycle Optimizer',
    description: 'Compute precise bedtime and wake times to align with 90-minute REM cycles, reducing morning sleep inertia and nighttime cortisol.',
    icon: <Moon className="w-7 h-7 text-white" />,
    href: '/tools/sleep-calculator',
    color: 'from-indigo-600 to-purple-600',
    tag: 'Neurology & Sleep'
  },
  {
    title: 'AI Symptom & Clinical Guidance Assistant',
    description: 'Conversational assistant backed by medical triage literature to help you prepare structured questions for your next doctor consultation.',
    icon: <Stethoscope className="w-7 h-7 text-white" />,
    href: '/tools/symptom-checker',
    color: 'from-accent to-amber-600',
    tag: 'Clinical Triage'
  },
  {
    title: 'BMI & Body Composition Calculator',
    description: 'Assess Body Mass Index with South Asian and Asian-specific visceral adiposity cutoffs to accurately evaluate cardiometabolic risk.',
    icon: <Scale className="w-7 h-7 text-white" />,
    href: '/tools/macro-calculator',
    color: 'from-rose-600 to-pink-500',
    tag: 'Cardiology'
  },
  {
    title: 'Daily Hydration & Electrolyte Guide',
    description: 'Determine personalized fluid requirements based on climate, ambient humidity, and physical activity levels.',
    icon: <Droplet className="w-7 h-7 text-white" />,
    href: '/tools/macro-calculator',
    color: 'from-sky-600 to-blue-500',
    tag: 'Renal & Wellness'
  }
];

export default function ToolsHubPage() {
  return (
    <div className="w-full min-h-screen bg-surface py-8 sm:py-12">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-4 uppercase tracking-wider">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-primary">Clinical Health Tools</span>
        </div>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-900/10 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5" />
              Interactive Health Utilities
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2E1A] tracking-tight">
              Evidence-Based Health Calculators
            </h1>
            <p className="mt-3 text-base text-text-secondary leading-relaxed">
              Scientifically grounded utilities engineered to help patients, caregivers, and health enthusiasts quantify biological metrics and prepare for clinical visits.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/category/nutrition"
              className="px-5 py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-dark hover:bg-emerald-50 hover:text-primary transition-colors text-center"
            >
              Nutrition News →
            </Link>
            <Link
              href="/category/heart"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm text-center flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              Cardio Protocols
            </Link>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TOOLS.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className="group bg-white rounded-2xl p-7 border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
                  {tool.icon}
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-primary border border-emerald-200">
                  {tool.tag}
                </span>
              </div>

              <h2 className="font-serif text-xl font-bold text-[#1A2E1A] mb-2.5 group-hover:text-primary transition-colors leading-snug">
                {tool.title}
              </h2>

              <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1">
                {tool.description}
              </p>

              <div className="flex items-center text-xs font-bold uppercase tracking-wider text-primary mt-auto pt-4 border-t border-gray-100 group-hover:text-accent transition-colors">
                Launch Interactive Tool
                <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mandatory Medical Disclaimer Box */}
        <div className="rounded-2xl bg-amber-50/80 border-2 border-amber-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-amber-900">
              Mandatory Clinical & Emergency Medical Disclaimer
            </h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              The health calculators and algorithmic tools provided on HealthGhuru are intended solely for general informational, fitness, and educational reference. They do <strong>not</strong> constitute medical advice, clinical diagnosis, or treatment plans.
            </p>
            <p className="text-xs font-bold text-amber-900">
              🚨 EMERGENCY PROTOCOL: If you or someone you know is experiencing acute symptoms—including crushing chest pain, sudden numbness, difficulty speaking, shortness of breath, or allergic anaphylaxis—please call your local emergency medical service (112 / 911 / 108) immediately or visit the nearest hospital emergency department.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
