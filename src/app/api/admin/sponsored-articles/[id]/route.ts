import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { sendSponsoredArticleStatusUpdateEmail } from '@/lib/email/mailer';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await sql`
      SELECT
        sa.*,
        s.name AS sponsor_name,
        s.type AS sponsor_type,
        s.logo_url AS sponsor_logo_url,
        c.name AS campaign_name,
        a.organization_name AS advertiser_name
      FROM sponsored_articles sa
      LEFT JOIN sponsors s ON sa.sponsor_id = s.id
      LEFT JOIN campaigns c ON sa.campaign_id = c.id
      LEFT JOIN advertisers a ON sa.advertiser_id = a.id
      WHERE sa.id = ${id}::uuid
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, article: rows[0] });
  } catch (error: any) {
    console.error('Error fetching admin sponsored article:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      sponsor_id,
      campaign_id,
      advertiser_id,
      category,
      tags,
      author_name,
      author_title,
      medical_reviewer_name,
      medical_reviewer_credentials,
      requires_medical_review,
      medical_claim_flags,
      status,
      review_status,
      is_featured,
      is_active,
      sponsored_label,
      content_type,
      cta_text,
      cta_url,
      published_at,
      scheduled_at,
      expires_at,
      reading_time,
      seo_title,
      seo_description,
      rights_confirmed,
    } = body;

    // Fetch existing for audit log
    const existing = await sql`SELECT * FROM sponsored_articles WHERE id = ${id}::uuid`;
    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: 'Sponsored article not found' }, { status: 404 });
    }

    const updated = await sql`
      UPDATE sponsored_articles
      SET
        title = COALESCE(${title}, title),
        slug = COALESCE(${slug}, slug),
        excerpt = ${excerpt !== undefined ? excerpt : sql`excerpt`},
        content = ${content !== undefined ? content : sql`content`},
        featured_image = ${featured_image !== undefined ? featured_image : sql`featured_image`},
        sponsor_id = ${sponsor_id !== undefined ? (sponsor_id ? sql`${sponsor_id}::uuid` : null) : sql`sponsor_id`},
        campaign_id = ${campaign_id !== undefined ? (campaign_id ? sql`${campaign_id}::uuid` : null) : sql`campaign_id`},
        advertiser_id = ${advertiser_id !== undefined ? (advertiser_id ? sql`${advertiser_id}::uuid` : null) : sql`advertiser_id`},
        category = COALESCE(${category}, category),
        tags = ${tags !== undefined ? tags : sql`tags`},
        author_name = COALESCE(${author_name}, author_name),
        author_title = ${author_title !== undefined ? author_title : sql`author_title`},
        company_name = ${body.company_name !== undefined ? body.company_name : sql`company_name`},
        assigned_reporter = ${body.assigned_reporter !== undefined ? body.assigned_reporter : sql`assigned_reporter`},
        package_name = ${body.package_name !== undefined ? body.package_name : sql`package_name`},
        package_price = ${body.package_price !== undefined ? body.package_price : sql`package_price`},
        placement = ${body.placement !== undefined ? body.placement : sql`placement`},
        video_url = ${body.video_url !== undefined ? body.video_url : sql`video_url`},
        medical_reviewer_name = ${medical_reviewer_name !== undefined ? medical_reviewer_name : sql`medical_reviewer_name`},
        medical_reviewer_credentials = ${medical_reviewer_credentials !== undefined ? medical_reviewer_credentials : sql`medical_reviewer_credentials`},
        requires_medical_review = ${requires_medical_review !== undefined ? requires_medical_review : sql`requires_medical_review`},
        medical_claim_flags = ${medical_claim_flags !== undefined ? medical_claim_flags : sql`medical_claim_flags`},
        status = COALESCE(${status}, status),
        review_status = COALESCE(${review_status}, review_status),
        is_featured = ${is_featured !== undefined ? is_featured : sql`is_featured`},
        is_active = ${is_active !== undefined ? is_active : sql`is_active`},
        sponsored_label = COALESCE(${sponsored_label}, sponsored_label),
        content_type = COALESCE(${content_type}, content_type),
        cta_text = COALESCE(${cta_text}, cta_text),
        cta_url = ${cta_url !== undefined ? cta_url : sql`cta_url`},
        published_at = ${published_at !== undefined ? (published_at ? new Date(published_at) : null) : sql`published_at`},
        scheduled_at = ${scheduled_at !== undefined ? (scheduled_at ? new Date(scheduled_at) : null) : sql`scheduled_at`},
        expires_at = ${expires_at !== undefined ? (expires_at ? new Date(expires_at) : null) : sql`expires_at`},
        reading_time = COALESCE(${reading_time}, reading_time),
        seo_title = ${seo_title !== undefined ? seo_title : sql`seo_title`},
        seo_description = ${seo_description !== undefined ? seo_description : sql`seo_description`},
        rights_confirmed = COALESCE(${rights_confirmed}, rights_confirmed),
        version = version + 1,
        updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `;

    // Write audit log
    await sql`
      INSERT INTO sponsored_article_audit_logs (article_id, action, old_value, new_value)
      VALUES (
        ${id}::uuid,
        'UPDATE',
        ${JSON.stringify({ status: existing[0].status, title: existing[0].title })},
        ${JSON.stringify({ status: updated[0].status, title: updated[0].title })}
      )
    `;

    try {
      revalidatePath('/sponsored-articles');
      if (updated[0]?.slug) {
        revalidatePath(`/sponsored-articles/${updated[0].slug}`);
      }
      revalidatePath('/admin/sponsored-articles');
    } catch {
      // ignore
    }

    // Trigger status update email if status was modified
    if (status && status !== existing[0]?.status) {
      try {
        const articleRow = updated[0];
        let recipientEmail = '';
        if (articleRow.campaign_id) {
          const cr = await sql`SELECT contact_email FROM campaign_requests WHERE id = ${articleRow.campaign_id}::uuid LIMIT 1`;
          if (cr.length && cr[0].contact_email) recipientEmail = cr[0].contact_email;
        }
        if (!recipientEmail && articleRow.company_name) {
          const cr = await sql`SELECT contact_email FROM campaign_requests WHERE advertiser_name ILIKE ${articleRow.company_name} OR campaign_title ILIKE ${'%' + articleRow.company_name + '%'} ORDER BY created_at DESC LIMIT 1`;
          if (cr.length && cr[0].contact_email) recipientEmail = cr[0].contact_email;
        }
        if (!recipientEmail && articleRow.sponsor_id) {
          const sp = await sql`SELECT contact_email FROM sponsors WHERE id = ${articleRow.sponsor_id}::uuid LIMIT 1`;
          if (sp.length && sp[0].contact_email) recipientEmail = sp[0].contact_email;
        }

        if (recipientEmail) {
          sendSponsoredArticleStatusUpdateEmail(
            articleRow,
            status,
            body.admin_notes || body.reviewer_notes || undefined,
            recipientEmail
          ).catch((mailErr) => console.error('Error sending sponsored article status email:', mailErr));
        }
      } catch (e) {
        console.warn('Warning sending sponsored article status email:', e);
      }
    }

    return NextResponse.json({ success: true, article: updated[0] });
  } catch (error: any) {
    console.error('Error updating sponsored article:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM sponsored_articles WHERE id = ${id}::uuid`;

    try {
      revalidatePath('/sponsored-articles');
      revalidatePath('/admin/sponsored-articles');
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting sponsored article:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
