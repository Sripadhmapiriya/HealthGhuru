import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { DEFAULT_SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/lib/types/subscription-plan';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if table exists
    const tableExists = await sql`
      SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_plans'
    `;

    if (tableExists.length === 0) {
      return NextResponse.json({ success: true, plans: DEFAULT_SUBSCRIPTION_PLANS, debug: 'tableExists is 0' });
    }

    const rows = await sql`
      SELECT id, name, price::float, currency, duration_label, duration_months, is_recommended, benefits, display_order, is_active
      FROM subscription_plans
      WHERE is_active = TRUE
      ORDER BY display_order ASC, price ASC
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: true, plans: DEFAULT_SUBSCRIPTION_PLANS, debug: 'rows is 0' });
    }

    const plans: SubscriptionPlan[] = rows.map((r: any) => ({
      ...r,
      benefits: Array.isArray(r.benefits) ? r.benefits : [],
    }));

    return NextResponse.json(
      {
        success: true,
        plans,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching public subscription plans:', error);
    return NextResponse.json({ success: true, plans: DEFAULT_SUBSCRIPTION_PLANS });
  }
}
