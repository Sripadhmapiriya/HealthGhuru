import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createAdminNotification } from '@/lib/notifications-server';

// GET — return all campaigns (in a real app filtered by session user; here returning all for demo)
export async function GET() {
  try {
    const rows = await sql`
      SELECT * FROM campaign_requests
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return NextResponse.json({ success: true, campaigns: rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST — submit a new campaign request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      campaign_title, advertiser_name, advertiser_type,
      contact_name, contact_email, contact_phone,
      target_url, placement, duration_plan,
      start_date, end_date, banner_image_url,
      base_price, gst_amount, total_amount, payment_method,
    } = body;

    // Basic validation
    if (!campaign_title || !advertiser_name || !contact_name || !contact_email || !target_url || !placement || !start_date || !end_date) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const contactSummary = `${contact_name} (${contact_email}${contact_phone ? ' / ' + contact_phone : ''})`;

    // 1. Insert into campaign_requests
    const requestRows = await sql`
      INSERT INTO campaign_requests (
        campaign_title, advertiser_name, advertiser_type,
        contact_name, contact_email, contact_phone,
        target_url, placement, duration_plan,
        start_date, end_date, banner_image_url,
        base_price, gst_amount, total_amount, payment_method,
        payment_status, status
      ) VALUES (
        ${campaign_title}, ${advertiser_name}, ${advertiser_type ?? 'hospital'},
        ${contact_name}, ${contact_email}, ${contact_phone ?? null},
        ${target_url}, ${placement}, ${duration_plan ?? 'weekly'},
        ${start_date}, ${end_date}, ${banner_image_url ?? null},
        ${base_price ?? 0}, ${gst_amount ?? 0}, ${total_amount ?? 0}, ${payment_method ?? 'upi'},
        'paid', 'pending'
      )
      RETURNING *
    `;

    // Trigger admin notification for new ad campaign
    try {
      await createAdminNotification(
        `New Ad Campaign: ${campaign_title}`,
        `${advertiser_name} submitted a ${placement} campaign (₹${total_amount}). Pending approval.`,
        '/admin/campaigns',
        'campaign',
        'high',
        'Megaphone'
      );
    } catch (notifErr) {
      console.error('Non-critical notification trigger error:', notifErr);
    }

    // 2. Also insert into advertisements table as pending (is_active = FALSE until admin approves!)
    try {
      await sql`
        INSERT INTO advertisements (
          title,
          placement,
          image_url,
          target_url,
          headline,
          cta_text,
          category,
          is_active,
          advertiser_name,
          advertiser_contact,
          advertiser_type,
          budget,
          start_date,
          end_date,
          status,
          payment_status,
          payment_method,
          priority
        ) VALUES (
          ${campaign_title},
          ${placement},
          ${banner_image_url ?? null},
          ${target_url},
          ${campaign_title},
          'Book Appointment',
          'All',
          FALSE,
          ${advertiser_name},
          ${contactSummary},
          ${advertiser_type ?? 'hospital'},
          ${total_amount ?? 0},
          ${start_date},
          ${end_date},
          'pending',
          'paid',
          ${payment_method ?? 'upi'},
          'Medium'
        )
      `;
    } catch (adSyncError) {
      console.error('Warning: could not sync campaign to advertisements table:', adSyncError);
    }

    return NextResponse.json({ success: true, campaign: requestRows[0] }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
