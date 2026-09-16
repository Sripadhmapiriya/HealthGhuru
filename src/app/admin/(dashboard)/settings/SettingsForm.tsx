/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import { Clock, Megaphone } from 'lucide-react';

export function SettingsForm({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const [rotationSeconds, setRotationSeconds] = useState(8);
  const [savingAdSettings, setSavingAdSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/admin/ad-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.rotation_interval_seconds) {
          setRotationSeconds(data.rotation_interval_seconds);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveAdSettings = async () => {
    setSavingAdSettings(true);
    try {
      const res = await fetch('/api/admin/ad-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rotation_interval_seconds: rotationSeconds }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Ad rotation interval updated to ${rotationSeconds} seconds.`);
      } else {
        toast.error(data.error || 'Failed to update ad settings.');
      }
    } catch {
      toast.error('Network error saving ad settings.');
    } finally {
      setSavingAdSettings(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error('Profile settings are read-only in this demo.');
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="font-heading font-bold text-base text-gray-900 border-b border-gray-100 pb-2">
          Administrator Profile
        </h3>
        <div>
          <label className="block text-sm font-medium text-[#1A2E1A] mb-1">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A2E1A] mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg font-medium text-xs transition-colors"
          >
            Save Profile
          </button>
        </div>
      </form>

      {/* Ad Management & Rotation Settings */}
      <div className="pt-6 border-t border-gray-200 space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone size={18} className="text-[#f06d2f]" />
          <h3 className="font-heading font-bold text-base text-gray-900">
            Ad Banner Multi-Rotation Configuration
          </h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          When multiple active health advertisement campaigns are running in the same position (e.g. Header Banner, Top Banner, Sidebar, Floating Bar), they automatically rotate to give equal exposure to all advertisers.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#f06d2f] flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-gray-900 block">
                Banner Auto-Rotation Interval
              </span>
              <span className="text-xs text-gray-500">
                Time before transitioning to the next active ad in each slot
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={rotationSeconds}
              onChange={(e) => setRotationSeconds(parseInt(e.target.value, 10))}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 outline-none cursor-pointer"
            >
              <option value={5}>5 Seconds (Fast)</option>
              <option value={8}>8 Seconds (Recommended)</option>
              <option value={10}>10 Seconds (Standard)</option>
              <option value={15}>15 Seconds (Relaxed)</option>
              <option value={20}>20 Seconds (Extended)</option>
            </select>

            <button
              type="button"
              onClick={handleSaveAdSettings}
              disabled={savingAdSettings}
              className="px-4 py-2 bg-[#f06d2f] hover:bg-[#d95c22] text-white rounded-lg text-xs font-heading font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {savingAdSettings ? 'Saving...' : 'Save Interval'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
