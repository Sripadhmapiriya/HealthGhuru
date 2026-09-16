/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { overrideUserPlan } from '@/lib/admin/actions/overrideUserPlan';
import { useToast } from '@/components/providers/ToastProvider';

export function PlanOverrideClient({ users }: { users: any[] }) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [tier, setTier] = useState<'free' | 'pro'>('free');
  const [recordsLimit, setRecordsLimit] = useState(10);
  const [activeGoalsLimit, setActiveGoalsLimit] = useState(3);
  const [familyMembersLimit, setFamilyMembersLimit] = useState(1);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const { toast } = useToast();

  const selectedUser = users.find(u => u.id === selectedUserId);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedUserId(id);
    const u = users.find(user => user.id === id);
    if (u) {
      setTier(u.tier || 'free');
      setRecordsLimit(u.records_limit || (u.tier === 'pro' ? 9999 : 10));
      setActiveGoalsLimit(u.active_goals_limit || (u.tier === 'pro' ? 9999 : 3));
      setFamilyMembersLimit(u.family_members_limit || (u.tier === 'pro' ? 5 : 1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !reason) return;
    
    setIsSubmitting(true);
    setSuccessMsg('');
    try {
      await overrideUserPlan({
        targetUserId: selectedUserId,
        tier,
        recordsLimit: Number(recordsLimit),
        activeGoalsLimit: Number(activeGoalsLimit),
        familyMembersLimit: Number(familyMembersLimit),
        reason
      });
      setSuccessMsg('Plan successfully updated.');
      toast.success('Plan successfully updated.');
      setReason('');
    } catch (err: any) {
      toast.error('Failed to override plan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[rgba(46,125,50,0.15)] p-6">
      <h3 className="font-heading font-bold text-lg text-[#1A2E1A] mb-6">Manual Plan Override</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#1A2E1A] mb-1">Select User</label>
          <select 
            value={selectedUserId}
            onChange={handleUserChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            required
          >
            <option value="">-- Select a user --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email}) - Current: {u.tier?.toUpperCase() || 'FREE'}</option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[rgba(46,125,50,0.15)]">
            <div>
              <label className="block text-sm font-medium text-[#1A2E1A] mb-1">Tier</label>
              <select 
                value={tier}
                onChange={e => setTier(e.target.value as 'free'|'pro')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2E1A] mb-1">Records Limit</label>
              <input 
                type="number" 
                value={recordsLimit}
                onChange={e => setRecordsLimit(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2E1A] mb-1">Active Goals Limit</label>
              <input 
                type="number" 
                value={activeGoalsLimit}
                onChange={e => setActiveGoalsLimit(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2E1A] mb-1">Family Members Limit</label>
              <input 
                type="number" 
                value={familyMembersLimit}
                onChange={e => setFamilyMembersLimit(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1A2E1A] mb-1">Reason for Override (Required)</label>
              <textarea 
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
                rows={3}
                placeholder="E.g., Customer support request ticket #1234, granted complimentary pro tier..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
              ></textarea>
              <p className="text-xs text-[#78909C] mt-1">This reason will be permanently recorded in the audit log.</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-[#EBF5EB] text-[#2E7D32] rounded-lg text-sm font-medium">
            {successMsg}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={!selectedUserId || !reason || isSubmitting}
            className="bg-accent hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Applying...' : 'Apply Override'}
          </button>
        </div>
      </form>
    </div>
  );
}
