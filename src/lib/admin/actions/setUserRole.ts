'use server';

import { requireAdmin } from '@/lib/auth/session';
import { canChangeUserRole } from '@/lib/admin/permissions';
import { sql } from '@/lib/db';
import { writeAuditLog } from './auditLog';
import { z } from 'zod';

const setUserRoleSchema = z.object({
  targetUserId: z.string().uuid(),
  newRole: z.enum(['user', 'admin']),
});

export async function setUserRole(input: z.infer<typeof setUserRoleSchema>) {
  // Layer: re-verify the caller server-side
  const session = await requireAdmin();
  if (!canChangeUserRole(session)) {
    throw new Error('Forbidden');
  }

  const { targetUserId, newRole } = setUserRoleSchema.parse(input);

  const targetUsers = await sql`SELECT role FROM users WHERE id = ${targetUserId}::uuid`;
  const target = targetUsers[0];
  if (!target) throw new Error('User not found');

  const beforeRole = target.role;

  await sql`UPDATE users SET role = ${newRole} WHERE id = ${targetUserId}::uuid`;

  await writeAuditLog({
    adminUserId: session.user.id,
    actionType: 'role_change',
    targetTable: 'users',
    targetId: targetUserId,
    beforeValue: { role: beforeRole },
    afterValue: { role: newRole },
  });

  return { success: true };
}
