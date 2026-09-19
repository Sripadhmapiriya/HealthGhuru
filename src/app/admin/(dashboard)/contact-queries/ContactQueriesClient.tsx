/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import {
  Mail,
  MailOpen,
  MessageSquare,
  Search,
  CheckCircle2,
  Trash2,
  ExternalLink,
  X,
  Send,
  RotateCcw,
  Inbox,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ContactQuery {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  category?: string | null;
  language?: string | null;
  status: 'unread' | 'read' | 'reviewed' | 'pending' | 'replied' | 'archived';
  admin_notes?: string | null;
  created_at: string;
}

interface ContactQueriesClientProps {
  initialQueries: ContactQuery[];
  counts: {
    total: number;
    unread: number;
    reviewed: number;
    replied: number;
  };
}

function formatQueryDate(dateString: string) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

export function ContactQueriesClient({ initialQueries, counts: initialCounts }: ContactQueriesClientProps) {
  const [queries, setQueries] = useState<ContactQuery[]>(initialQueries);
  const [counts, setCounts] = useState(initialCounts);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const refreshQueries = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setQueries(data.queries || []);
        setCounts(data.counts || { total: 0, unread: 0, reviewed: 0, replied: 0 });
      }
    } catch (err) {
      console.error('Failed to refresh contact queries:', err);
    }
  };

  // Status update
  const handleUpdateStatus = async (id: string, newStatus: 'unread' | 'read' | 'reviewed' | 'replied') => {
    // Optimistic UI update
    setQueries((prev) => {
      const target = prev.find((q) => q.id === id);
      const prevStatus = target?.status || 'unread';

      // Update counts optimistically
      setCounts((c) => {
        const next = { ...c };
        if (prevStatus === 'unread' || prevStatus === 'pending') {
          next.unread = Math.max(0, next.unread - 1);
        } else if (prevStatus === 'reviewed' || prevStatus === 'read') {
          next.reviewed = Math.max(0, next.reviewed - 1);
        } else if (prevStatus === 'replied') {
          next.replied = Math.max(0, next.replied - 1);
        }

        if (newStatus === 'unread') {
          next.unread += 1;
        } else if (newStatus === 'reviewed' || newStatus === 'read') {
          next.reviewed += 1;
        } else if (newStatus === 'replied') {
          next.replied += 1;
        }
        return next;
      });

      return prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q));
    });

    if (selectedQuery && selectedQuery.id === id) {
      setSelectedQuery((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          newStatus === 'reviewed'
            ? 'Query marked as Reviewed'
            : `Status marked as ${newStatus}`,
          'success'
        );
      } else {
        showToast(data.error?.message || 'Failed to update status', 'error');
        await refreshQueries();
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred', 'error');
      await refreshQueries();
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete query
  const handleDelete = async (id: string) => {
    // Optimistic delete
    setQueries((prev) => prev.filter((q) => q.id !== id));
    if (selectedQuery?.id === id) setSelectedQuery(null);
    setDeleteConfirmId(null);

    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Contact query deleted successfully.', 'success');
        await refreshQueries();
      } else {
        showToast(data.error?.message || 'Failed to delete query', 'error');
        await refreshQueries();
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred during deletion', 'error');
      await refreshQueries();
    }
  };

  // Open detail view and automatically mark as reviewed if unread
  const openQueryDetail = (query: ContactQuery) => {
    setSelectedQuery(query);
    if (query.status === 'unread' || query.status === 'pending') {
      handleUpdateStatus(query.id, 'reviewed');
    }
  };

  // Filtered queries
  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'unread' && q.status !== 'unread' && q.status !== 'pending') return false;
        if (selectedStatus === 'reviewed' && q.status !== 'reviewed' && q.status !== 'read') return false;
        if (selectedStatus === 'replied' && q.status !== 'replied') return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = (q.name || '').toLowerCase().includes(query);
        const matchEmail = (q.email || '').toLowerCase().includes(query);
        const matchSubject = (q.subject || '').toLowerCase().includes(query);
        const matchMessage = (q.message || '').toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchSubject && !matchMessage) {
          return false;
        }
      }
      return true;
    });
  }, [queries, selectedStatus, searchQuery]);

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center justify-between border shadow-sm ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button onClick={() => setToast(null)} className="text-xs font-bold text-slate-400 hover:text-slate-700">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Header (Clean Light Mode) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-[#f06d2f] border border-orange-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Inbox size={22} />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Contact Queries &amp; Subscriptions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-body">
              Manage messages and subscription requests from users.
            </p>
          </div>
        </div>
      </div>

      {/* ── 1. KPI Cards Row (Light Mode) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Queries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-heading font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Queries
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
              {counts.total}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <MessageSquare size={22} />
          </div>
        </div>

        {/* Unread / Pending */}
        <div className="bg-white rounded-2xl p-5 border border-orange-200 bg-orange-50/20 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-heading font-bold text-[#f06d2f] uppercase tracking-wider mb-1">
              Unread / Pending
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#f06d2f]">
              {counts.unread}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#f06d2f] flex items-center justify-center">
            <Mail size={22} />
          </div>
        </div>

        {/* Reviewed */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200 bg-emerald-50/20 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-heading font-bold text-emerald-700 uppercase tracking-wider mb-1">
              Reviewed
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-800">
              {counts.reviewed}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Replied */}
        <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-heading font-bold text-blue-600 uppercase tracking-wider mb-1">
              Replied
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
              {counts.replied}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MailOpen size={22} />
          </div>
        </div>
      </div>

      {/* ── 2. Filters & Search Toolbar (Light Mode) ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {[
            { label: 'All Queries', value: 'all', count: counts.total },
            { label: 'Unread', value: 'unread', count: counts.unread },
            { label: 'Reviewed', value: 'reviewed', count: counts.reviewed },
            { label: 'Replied', value: 'replied', count: counts.replied },
          ].map((tab) => {
            const isActive = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={`text-xs font-heading font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#f06d2f] text-white shadow-xs'
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

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by sender, email, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-[#f06d2f] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Table (Clean Columns: DATE, NAME, EMAIL, STATUS, ACTIONS) ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-heading font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6">NAME</th>
                <th className="py-4 px-6">EMAIL</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-slate-400">
                    <p className="font-heading font-bold text-slate-700 text-sm mb-1">No Contact Queries Found</p>
                    <p className="text-xs text-slate-500">
                      {searchQuery
                        ? `No messages matching "${searchQuery}".`
                        : 'No queries submitted in this category yet.'}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-3 text-xs text-[#f06d2f] hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <RotateCcw size={12} /> Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredQueries.map((q) => {
                  const isUnread = q.status === 'unread' || q.status === 'pending';

                  return (
                    <tr
                      key={q.id}
                      onClick={() => openQueryDetail(q)}
                      className={`group hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isUnread ? 'bg-orange-50/20' : ''
                      }`}
                    >
                      {/* Column 1: DATE */}
                      <td className="py-4 px-6 text-xs text-slate-600 font-mono whitespace-nowrap">
                        <span suppressHydrationWarning>{formatQueryDate(q.created_at)}</span>
                      </td>

                      {/* Column 2: NAME */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isUnread && <span className="w-2 h-2 rounded-full bg-[#f06d2f] shrink-0" />}
                          <span className="font-heading font-bold text-slate-900 text-sm">
                            {q.name}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: EMAIL */}
                      <td className="py-4 px-6 text-xs text-slate-700 font-mono whitespace-nowrap">
                        {q.email}
                      </td>

                      {/* Column 4: STATUS */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {q.status === 'reviewed' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-heading font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                            <span>Reviewed</span>
                          </span>
                        ) : q.status === 'replied' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-heading font-bold">
                            <CheckCircle2 size={12} className="text-blue-600" />
                            <span>Replied</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#f06d2f] border border-orange-200 text-xs font-heading font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f06d2f] animate-pulse" />
                            <span>Unread</span>
                          </span>
                        )}
                      </td>

                      {/* Column 5: ACTIONS */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div
                          className="inline-flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* View Button */}
                          <button
                            type="button"
                            onClick={() => openQueryDetail(q)}
                            className="px-4 py-1.5 rounded-lg bg-[#f06d2f] hover:bg-[#e05a1b] text-white text-xs font-heading font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                          >
                            View
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(q.id)}
                            className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. View Query Modal ── */}
      <AnimatePresence>
        {selectedQuery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Top Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#f06d2f] px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200">
                    {selectedQuery.category || 'General Inquiry'}
                  </span>
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900 mt-2">
                    {selectedQuery.subject || 'Contact Inquiry Details'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1" suppressHydrationWarning>
                    Submitted: {formatQueryDate(selectedQuery.created_at)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedQuery(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Sender Details Box */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-mono uppercase text-[10px]">Sender Name</p>
                  <p className="font-heading font-bold text-slate-900 text-sm mt-0.5">
                    {selectedQuery.name}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 font-mono uppercase text-[10px]">Sender Email</p>
                  <a
                    href={`mailto:${selectedQuery.email}?subject=Re: ${encodeURIComponent(
                      selectedQuery.subject || 'HealthGhuru Inquiry'
                    )}`}
                    className="font-mono font-bold text-[#f06d2f] hover:underline text-sm mt-0.5 inline-flex items-center gap-1"
                  >
                    <span>{selectedQuery.email}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div>
                  <p className="text-slate-400 font-mono uppercase text-[10px]">Current Status</p>
                  <div className="mt-1">
                    {selectedQuery.status === 'reviewed' ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-600" /> Reviewed
                      </span>
                    ) : selectedQuery.status === 'replied' ? (
                      <span className="text-blue-700 font-bold flex items-center gap-1">
                        <MailOpen size={13} className="text-blue-600" /> Replied
                      </span>
                    ) : (
                      <span className="text-orange-600 font-bold">Unread / Pending</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Message Body */}
              <div className="space-y-2">
                <p className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider">
                  Message Content:
                </p>
                <div className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm leading-relaxed font-body whitespace-pre-wrap shadow-2xs">
                  {selectedQuery.message}
                </div>
              </div>

              {/* Status Action Buttons & Reply CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedQuery.id, 'reviewed')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark as Reviewed</span>
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedQuery.id, 'unread')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-bold transition-colors cursor-pointer"
                  >
                    Mark as Unread
                  </button>
                </div>

                <a
                  href={`mailto:${selectedQuery.email}?subject=Re: ${encodeURIComponent(
                    selectedQuery.subject || 'HealthGhuru Inquiry'
                  )}&body=%0A%0A---%0AOriginal Message from ${encodeURIComponent(selectedQuery.name)}:%0A${encodeURIComponent(selectedQuery.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f06d2f] to-[#ff7d42] hover:brightness-105 text-white text-xs font-heading font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Send size={14} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 5. Delete Confirmation Modal ── */}
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
                  <h3 className="font-heading font-bold text-base text-slate-900">Delete Contact Query</h3>
                  <p className="text-xs text-slate-500">This action will remove the record permanently.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete this message?
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors cursor-pointer"
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
