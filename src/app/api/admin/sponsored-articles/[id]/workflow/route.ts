/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, scheduled_at, reviewer_notes } = body;

    const [article] = await sql`
      SELECT * FROM sponsored_articles WHERE id = ${id}::uuid
    `;

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    let newStatus = article.status;
    let newReviewStatus = article.review_status;
    let publishedAt = article.published_at;
    let scheduledAt = article.scheduled_at;
    let isActive = article.is_active;

    switch (action) {
      case 'submit':
        newStatus = 'editorial_review';
        newReviewStatus = 'in_review';
        break;

      case 'editorial_approve':
        if (article.requires_medical_review) {
          newStatus = 'medical_review';
          newReviewStatus = 'in_review';
        } else {
          newStatus = 'approved';
          newReviewStatus = 'approved';
        }
        break;

      case 'medical_approve':
        newStatus = 'approved';
        newReviewStatus = 'approved';
        break;

      case 'publish':
        // Strict healthcare editorial safety: cannot bypass medical review if required
        if (article.requires_medical_review && article.review_status !== 'approved') {
          return NextResponse.json(
            {
              success: false,
              error:
                'Medical review is required before publication. A certified medical reviewer must approve medical claims.',
            },
            { status: 400 }
          );
        }
        newStatus = 'published';
        newReviewStatus = 'approved';
        publishedAt = new Date();
        isActive = true;
        break;

      case 'schedule':
        if (article.requires_medical_review && article.review_status !== 'approved') {
          return NextResponse.json(
            { success: false, error: 'Cannot schedule article before medical review approval.' },
            { status: 400 }
          );
        }
        newStatus = 'scheduled';
        scheduledAt = scheduled_at ? new Date(scheduled_at) : new Date();
        isActive = true;
        break;

      case 'unpublish':
        newStatus = 'draft';
        isActive = false;
        break;

      case 'expire':
        newStatus = 'expired';
        isActive = false;
        break;

      case 'archive':
        newStatus = 'archived';
        isActive = false;
        break;

      default:
        return NextResponse.json({ success: false, error: `Invalid workflow action: ${action}` }, { status: 400 });
    }

    const [updated] = await sql`
      UPDATE sponsored_articles
      SET
        status = ${newStatus},
        review_status = ${newReviewStatus},
        published_at = ${publishedAt ? new Date(publishedAt) : null},
        scheduled_at = ${scheduledAt ? new Date(scheduledAt) : null},
        is_active = ${isActive},
        updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING *
    `;

    // Audit log
    await sql`
      INSERT INTO sponsored_article_audit_logs (article_id, action, old_value, new_value)
      VALUES (
        ${id}::uuid,
        ${'WORKFLOW_' + action.toUpperCase()},
        ${JSON.stringify({ status: article.status, review_status: article.review_status })},
        ${JSON.stringify({ status: newStatus, review_status: newReviewStatus, notes: reviewer_notes || null })}
      )
    `;

    // Real-time synchronization: Invalidate public and admin caches
    try {
      revalidatePath('/sponsored-articles');
      if (updated.slug) {
        revalidatePath(`/sponsored-articles/${updated.slug}`);
      }
      revalidatePath('/admin/sponsored-articles');
      revalidatePath('/admin/campaigns');
    } catch (revalErr) {
      console.warn('Revalidation warning in workflow route:', revalErr);
    }

    return NextResponse.json({ success: true, article: updated });
  } catch (error: any) {
    console.error('Error in workflow transition:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
