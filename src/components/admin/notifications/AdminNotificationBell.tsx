/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  Mail,
  Megaphone,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppNotification, formatTimeAgo } from '@/lib/notifications';
import { AdminBroadcastModal } from './AdminBroadcastModal';
import { useToast } from '@/components/providers/ToastProvider';

export function AdminNotificationBell() {
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'inquiries' | 'system'>('all');

  // Fetch notifications
  const fetchNotifications = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/notifications?scope=admin');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch admin notifications:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial fetch and 30s polling
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Mark single as read
  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/notifications/mark-all-read?scope=admin', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  // Delete single notification
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        fetchNotifications(true);
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((item) => {
    if (filterTab === 'unread') return !item.is_read;
    if (filterTab === 'inquiries') return item.type === 'contact' || item.type === 'campaign';
    if (filterTab === 'system') return item.type === 'system' || item.type === 'alert';
    return true;
  });

  // Icon resolver
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Topbar Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Admin Notifications"
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-xs animate-in zoom-in-50">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2.5 w-[360px] sm:w-[420px] bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col text-slate-900"
          >
            {/* Header */}
            <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm text-slate-900">
                  Admin Notifications
                </span>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-mono font-bold text-[10px]">
                    {unreadCount} unread
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                    All caught up
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(true)}
                  title="Broadcast Sitewide Announcement"
                  className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#f06d2f] text-xs font-heading font-bold transition-colors flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span className="text-[11px]">Broadcast</span>
                </button>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-white overflow-x-auto scrollbar-none">
              {[
                { label: 'All', value: 'all' },
                { label: 'Unread', value: 'unread' },
                { label: 'Inquiries', value: 'inquiries' },
                { label: 'System', value: 'system' },
              ].map((tab) => {
                const isActive = filterTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setFilterTab(tab.value as any)}
                    className={`text-[11px] font-heading font-bold px-3 py-1 rounded-lg transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Notification Items List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
              {loading && notifications.length === 0 ? (
                <div className="py-12 flex items-center justify-center text-slate-400">
                  <RefreshCw size={20} className="animate-spin text-[#16A34A]" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-1">
                  <p className="font-heading font-bold text-xs text-slate-700">No Notifications</p>
                  <p className="text-[11px] text-slate-400">
                    {filterTab === 'unread' ? 'You have read all notifications.' : 'No alerts in this category.'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isUnread = !notif.is_read;
                  return (
                    <div
                      key={notif.id}
                      className={`group p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                        isUnread ? 'bg-orange-50/20' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
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

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-heading font-bold text-xs text-slate-900 leading-tight truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {formatTimeAgo(notif.created_at)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-snug font-body">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          {notif.link_url ? (
                            <Link
                              href={notif.link_url}
                              onClick={() => {
                                handleMarkAsRead(notif.id);
                                setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-[#16A34A] hover:underline"
                            >
                              <span>View Details</span>
                              <ExternalLink size={10} />
                            </Link>
                          ) : (
                            <span />
                          )}

                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isUnread && (
                              <button
                                onClick={(e) => handleMarkAsRead(notif.id, e)}
                                title="Mark as read"
                                className="p-1 rounded text-slate-400 hover:text-emerald-600"
                              >
                                <Check size={13} />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(notif.id, e)}
                              title="Delete notification"
                              className="p-1 rounded text-slate-400 hover:text-red-600"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Broadcast Announcement Modal */}
      <AdminBroadcastModal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        onSuccess={() => fetchNotifications(true)}
      />
    </div>
  );
}
