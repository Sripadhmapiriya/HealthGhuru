'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Eye,
  Clock,
  Edit2,
  Trash2,
  ExternalLink,
  X,
} from 'lucide-react';
import { Advertisement } from '@/lib/types/advertisement';
import { AdFormModal } from './AdFormModal';
import Image from 'next/image';
import Link from 'next/link';

interface AdvertisementsClientProps {
  initialAds: Advertisement[];
}

const PLACEMENT_TAGS: Record<string, { label: string; code: string }> = {
  top_banner:      { label: 'Top Banner', code: 'TOP_BANNER' },
  hero_banner:     { label: 'Header Banner', code: 'HEADER_BANNER' },
  sidebar:         { label: 'Sidebar', code: 'SIDEBAR' },
  floating_footer: { label: 'Floating Ad', code: 'FLOATING_ADVERTISEMENT' },
  popup:           { label: 'Popup Ad', code: 'POPUP' },
};

function formatDateSchedule(dateStr?: string | null, isEnd?: boolean): string {
  if (!dateStr) return isEnd ? 'End: 30/12/2026 at 23:59' : 'Start: Immediate at 00:00';
  const d = new Date(dateStr);
  const formatted = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  return isEnd ? `End: ${formatted} at 23:59` : `Start: ${formatted} at 00:00`;
}

