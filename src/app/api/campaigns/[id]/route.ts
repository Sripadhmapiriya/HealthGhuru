import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

// GET — single campaign
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rows = await sql`SELECT * FROM campaign_requests WHERE id = ${params.id}::uuid`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, campaign: rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH — admin updates status / payment_status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status, payment_status, admin_notes } = body;

    const rows = await sql`
      UPDATE campaign_requests SET
        status         = COALESCE(${status ?? null}, status),
        payment_status = COALESCE(${payment_status ?? null}, payment_status),
        admin_notes    = COALESCE(${admin_notes ?? null}, admin_notes),
        updated_at     = CURRENT_TIMESTAMP
      WHERE id = ${params.id}::uuid
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const campaign = rows[0];
    const isNowActive = campaign.status === 'active' || campaign.status === 'approved';

    // If rejected, refund the money to user's wallet
    if (campaign.status === 'rejected') {
      try {
        const refundAmount = parseFloat(campaign.total_amount || '0');
        if (campaign.contact_email && refundAmount > 0) {
          await sql`
            INSERT INTO user_wallets (email, balance, updated_at)
            VALUES (${campaign.contact_email}, ${refundAmount}, CURRENT_TIMESTAMP)
            ON CONFLICT (email)
            DO UPDATE SET balance = user_wallets.balance + ${refundAmount}, updated_at = CURRENT_TIMESTAMP
          `;
        }
      } catch (err) {
        console.error('Wallet refund error:', err);
      }
    }

    // Promote or update in advertisements table
    try {
      const existingAds = await sql`
        SELECT id FROM advertisements WHERE title = ${campaign.campaign_title}
      `;

      if (existingAds.length > 0) {
        await sql`
          UPDATE advertisements
          SET is_active = ${isNowActive},
              status = ${campaign.status},
              payment_status = ${campaign.payment_status},
              updated_at = CURRENT_TIMESTAMP
          WHERE title = ${campaign.campaign_title}
        `;
      } else if (isNowActive) {
        // Insert new active advertisement if not exists
        await sql`
          INSERT INTO advertisements (
            title, placement, image_url, target_url,
            headline, cta_text, category, is_active,
            advertiser_name, advertiser_contact, advertiser_type,
            budget, start_date, end_date, status, payment_status, payment_method, priority
          ) VALUES (
            ${campaign.campaign_title},
            ${campaign.placement},
            ${campaign.banner_image_url ?? null},
            ${campaign.target_url},
            ${campaign.campaign_title},
            'Book Appointment',
            'All',
            TRUE,
            ${campaign.advertiser_name},
            ${campaign.contact_name + ' (' + campaign.contact_email + ')'},
            ${campaign.advertiser_type ?? 'hospital'},
            ${campaign.total_amount ?? 0},
            ${campaign.start_date},
            ${campaign.end_date},
            'active',
            ${campaign.payment_status},
            ${campaign.payment_method ?? 'upi'},
            'Medium'
          )
        `;
      }
    } catch (adErr) {
      console.error('Advertisement sync error:', adErr);
    }

    // Sync to sponsored_articles table
    try {
      if (isNowActive) {
        await sql`
          UPDATE sponsored_articles
          SET status = 'published',
              is_active = TRUE,
              review_status = 'approved',
              published_at = COALESCE(published_at, NOW()),
              updated_at = NOW()
          WHERE campaign_id = ${params.id}::uuid
             OR title ILIKE ${'%' + campaign.advertiser_name + '%'}
        `;
      } else if (campaign.status === 'rejected') {
        await sql`
          UPDATE sponsored_articles
          SET status = 'rejected',
              is_active = FALSE,
              updated_at = NOW()
          WHERE campaign_id = ${params.id}::uuid
             OR title ILIKE ${'%' + campaign.advertiser_name + '%'}
        `;
      } else if (campaign.status === 'completed') {
        await sql`
          UPDATE sponsored_articles
          SET status = 'expired',
              is_active = FALSE,
              updated_at = NOW()
          WHERE campaign_id = ${params.id}::uuid
             OR title ILIKE ${'%' + campaign.advertiser_name + '%'}
        `;
      }
    } catch (articleSyncErr) {
      console.error('Warning: could not sync campaign to sponsored_articles:', articleSyncErr);
    }

    // Revalidate public user portal and admin queues
    try {
      revalidatePath('/sponsored-articles');
      revalidatePath('/admin/sponsored-articles');
      revalidatePath('/admin/campaigns');
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, campaign: rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE — admin deletes a campaign request
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await sql`DELETE FROM campaign_requests WHERE id = ${params.id}::uuid`;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
