export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string; // 'INR' or 'USD'
  duration_label: string; // '1 Month', '6 Months', '1 Year', 'LIFETIME'
  duration_months: number;
  is_recommended: boolean;
  benefits: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_SUBSCRIPTION_PLANS: Omit<SubscriptionPlan, 'created_at' | 'updated_at'>[] = [
  {
    id: '1-month',
    name: '1 Month',
    price: 129,
    currency: 'INR',
    duration_label: '1 Month',
    duration_months: 1,
    is_recommended: false,
    benefits: [
      'Full Access to Health Tools & Daily Body Routine Manager',
      'All 9 Clinical Calculators Unlocked (BMI, BMR, Sleep, Macros)',
      'Unlimited Access to Premium Medical Reports',
      'Ad-Free Reading Experience Across All Devices',
      'Personalized Health & Wellness Dashboard',
    ],
    display_order: 1,
    is_active: true,
  },
  {
    id: '6-months',
    name: '6 Months',
    price: 749,
    currency: 'INR',
    duration_label: '6 Months',
    duration_months: 6,
    is_recommended: false,
    benefits: [
      'All 1-Month Plan Benefits Included',
      'Full Health Tools & Daily Body Routine Optimization',
      'Full Digital Magazine Archive Access (PDF & Web)',
      'Early Access to Clinical Studies & Medical Insights',
      'Exclusive Dietary Guides & Evidence Protocols',
    ],
    display_order: 2,
    is_active: true,
  },
  {
    id: '1-year',
    name: '1 Year',
    price: 999,
    currency: 'INR',
    duration_label: '1 Year',
    duration_months: 12,
    is_recommended: true,
    benefits: [
      'All 6-Month Plan Benefits Included',
      'Full Health Tools & Daily Body Routine Optimization',
      'VIP Doctor Webinar & Interview Replays',
      'Priority Access to Medical Review Board Insights',
      'Family Health Vault Sync & Record Storage',
      'Best Value — Save Over 35% Annually',
    ],
    display_order: 3,
    is_active: true,
  },
  {
    id: 'lifetime',
    name: 'LIFETIME',
    price: 9999,
    currency: 'INR',
    duration_label: 'LIFETIME',
    duration_months: 999,
    is_recommended: false,
    benefits: [
      'Permanent VIP Ad-Free Lifetime Access',
      'Lifetime Access to All Health Tools & Body Routine Features',
      'All Future Premium Tools Included Automatically',
      'Full Archive of Downloadable Health Guides & eBooks',
      'Dedicated VIP Priority Support Channel',
    ],
    display_order: 4,
    is_active: true,
  },
];