function formatINR(n?: number | null) {
  if (n === undefined || n === null) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function AdvertisementsClient({ initialAds }: AdvertisementsClientProps) {
  const [ads, setAds] = useState<Advertisement[]>(initialAds);
  const [placementFilter, setPlacementFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adToEdit, setAdToEdit] = useState<Advertisement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewAd, setPreviewAd] = useState<Advertisement | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rotationSeconds, setRotationSeconds] = useState<number>(8);
  const [savingRotation, setSavingRotation] = useState<boolean>(false);

  // Load rotation interval from settings
  useState(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/admin/ad-settings')
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.rotation_interval_seconds) {
            setRotationSeconds(data.rotation_interval_seconds);
          }
        })
        .catch(() => {});
    }
  });

  const handleRotationChange = async (newSeconds: number) => {
    setRotationSeconds(newSeconds);
    setSavingRotation(true);
    try {
      await fetch('/api/admin/ad-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rotation_interval_seconds: newSeconds }),
      });
    } catch {
      //
    } finally {
      setTimeout(() => setSavingRotation(false), 1200);
    }
  };

  // Helper to parse contact details cleanly
  const getContactDetails = (ad?: Advertisement | null) => {
    if (!ad) return { name: '—', email: '—', phone: '—' };
    const raw = ad.advertiser_contact || '';
    const match = raw.match(/^(.*?)\s*\((.*?)(?:\s*\/\s*(.*?))?\)$/);
    if (match) {
      return {
        name: match[1]?.trim() || ad.advertiser_name || '—',
        email: match[2]?.trim() || '—',
        phone: match[3]?.trim() || '—',
      };
    }
    return {
      name: ad.advertiser_name || '—',
      email: raw.includes('@') ? raw : '—',
      phone: '—',
    };
  };

  // Filtered Ads
  const filteredAds = ads.filter((ad) => {
    const matchesPlacement = placementFilter === 'all' || ad.placement === placementFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && ad.is_active) ||
      (statusFilter === 'pending' && (ad.status === 'pending' || !ad.is_active)) ||
      (statusFilter === 'expired' && ad.status === 'expired') ||
      (statusFilter === 'unpublished' && (ad.status === 'unpublished' || !ad.is_active));

    const matchesPriority = priorityFilter === 'all' || (ad.priority || 'Medium').toLowerCase() === priorityFilter.toLowerCase();

    const matchesSearch =
      searchQuery === '' ||
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.advertiser_name && ad.advertiser_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ad.headline && ad.headline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ad.category && ad.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesPlacement && matchesStatus && matchesPriority && matchesSearch;
  });

  // Approve & Publish action
  const handlePublishToggle = async (ad: Advertisement) => {
    setActionLoadingId(ad.id);
    const willBeActive = !ad.is_active;
    const newStatus = willBeActive ? 'active' : 'unpublished';

    // Optimistic UI update
    setAds((prev) =>
      prev.map((a) => (a.id === ad.id ? { ...a, is_active: willBeActive, status: newStatus } : a))
    );
    if (previewAd && previewAd.id === ad.id) {
      setPreviewAd((prev) => (prev ? { ...prev, is_active: willBeActive, status: newStatus } : null));
    }

    try {
      const res = await fetch(`/api/admin/advertisements/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: willBeActive, status: newStatus }),
      });
      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Server returned status ${res.status}`);
      }
      if (!json.success) {
        setAds((prev) =>
          prev.map((a) => (a.id === ad.id ? { ...a, is_active: ad.is_active, status: ad.status } : a))
        );
        if (previewAd && previewAd.id === ad.id) {
          setPreviewAd((prev) => (prev ? { ...prev, is_active: ad.is_active, status: ad.status } : null));
        }
        alert(json.error || 'Failed to update campaign status');
      }
    } catch (err: any) {
      setAds((prev) =>
        prev.map((a) => (a.id === ad.id ? { ...a, is_active: ad.is_active, status: ad.status } : a))
      );
      if (previewAd && previewAd.id === ad.id) {
        setPreviewAd((prev) => (prev ? { ...prev, is_active: ad.is_active, status: ad.status } : null));
      }
      alert(err.message || 'Network error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement campaign?')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/advertisements/${id}`, {
        method: 'DELETE',
      });
      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Server returned status ${res.status}`);
      }
      if (json.success) {
        setAds((prev) => prev.filter((a) => a.id !== id));
        if (previewAd && previewAd.id === id) {
          setPreviewAd(null);
        }
      } else {
        alert(json.error || 'Failed to delete advertisement');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting advertisement');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdSaved = (savedAd: Advertisement, isNew: boolean) => {
    if (isNew) {
      setAds((prev) => [savedAd, ...prev]);
    } else {
      setAds((prev) => prev.map((a) => (a.id === savedAd.id ? savedAd : a)));
      if (previewAd && previewAd.id === savedAd.id) {
        setPreviewAd(savedAd);
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header & Lite Control Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-900 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-xl">
              📣
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl sm:text-2xl text-gray-900">
                Advertisement Campaigns
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage hospital &amp; doctor banners, click rates, active scheduling, and tracking indicators.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns, advertisers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#f06d2f] focus:ring-1 focus:ring-[#f06d2f] outline-none transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Position Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600">
              <span className="text-gray-400">Position:</span>
              <select
                value={placementFilter}
                onChange={(e) => setPlacementFilter(e.target.value)}
                className="bg-transparent text-gray-900 font-semibold outline-none cursor-pointer"
              >
                <option value="all">All Positions</option>
                <option value="hero_banner">HEADER_BANNER</option>
                <option value="top_banner">TOP_BANNER</option>
                <option value="sidebar">SIDEBAR</option>
                <option value="floating_footer">FLOATING_ADVERTISEMENT</option>
                <option value="popup">POPUP</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600">
              <span className="text-gray-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-gray-900 font-semibold outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="pending">Pending Review</option>
                <option value="expired">Expired</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600">
              <span className="text-gray-400">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent text-gray-900 font-semibold outline-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Auto-Rotation Timing Dropdown */}
            <div
              className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600"
              title="Interval for auto-rotating multiple active banners in the same position"
            >
              <Clock size={13} className="text-[#f06d2f]" />
              <span className="text-gray-400">Rotation:</span>
              <select
                value={rotationSeconds}
                onChange={(e) => handleRotationChange(parseInt(e.target.value, 10))}
                className="bg-transparent text-gray-900 font-semibold outline-none cursor-pointer"
              >
                <option value={5}>Every 5s</option>
                <option value={8}>Every 8s</option>
                <option value={10}>Every 10s</option>
                <option value={15}>Every 15s</option>
                <option value={20}>Every 20s</option>
              </select>
              {savingRotation && (
                <span className="text-[10px] text-emerald-600 font-bold animate-pulse">
                  Saved!
                </span>
              )}
            </div>

            {/* Add Campaign Button */}
            <Link
              href="/admin/advertisements/add"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f06d2f] hover:bg-[#d95c22] text-white rounded-xl text-xs font-heading font-bold transition-all shadow-md shadow-orange-500/20 shrink-0 cursor-pointer"
            >
              <Plus size={15} /> Add Campaign
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Lite Table (Full Width & Clean Row Layout) */}
      <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {filteredAds.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Megaphone size={40} className="mx-auto text-gray-400 stroke-[1.5]" />
            <h3 className="font-heading font-bold text-base text-gray-800">No advertisement campaigns found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery || placementFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search query or filters.'
                : 'Get started by creating your first health advertisement campaign.'}
            </p>
            <Link
              href="/admin/advertisements/add"
              className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-[#f06d2f] text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Plus size={14} /> Add Campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/90 border-b border-gray-200 text-[11px] font-heading font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-5">BANNER</th>
                  <th className="py-4 px-5">CAMPAIGN DETAILS</th>
                  <th className="py-4 px-4">POSITION</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4">PRIORITY</th>
                  <th className="py-4 px-4">SCHEDULING DATES</th>
                  <th className="py-4 px-3 text-center">CLICKS</th>
                  <th className="py-4 px-3 text-center">IMPRESSIONS</th>
                  <th className="py-4 px-3 text-center">CTR</th>
                  <th className="py-4 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredAds.map((ad) => {
                  const tagInfo = PLACEMENT_TAGS[ad.placement] || {
                    label: ad.placement,
                    code: ad.placement.toUpperCase(),
                  };

                  const adCtr =
                    ad.impressions_count > 0
                      ? ((ad.clicks_count / ad.impressions_count) * 100).toFixed(2)
                      : '0.00';

                  const isPending = ad.status === 'pending';
                  const isExpired = ad.status === 'expired' || (ad.end_date && new Date(ad.end_date) < new Date());
                  const isUnpublished = ad.status === 'unpublished' || (!ad.is_active && !isPending && !isExpired);
                  const isActive = ad.is_active && !isExpired && !isPending;

                  const paymentStatus = ad.payment_status || 'paid';
                  const paymentMethod = ad.payment_method || 'UPI';

                  return (
                    <tr key={ad.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* 1. BANNER */}
                      <td className="py-4 px-5">
                        <div
                          onClick={() => setPreviewAd(ad)}
                          className="relative w-16 h-11 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                          title="Click to preview full campaign details"
                        >
                          {ad.image_url ? (
                            <Image
                              src={ad.image_url}
                              alt={ad.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Megaphone size={16} />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 2. CAMPAIGN DETAILS */}
                      <td className="py-4 px-5 max-w-[260px]">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-heading font-bold text-sm text-gray-900 truncate">
                              {ad.title}
                            </span>
                            <span className="px-1.5 py-0.5 text-[9px] font-heading font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200 uppercase">
                              {ad.advertiser_type || 'HOSPITAL'}
                            </span>
                          </div>

                          <div className="text-[11px] text-gray-500 truncate">
                            Advertiser: <span className="font-semibold text-gray-800">{ad.advertiser_name || 'Hospital'}</span>
                            {ad.advertiser_contact ? ` (${ad.advertiser_contact})` : ''}
                          </div>

                          <div className="text-[11px] text-orange-600 font-medium flex items-center gap-1">
                            <span>💰 Paid: {formatINR(ad.budget)} ({paymentMethod}) — </span>
                            <span className={paymentStatus === 'paid' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                              {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. POSITION */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-gray-100 border border-gray-200 text-gray-800 tracking-wider">
                          {tagInfo.code}
                        </span>
                      </td>

                      {/* 4. STATUS */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock size={11} /> Pending Review
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold bg-red-100 text-red-800 border border-red-200">
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold bg-gray-100 text-gray-700 border border-gray-200">
                            Unpublished
                          </span>
                        )}
                      </td>

                      {/* 5. PRIORITY */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-blue-600 font-heading font-bold text-xs">
                          {ad.priority || 'Medium'}
                        </span>
                      </td>

                      {/* 6. SCHEDULING DATES */}
                      <td className="py-4 px-4 whitespace-nowrap text-[11px] font-mono text-gray-600 leading-relaxed">
                        <div>{formatDateSchedule(ad.start_date, false)}</div>
                        <div className="text-gray-500">{formatDateSchedule(ad.end_date, true)}</div>
                      </td>

                      {/* 7. CLICKS */}
                      <td className="py-4 px-3 text-center whitespace-nowrap font-heading font-bold text-gray-900">
                        {ad.clicks_count.toLocaleString()}
                      </td>

                      {/* 8. IMPRESSIONS */}
                      <td className="py-4 px-3 text-center whitespace-nowrap font-medium text-gray-600">
                        {ad.impressions_count.toLocaleString()}
                      </td>

                      {/* 9. CTR */}
                      <td className="py-4 px-3 text-center whitespace-nowrap font-heading font-bold text-emerald-600">
                        {adCtr}%
                      </td>

                      {/* 10. ACTIONS */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          {/* ON / OFF Toggle Switch */}
                          <button
                            onClick={() => handlePublishToggle(ad)}
                            disabled={actionLoadingId === ad.id}
                            className={`font-mono font-bold text-xs transition-colors cursor-pointer ${
                              ad.is_active ? 'text-emerald-600 hover:text-emerald-700' : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title="Toggle Live Status"
                          >
                            {ad.is_active ? 'ON' : 'OFF'}
                          </button>

                          {/* External Link */}
                          <a
                            href={ad.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                            title="Open Destination Link"
                          >
                            <ExternalLink size={15} />
                          </a>

                          {/* Preview Eye (Orange/Amber) */}
                          <button
                            onClick={() => setPreviewAd(ad)}
                            className="text-amber-500 hover:text-amber-600 transition-colors p-1 cursor-pointer"
                            title="Preview Full Campaign Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit Pencil (Blue) */}
                          <button
                            onClick={() => {
                              setAdToEdit(ad);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1 cursor-pointer"
                            title="Edit Campaign"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Delete (Red) */}
                          <button
                            onClick={() => handleDelete(ad.id)}
                            disabled={deletingId === ad.id}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-40 cursor-pointer"
                            title="Delete Campaign"
                          >
                            <Trash2 size={15} />
                          </button>

                          {/* Publish / Unpublish Button */}
                          <button
                            onClick={() => handlePublishToggle(ad)}
                            disabled={actionLoadingId === ad.id}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                              ad.is_active
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-sm'
                                : isPending
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                                : 'bg-[#f06d2f] hover:bg-[#d95c22] text-white shadow-sm'
                            }`}
                          >
                            {actionLoadingId === ad.id
                              ? 'Saving...'
                              : ad.is_active
                              ? 'Unpublish'
                              : isPending
                              ? 'Approve & Publish'
                              : 'Publish'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Full Ad Campaign Preview Modal in Lite Mode (Matches Screenshot) ── */}
      {previewAd && (
        <div
          onClick={() => setPreviewAd(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto flex flex-col text-gray-900"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <span className="text-lg">📢</span>
                <h3 className="font-heading font-extrabold text-base text-gray-900">
                  Ad Campaign Preview
                </h3>
              </div>
              <button
                onClick={() => setPreviewAd(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Banner Image Display */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 bg-slate-950 flex items-center justify-center shadow-inner">
                {previewAd.image_url ? (
                  <Image
                    src={previewAd.image_url}
                    alt={previewAd.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-1.5">
                    <Megaphone size={28} />
                    <span className="text-xs">No banner image uploaded</span>
                  </div>
                )}
              </div>

              {/* Main Detail Fields (Exact layout from user screenshot) */}
              <div className="space-y-2.5 text-sm">
                <div>
                  <span className="font-bold text-gray-900">Campaign Title: </span>
                  <span className="text-[#f06d2f] font-bold">{previewAd.title}</span>
                </div>

                <div>
                  <span className="font-bold text-gray-900">Company / Brand: </span>
                  <span className="text-gray-700 font-medium">{previewAd.advertiser_name || '—'}</span>
                </div>

                <div>
                  <span className="font-bold text-gray-900">Description: </span>
                  <span className="text-gray-700 font-normal">{previewAd.headline || previewAd.category || '—'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">Position / Location: </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-gray-100 border border-gray-300 text-gray-800">
                    {PLACEMENT_TAGS[previewAd.placement]?.code || previewAd.placement.toUpperCase()}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-gray-900">Priority: </span>
                  <span className="text-blue-600 font-bold">{previewAd.priority || 'Medium'}</span>
                </div>

                <div>
                  <span className="font-bold text-gray-900">Payment Details: </span>
                  <span className="text-[#f06d2f] font-bold">{formatINR(previewAd.budget)}</span>
                  <span className="text-gray-600"> via {previewAd.payment_method || 'UPI'} </span>
                  <span className={previewAd.payment_status === 'paid' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                    ({previewAd.payment_status === 'paid' ? 'Paid' : 'Pending'})
                  </span>
                </div>

                <div className="break-all">
                  <span className="font-bold text-gray-900">Target Link: </span>
                  <a
                    href={previewAd.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-mono text-xs"
                  >
                    {previewAd.target_url}
                  </a>
                </div>
              </div>

              {/* Advertiser Information */}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <h4 className="font-heading font-bold text-sm text-gray-900">Advertiser Information:</h4>
                {(() => {
                  const contact = getContactDetails(previewAd);
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                      <div>
                        <span className="font-bold text-gray-900">Name: </span>
                        <span>{contact.name}</span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-900">Phone: </span>
                        <span>{contact.phone}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-bold text-gray-900">Email: </span>
                        <span>{contact.email}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Publication Timeline */}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <h4 className="font-heading font-bold text-sm text-gray-900">Publication Timeline:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-gray-700">
                  <div>
                    <span className="font-bold text-gray-900 font-sans">Start: </span>
                    <span>{formatDateSchedule(previewAd.start_date, false).replace('Start: ', '')}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 font-sans">End: </span>
                    <span>{formatDateSchedule(previewAd.end_date, true).replace('End: ', '')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setPreviewAd(null)}
                className="px-5 py-2 rounded-xl text-xs font-heading font-bold text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handlePublishToggle(previewAd)}
                disabled={actionLoadingId === previewAd.id}
                className={`px-5 py-2 rounded-xl text-xs font-heading font-bold text-white transition-all shadow-sm ${
                  previewAd.is_active
                    ? 'bg-slate-700 hover:bg-slate-800'
                    : previewAd.status === 'pending'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-[#f06d2f] hover:bg-[#d95c22]'
                }`}
              >
                {actionLoadingId === previewAd.id
                  ? 'Saving...'
                  : previewAd.is_active
                  ? 'Unpublish Campaign'
                  : previewAd.status === 'pending'
                  ? 'Approve & Publish'
                  : 'Publish Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal for Create/Edit */}
      <AdFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        adToEdit={adToEdit}
        onSaved={handleAdSaved}
      />
    </div>
  );
}
