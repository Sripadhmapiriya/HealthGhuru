import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { SponsoredCMSClient } from './SponsoredCMSClient';
import { getAdminSponsoredKPIs } from '@/lib/sponsored/db';

export const dynamic = 'force-dynamic';

export default async function AdminSponsoredArticlesPage() {
  await requireAdmin();

  let articles: any[] = [];
  let sponsors: any[] = [];
  let campaigns: any[] = [];
  let requests: any[] = [];
  let kpis = {
    totalArticles: 0,
    activeCampaigns: 0,
    pendingReviews: 0,
    medicalReviews: 0,
    totalViews: 0,
    totalClicks: 0,
    totalCtaClicks: 0,
    avgCtr: 0,
    expiringSoonCount: 0,
  };

  try {
    const [articlesRes, sponsorsRes, campaignsRes, requestsRes, kpisRes] = await Promise.all([
      sql`
        SELECT
          sa.*,
          s.name AS sponsor_name,
          s.type AS sponsor_type,
          s.logo_url AS sponsor_logo_url,
          s.verified AS sponsor_verified,
          c.name AS campaign_name,
          c.status AS campaign_status,
          c.end_date AS campaign_end_date,
          a.organization_name AS advertiser_name
        FROM sponsored_articles sa
        LEFT JOIN sponsors s ON sa.sponsor_id = s.id
        LEFT JOIN campaigns c ON sa.campaign_id = c.id
        LEFT JOIN advertisers a ON sa.advertiser_id = a.id
        ORDER BY sa.created_at DESC
      `,
      sql`
        SELECT s.*, a.organization_name AS advertiser_name
        FROM sponsors s
        LEFT JOIN advertisers a ON s.advertiser_id = a.id
        ORDER BY s.name ASC
      `,
      sql`
        SELECT c.*, a.organization_name AS advertiser_name
        FROM campaigns c
        LEFT JOIN advertisers a ON c.advertiser_id = a.id
        ORDER BY c.created_at DESC
      `,
      sql`
        SELECT *
        FROM campaign_requests
        ORDER BY created_at DESC
      `,
      getAdminSponsoredKPIs(),
    ]);

    articles = articlesRes;
    sponsors = sponsorsRes;
    campaigns = campaignsRes;
    requests = requestsRes;
    kpis = kpisRes;
  } catch (err) {
    console.error('Failed to load initial admin sponsored data:', err);
  }

  return (
    <div className="w-full">
      <SponsoredCMSClient
        initialArticles={articles}
        sponsors={sponsors}
        campaigns={campaigns}
        initialRequests={requests}
        kpis={kpis}
      />
    </div>
  );
}
