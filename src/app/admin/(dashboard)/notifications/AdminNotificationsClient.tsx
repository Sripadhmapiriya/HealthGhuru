/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bell,
  Mail,
  Megaphone,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Search,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  Globe,
  Users,
  Lock,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppNotification, formatTimeAgo } from '@/lib/notifications';
import { AdminBroadcastModal } from '@/components/admin/notifications/AdminBroadcastModal';
import { useToast } from '@/components/providers/ToastProvider';
import { formatDate } from '@/lib/utils';

interface AdminNotificationsClientProps {
  initialNotifications: AppNotification[];
  initialCounts: {
    total: number;
    unread: number;
    broadcasts: number;
    leads: number;
    alerts: number;
  };
}

export function AdminNotificationsClient({
  initialNotifications,
  initialCounts,
}: AdminNotificationsClientProps) {
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [counts, setCounts] = useState(initialCounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'broadcasts' | 'leads' | 'system'>('all');
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications?scope=admin');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        // Recompute counts
        const items: AppNotification[] = data.notifications || [];
        setCounts({
          total: items.length,
          unread: items.filter((n) => !n.is_read).length,
          broadcasts: items.filter((n) => n.is_broadcast).length,
          leads: items.filter((n) => n.type === 'contact' || n.type === 'campaign').length,
          alerts: items.filter((n) => ['system', 'alert', 'breaking'].includes(n.type)).length,
        });
      }
    } catch (err) {
      console.error('Failed to refresh notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setCounts((c) => ({ ...c, unread: Math.max(0, c.unread - 1) }));
        toast.success('Marked as read');
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/notifications/mark-all-read?scope=admin', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setCounts((c) => ({ ...c, unread: 0 }));
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setDeleteConfirmId(null);
        toast.success('Notification deleted successfully');
        await refreshData();
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (filterTab === 'unread' && item.is_read) return false;
      if (filterTab === 'broadcasts' && !item.is_broadcast) return false;
      if (filterTab === 'leads' && item.type !== 'contact' && item.type !== 'campaign') return false;
      if (filterTab === 'system' && !['system', 'alert', 'breaking'].includes(item.type)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (item.title || '').toLowerCase().includes(q);
        const matchMsg = (item.message || '').toLowerCase().includes(q);
        const matchType = (item.type || '').toLowerCase().includes(q);
        if (!matchTitle && !matchMsg && !matchType) return false;
      }

      return true;
    });
  }, [notifications, filterTab, searchQuery]);

  const renderIcon = (notif: AppNotification) => {
    switch (notif.type) {
      case 'contact':
        return <Mail size={16} className="text-orange-600" />;
      case 'campaign':
        return <Megaphone size={16} className="text-purple-600" />;
      case 'breaking':
      case 'alert':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'subscription':
        return <Sparkles size={16} className="text-emerald-600" />;
      default:
        return <ShieldCheck size={16} className="text-[#16A34A]" />;
    }
  };

  const renderAudienceBadge = (audience: string) => {
    switch (audience) {
      case 'all':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-mono font-semibold border border-blue-200">
            <Globe size={10} /> Public
          </span>
        );
      case 'users':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-semibold border border-emerald-200">
            <Users size={10} /> Users
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-mono font-semibold border border-purple-200">
            <Lock size={10} /> Admin Staff
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ── 1. KPI Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1">
              Total Alerts
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
              {counts.total}
            </p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Bell size={22} />
          </div>
        </div>

        {/* Unread */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-red-200 bg-red-50/20 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-red-600 uppercase tracking-wider mb-1">
              Unread Action Items
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-red-600">
              {counts.unread}
            </p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
        </div>

        {/* Public Broadcasts */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-200 bg-orange-50/20 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-[#f06d2f] uppercase tracking-wider mb-1">
              Live Broadcasts
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#f06d2f]">
              {counts.broadcasts}
            </p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-orange-100 text-[#f06d2f] flex items-center justify-center">
            <Megaphone size={22} />
          </div>
        </div>

        {/* Inquiries & Leads */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 bg-emerald-50/20 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-emerald-700 uppercase tracking-wider mb-1">
              Inquiries &amp; Leads
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-800">
              {counts.leads}
            </p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
            <Mail size={22} />
          </div>
        </div>
      </div>

      {/* ── 2. Action Bar & Filter Tabs ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {[
            { label: 'All Notifications', value: 'all', count: counts.total },
            { label: 'Unread', value: 'unread', count: counts.unread },
            { label: 'Broadcasts', value: 'broadcasts', count: counts.broadcasts },
            { label: 'Inquiries', value: 'leads', count: counts.leads },
            { label: 'System Alerts', value: 'system', count: counts.alerts },
          ].map((tab) => {
            const isActive = filterTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setFilterTab(tab.value as any)}
                className={`text-xs font-heading font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-black/20 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {counts.unread > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-heading font-bold text-slate-700 transition-colors"
            >
              <CheckCheck size={14} />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={() => setBroadcastModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f06d2f] hover:bg-[#e05a1b] text-white text-xs font-heading font-bold shadow-xs hover:shadow-orange-500/20 transition-all"
          >
            <Plus size={15} />
            <span>Broadcast Announcement</span>
          </button>
        </div>
      </div>

      {/* ── 3. Search Bar ── */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search notifications by title, message, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A] shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── 4. Notifications List / Cards ── */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <RefreshCw size={24} className="animate-spin text-[#16A34A] mx-auto" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bell size={24} />
            </div>
            <p className="font-heading font-bold text-slate-800 text-sm">No Notifications Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No alerts matching "${searchQuery}".`
                : 'Broadcast a new announcement or wait for automated triggers.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.is_read;
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-2xs flex flex-col sm:flex-row items-start justify-between gap-4 ${
                  isUnread
                    ? 'border-orange-200 bg-orange-50/15 ring-1 ring-orange-200/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left: Icon & Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.type === 'contact'
                        ? 'bg-orange-100'
                        : notif.type === 'campaign'
                        ? 'bg-purple-100'
                        : notif.type === 'breaking' || notif.type === 'alert'
                        ? 'bg-red-100'
                        : 'bg-emerald-100'
                    }`}
                  >
                    {renderIcon(notif)}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-heading font-bold text-sm text-slate-900 leading-tight">
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#f06d2f] shrink-0" />
                      )}
                      {renderAudienceBadge(notif.audience)}
                      {notif.priority === 'urgent' && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-mono font-bold">
                          URGENT
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-body">
                      {notif.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                      <span suppressHydrationWarning>{formatDate(notif.created_at)}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(notif.created_at)}</span>
                      {notif.link_url && (
                        <>
                          <span>•</span>
                          <Link
                            href={notif.link_url}
                            className="text-[#16A34A] hover:underline font-bold inline-flex items-center gap-1 font-heading"
                          >
                            <span>Open Destination Link</span>
                            <ExternalLink size={11} />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-bold transition-colors flex items-center gap-1"
                    >
                      <Check size={13} />
                      <span>Mark Read</span>
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteConfirmId(notif.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── 5. Broadcast Announcement Modal ── */}
      <AdminBroadcastModal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        onSuccess={refreshData}
      />

      {/* ── 6. Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">Delete Notification?</h3>
                  <p className="text-xs text-slate-500">This will permanently remove the alert.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete this notification record?
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
