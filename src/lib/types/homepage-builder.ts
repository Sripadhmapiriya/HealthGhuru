export interface HomepageSectionConfig {
  id: string;
  blockId: string;
  title: string; // Clean display title
  englishTitle?: string; // Kept for backwards compatibility
  primaryTitle?: string; // Kept for backwards compatibility
  enabled: boolean;
  order: number;
}

export interface RightSidebarWidgetConfig {
  id: string;
  widgetId: string;
  type: 'ad' | 'trending' | 'mostRead' | 'newsletter' | 'poll';
  title: string;
  englishTitle?: string;
  primaryTitle?: string;
  enabled: boolean;
  order: number;
}

export interface TrendingStoryPin {
  id: string; // content item id
  title: string;
  category?: string;
  rank: number; // 1 to 5+
}

export interface MostReadSettingsConfig {
  articlesCountLimit: number;
  minViewsThreshold: number;
  displayViewsBadge: boolean;
}

export interface HomepageBuilderConfig {
  heroStoryId: string | null;
  editorPickIds: string[];
  featuredShortIds: string[];
  sections: HomepageSectionConfig[];
  sidebarWidgets: RightSidebarWidgetConfig[];
  pinnedTrending: TrendingStoryPin[];
  mostReadSettings: MostReadSettingsConfig;
  updatedAt?: string;
}

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  {
    id: 'breaking',
    blockId: 'breaking',
    title: 'Breaking News',
    englishTitle: 'Breaking News',
    primaryTitle: 'Breaking News',
    enabled: true,
    order: 1,
  },
  {
    id: 'hero',
    blockId: 'hero',
    title: 'Top Stories & Analysis',
    englishTitle: 'Top Stories & Analysis',
    primaryTitle: 'Top Stories & Analysis',
    enabled: true,
    order: 2,
  },
  {
    id: 'latest',
    blockId: 'latest',
    title: 'Latest Health News',
    englishTitle: 'Latest Health News',
    primaryTitle: 'Latest Health News',
    enabled: true,
    order: 3,
  },
  {
    id: 'cancer',
    blockId: 'cancer',
    title: 'Cancer & Oncology News',
    englishTitle: 'Cancer & Oncology News',
    primaryTitle: 'Cancer & Oncology News',
    enabled: true,
    order: 4,
  },
  {
    id: 'heart',
    blockId: 'heart',
    title: 'Heart & Cardiovascular Health',
    englishTitle: 'Heart & Cardiovascular Health',
    primaryTitle: 'Heart & Cardiovascular Health',
    enabled: true,
    order: 5,
  },
  {
    id: 'diabetes',
    blockId: 'diabetes',
    title: 'Diabetes & Metabolic Health',
    englishTitle: 'Diabetes & Metabolic Health',
    primaryTitle: 'Diabetes & Metabolic Health',
    enabled: true,
    order: 6,
  },
  {
    id: 'womens-health',
    blockId: 'womens-health',
    title: "Women's Health & Maternal Wellness",
    englishTitle: "Women's Health & Maternal Wellness",
    primaryTitle: "Women's Health & Maternal Wellness",
    enabled: true,
    order: 7,
  },
  {
    id: 'pediatrics',
    blockId: 'pediatrics',
    title: 'Pediatrics & Child Health',
    englishTitle: 'Pediatrics & Child Health',
    primaryTitle: 'Pediatrics & Child Health',
    enabled: true,
    order: 8,
  },
  {
    id: 'mental-health',
    blockId: 'mental-health',
    title: 'Mental Health & Neuroscience',
    englishTitle: 'Mental Health & Neuroscience',
    primaryTitle: 'Mental Health & Neuroscience',
    enabled: true,
    order: 9,
  },
  {
    id: 'fitness',
    blockId: 'fitness',
    title: 'Fitness & Exercise Physiology',
    englishTitle: 'Fitness & Exercise Physiology',
    primaryTitle: 'Fitness & Exercise Physiology',
    enabled: true,
    order: 10,
  },
  {
    id: 'nutrition',
    blockId: 'nutrition',
    title: 'Clinical Nutrition & Dietetics',
    englishTitle: 'Clinical Nutrition & Dietetics',
    primaryTitle: 'Clinical Nutrition & Dietetics',
    enabled: true,
    order: 11,
  },
  {
    id: 'visual-stories',
    blockId: 'photos',
    title: 'Visual Stories & Infographics',
    englishTitle: 'Visual Stories & Infographics',
    primaryTitle: 'Visual Stories & Infographics',
    enabled: true,
    order: 12,
  },
  {
    id: 'research',
    blockId: 'research',
    title: 'Medical Research & Discoveries',
    englishTitle: 'Medical Research & Discoveries',
    primaryTitle: 'Medical Research & Discoveries',
    enabled: true,
    order: 13,
  },
  {
    id: 'doctor-interviews',
    blockId: 'interviews',
    title: 'Doctor Interviews',
    englishTitle: 'Doctor Interviews',
    primaryTitle: 'Doctor Interviews',
    enabled: true,
    order: 14,
  },
  {
    id: 'shorts',
    blockId: 'shorts',
    title: 'Health Videos & Shorts',
    englishTitle: 'Health Videos & Shorts',
    primaryTitle: 'Health Videos & Shorts',
    enabled: true,
    order: 15,
  },
  {
    id: 'editors',
    blockId: 'editors',
    title: "Editor's Picks & Most Read",
    englishTitle: "Editor's Picks & Most Read",
    primaryTitle: "Editor's Picks & Most Read",
    enabled: true,
    order: 16,
  },
  {
    id: 'polls-magazines',
    blockId: 'polls-magazines',
    title: 'Health Poll & Digital Magazines',
    englishTitle: 'Health Poll & Digital Magazines',
    primaryTitle: 'Health Poll & Digital Magazines',
    enabled: true,
    order: 17,
  },
  {
    id: 'sponsored',
    blockId: 'sponsored',
    title: 'Sponsored Healthcare Content',
    englishTitle: 'Sponsored Healthcare Content',
    primaryTitle: 'Sponsored Healthcare Content',
    enabled: true,
    order: 18,
  },
];

