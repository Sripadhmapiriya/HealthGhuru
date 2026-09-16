import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

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

    const rows = await sql`
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
        'pending', 'pending'
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, campaign: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
