export type SponsorType =
  | 'HOSPITAL'
  | 'DOCTOR'
  | 'CLINIC'
  | 'DIAGNOSTIC_CENTRE'
  | 'HEALTHCARE_BRAND'
  | 'MEDICAL_INSTITUTION'
  | 'WELLNESS_BRAND'
  | 'OTHER';

export type ArticleWorkflowStatus =
  | 'draft'
  | 'submitted'
  | 'editorial_review'
  | 'medical_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'expired'
  | 'archived';

export type ReviewStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'changes_requested';

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export type RightsStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';

export type SponsoredLabelType = 'SPONSORED' | 'PARTNER CONTENT' | 'ADVERTISEMENT';

export interface Advertiser {
  id: string;
  organization_name: string;
  organization_type: string;
  logo_url?: string | null;
  contact_person?: string | null;
  email: string;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  description?: string | null;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Sponsor {
  id: string;
  advertiser_id?: string | null;
  name: string;
  type: SponsorType;
  logo_url?: string | null;
  cover_image_url?: string | null;
  description?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  specializations?: string[];
  verified: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  advertiser_id?: string | null;
  name: string;
  description?: string | null;
  start_date: string;
  end_date: string;
  budget?: number | null;
  status: CampaignStatus;
  objective?: string | null;
  on_expiry: 'unpublish' | 'archive' | 'keep_published';
  created_at: string;
  updated_at: string;
}

export interface SponsoredArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  sponsor_id?: string | null;
  advertiser_id?: string | null;
  campaign_id?: string | null;
  category: string;
  tags?: string[];
  author_name: string;
  author_title?: string | null;
  author_avatar?: string | null;
  medical_reviewer_name?: string | null;
  medical_reviewer_credentials?: string | null;
  medical_reviewer_avatar?: string | null;
  reviewed_at?: string | null;
  requires_medical_review: boolean;
  medical_claim_flags?: string[];
  status: ArticleWorkflowStatus;
  review_status: ReviewStatus;
  is_featured: boolean;
  is_active: boolean;
  sponsored_label: SponsoredLabelType;
  content_type: string;
  cta_text: string;
  cta_url?: string | null;
  published_at?: string | null;
  scheduled_at?: string | null;
  expires_at?: string | null;
  views: number;
  clicks: number;
  cta_clicks: number;
  shares: number;
  reading_time: number;
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
  rights_confirmed: RightsStatus;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface SponsoredArticleWithSponsor extends SponsoredArticle {
  sponsor_name?: string;
  sponsor_type?: SponsorType;
  sponsor_logo_url?: string;
  sponsor_cover_url?: string;
  sponsor_description?: string;
  sponsor_city?: string;
  sponsor_state?: string;
  sponsor_country?: string;
  sponsor_phone?: string;
  sponsor_email?: string;
  sponsor_specializations?: string[];
  sponsor_verified?: boolean;
  sponsor_website?: string;
  campaign_name?: string;
  campaign_status?: CampaignStatus;
  advertiser_name?: string;
}

export interface SponsoredArticleFilterParams {
  category?: string;
  sponsor_type?: string;
  q?: string;
  sort?: 'latest' | 'most_read' | 'featured';
  page?: number;
  limit?: number;
}

export interface SponsoredKPIStats {
  totalArticles: number;
  activeCampaigns: number;
  pendingReviews: number;
  medicalReviews: number;
  totalViews: number;
  totalClicks: number;
  totalCtaClicks: number;
  avgCtr: number;
  expiringSoonCount: number;
}
