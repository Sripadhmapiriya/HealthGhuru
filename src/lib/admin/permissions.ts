import 'server-only';
import type { Session } from 'next-auth';

export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === 'admin';
}

export function canChangeUserRole(session: Session | null): boolean {
  return isAdmin(session);
}

export function canOverridePlan(session: Session | null): boolean {
  return isAdmin(session);
}

export function canManageArticles(session: Session | null): boolean {
  return isAdmin(session);
}

export function canViewAuditLog(session: Session | null): boolean {
  return isAdmin(session);
}
