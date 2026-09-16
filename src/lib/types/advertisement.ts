export type AdPlacement = 'top_banner' | 'hero_banner' | 'sidebar' | 'floating_footer' | 'popup';

export interface Advertisement {
  id: string;
  title: string;
  placement: AdPlacement;
  image_url: string | null;
  target_url: string;
  headline?: string | null;
  description?: string | null;
  cta_text?: string | null;
  category?: string | null;
  html_code?: string | null;
  is_active: boolean;
  impressions_count: number;
  clicks_count: number;
  // Hospital / Doctor Advertiser & Campaign fields
  advertiser_name?: string | null;
  advertiser_contact?: string | null;
  advertiser_type?: 'hospital' | 'doctor' | 'clinic' | 'pharmacy' | null;
  budget?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: 'active' | 'pending' | 'expired' | 'unpublished' | 'rejected' | string | null;
  payment_status?: 'paid' | 'pending' | 'failed' | string | null;
  payment_method?: string | null;
  priority?: 'Low' | 'Medium' | 'High' | string | null;
  created_at: string;
  updated_at: string;
}

export interface AdMetricsSummary {
  totalAds: number;
  activeAds: number;
  totalImpressions: number;
  totalClicks: number;
  averageCtr: number;
}

export interface AdSlotPricing {
  id: string;
  placement: AdPlacement;
  label: string;
  description?: string | null;
  price_per_day: number;
  price_per_week: number;
  price_per_month: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SponsoredArticle {
  id: string;
  article_id: string;
  article_title: string;
  article_slug: string;
  advertiser_name: string;
  advertiser_type?: 'hospital' | 'doctor' | 'clinic' | 'pharmacy' | null;
  advertiser_logo_url?: string | null;
  sponsor_label: string;
  cta_text?: string | null;
  cta_url?: string | null;
  is_active: boolean;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}
