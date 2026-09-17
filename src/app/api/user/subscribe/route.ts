import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth.config';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await sql`
      SELECT tier, ads_enabled, records_limit, active_goals_limit, family_members_limit, ocr_enabled, data_export_enabled
      FROM user_plans
      WHERE user_id = ${session.user.id}::uuid
    `;

    const plan = plans[0] || { tier: 'free', ads_enabled: true };
    const isSubscribed = plan.tier !== 'free' && plan.ads_enabled === false;

    return NextResponse.json({
      success: true,
      tier: plan.tier || 'free',
      ads_enabled: plan.ads_enabled ?? true,
      is_subscribed: isSubscribed,
      plan,
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

    const targetTier = (planId === 'annual' || planId === 'premium' || planId === 'pro')
      ? planId
      : (planId === 'free' ? 'free' : 'premium');

    const adsEnabled = targetTier === 'free';
    const isSubscribed = !adsEnabled;

    const recordsLimit = targetTier === 'free' ? 10 : 100;
    const activeGoalsLimit = targetTier === 'free' ? 3 : 10;
    const familyMembersLimit = targetTier === 'free' ? 0 : 5;

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
