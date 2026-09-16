'use server';

import { requireAdmin } from '@/lib/auth/session';
import { canOverridePlan } from '@/lib/admin/permissions';
import { sql } from '@/lib/db';
import { writeAuditLog } from './auditLog';
import { z } from 'zod';

const planOverrideSchema = z.object({
  targetUserId: z.string().uuid(),
  tier: z.enum(['free', 'pro']),
  recordsLimit: z.number().int().min(0),
  activeGoalsLimit: z.number().int().min(0),
  familyMembersLimit: z.number().int().min(0),
  reason: z.string().min(5, 'Reason is required and must be at least 5 characters'),
});

export async function overrideUserPlan(input: z.infer<typeof planOverrideSchema>) {
  const session = await requireAdmin();
  if (!canOverridePlan(session)) {
    throw new Error('Forbidden');
  }

  const validated = planOverrideSchema.parse(input);

  const existingPlans = await sql`SELECT * FROM user_plans WHERE user_id = ${validated.targetUserId}::uuid`;
  const beforePlan = existingPlans[0] || null;

  if (beforePlan) {
    await sql`
      UPDATE user_plans 
      SET 
        tier = ${validated.tier}, 
        records_limit = ${validated.recordsLimit},
        active_goals_limit = ${validated.activeGoalsLimit},
        family_members_limit = ${validated.familyMembersLimit}
      WHERE user_id = ${validated.targetUserId}::uuid
    `;
  } else {
    await sql`
      INSERT INTO user_plans (user_id, tier, records_limit, active_goals_limit, family_members_limit)
      VALUES (${validated.targetUserId}::uuid, ${validated.tier}, ${validated.recordsLimit}, ${validated.activeGoalsLimit}, ${validated.familyMembersLimit})
    `;
  }

  const afterPlan = {
    tier: validated.tier,
    records_limit: validated.recordsLimit,
    active_goals_limit: validated.activeGoalsLimit,
    family_members_limit: validated.familyMembersLimit
  };

  // Log the override
  await writeAuditLog({
    adminUserId: session.user.id,
    actionType: 'plan_override',
    targetTable: 'user_plans',
    targetId: validated.targetUserId,
    beforeValue: beforePlan,
    afterValue: { ...afterPlan, reason: validated.reason },
  });

  return { success: true };
}
