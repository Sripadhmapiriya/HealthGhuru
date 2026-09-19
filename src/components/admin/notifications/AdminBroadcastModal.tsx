/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  Megaphone,
  X,
  Send,
  AlertTriangle,
  Info,
  Sparkles,
  ShieldCheck,
  Globe,
  Users,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/providers/ToastProvider';
import { NotificationType, NotificationAudience, NotificationPriority } from '@/lib/notifications';

interface AdminBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AdminBroadcastModal({ isOpen, onClose, onSuccess }: AdminBroadcastModalProps) {
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('info');
  const [audience, setAudience] = useState<NotificationAudience>('all');
  const [priority, setPriority] = useState<NotificationPriority>('normal');
  const [linkUrl, setLinkUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          type,
          audience,
          priority,
          linkUrl: linkUrl.trim() || null,
          icon: type === 'breaking' ? 'AlertTriangle' : type === 'health_tip' ? 'Sparkles' : 'Megaphone',
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Notification broadcasted successfully!');
        setTitle('');
        setMessage('');
        setLinkUrl('');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.error?.message || 'Failed to broadcast notification');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#f06d2f] flex items-center justify-center border border-orange-100">
                <Megaphone size={20} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">
                  Broadcast Notification
                </h3>
                <p className="text-xs text-slate-500">
                  Send live announcements, health alerts, or system messages.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Audience Tabs */}
            <div>
              <label className="block text-xs font-heading font-bold text-slate-700 mb-1.5">
                Target Audience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'all', label: 'All Visitors', icon: Globe, desc: 'Public Sitewide' },
                  { value: 'users', label: 'Registered Users', icon: Users, desc: 'Logged-in Members' },
                  { value: 'admin', label: 'Admin Team', icon: Lock, desc: 'Internal Staff' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = audience === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setAudience(item.value as NotificationAudience)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        isSelected
                          ? 'border-[#16A34A] bg-emerald-50/40 ring-1 ring-[#16A34A]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-heading font-bold text-xs text-slate-900">
                        <Icon size={14} className={isSelected ? 'text-[#16A34A]' : 'text-slate-500'} />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notification Type & Priority Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                  Type / Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as NotificationType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-heading font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                >
                  <option value="info">Information / General</option>
                  <option value="breaking">Breaking Health Alert</option>
                  <option value="health_tip">Daily Wellness Tip</option>
                  <option value="system">System / Maintenance</option>
                  <option value="alert">Important Advisory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NotificationPriority)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-heading font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent / Breaking Banner</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                Notification Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Seasonal Influenza Advisory — Prevention Guide"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                Message Content
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detailed message description to display in notification center..."
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#16A34A] focus:outline-none resize-none"
              />
            </div>

            {/* Link URL (Optional) */}
            <div>
              <label className="flex items-center justify-between text-xs font-heading font-bold text-slate-700 mb-1">
                <span>Action Link URL (Optional)</span>
                <span className="text-[10px] text-slate-400 font-mono">e.g. /category/nutrition</span>
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Relative (/article/...) or absolute (https://...) link"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#16A34A] focus:outline-none font-mono"
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-heading font-bold shadow-xs transition-colors"
              >
                <Send size={13} />
                <span>{isSubmitting ? 'Broadcasting...' : 'Broadcast Now'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
