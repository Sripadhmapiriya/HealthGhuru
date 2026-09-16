/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/providers/ToastProvider';

export function SettingsForm({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error('Settings update would happen here. Role change is strictly forbidden on this page per the security prompt.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#1A2E1A] mb-1">Name</label>
        <input 
          type="text" required
          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A2E1A] mb-1">Email</label>
        <input 
          type="email" required
          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      
      <div className="pt-4 border-t border-[rgba(46,125,50,0.15)]">
        <button type="submit" className="bg-accent hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Save Settings
        </button>
      </div>
    </form>
  );
}
