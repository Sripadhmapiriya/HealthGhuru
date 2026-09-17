/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/sponsored-articles
 * Fetch all sponsored articles with joins for Admin CMS
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const sponsor_id = searchParams.get('sponsor_id');
    const q = searchParams.get('q');

    const articles = await sql`
      SELECT
        sa.*,
        s.name AS sponsor_name,
        s.type AS sponsor_type,
        s.logo_url AS sponsor_logo_url,
        c.name AS campaign_name,
        c.status AS campaign_status,
        c.end_date AS campaign_end_date,
        a.organization_name AS advertiser_name
      FROM sponsored_articles sa
      LEFT JOIN sponsors s ON sa.sponsor_id = s.id
      LEFT JOIN campaigns c ON sa.campaign_id = c.id
      LEFT JOIN advertisers a ON sa.advertiser_id = a.id
      WHERE (${!status || status === 'all'} OR sa.status = ${status || ''})
        AND (${!category || category === 'all'} OR LOWER(sa.category) = LOWER(${category || ''}))
        AND (${!sponsor_id || sponsor_id === 'all'} OR sa.sponsor_id = ${sponsor_id || null}::uuid)
        AND (
          ${!q || q.trim() === ''} OR
          sa.title ILIKE ${'%' + (q || '').trim() + '%'} OR
          sa.slug ILIKE ${'%' + (q || '').trim() + '%'} OR
          s.name ILIKE ${'%' + (q || '').trim() + '%'}
        )
      ORDER BY sa.created_at DESC
    `;

    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    console.error('Error in GET /api/admin/sponsored-articles:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/sponsored-articles
 * Create new sponsored article
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      sponsor_id,
      campaign_id,
      category = 'General Health',
      tags = [],
      author_name = 'HealthGhuru Partner Content Team',
      author_title,
      medical_reviewer_name,
      medical_reviewer_credentials,
      requires_medical_review = true,
      medical_claim_flags = [],
      status = 'draft',
      review_status = 'pending',
      is_featured = false,
      is_active = true,
      sponsored_label = 'SPONSORED',
      content_type = 'sponsored_article',
      cta_text = 'Read Article →',
      cta_url,
      published_at,
      scheduled_at,
      expires_at,
      reading_time = 5,
      seo_title,
      seo_description,
      rights_confirmed = 'CONFIRMED',
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: 'Title and Slug are required fields' },
        { status: 400 }
      );
    }

    // Auto-fetch advertiser_id from sponsor if not provided
    let advertiser_id = body.advertiser_id;
    if (!advertiser_id && sponsor_id) {
      const [sp] = await sql`SELECT advertiser_id FROM sponsors WHERE id = ${sponsor_id}::uuid`;
      if (sp) advertiser_id = sp.advertiser_id;
    }

    const [newArticle] = await sql`
      INSERT INTO sponsored_articles (
        title, slug, excerpt, content, featured_image,
        sponsor_id, advertiser_id, campaign_id,
        category, tags,
        author_name, author_title,
        medical_reviewer_name, medical_reviewer_credentials,
        requires_medical_review, medical_claim_flags,
        status, review_status,
        is_featured, is_active,
        sponsored_label, content_type,
        cta_text, cta_url,
        published_at, scheduled_at, expires_at,
        reading_time, seo_title, seo_description,
        rights_confirmed
      ) VALUES (
        ${title}, ${slug}, ${excerpt || ''}, ${content || ''}, ${featured_image || ''},
        ${sponsor_id ? sql`${sponsor_id}::uuid` : null},
        ${advertiser_id ? sql`${advertiser_id}::uuid` : null},
        ${campaign_id ? sql`${campaign_id}::uuid` : null},
        ${category}, ${tags},
        ${author_name}, ${author_title || null},
        ${medical_reviewer_name || null}, ${medical_reviewer_credentials || null},
        ${requires_medical_review}, ${medical_claim_flags},
        ${status}, ${review_status},
        ${is_featured}, ${is_active},
        ${sponsored_label}, ${content_type},
        ${cta_text}, ${cta_url || null},
        ${published_at ? new Date(published_at) : (status === 'published' ? new Date() : null)},
        ${scheduled_at ? new Date(scheduled_at) : null},
        ${expires_at ? new Date(expires_at) : null},
        ${reading_time}, ${seo_title || title}, ${seo_description || excerpt || null},
        ${rights_confirmed}
      )
      RETURNING *
    `;

    // Audit log
    await sql`
      INSERT INTO sponsored_article_audit_logs (article_id, action, old_value, new_value)
      VALUES (${newArticle.id}::uuid, 'CREATE', null, ${JSON.stringify({ title, status })})
    `;

    try {
      revalidatePath('/sponsored-articles');
      revalidatePath('/admin/sponsored-articles');
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, article: newArticle });
  } catch (error: any) {
    console.error('Error creating sponsored article:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
