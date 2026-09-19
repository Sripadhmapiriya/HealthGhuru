/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db';
import {
  SponsoredArticleFilterParams,
  SponsoredArticleWithSponsor,
  SponsoredKPIStats,
} from '@/lib/types/sponsored';

/**
 * Fetch paginated sponsored articles for the public portal
 */
export async function getSponsoredArticles(params: SponsoredArticleFilterParams = {}) {
  const {
    category,
    sponsor_type,
    q,
    sort = 'latest',
    page = 1,
    limit = 9,
  } = params;

  const offset = Math.max(0, (page - 1) * limit);

  // We build a safe parameterised query using tagged templates and fragments
  // In Neon, we can fetch all published active articles and filter or query directly
  const rows = await sql`
    SELECT
      sa.*,
      s.name AS sponsor_name,
      s.type AS sponsor_type,
      s.logo_url AS sponsor_logo_url,
      s.city AS sponsor_city,
      s.specializations AS sponsor_specializations,
      s.verified AS sponsor_verified,
      s.website AS sponsor_website,
      c.name AS campaign_name,
      c.status AS campaign_status,
      a.organization_name AS advertiser_name
    FROM sponsored_articles sa
    LEFT JOIN sponsors s ON sa.sponsor_id = s.id
    LEFT JOIN campaigns c ON sa.campaign_id = c.id
    LEFT JOIN advertisers a ON sa.advertiser_id = a.id
    WHERE sa.status = 'published'
      AND sa.is_active = TRUE
      AND (sa.published_at IS NULL OR sa.published_at <= NOW())
      AND (sa.expires_at IS NULL OR sa.expires_at >= NOW())
      AND (${!category || category === 'All'} OR LOWER(sa.category) = LOWER(${category || ''}))
      AND (${!sponsor_type || sponsor_type === 'All'} OR UPPER(s.type::text) = UPPER(${sponsor_type || ''}))
      AND (
        ${!q || q.trim() === ''} OR
        sa.title ILIKE ${'%' + (q || '').trim() + '%'} OR
        sa.excerpt ILIKE ${'%' + (q || '').trim() + '%'} OR
        s.name ILIKE ${'%' + (q || '').trim() + '%'}
      )
    ORDER BY
      CASE WHEN ${sort === 'featured'} THEN sa.is_featured END DESC,
      CASE WHEN ${sort === 'most_read'} THEN sa.views END DESC,
      sa.published_at DESC NULLS LAST,
      sa.created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  // Count total matching
  const countRes = await sql`
    SELECT COUNT(*)::int AS total
    FROM sponsored_articles sa
    LEFT JOIN sponsors s ON sa.sponsor_id = s.id
    WHERE sa.status = 'published'
      AND sa.is_active = TRUE
      AND (sa.published_at IS NULL OR sa.published_at <= NOW())
      AND (sa.expires_at IS NULL OR sa.expires_at >= NOW())
      AND (${!category || category === 'All'} OR LOWER(sa.category) = LOWER(${category || ''}))
      AND (${!sponsor_type || sponsor_type === 'All'} OR UPPER(s.type::text) = UPPER(${sponsor_type || ''}))
      AND (
        ${!q || q.trim() === ''} OR
        sa.title ILIKE ${'%' + (q || '').trim() + '%'} OR
        sa.excerpt ILIKE ${'%' + (q || '').trim() + '%'} OR
        s.name ILIKE ${'%' + (q || '').trim() + '%'}
      )
  `;

  const total = countRes[0]?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    articles: rows as SponsoredArticleWithSponsor[],
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetch a single sponsored article by slug with full sponsor & campaign joins
 */
export async function getSponsoredArticleBySlug(slug: string): Promise<SponsoredArticleWithSponsor | null> {
  const rows = await sql`
    SELECT
      sa.*,
      s.name AS sponsor_name,
      s.type AS sponsor_type,
      s.logo_url AS sponsor_logo_url,
      s.cover_image_url AS sponsor_cover_url,
      s.description AS sponsor_description,
      s.city AS sponsor_city,
      s.state AS sponsor_state,
      s.country AS sponsor_country,
      s.specializations AS sponsor_specializations,
      s.verified AS sponsor_verified,
      s.website AS sponsor_website,
      s.email AS sponsor_email,
      s.phone AS sponsor_phone,
      c.name AS campaign_name,
      c.status AS campaign_status,
      a.organization_name AS advertiser_name
    FROM sponsored_articles sa
    LEFT JOIN sponsors s ON sa.sponsor_id = s.id
    LEFT JOIN campaigns c ON sa.campaign_id = c.id
    LEFT JOIN advertisers a ON sa.advertiser_id = a.id
    WHERE sa.slug = ${slug}
    LIMIT 1
  `;

  if (!rows || rows.length === 0) return null;
  return rows[0] as SponsoredArticleWithSponsor;
}

/**
 * Fetch the primary featured sponsored article
 */
export async function getFeaturedSponsoredArticle(): Promise<SponsoredArticleWithSponsor | null> {
  const rows = await sql`
    SELECT
      sa.*,
      s.name AS sponsor_name,
      s.type AS sponsor_type,
      s.logo_url AS sponsor_logo_url,
      s.city AS sponsor_city,
      s.specializations AS sponsor_specializations,
      s.verified AS sponsor_verified,
      s.website AS sponsor_website
    FROM sponsored_articles sa
    LEFT JOIN sponsors s ON sa.sponsor_id = s.id
    WHERE sa.status = 'published'
      AND sa.is_active = TRUE
      AND (sa.published_at IS NULL OR sa.published_at <= NOW())
      AND (sa.expires_at IS NULL OR sa.expires_at >= NOW())
    ORDER BY sa.is_featured DESC, sa.published_at DESC NULLS LAST
    LIMIT 1
  `;

  if (!rows || rows.length === 0) return null;
  return rows[0] as SponsoredArticleWithSponsor;
}

/**
 * Fetch related sponsored articles (excluding current article)
 */
export async function getRelatedSponsoredArticles(
  category: string,
  excludeId: string,
  limit = 3
): Promise<SponsoredArticleWithSponsor[]> {
  const rows = await sql`
    SELECT
      sa.*,
      s.name AS sponsor_name,
      s.type AS sponsor_type,
      s.logo_url AS sponsor_logo_url,
      s.city AS sponsor_city,
      s.verified AS sponsor_verified
    FROM sponsored_articles sa
    LEFT JOIN sponsors s ON sa.sponsor_id = s.id
    WHERE sa.status = 'published'
      AND sa.is_active = TRUE
      AND sa.id != ${excludeId}::uuid
      AND (sa.published_at IS NULL OR sa.published_at <= NOW())
    ORDER BY
      CASE WHEN LOWER(sa.category) = LOWER(${category}) THEN 0 ELSE 1 END,
      sa.published_at DESC
    LIMIT ${limit}
  `;

  return rows as SponsoredArticleWithSponsor[];
}

/**
 * Fetch related HealthGhuru independent editorial stories for sidebar or related section
 */
export async function getEditorialHealthArticles(category?: string, limit = 5) {
  try {
    const rows = await sql`
      SELECT
        id, title, slug, excerpt, image_url as featured_image, category,
        reading_time, published_at, view_count as views_count
      FROM content_items
      WHERE status = 'published'
        AND deleted_at IS NULL
        AND (${!category} OR LOWER(category) = LOWER(${category || ''}))
      ORDER BY published_at DESC NULLS LAST
      LIMIT ${limit}
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching editorial items from content_items:', error);
    return [];
  }
}

