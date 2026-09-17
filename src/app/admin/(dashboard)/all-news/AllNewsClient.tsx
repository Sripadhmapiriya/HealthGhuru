'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
  Search,
  CheckSquare,
  Square,
  X,
  Save,
  Upload,
  Plus,
  Loader2,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  language?: string;
  excerpt?: string;
  description?: string;
  image_url?: string;
  published_at: string;
  is_breaking?: boolean;
  raw_metadata?: any;
}

interface AllNewsClientProps {
  initialNews: NewsItem[];
  totalCount: number;
}

function timeAgo(dateString: string) {
  if (!dateString) return 'just now';
  const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function getFormattedTamilDate(date: Date = new Date()) {
  try {
    const dateStr = date.toLocaleDateString('ta-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const dayStr = date.toLocaleDateString('ta-IN', { weekday: 'long' });
    return `${dateStr} | ${dayStr}`;
  } catch {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
  }
}

const HEALTH_CATEGORIES = [
  'All Categories',
  'Heart',
  'Cancer',
  'Diabetes',
  "Women's Health",
  'Pediatrics',
  'Mental Health',
  'Fitness',
  'Nutrition',
  'Ayurveda',
  'Neurology',
  'Orthopedics',
  'General Health',
  'Education',
  'Business',
];

export function AllNewsClient({ initialNews, totalCount: serverTotalCount }: AllNewsClientProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    language: 'en',
    location: '',
    excerpt: '',
    content: '',
    heroImageUrl: '',
    isBreaking: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [modalMessage, setModalMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Filter news
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      if (selectedLanguage !== 'all' && (item.language || 'en') !== selectedLanguage) return false;
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchExcerpt = item.excerpt?.toLowerCase().includes(q);
        if (!matchTitle && !matchExcerpt) return false;
      }
      return true;
    });
  }, [news, selectedLanguage, selectedCategory, searchQuery]);

  // Tamil Formatted Date string
  const todayHeaderStr = useMemo(() => getFormattedTamilDate(new Date()), []);

  // Open Edit Modal
  const handleOpenEdit = (item: NewsItem) => {
    let rawMeta: any = {};
    try {
      rawMeta = typeof item.raw_metadata === 'string'
        ? JSON.parse(item.raw_metadata)
        : item.raw_metadata || {};
    } catch {
      rawMeta = {};
    }

    setEditingItem(item);
    setEditFormData({
      title: item.title || '',
      subtitle: rawMeta?.subtitle || '',
      category: item.category || 'General Health',
      language: item.language || 'en',
      location: rawMeta?.location || '',
      excerpt: item.excerpt || '',
      content: item.description || item.excerpt || '',
      heroImageUrl: item.image_url || '',
      isBreaking: Boolean(item.is_breaking),
    });
    setModalMessage(null);
  };

  // Upload image inside Edit Modal
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setEditFormData((prev) => ({ ...prev, heroImageUrl: data.url }));
      } else {
        alert('Image upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save Edited News
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    setModalMessage(null);
    try {
      const res = await fetch(`/api/admin/news/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (data.success) {
        setNews((prev) =>
          prev.map((n) =>
            n.id === editingItem.id
              ? {
                  ...n,
                  title: editFormData.title,
                  category: editFormData.category,
                  language: editFormData.language,
                  excerpt: editFormData.excerpt,
                  description: editFormData.content,
                  image_url: editFormData.heroImageUrl,
                  is_breaking: editFormData.isBreaking,
                  raw_metadata: {
                    ...(typeof n.raw_metadata === 'object' ? n.raw_metadata : {}),
                    subtitle: editFormData.subtitle,
                    location: editFormData.location,
                  },
                }
              : n
          )
        );
        setModalMessage({ type: 'success', text: 'News updated successfully!' });
        setTimeout(() => setEditingItem(null), 900);
      } else {
        throw new Error(data.error || 'Failed to update news');
      }
    } catch (err: any) {
      setModalMessage({ type: 'error', text: err.message || 'Error saving changes' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Single News Item
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete:\n"${title}"?\nThis will remove it from the website immediately.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNews((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Failed to delete: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      alert('Delete error: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Batch Selection toggles
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNews.map((n) => n.id));
    }
  };

  // Delete All / Delete Selected
  const handleDeleteAllOrSelected = async () => {
    const isTargetingSelected = selectionMode && selectedIds.length > 0;
    const targetCount = isTargetingSelected ? selectedIds.length : filteredNews.length;

    if (targetCount === 0) {
      alert('No news articles selected to delete.');
      return;
    }

    const message = isTargetingSelected
      ? `Delete ${targetCount} selected articles permanently?`
      : `Are you sure you want to delete all ${targetCount} filtered articles?`;

    if (!confirm(message)) return;

    setIsBatchDeleting(true);
    try {
      const idsToDelete = isTargetingSelected ? selectedIds : filteredNews.map((n) => n.id);
      const res = await fetch('/api/admin/news/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_selected',
          ids: idsToDelete,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNews((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
        setSelectedIds([]);
        setSelectionMode(false);
      } else {
        alert('Batch delete failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error during batch delete: ' + err.message);
    } finally {
      setIsBatchDeleting(false);
    }
  };

  // Delete Day's News
  const handleDeleteDaysNews = async () => {
    if (!confirm(`Are you sure you want to delete all news articles published today (${todayHeaderStr})? This will remove them immediately from the website.`)) {
      return;
    }

    setIsBatchDeleting(true);
    try {
      const res = await fetch('/api/admin/news/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_today' }),
      });
      const data = await res.json();
      if (data.success) {
        const todayDate = new Date().toISOString().slice(0, 10);
        setNews((prev) => prev.filter((item) => !item.published_at?.startsWith(todayDate)));
        alert(`Successfully deleted ${data.count} articles published today.`);
      } else {
        alert('Failed to delete day news: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error deleting day news: ' + err.message);
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const totalDisplay = Math.max(serverTotalCount, news.length);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
      
      {/* ── 1. Top Bar Controls (Clean White & Light Green) ── */}
      <div className="bg-white border border-border rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Heading with Eyebrow */}
        <div>
          <span className="text-[11px] font-mono text-primary font-bold uppercase tracking-wider block mb-0.5">
            News Management Archive
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-dark">
            All News
          </h1>
        </div>

        {/* Right: Controls Row */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white border border-gray-200 text-dark rounded-xl px-3 py-2 text-xs font-semibold focus:border-primary outline-hidden shadow-2xs cursor-pointer hover:border-gray-300 transition-colors"
          >
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
            <option value="te">Telugu</option>
          </select>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-gray-200 text-dark rounded-xl px-3 py-2 text-xs font-semibold focus:border-primary outline-hidden shadow-2xs cursor-pointer hidden md:block hover:border-gray-300 transition-colors"
          >
            {HEALTH_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Total Badge - Matches the Sidebar Active Pill */}
          <span className="bg-primary/10 border border-primary/20 text-primary px-3.5 py-2 rounded-xl text-xs font-mono font-bold">
            Total: {totalDisplay}
          </span>

          {/* Select Button */}
          <button
            type="button"
            onClick={() => {
              setSelectionMode(!selectionMode);
              setSelectedIds([]);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all border inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              selectionMode
                ? 'bg-primary/15 text-primary border-primary'
                : 'bg-white text-text-secondary border-gray-200 hover:bg-surface hover:text-dark'
            }`}
          >
            <CheckSquare size={14} className={selectionMode ? 'text-primary' : 'text-text-muted'} />
            <span>{selectionMode ? 'Cancel' : 'Select'}</span>
          </button>

          {/* If selection mode active, Select All toggle */}
          {selectionMode && (
            <button
              type="button"
              onClick={toggleSelectAll}
              className="px-3 py-2 bg-surface border border-gray-200 text-text-secondary hover:text-dark rounded-xl text-xs font-heading font-semibold cursor-pointer"
            >
              {selectedIds.length === filteredNews.length ? 'Deselect All' : 'Select All'}
            </button>
          )}

          {/* Delete All / Delete Selected */}
          <button
            type="button"
            disabled={isBatchDeleting}
            onClick={handleDeleteAllOrSelected}
            className="px-3.5 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-xs font-heading font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isBatchDeleting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            <span>
              {selectionMode && selectedIds.length > 0
                ? `Delete Selected (${selectedIds.length})`
                : 'Delete All'}
            </span>
          </button>

          {/* Add News Button */}
          <Link
            href="/admin/add-news"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-heading font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add News</span>
          </Link>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search news by headline, tags, or topics..."
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-dark placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-hidden shadow-2xs transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-dark cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── 2. Date Header Bar (Light Green Theme like Sidebar) ── */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
        {/* Left: Tamil Formatted Date */}
        <div className="flex items-center gap-2 text-xs font-heading font-bold text-primary">
          <span className="text-base leading-none">📅</span>
          <span>{todayHeaderStr}</span>
        </div>

        {/* Right: Delete Day's News Button */}
        <button
          type="button"
          disabled={isBatchDeleting}
          onClick={handleDeleteDaysNews}
          className="px-3 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg text-xs font-heading font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isBatchDeleting ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Trash2 size={13} />
          )}
          <span>Delete Day&apos;s News</span>
        </button>
      </div>

      {/* ── 3. 4-Column News Cards Grid (Clean White Card with Light Green Accents) ── */}
      {filteredNews.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-16 text-center text-text-secondary space-y-3 shadow-sm">
          <p className="text-sm font-semibold text-dark">No news articles found</p>
          <p className="text-xs text-text-muted">
            {searchQuery ? `No results for "${searchQuery}"` : 'No stories match the active filters.'}
          </p>
          <div>
            <Link
              href="/admin/add-news"
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>Publish First Article</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredNews.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const coverImg =
              item.image_url ||
              'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80';
            const langCode = (item.language || 'en').toLowerCase();
            const langLabel =
              langCode === 'ta'
                ? 'TAMIL'
                : langCode === 'hi'
                ? 'HINDI'
                : langCode === 'te'
                ? 'TELUGU'
                : 'ENGLISH';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between group hover:shadow-md ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/30 shadow-md'
                    : 'border-border hover:border-primary/50 shadow-xs'
                }`}
              >
                {/* Card Upper: Media + Meta + Text */}
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] w-full bg-surface-alt overflow-hidden border-b border-border/50">
                    <img
                      src={coverImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Batch Selection Checkbox */}
                    {selectionMode && (
                      <button
                        type="button"
                        onClick={() => toggleSelect(item.id)}
                        className="absolute top-2.5 left-2.5 z-10 bg-white/95 hover:bg-white p-1.5 rounded-lg text-dark shadow-sm transition-colors cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare size={16} className="text-primary" />
                        ) : (
                          <Square size={16} className="text-gray-400" />
                        )}
                      </button>
                    )}

                    {/* Breaking News Pulse Badge */}
                    {item.is_breaking && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="bg-red-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase shadow-xs flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          BREAKING
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content Area */}
                  <div className="p-4 space-y-2.5">
                    {/* Category & Language Pills (Matches the Light Green Sidebar Aesthetic) */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                        {item.category || 'Health'}
                      </span>
                      <span className="bg-sky-50 text-sky-700 border border-sky-200/70 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                        {langLabel}
                      </span>
                    </div>

                    {/* Article Headline */}
                    <h3
                      className="font-heading font-bold text-sm text-dark line-clamp-2 leading-snug group-hover:text-primary transition-colors cursor-pointer"
                      onClick={() => handleOpenEdit(item)}
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {/* Article Excerpt / Summary */}
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-normal">
                      {item.excerpt || item.description || ''}
                    </p>
                  </div>
                </div>

                {/* Card Lower: Clock + Live View + Action Buttons */}
                <div className="p-4 pt-0 space-y-3">
                  {/* Elapsed Time & Live Page Link */}
                  <div className="flex items-center justify-between text-[11px] text-text-muted font-mono pt-2 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1 text-text-secondary">
                      <Clock size={12} className="text-text-muted" />
                      <span>{timeAgo(item.published_at)}</span>
                    </span>

                    <Link
                      href={`/article/${item.slug}`}
                      target="_blank"
                      className="text-text-muted hover:text-primary inline-flex items-center gap-1 transition-colors font-sans font-medium"
                      title="View live article"
                    >
                      <span>View</span>
                      <ExternalLink size={11} />
                    </Link>
                  </div>

                  {/* Edit News & Delete News Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="py-2 px-3 bg-[#f06d2f] hover:bg-[#d95d22] text-white text-xs font-heading font-bold rounded-xl transition-colors text-center cursor-pointer shadow-xs hover:shadow-sm"
                    >
                      Edit News
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item.id, item.title)}
                      className="py-2 px-3 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-heading font-bold rounded-xl transition-colors text-center cursor-pointer shadow-xs hover:shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-1"
                    >
                      {deletingId === item.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : null}
                      <span>{deletingId === item.id ? 'Deleting...' : 'Delete News'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. Interactive Edit News Modal (Clean Light Theme) ── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 text-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="font-heading font-bold text-lg text-dark">Edit News Story</h2>
                <span className="text-xs font-mono text-text-muted">Slug: /{editingItem.slug}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-text-muted hover:text-dark p-1.5 rounded-lg hover:bg-surface cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Notification alert banner */}
            {modalMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  modalMessage.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {modalMessage.type === 'error' ? <AlertCircle size={14} className="text-red-600" /> : <Check size={14} className="text-emerald-600" />}
                <span>{modalMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="font-heading font-bold block mb-1 text-text-secondary">
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full bg-surface border border-gray-200 rounded-xl px-3 py-2 text-sm text-dark focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-hidden font-medium transition-all"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="font-heading font-bold block mb-1 text-text-secondary">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editFormData.subtitle}
                  onChange={(e) => setEditFormData({ ...editFormData, subtitle: e.target.value })}
                  className="w-full bg-surface border border-gray-200 rounded-xl px-3 py-2 text-sm text-dark focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-hidden transition-all"
                />
              </div>

              {/* Category & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-bold block mb-1 text-text-secondary">Category *</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-surface border border-gray-200 rounded-xl px-3 py-2 text-dark focus:bg-white focus:border-primary outline-hidden font-medium cursor-pointer"
                  >
                    {HEALTH_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-heading font-bold block mb-1 text-text-secondary">Language *</label>
                  <select
                    value={editFormData.language}
                    onChange={(e) => setEditFormData({ ...editFormData, language: e.target.value })}
                    className="w-full bg-surface border border-gray-200 rounded-xl px-3 py-2 text-dark focus:bg-white focus:border-primary outline-hidden font-medium cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="font-heading font-bold block mb-1 text-text-secondary">Location</label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  placeholder="e.g. Chennai, Tamil Nadu"
                  className="w-full bg-surface border border-gray-200 rounded-xl px-3 py-2 text-dark focus:bg-white focus:border-primary outline-hidden"
                />
              </div>

              {/* Short Summary */}
              <div>
                <label className="font-heading font-bold block mb-1 text-text-secondary">
                  Short Summary / Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editFormData.excerpt}
                  onChange={(e) => setEditFormData({ ...editFormData, excerpt: e.target.value })}
                  className="w-full bg-surface border border-gray-200 rounded-xl px-3 py-2 text-dark focus:bg-white focus:border-primary outline-hidden leading-relaxed"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="font-heading font-bold block mb-1 text-text-secondary">
                  Full Article Content *
                </label>
                <textarea
                  required
                  rows={6}
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  className="w-full bg-surface border border-gray-200 rounded-xl px-3 py-2 text-dark focus:bg-white focus:border-primary outline-hidden leading-relaxed font-sans"
                />
              </div>

              {/* Cover Image URL + Direct Upload */}
              <div>
                <label className="font-heading font-bold block mb-1 text-text-secondary">
                  Cover Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editFormData.heroImageUrl}
                    onChange={(e) => setEditFormData({ ...editFormData, heroImageUrl: e.target.value })}
                    placeholder="https://... or /uploads/..."
                    className="flex-1 bg-surface border border-gray-200 rounded-xl px-3 py-2 text-dark focus:bg-white focus:border-primary outline-hidden"
                  />
                  <label className="px-3.5 py-2 bg-surface hover:bg-surface-alt text-dark border border-gray-200 rounded-xl font-semibold cursor-pointer inline-flex items-center gap-1.5 shadow-2xs">
                    {isUploadingImage ? <Loader2 size={13} className="animate-spin text-primary" /> : <Upload size={13} className="text-primary" />}
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                {editFormData.heroImageUrl && (
                  <div className="mt-2.5 w-32 h-20 rounded-xl overflow-hidden border border-gray-200 bg-surface">
                    <img
                      src={editFormData.heroImageUrl}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Breaking News Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="edit_breaking"
                  checked={editFormData.isBreaking}
                  onChange={(e) => setEditFormData({ ...editFormData, isBreaking: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="edit_breaking" className="text-text-secondary cursor-pointer font-semibold">
                  Mark as Breaking News (முக்கிய செய்தி - shows on live ticker)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-surface hover:bg-surface-alt text-text-secondary rounded-xl font-semibold cursor-pointer border border-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-heading font-bold shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{isSaving ? 'Saving Changes...' : 'Update News'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
