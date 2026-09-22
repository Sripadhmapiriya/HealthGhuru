/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        razorpay_enabled,
        upi_qr_enabled,
        business_upi_id,
        razorpay_key_id,
        gst_rate
      FROM payment_settings
      WHERE id = 'default'
      LIMIT 1
    `;

    if (rows.length > 0) {
      return NextResponse.json({
        success: true,
        settings: {
          razorpay_enabled: Boolean(rows[0].razorpay_enabled),
          upi_qr_enabled: Boolean(rows[0].upi_qr_enabled),
          business_upi_id: rows[0].business_upi_id || 'manishmadhava91@okicici',
          razorpay_key_id: rows[0].razorpay_key_id || '',
          gst_rate: Number(rows[0].gst_rate || 18),
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        razorpay_enabled: false,
        upi_qr_enabled: true,
        business_upi_id: 'manishmadhava91@okicici',
        razorpay_key_id: '',
        gst_rate: 18,
      },
    });
  } catch (error: any) {
    console.error('Error fetching public payment settings:', error);
    return NextResponse.json({
      success: true,
      settings: {
        razorpay_enabled: false,
        upi_qr_enabled: true,
        business_upi_id: 'manishmadhava91@okicici',
        razorpay_key_id: '',
        gst_rate: 18,
      },
    });
  }
}