/**
 * Fetch editorial Trending items (01 to 05)
 */
export async function getTrendingHealthEditorial(limit = 5) {
  try {
    const rows = await sql`
      SELECT
        id, title, slug, category, published_at, view_count as views_count
      FROM content_items
      WHERE status = 'published'
        AND deleted_at IS NULL
      ORDER BY is_trending DESC, view_count DESC, published_at DESC
      LIMIT ${limit}
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching trending editorial items:', error);
    return [];
  }
}

/**
 * Record analytics event (view, click, cta_click, share)
 */
export async function recordSponsoredEvent(
  articleId: string,
  eventType: 'SPONSORED_VIEW' | 'SPONSORED_CLICK' | 'SPONSOR_PROFILE_VIEW' | 'CTA_CLICK' | 'SHARE',
  meta: { campaignId?: string; sponsorId?: string; userSession?: string; destination?: string } = {}
) {
  try {
    // 1. Increment aggregate counter on sponsored_articles
    if (eventType === 'SPONSORED_VIEW') {
      await sql`UPDATE sponsored_articles SET views = views + 1 WHERE id = ${articleId}::uuid`;
    } else if (eventType === 'SPONSORED_CLICK') {
      await sql`UPDATE sponsored_articles SET clicks = clicks + 1 WHERE id = ${articleId}::uuid`;
    } else if (eventType === 'CTA_CLICK') {
      await sql`UPDATE sponsored_articles SET cta_clicks = cta_clicks + 1 WHERE id = ${articleId}::uuid`;
    } else if (eventType === 'SHARE') {
      await sql`UPDATE sponsored_articles SET shares = shares + 1 WHERE id = ${articleId}::uuid`;
    }

    // 2. Insert raw analytics row
    await sql`
      INSERT INTO sponsored_article_analytics (
        article_id, campaign_id, sponsor_id, event_type, user_session, destination
      ) VALUES (
        ${articleId}::uuid,
        ${meta.campaignId ? sql`${meta.campaignId}::uuid` : null},
        ${meta.sponsorId ? sql`${meta.sponsorId}::uuid` : null},
        ${eventType},
        ${meta.userSession || null},
        ${meta.destination || null}
      )
    `;
  } catch (err) {
    console.error('Failed to record sponsored event:', err);
  }
}

/**
 * Fetch Admin Sponsored CMS KPI Stats
 */
export async function getAdminSponsoredKPIs(): Promise<SponsoredKPIStats> {
  const [articleCount] = await sql`SELECT COUNT(*)::int AS count FROM sponsored_articles`;
  const [activeCampCount] = await sql`SELECT COUNT(*)::int AS count FROM campaigns WHERE status = 'ACTIVE'`;
  const [pendingRev] = await sql`
    SELECT COUNT(*)::int AS count
    FROM sponsored_articles
    WHERE status IN ('submitted', 'editorial_review')
  `;
  const [medRev] = await sql`
    SELECT COUNT(*)::int AS count
    FROM sponsored_articles
    WHERE status = 'medical_review'
  `;
  const [totals] = await sql`
    SELECT
      COALESCE(SUM(views), 0)::int AS total_views,
      COALESCE(SUM(clicks), 0)::int AS total_clicks,
      COALESCE(SUM(cta_clicks), 0)::int AS total_cta_clicks
    FROM sponsored_articles
  `;
  const [expiring] = await sql`
    SELECT COUNT(*)::int AS count
    FROM campaigns
    WHERE status = 'ACTIVE'
      AND end_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
  `;

  const totalViews = totals?.total_views || 0;
  const totalClicks = totals?.total_clicks || 0;
  const avgCtr = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(2)) : 0;

  return {
    totalArticles: articleCount?.count || 0,
    activeCampaigns: activeCampCount?.count || 0,
    pendingReviews: pendingRev?.count || 0,
    medicalReviews: medRev?.count || 0,
    totalViews,
    totalClicks,
    totalCtaClicks: totals?.total_cta_clicks || 0,
    avgCtr,
    expiringSoonCount: expiring?.count || 0,
  };
}
