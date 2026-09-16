/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { sql } from '@/lib/db';

interface AuditLogInput {
  adminUserId: string;
  actionType: string;
  targetTable: string;
  targetId?: string;
  beforeValue?: any;
  afterValue?: any;
}

export async function writeAuditLog({
  adminUserId,
  actionType,
  targetTable,
  targetId,
  beforeValue,
  afterValue
}: AuditLogInput) {
  try {
    await sql`
      INSERT INTO admin_audit_log (
        admin_user_id, 
        action_type, 
        target_table, 
        target_id, 
        before_value, 
        after_value
      ) VALUES (
        ${adminUserId}::uuid, 
        ${actionType}, 
        ${targetTable}, 
        ${targetId || null}, 
        ${beforeValue ? JSON.stringify(beforeValue) : null}::jsonb, 
        ${afterValue ? JSON.stringify(afterValue) : null}::jsonb
      )
    `;
  } catch (error) {
    console.error('Failed to write audit log:', error);
    throw error;
  }
}
