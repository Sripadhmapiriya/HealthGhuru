/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const rows = await sql`
      SELECT razorpay_enabled, razorpay_key_id, razorpay_key_secret
      FROM payment_settings
      WHERE id = 'default'
      LIMIT 1
    `;

    const settings = rows[0];
    if (!settings || !settings.razorpay_enabled || !settings.razorpay_key_id) {
      return NextResponse.json(
        { success: false, error: 'Razorpay gateway is currently disabled or unconfigured in Admin.' },
        { status: 400 }
      );
    }

    // Call Razorpay API to generate order
    const authHeader = 'Basic ' + Buffer.from(`${settings.razorpay_key_id}:${settings.razorpay_key_secret}`).toString('base64');
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount) * 100), // in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      return NextResponse.json(
        { success: false, error: orderData.error?.description || 'Failed to create Razorpay order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      key_id: settings.razorpay_key_id,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
