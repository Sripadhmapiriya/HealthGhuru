import { requireAdmin } from '@/lib/auth/session';
import { ReactNode } from 'react';
import { signOut } from '@/lib/auth/auth.config';
import { AdminLayoutClient } from './AdminLayoutClient';

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  // Server-side admin verification
  await requireAdmin();

  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/admin/login' });
  }

  return (
    <AdminLayoutClient signOutAction={handleSignOut}>
      {children}
    </AdminLayoutClient>
  );
}
