export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  date: string;
}

export interface ExerciseData {
  name: string;
  description: string;
  image: string;
}

export interface SleepRisk {
  title: string;
  icon: string;
  description: string;
}

// Dashboard Types
export interface User {
  name: string;
  email: string;
  plan: 'free' | 'pro';
  avatar: string | null;
  dob: string;
  gender: string;
  height: number;
  weight: number;
  city: string;
  goals: HealthGoal[];
  calorieTarget: number;
}

export type HealthGoal =
  | 'lose_weight'
  | 'build_muscle'
  | 'sleep_better'
  | 'eat_healthier'
  | 'reduce_stress'
  | 'more_active';

export interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealLog {
  date: string;
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  type: string;
  duration: number;
  intensity: 'light' | 'moderate' | 'intense';
  calories: number;
  notes?: string;
}

export interface SleepLog {
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood: number;
}

export type ArticleCategory = 'Nutrition' | 'Fitness' | 'Sleep' | 'Mental Health';

// The Article interface has been moved to src/lib/types/article.ts

export interface WeeklyDataPoint {
  day: string;
  nutritionScore: number;
  sleepHours: number;
  activeMinutes: number;
  moodScore: number;
}

// Vault Types
export type RecordType = 'lab_report' | 'prescription' | 'visit_note' | 'vaccination' | 'insurance' | 'other';

export interface VaultRecord {
  id: string;
  memberId: string;
  type: RecordType;
  title: string;
  date: string;
  doctorOrFacility?: string;
  tags: string[];
  fileName: string;
  fileUrl?: string;
  extractedText?: string;
  createdAt: string;
}

export type GoalCategory = 'weight' | 'blood_sugar' | 'blood_pressure' | 'sleep' | 'fitness' | 'mental_health' | 'other';
export type GoalStatus = 'active' | 'completed' | 'archived';

export interface GoalProgressEntry {
  date: string;
  value: number;
  note?: string;
}

export interface Goal {
  id: string;
  memberId: string;
  title: string;
  category: GoalCategory;
  startValue: number;
  targetValue: number;
  unit: string;
  targetDate: string;
  status: GoalStatus;
  history: GoalProgressEntry[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'self' | 'spouse' | 'child' | 'parent' | 'other';
  avatarInitials: string;
  dob: string;
}

// Dashboard Types
export interface LibraryArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: number;
  date: string;
  saved: boolean;
  heroImage?: string;
  matchedGoalCategory?: string;
}

export interface VaultActivityEvent {
  id: string;
  memberId: string;
  type: 'record_added' | 'goal_updated' | 'goal_created' | 'article_saved';
  label: string;
  timestamp: string;
  linkHref: string;
}

export interface UserPlan {
  tier: 'free' | 'pro';
  recordsUsed: number;
  recordsLimit: number;
  activeGoalsLimit: number;
  familyMembersLimit: number;
  adsEnabled: boolean;
  ocrEnabled: boolean;
  dataExportEnabled: boolean;
  accountCreatedAt: string;
}
