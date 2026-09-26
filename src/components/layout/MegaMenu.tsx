"use client";

import Link from "next/link";
import {
  Activity,
  HeartPulse,
  Baby,
  Sparkles,
  Stethoscope,
  Building2,
  BookOpen,
  Video,
  Calculator,
  Flame,
  ArrowRight,
  ShieldCheck,
  Microscope,
  FileText,
} from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const DISEASES_CONDITIONS = [
  { name: "Cancer & Oncology", href: "/category/cancer" },
  { name: "Heart & Cardiovascular", href: "/category/heart" },
  { name: "Diabetes & Endocrinology", href: "/category/diabetes" },
  { name: "Neurology & Brain Health", href: "/category/neurology" },
  { name: "Respiratory Health", href: "/category/respiratory" },
  { name: "Kidney & Nephrology", href: "/category/kidney" },
  { name: "Liver & Hepatic Health", href: "/category/liver" },
  { name: "Digestive & Gut Health", href: "/category/gut-health" },
  { name: "Bone, Joint & Orthopedics", href: "/category/bone-joint" },
  { name: "Dermatology & Skin", href: "/category/dermatology" },
  { name: "Dental & Oral Health", href: "/category/dental" },
  { name: "Eye & Vision Care", href: "/category/eye-health" },
  { name: "Infectious Diseases", href: "/category/infectious-diseases" },
  { name: "Rare Diseases", href: "/category/rare-diseases" },
];

const LIFE_STAGES = [
  { name: "Women's Health", href: "/category/womens-health" },
  { name: "Pediatrics & Kids", href: "/category/pediatrics" },
  { name: "Pregnancy & Fertility", href: "/category/pregnancy" },
  { name: "Newborn & Infant Care", href: "/category/newborn-care" },
  { name: "Teen & Adolescent Health", href: "/category/teen-health" },
  { name: "Men's Health", href: "/category/mens-health" },
  { name: "Healthy Aging & Seniors", href: "/category/healthy-aging" },
];

const WELLNESS_PREVENTION = [
  { name: "Fitness & Workouts", href: "/category/fitness" },
  { name: "Nutrition & Diet", href: "/category/nutrition" },
  { name: "Mental Health & Stress", href: "/category/mental-health" },
  { name: "Yoga & Breathwork", href: "/category/yoga" },
  { name: "Ayurveda & Holistic", href: "/category/ayurveda" },
  { name: "Sleep Science & Recovery", href: "/category/sleep" },
  { name: "Weight Management", href: "/category/weight-management" },
  { name: "Preventive Care", href: "/category/preventive-care" },
];

const MEDICAL_ECOSYSTEM = [
  { name: "Medical Research & Clinical Trials", href: "/research", icon: Microscope, highlight: true },
  { name: "Doctor Directory & Profiles", href: "/doctors", icon: Stethoscope, highlight: true },
  { name: "Hospitals & Care Centers", href: "/hospitals", icon: Building2, highlight: true },
  { name: "Sponsored Health Articles", href: "/sponsored-articles", icon: FileText, highlight: true },
  { name: "Doctor Video Interviews", href: "/interviews", icon: Video, highlight: false },
  { name: "Health Videos & Documentaries", href: "/videos", icon: Video, highlight: false },
  { name: "Health Magazines & Journals", href: "/magazines", icon: BookOpen, highlight: false },
  { name: "Health Tools & 9 Calculators", href: "/health-tools", icon: Calculator, highlight: true },
  { name: "Editorial Medical Reviews", href: "/about/medical-review", icon: ShieldCheck, highlight: false },
];

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 w-full bg-white border-b-2 border-[#2E7D32] shadow-2xl z-50 transition-all animate-in fade-in slide-in-from-top-2 duration-200"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto p-6 lg:p-8">
        {/* Top title banner inside mega menu */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f06d2f]" />
            <h3 className="font-heading font-bold text-sm tracking-wider uppercase text-[#1B5E20]">
              HealthGhuru Complete Healthcare Ecosystem
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">
            Browse across 40+ clinical specialties, research topics, and medical directories
          </span>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Diseases & Conditions */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-[#2E7D32]/20">
              <HeartPulse size={16} className="text-[#2E7D32]" />
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A2E1A]">
                Diseases & Conditions
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs">
              {DISEASES_CONDITIONS.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    onClick={onClose}
                    className="text-[#4A6741] hover:text-[#f06d2f] hover:translate-x-1 transition-all inline-flex items-center gap-1.5 py-0.5"
                  >
                    <span className="text-gray-300">•</span>
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Life Stages */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-[#2E7D32]/20">
              <Baby size={16} className="text-[#2E7D32]" />
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A2E1A]">
                Life Stages
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs">
              {LIFE_STAGES.map((stage) => (
                <li key={stage.name}>
                  <Link
                    href={stage.href}
                    onClick={onClose}
                    className="text-[#4A6741] hover:text-[#f06d2f] hover:translate-x-1 transition-all inline-flex items-center gap-1.5 py-0.5"
                  >
                    <span className="text-gray-300">•</span>
                    <span>{stage.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-100 bg-[#f9fbf9] p-3 rounded-xl">
              <p className="text-[11px] font-heading font-semibold text-[#1B5E20]">
                Looking for Maternal & Child Guidance?
              </p>
              <Link
                href="/category/pediatrics"
                onClick={onClose}
                className="text-xs text-[#f06d2f] font-semibold flex items-center gap-1 mt-1 hover:underline"
              >
                <span>Explore Pediatrics Hub</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Column 3: Wellness & Prevention */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-[#2E7D32]/20">
              <Sparkles size={16} className="text-[#f06d2f]" />
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A2E1A]">
                Wellness & Prevention
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs">
              {WELLNESS_PREVENTION.map((w) => (
                <li key={w.name}>
                  <Link
                    href={w.href}
                    onClick={onClose}
                    className="text-[#4A6741] hover:text-[#f06d2f] hover:translate-x-1 transition-all inline-flex items-center gap-1.5 py-0.5"
                  >
                    <span className="text-gray-300">•</span>
                    <span>{w.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-100 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
              <p className="text-[11px] font-heading font-semibold text-amber-900">
                Live Better. Feel Stronger. Every Day.
              </p>
              <p className="text-[10px] text-amber-800/80 mt-0.5">
                Evidence-backed nutrition and exercise routines validated by physicians.
              </p>
            </div>
          </div>

          {/* Column 4: Medical Ecosystem & Directory */}
          <div className="bg-[#F5FAF5] p-4 rounded-2xl border border-[#2E7D32]/15">
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#2E7D32]/20">
              <Stethoscope size={16} className="text-[#2E7D32]" />
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1B5E20]">
                Medical Ecosystem
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              {MEDICAL_ECOSYSTEM.map((med) => {
                const IconComponent = med.icon;
                return (
                  <li key={med.name}>
                    <Link
                      href={med.href}
                      onClick={onClose}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-all group ${
                        med.highlight
                          ? "bg-white text-[#1B5E20] font-semibold shadow-xs hover:bg-[#1B5E20] hover:text-white"
                          : "text-[#4A6741] hover:bg-white hover:text-[#f06d2f]"
                      }`}
                    >
                      <IconComponent size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate">{med.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