export const DEFAULT_SIDEBAR_WIDGETS: RightSidebarWidgetConfig[] = [
  {
    id: 'ad1',
    widgetId: 'ad1',
    type: 'ad',
    title: 'Advertisement 1',
    englishTitle: 'Advertisement 1',
    primaryTitle: 'Advertisement 1',
    enabled: true,
    order: 1,
  },
  {
    id: 'trending',
    widgetId: 'trending',
    type: 'trending',
    title: 'Trending News',
    englishTitle: 'Trending News',
    primaryTitle: 'Trending News',
    enabled: true,
    order: 2,
  },
  {
    id: 'ad2',
    widgetId: 'ad2',
    type: 'ad',
    title: 'Advertisement 2',
    englishTitle: 'Advertisement 2',
    primaryTitle: 'Advertisement 2',
    enabled: true,
    order: 3,
  },
  {
    id: 'mostRead',
    widgetId: 'mostRead',
    type: 'mostRead',
    title: 'Most Read',
    englishTitle: 'Most Read',
    primaryTitle: 'Most Read',
    enabled: true,
    order: 4,
  },
  {
    id: 'newsletter',
    widgetId: 'newsletter',
    type: 'newsletter',
    title: 'Newsletter Briefing',
    englishTitle: 'Newsletter Briefing',
    primaryTitle: 'Newsletter Briefing',
    enabled: true,
    order: 5,
  },
];

export const DEFAULT_MOST_READ_SETTINGS: MostReadSettingsConfig = {
  articlesCountLimit: 5,
  minViewsThreshold: 0,
  displayViewsBadge: true,
};

export function getDefaultHomepageConfig(): HomepageBuilderConfig {
  return {
    heroStoryId: null,
    editorPickIds: [],
    featuredShortIds: [],
    sections: [...DEFAULT_HOMEPAGE_SECTIONS],
    sidebarWidgets: [...DEFAULT_SIDEBAR_WIDGETS],
    pinnedTrending: [],
    mostReadSettings: { ...DEFAULT_MOST_READ_SETTINGS },
  };
}
