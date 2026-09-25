/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  Sparkles,
  AlertTriangle,
  Heart,
  ExternalLink,
  CheckCheck,
  RefreshCw,
  X,
  Flame,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppNotification, formatTimeAgo } from '@/lib/notifications';

interface PublicNotificationBellProps {
  className?: string;
  isMobile?: boolean;
}

export function PublicNotificationBell({ className = '', isMobile = false }: PublicNotificationBellProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'alerts' | 'tips'>('all');

  // Fetch public / user notifications
  const fetchNotifications = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/notifications?scope=user');
      const data = await res.json();
      if (data.success) {
        let items: AppNotification[] = data.notifications || [];

        // Check local guest read status fallback if guest
        try {
          const localReads = JSON.parse(localStorage.getItem('hg_read_notifs') || '[]');
          if (Array.isArray(localReads) && localReads.length > 0) {
            items = items.map((item) => ({
              ...item,
              is_read: item.is_read || localReads.includes(item.id),
            }));
          }
        } catch {
          // ignore
        }

        setNotifications(items);
        const unread = items.filter((n) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 45000);
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

  // Mark single item as read
  const handleMarkAsRead = async (id: string) => {
    try {
      // Local storage fallback for guests
      try {
        const localReads = JSON.parse(localStorage.getItem('hg_read_notifs') || '[]');
        if (!localReads.includes(id)) {
          localReads.push(id);
          localStorage.setItem('hg_read_notifs', JSON.stringify(localReads));
        }
      } catch {
        // ignore
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      // Server update
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      // Local storage fallback
      try {
        const allIds = notifications.map((n) => n.id);
        localStorage.setItem('hg_read_notifs', JSON.stringify(allIds));
      } catch {
        // ignore
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);

      await fetch('/api/notifications/mark-all-read?scope=user', { method: 'POST' });
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'alerts') return item.type === 'breaking' || item.type === 'alert';
    if (activeTab === 'tips') return item.type === 'health_tip' || item.type === 'info' || item.type === 'article';
    return true;
  });

  const renderIcon = (notif: AppNotification) => {
    switch (notif.type) {
      case 'breaking':
      case 'alert':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'health_tip':
        return <Sparkles size={16} className="text-amber-600" />;
      case 'article':
        return <Heart size={16} className="text-[#16A34A]" />;
      default:
        return <Info size={16} className="text-blue-600" />;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Health Notifications"
        title="Health Alerts & Notifications"
        className={`group relative !min-w-0 !min-h-0 transition-all cursor-pointer ${
          isMobile
            ? 'flex items-center gap-3 w-full p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 min-h-[48px]'
            : 'w-7.5 h-7.5 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-slate-700 hover:text-[#16A34A] hover:bg-emerald-50/80 p-0'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 text-slate-700 group-hover:text-[#16A34A]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 min-w-[14px] h-[14px] sm:min-w-[18px] sm:h-[18px] px-0.5 sm:px-1 rounded-full bg-[#f06d2f] text-white font-mono font-bold text-[7.5px] sm:text-[10px] flex items-center justify-center shadow-xs border-2 border-white ring-1 ring-orange-500/30 pointer-events-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        {isMobile && (
          <div className="flex-1 text-left flex items-center justify-between font-heading font-semibold text-sm">
            <span className="text-slate-800">Health Alerts &amp; Updates</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#f06d2f] font-mono text-xs font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
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
            className={`bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col text-slate-900 ${
              isMobile
                ? 'w-full mt-2'
                : 'fixed left-2 right-2 sm:absolute sm:left-auto sm:right-0 mt-2.5 sm:w-[390px]'
            }`}
          >
            {/* Header */}
            <div className="p-4 bg-emerald-50/50 border-b border-emerald-100/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm text-slate-900">
                  Health Alerts &amp; Updates
                </span>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#f06d2f] font-mono font-bold text-[10px]">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                    Up to date
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="text-xs font-heading font-bold text-[#16A34A] hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={14} />
                  <span>Read all</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-white">
              {[
                { label: 'All', value: 'all' },
                { label: 'Alerts', value: 'alerts' },
                { label: 'Tips & News', value: 'tips' },
              ].map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value as any)}
                    className={`text-[11px] font-heading font-bold px-3 py-1 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#16A34A] text-white'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Notification Items List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
              {loading && notifications.length === 0 ? (
                <div className="py-12 flex items-center justify-center text-slate-400">
                  <RefreshCw size={20} className="animate-spin text-[#16A34A]" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="py-10 text-center text-slate-400 space-y-1">
                  <p className="font-heading font-bold text-xs text-slate-700">No Notifications</p>
                  <p className="text-[11px] text-slate-400">You are completely caught up!</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isUnread = !notif.is_read;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${
                        isUnread ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          notif.type === 'breaking' || notif.type === 'alert'
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : notif.type === 'health_tip'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-emerald-50 text-[#16A34A] border border-emerald-100'
                        }`}
                      >
                        {renderIcon(notif)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <p className="font-heading font-bold text-xs text-slate-900 leading-tight truncate">
                            {notif.title}
                          </p>
                          {isUnread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f06d2f] shrink-0" />
                          )}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-snug font-body">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatTimeAgo(notif.created_at)}
                          </span>

                          {notif.link_url && (
                            <Link
                              href={notif.link_url}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-[#16A34A] hover:underline"
                            >
                              <span>Explore</span>
                              <ExternalLink size={10} />
                            </Link>
                          )}
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
    </div>
  );
}
