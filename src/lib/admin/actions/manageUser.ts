'use server';

import { requireAdmin } from '@/lib/auth/session';
import { canChangeUserRole } from '@/lib/admin/permissions';
import { sql } from '@/lib/db';
import { writeAuditLog } from './auditLog';
import { z } from 'zod';

const manageUserSchema = z.object({
  action: z.enum(['suspend', 'activate', 'delete']),
  userId: z.string().uuid(),
});

export async function manageUser(input: z.infer<typeof manageUserSchema>) {
  const session = await requireAdmin();
  if (!canChangeUserRole(session)) {
    throw new Error('Forbidden');
  }

  const { action, userId } = manageUserSchema.parse(input);

  // Prevent self-deletion/suspension
  if (userId === session.user.id) {
    throw new Error('You cannot modify your own account status.');
  }

  // Ensure the target exists
  const targetUsers = await sql`SELECT role FROM users WHERE id = ${userId}::uuid`;
  const target = targetUsers[0];
  if (!target) throw new Error('User not found');

  if (action === 'delete') {
    // Delete audit logs first to prevent foreign key constraint violation (NO ACTION)
    await sql`DELETE FROM admin_audit_log WHERE admin_user_id = ${userId}::uuid`;
    
    await sql`DELETE FROM users WHERE id = ${userId}::uuid`;
    
    await writeAuditLog({
      adminUserId: session.user.id,
      actionType: 'user_delete',
      targetTable: 'users',
      targetId: userId,
      beforeValue: { role: target.role }
    });

    return { success: true };
  }

  // For suspend/activate, we lazily ensure the status column exists 
  // (if it doesn't already, this adds it gracefully).
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'`;
  } catch {
    // Ignore error if it somehow fails (e.g., lack of permissions to alter table)
    // but the column might already exist.
  }

  const newStatus = action === 'suspend' ? 'suspended' : 'active';

  await sql`UPDATE users SET status = ${newStatus} WHERE id = ${userId}::uuid`;

  await writeAuditLog({
    adminUserId: session.user.id,
    actionType: `user_${action}`,
    targetTable: 'users',
    targetId: userId,
    afterValue: { status: newStatus }
  });

  return { success: true };
}
