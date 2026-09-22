/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sql } from '@/lib/db';
import { sendSubscriptionEmails } from '@/lib/email/mailer';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_type, // 'subscription' | 'sponsorship' | 'advertisement'
      metadata,
    } = body;

    const rows = await sql`
      SELECT razorpay_key_secret
      FROM payment_settings
      WHERE id = 'default'
      LIMIT 1
    `;

    const keySecret = rows[0]?.razorpay_key_secret;
    if (keySecret) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Payment signature is verified. Fulfill based on payment_type
    if (payment_type === 'subscription' && metadata?.userId && metadata?.planId) {
      const durationDays = metadata.billingCycle === 'annual' ? 365 : 30;
      
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS user_subscriptions (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL,
            plan_id VARCHAR(50) NOT NULL,
            status VARCHAR(50) DEFAULT 'active',
            payment_id VARCHAR(255),
            starts_at TIMESTAMP DEFAULT NOW(),
            expires_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `;

        await sql`
          INSERT INTO user_subscriptions (
            user_id, plan_id, status, payment_id, starts_at, expires_at, created_at, updated_at
          ) VALUES (
            ${metadata.userId}::uuid,
            ${metadata.planId},
            'active',
            ${razorpay_payment_id},
            NOW(),
            NOW() + (${durationDays} || ' days')::interval,
            NOW(),
            NOW()
          )
        `;
      } catch (subErr) {
        console.warn('Could not insert user_subscriptions record:', subErr);
      }

      // Upsert user_plans
      try {
        await sql`
          INSERT INTO user_plans (
            user_id,
            tier,
            records_used,
            records_limit,
            active_goals_limit,
            family_members_limit,
            ads_enabled,
            ocr_enabled,
            data_export_enabled
          ) VALUES (
            ${metadata.userId}::uuid,
            ${metadata.planId},
            0,
            999,
            50,
            10,
            false,
            true,
            true
          )
          ON CONFLICT (user_id) DO UPDATE SET
            tier = ${metadata.planId},
            ads_enabled = false,
            ocr_enabled = true,
            data_export_enabled = true;
        `;
      } catch (planErr) {
        console.error('Failed to update user_plans:', planErr);
      }

      // Trigger subscription welcome email in background
      if (metadata?.email) {
        sendSubscriptionEmails({
          email: metadata.email,
          name: metadata.name,
          planId: metadata.planId,
          planName: metadata.planId?.toUpperCase?.() || 'PRO',
          billingCycle: metadata.billingCycle || 'annual',
          amount: metadata.amount,
          paymentId: razorpay_payment_id,
        }).catch((err) => console.error('Error sending subscription confirmation email:', err));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.',
      payment_id: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
