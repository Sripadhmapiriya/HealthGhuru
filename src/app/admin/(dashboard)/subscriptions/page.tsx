import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { SubscriptionPlansManager } from './SubscriptionPlansManager';
import { PlanOverrideClient } from './PlanOverrideClient';
import { DEFAULT_SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/lib/types/subscription-plan';

export const dynamic = 'force-dynamic';

export default async function AdminSubscriptionsPage() {
  await requireAdmin();

  // 1. Ensure table exists and default plans are seeded if empty
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

  const existingCount = await sql`SELECT count(*)::int as count FROM subscription_plans`;
  if (existingCount[0]?.count === 0) {
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

  // 2. Fetch plans & users in parallel
  const [plansRows, users] = await Promise.all([
    sql`
      SELECT id, name, price::float, currency, duration_label, duration_months, is_recommended, benefits, display_order, is_active
      FROM subscription_plans
      WHERE is_active = TRUE
      ORDER BY display_order ASC, price ASC
    `,
    sql`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        p.tier, 
        p.records_limit, 
        p.active_goals_limit, 
        p.family_members_limit
      FROM users u
      LEFT JOIN user_plans p ON p.user_id = u.id
      ORDER BY u.name ASC
      LIMIT 100
    `,
  ]);

  const initialPlans: SubscriptionPlan[] = plansRows.map((r: any) => ({
    ...r,
    benefits: Array.isArray(r.benefits) ? r.benefits : [],
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300 pb-16">
      {/* 1. Subscription Plans Manager (Grid & Create Form) */}
      <SubscriptionPlansManager initialPlans={initialPlans} />

      {/* 2. User Manual Plan Override Section */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div>
          <h3 className="font-heading font-extrabold text-xl text-dark">
            User Account Overrides
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Manually override subscription tiers and limits for individual user accounts.
          </p>
        </div>
        <PlanOverrideClient users={users} />
      </div>
    </div>
  );
}
