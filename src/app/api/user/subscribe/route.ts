import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth.config';
import { sql } from '@/lib/db';

import { DEFAULT_SUBSCRIPTION_PLANS } from '@/lib/types/subscription-plan';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await sql`
      SELECT *
      FROM user_plans
      WHERE user_id = ${session.user.id}::uuid
    `;

    const plan = plans[0] || { tier: 'free', ads_enabled: true };
    const isSubscribed = plan.tier !== 'free' && plan.ads_enabled === false;

    let planDetails: any = DEFAULT_SUBSCRIPTION_PLANS.find(
      (p) => p.id.toLowerCase() === plan.tier?.toLowerCase() || p.name.toLowerCase() === plan.tier?.toLowerCase()
    ) || null;

    try {
      const tableExists = await sql`
        SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_plans'
      `;
      if (tableExists.length > 0) {
        const rows = await sql`
          SELECT id, name, price::float, currency, duration_label, duration_months, is_recommended, benefits, display_order, is_active
          FROM subscription_plans
          WHERE id = ${plan.tier} OR LOWER(name) = LOWER(${plan.tier})
          LIMIT 1
        `;
        if (rows.length > 0) {
          planDetails = {
            ...rows[0],
            benefits: Array.isArray(rows[0].benefits) ? rows[0].benefits : [],
          };
        }
      }
    } catch (dbErr) {
      console.warn('Could not query subscription_plans table:', dbErr);
    }

    return NextResponse.json({
      success: true,
      tier: plan.tier || 'free',
      ads_enabled: plan.ads_enabled ?? true,
      is_subscribed: isSubscribed,
      plan,
      planDetails,
    });
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch subscription' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to activate a subscription.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { planId = 'premium', billingCycle = 'annual', name } = body;

    const targetTier = planId === 'free' ? 'free' : (planId || 'premium');

    const adsEnabled = targetTier === 'free';
    const isSubscribed = !adsEnabled;

    const recordsLimit = targetTier === 'free' ? 10 : 999;
    const activeGoalsLimit = targetTier === 'free' ? 3 : 50;
    const familyMembersLimit = targetTier === 'free' ? 0 : 10;

    // Upsert subscription into PostgreSQL
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
      )
      VALUES (
        ${session.user.id}::uuid,
        ${targetTier},
        0,
        ${recordsLimit},
        ${activeGoalsLimit},
        ${familyMembersLimit},
        ${adsEnabled},
        ${isSubscribed},
        ${isSubscribed}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        tier = ${targetTier},
        ads_enabled = ${adsEnabled},
        records_limit = ${recordsLimit},
        active_goals_limit = ${activeGoalsLimit},
        family_members_limit = ${familyMembersLimit},
        ocr_enabled = ${isSubscribed},
        data_export_enabled = ${isSubscribed};
    `;

    // Optionally update name in users table if provided
    if (name && typeof name === 'string' && name.trim()) {
      try {
        await sql`
          UPDATE users 
          SET name = ${name.trim()}, updated_at = NOW() 
          WHERE id = ${session.user.id}::uuid
        `;
      } catch (nameErr) {
        console.warn('Could not update user name:', nameErr);
      }
    }

    return NextResponse.json({
      success: true,
      tier: targetTier,
      billing_cycle: billingCycle,
      ads_enabled: adsEnabled,
      is_subscribed: isSubscribed,
      message: `Congratulations! Your ${targetTier.toUpperCase()} subscription is active and ad-free!`,
    });
  } catch (error: any) {
    console.error('Error activating subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to activate subscription. Please try again.' },
      { status: 500 }
    );
  }
}
