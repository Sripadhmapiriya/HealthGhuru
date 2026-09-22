/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();

    const rows = await sql`
      SELECT *
      FROM payment_settings
      WHERE id = 'default'
      LIMIT 1
    `;

    const settings = rows.length > 0 ? rows[0] : {
      razorpay_enabled: false,
      upi_qr_enabled: true,
      business_upi_id: 'manishmadhava91@okicici',
      razorpay_key_id: '',
      razorpay_key_secret: '',
      gst_rate: 18,
    };

    return NextResponse.json({
      success: true,
      settings: {
        razorpay_enabled: Boolean(settings.razorpay_enabled),
        upi_qr_enabled: Boolean(settings.upi_qr_enabled),
        business_upi_id: settings.business_upi_id || 'manishmadhava91@okicici',
        razorpay_key_id: settings.razorpay_key_id || '',
        razorpay_key_secret: settings.razorpay_key_secret || '',
        gst_rate: Number(settings.gst_rate || 18),
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin payment settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const {
      razorpay_enabled,
      upi_qr_enabled,
      business_upi_id,
      razorpay_key_id,
      razorpay_key_secret,
      gst_rate,
    } = body;

    const upiId = (business_upi_id || 'manishmadhava91@okicici').trim();
    const gst = isNaN(Number(gst_rate)) ? 18 : Number(gst_rate);

    await sql`
      INSERT INTO payment_settings (
        id,
        razorpay_enabled,
        upi_qr_enabled,
        business_upi_id,
        razorpay_key_id,
        razorpay_key_secret,
        gst_rate,
        updated_at
      ) VALUES (
        'default',
        ${Boolean(razorpay_enabled)},
        ${Boolean(upi_qr_enabled)},
        ${upiId},
        ${razorpay_key_id || ''},
        ${razorpay_key_secret || ''},
        ${gst},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        razorpay_enabled = EXCLUDED.razorpay_enabled,
        upi_qr_enabled = EXCLUDED.upi_qr_enabled,
        business_upi_id = EXCLUDED.business_upi_id,
        razorpay_key_id = EXCLUDED.razorpay_key_id,
        razorpay_key_secret = EXCLUDED.razorpay_key_secret,
        gst_rate = EXCLUDED.gst_rate,
        updated_at = NOW()
    `;

    try {
      revalidatePath('/admin/settings/payment');
      revalidatePath('/sponsored-request');
      revalidatePath('/advertise/create');
      revalidatePath('/subscribe');
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Payment settings saved successfully.',
    });
  } catch (error: any) {
    console.error('Error saving admin payment settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
