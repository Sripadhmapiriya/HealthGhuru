/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getAdminSponsoredKPIs } from '@/lib/sponsored/db';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const kpis = await getAdminSponsoredKPIs();

    // Top performing articles
    const topArticles = await sql`
      SELECT
        sa.id, sa.title, sa.slug, sa.views, sa.clicks, sa.cta_clicks,
        s.name AS sponsor_name, s.type AS sponsor_type
      FROM sponsored_articles sa
      LEFT JOIN sponsors s ON sa.sponsor_id = s.id
      WHERE sa.status = 'published'
      ORDER BY sa.views DESC
      LIMIT 5
    `;

    // Active campaigns with expiry dates
    const activeCampaigns = await sql`
      SELECT
        c.*, a.organization_name AS advertiser_name,
        COUNT(sa.id)::int AS article_count
      FROM campaigns c
      LEFT JOIN advertisers a ON c.advertiser_id = a.id
      LEFT JOIN sponsored_articles sa ON sa.campaign_id = c.id
      WHERE c.status = 'ACTIVE'
      GROUP BY c.id, a.organization_name
      ORDER BY c.end_date ASC
    `;

    return NextResponse.json({
      success: true,
      kpis,
      topArticles,
      activeCampaigns,
    });
  } catch (error: any) {
    console.error('Error in admin sponsored analytics:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
