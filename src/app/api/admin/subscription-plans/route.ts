import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth/auth.config';
import { DEFAULT_SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/lib/types/subscription-plan';

export const dynamic = 'force-dynamic';

async function ensureTableAndSeed() {
  await sql`
    CREATE TABLE IF NOT EXISTS subscription_plans (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price NUMERIC(10, 2) NOT NULL DEFAULT 0,
      currency VARCHAR(10) NOT NULL DEFAULT 'INR',
      duration_label VARCHAR(100) NOT NULL,
      duration_months INT NOT NULL DEFAULT 1,
      is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
      benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
      display_order INT NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const existing = await sql`SELECT count(*)::int as count FROM subscription_plans`;
  if (existing[0]?.count === 0) {
    for (const plan of DEFAULT_SUBSCRIPTION_PLANS) {
      await sql`
        INSERT INTO subscription_plans (
          id, name, price, currency, duration_label, duration_months, is_recommended, benefits, display_order, is_active
        ) VALUES (
          ${plan.id},
          ${plan.name},
          ${plan.price},
          ${plan.currency},
          ${plan.duration_label},
          ${plan.duration_months},
          ${plan.is_recommended},
          ${JSON.stringify(plan.benefits)}::jsonb,
          ${plan.display_order},
          ${plan.is_active}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }
}

export async function GET() {
  try {
    await ensureTableAndSeed();

    const rows = await sql`
      SELECT id, name, price::float, currency, duration_label, duration_months, is_recommended, benefits, display_order, is_active, created_at, updated_at
      FROM subscription_plans
      WHERE is_active = TRUE
      ORDER BY display_order ASC, price ASC
    `;

    const plans: SubscriptionPlan[] = rows.map((r: any) => ({
      ...r,
      benefits: Array.isArray(r.benefits) ? r.benefits : [],
    }));

    return NextResponse.json({ success: true, plans });
  } catch (error: any) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTableAndSeed();

    const body = await req.json();
    const {
      id: rawId,
      name,
      price,
      currency = 'INR',
      duration_label,
      duration_months,
      is_recommended = false,
      benefits = [],
      display_order,
    } = body;

    if (!name || typeof price !== 'number' || price < 0 || !duration_label) {
      return NextResponse.json(
        { success: false, error: 'Please provide valid plan name, price, and duration label.' },
        { status: 400 }
      );
    }

    const planId = rawId
      ? rawId.trim().toLowerCase()
      : name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    const months = parseInt(duration_months) || 1;
    const order = typeof display_order === 'number' ? display_order : 1;

    // If marked as recommended, optionally unset others
    if (is_recommended) {
      await sql`UPDATE subscription_plans SET is_recommended = FALSE WHERE is_recommended = TRUE`;
    }

    await sql`
      INSERT INTO subscription_plans (
        id, name, price, currency, duration_label, duration_months, is_recommended, benefits, display_order, is_active, updated_at
      ) VALUES (
        ${planId},
        ${name.trim()},
        ${price},
        ${currency},
        ${duration_label.trim()},
        ${months},
        ${Boolean(is_recommended)},
        ${JSON.stringify(benefits)}::jsonb,
        ${order},
        TRUE,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        currency = EXCLUDED.currency,
        duration_label = EXCLUDED.duration_label,
        duration_months = EXCLUDED.duration_months,
        is_recommended = EXCLUDED.is_recommended,
        benefits = EXCLUDED.benefits,
        display_order = EXCLUDED.display_order,
        is_active = TRUE,
        updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({
      success: true,
      message: 'Subscription plan saved successfully',
      planId,
    });
  } catch (error: any) {
    console.error('Error saving subscription plan:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save plan' },
      { status: 500 }
    );
  }
}
