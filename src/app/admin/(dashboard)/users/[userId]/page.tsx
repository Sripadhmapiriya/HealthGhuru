import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Calendar, Shield, Activity, Target } from 'lucide-react';
import { PillBadge } from '@/components/ui/PillBadge';

export default async function AdminUserProfilePage({ params }: { params: { userId: string } }) {
  await requireAdmin();

  const users = await sql`
    SELECT 
      u.id, u.name, u.email, u.role, COALESCE(u.status, 'active') as status,
      u.dob, u.gender, u.city, u.created_at,
      COALESCE(p.tier, 'free') as plan
    FROM users u
    LEFT JOIN user_plans p ON p.user_id = u.id
    WHERE u.id = ${params.userId}::uuid
  `;

  const user = users[0];
  if (!user) notFound();

  // Fetch some summary stats
  const recordsCount = await sql`SELECT COUNT(*) FROM app_vault_records WHERE user_id = ${params.userId}`;
  const goalsCount = await sql`SELECT COUNT(*) FROM app_vault_goals WHERE user_id = ${params.userId}`;

  const isSuspended = user.status === 'suspended';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Link href="/admin/users" className="text-[#78909C] hover:text-[#1A2E1A] transition-colors flex items-center gap-2 font-medium w-fit">
        <ArrowLeft size={16} /> Back to Users
      </Link>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(46,125,50,0.08)] border border-border p-8 relative overflow-hidden">
        {/* Banner */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary to-accent" />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 bg-[#EBF5EB] rounded-full flex items-center justify-center text-primary shrink-0 border-4 border-white shadow-sm">
              <User size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A2E1A] mb-2">{user.name}</h1>
              <div className="flex flex-wrap gap-2 items-center">
                <PillBadge active={!isSuspended} className={isSuspended ? 'bg-red-100 text-red-800 uppercase text-[10px]' : 'bg-[#EBF5EB] text-[#2E7D32] uppercase text-[10px]'}>
                  {user.status}
                </PillBadge>
                <PillBadge active={user.role === 'admin'} className={user.role === 'admin' ? 'bg-[#F9A825] text-white uppercase text-[10px]' : 'uppercase text-[10px]'}>
                  {user.role}
                </PillBadge>
                <PillBadge active={user.plan === 'pro'} className="uppercase text-[10px]">
                  {user.plan} PLAN
                </PillBadge>
              </div>
            </div>
          </div>
          
          {/* Quick Actions Note */}
          <div className="text-right">
            <p className="text-sm text-[#78909C]">Joined on</p>
            <p className="font-medium text-[#1A2E1A]">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-[rgba(46,125,50,0.15)]">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#1A2E1A] flex items-center gap-2"><Mail size={18} className="text-[#2E7D32]" /> Contact Information</h3>
            <div className="bg-[#F5FAF5] p-4 rounded-xl space-y-3">
              <div>
                <span className="text-sm text-[#78909C] block">Email Address</span>
                <span className="font-medium text-[#1A2E1A]">{user.email}</span>
              </div>
              {user.city && (
                <div>
                  <span className="text-sm text-[#78909C] block">City</span>
                  <span className="font-medium text-[#1A2E1A]">{user.city}</span>
                </div>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#1A2E1A] flex items-center gap-2"><Calendar size={18} className="text-[#2E7D32]" /> Personal Details</h3>
            <div className="bg-[#F5FAF5] p-4 rounded-xl space-y-3">
              <div>
                <span className="text-sm text-[#78909C] block">Date of Birth</span>
                <span className="font-medium text-[#1A2E1A]">{user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}</span>
              </div>
              <div>
                <span className="text-sm text-[#78909C] block">Gender</span>
                <span className="font-medium text-[#1A2E1A] capitalize">{user.gender || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-[#1A2E1A] flex items-center gap-2 mb-4"><Activity size={18} className="text-[#2E7D32]" /> Platform Usage</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[rgba(46,125,50,0.15)] p-4 rounded-xl flex items-center gap-3">
              <div className="bg-[#EBF5EB] p-2 rounded-lg text-[#2E7D32]"><Shield size={20} /></div>
              <div>
                <p className="text-xs text-[#78909C] font-semibold uppercase tracking-wider">Records</p>
                <p className="text-xl font-bold text-[#1A2E1A]">{recordsCount[0].count}</p>
              </div>
            </div>
            <div className="bg-white border border-[rgba(46,125,50,0.15)] p-4 rounded-xl flex items-center gap-3">
              <div className="bg-orange-50 p-2 rounded-lg text-accent"><Target size={20} /></div>
              <div>
                <p className="text-xs text-[#78909C] font-semibold uppercase tracking-wider">Goals</p>
                <p className="text-xl font-bold text-[#1A2E1A]">{goalsCount[0].count}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
