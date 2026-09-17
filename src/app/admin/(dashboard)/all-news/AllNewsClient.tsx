'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  CheckSquare,
  Square,
  AlertTriangle,
  X,
  Sparkles,
  Save,
  Upload,
  Eye,
  Plus,
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
  if (!dateString) return 'Just now';
  const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
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
];

export function AllNewsClient({ initialNews, totalCount }: AllNewsClientProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
  const [modalMessage, setModalMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Filter news
  const filteredNews = news.filter((item) => {
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

  // Open Edit Modal
  const handleOpenEdit = (item: NewsItem) => {
    let rawMeta = {};
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
      subtitle: (rawMeta as any).subtitle || '',
      category: item.category || 'Heart',
      language: item.language || 'en',
      location: (rawMeta as any).location || '',
      excerpt: item.excerpt || '',
      content: item.description || item.excerpt || '',
      heroImageUrl: item.image_url || '',
      isBreaking: Boolean(item.is_breaking),
    });
    setModalMessage(null);
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
                }
              : n
          )
        );
        setModalMessage({ type: 'success', text: 'News updated successfully!' });
        setTimeout(() => setEditingItem(null), 1200);
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
    if (!confirm(`Are you sure you want to delete:\n"${title}"?\nThis will remove it from the user website immediately.`)) {
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

  // Batch Selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete Selected
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected news articles permanently?`)) return;

    for (const id of selectedIds) {
      await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    }
    setNews((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setSelectionMode(false);
  };

  // Formatted today date header
  const todayHeaderStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* ── 1. Top Bar Controls (Matches Reference Image) ── */}
      <div className="bg-[#181818] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-[#f06d2f] font-bold uppercase tracking-wider block mb-0.5">
            News Management Archive
          </span>
          <h1 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-white">
            All News
          </h1>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#242424] border border-gray-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:border-[#f06d2f] outline-hidden"
          >
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="te">Telugu (తెలుగు)</option>
          </select>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#242424] border border-gray-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:border-[#f06d2f] outline-hidden hidden md:block"
          >
            {HEALTH_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Total Badge */}
          <span className="bg-[#2a2a2a] border border-gray-700 text-gray-200 px-3 py-2 rounded-xl text-xs font-mono font-bold">
            Total: {totalCount}
          </span>

          {/* Select Toggle */}
          <button
            type="button"
            onClick={() => {
              setSelectionMode(!selectionMode);
              setSelectedIds([]);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all border ${
              selectionMode
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-[#242424] text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
          >
            {selectionMode ? 'Cancel Selection' : '☑ Select'}
          </button>

          {/* Delete Action */}
          {selectionMode ? (
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-heading font-bold shadow-xs disabled:opacity-40 transition-colors"
            >
              Delete Selected ({selectedIds.length})
            </button>
          ) : (
            <Link
              href="/admin/add-news"
              className="px-4 py-2 bg-[#f06d2f] hover:bg-[#e05b1d] text-white rounded-xl text-xs font-heading font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add News</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search news by headline, keywords, or topics..."
          className="w-full pl-11 pr-4 py-3 bg-[#181818] border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:border-[#f06d2f] outline-hidden"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── 2. Date Grouping Header (Matches Reference) ── */}
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-heading font-bold text-gray-200">
          <Calendar size={15} className="text-[#f06d2f]" />
          <span>📅 {todayHeaderStr}</span>
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          Showing {filteredNews.length} articles
        </span>
      </div>

      {/* ── 3. 4-Column News Cards Grid (Matches Reference) ── */}
      {filteredNews.length === 0 ? (
        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-16 text-center text-gray-400">
          <p className="text-sm font-semibold mb-2">No news stories found</p>
          <p className="text-xs text-gray-500 mb-4">Try clearing filters or search query.</p>
          <Link
            href="/admin/add-news"
            className="px-4 py-2 bg-[#f06d2f] text-white rounded-xl text-xs font-bold inline-block"
          >
            Publish New Article
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredNews.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const coverImg = item.image_url || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={item.id}
                className={`bg-[#181818] rounded-2xl overflow-hidden border transition-all flex flex-col justify-between group ${
                  isSelected ? 'border-amber-500 ring-2 ring-amber-500/40' : 'border-gray-800 hover:border-gray-700 shadow-md'
                }`}
              >
                {/* Card Top: Image with Badges */}
                <div>
                  <div className="relative aspect-[16/10] w-full bg-gray-900 overflow-hidden">
                    <img
                      src={coverImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Checkbox for batch selection */}
                    {selectionMode && (
                      <button
                        type="button"
                        onClick={() => toggleSelect(item.id)}
                        className="absolute top-2.5 left-2.5 z-10 bg-black/70 p-1.5 rounded-lg text-white"
                      >
                        {isSelected ? <CheckSquare size={16} className="text-amber-400" /> : <Square size={16} />}
                      </button>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      {item.is_breaking && (
                        <span className="bg-red-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase shadow-xs animate-pulse">
                          BREAKING
                        </span>
                      )}
                    </div>

                    {/* Bottom overlay pills */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="bg-[#b35900] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                        {item.category || 'Health'}
                      </span>
                      <span className="bg-sky-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs uppercase">
                        {item.language === 'ta' ? 'TAMIL' : item.language === 'hi' ? 'HINDI' : 'ENGLISH'}
                      </span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-heading font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-[#f06d2f] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {item.excerpt || item.description || ''}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Elapsed Time & Action Buttons */}
                <div className="p-4 pt-0 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} className="text-gray-400" />
                      <span>{timeAgo(item.published_at)}</span>
                    </span>

                    <Link
                      href={`/article/${item.slug}`}
                      target="_blank"
                      className="text-gray-400 hover:text-[#f06d2f] inline-flex items-center gap-0.5"
                      title="View on Live Website"
                    >
                      <span>View</span>
                      <ExternalLink size={11} />
                    </Link>
                  </div>

                  {/* Edit & Delete Action Buttons (Matches Reference Screenshot) */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="py-2 px-3 bg-[#f06d2f] hover:bg-[#e05b1d] text-white text-xs font-heading font-bold rounded-xl transition-colors text-center cursor-pointer shadow-xs"
                    >
                      Edit News
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item.id, item.title)}
                      className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-bold rounded-xl transition-colors text-center cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {deletingId === item.id ? 'Deleting...' : 'Delete News'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. Full Edit News Modal ── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#181818] border border-gray-800 text-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h2 className="font-heading font-bold text-lg text-white">Edit News Story</h2>
                <span className="text-xs font-mono text-gray-400">/{editingItem.slug}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            {modalMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  modalMessage.type === 'error'
                    ? 'bg-red-950 text-red-200 border border-red-800'
                    : 'bg-emerald-950 text-emerald-200 border border-emerald-800'
                }`}
              >
                {modalMessage.text}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="font-heading font-bold block mb-1 text-gray-300">Headline *</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full bg-[#242424] border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#f06d2f] outline-hidden"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="font-heading font-bold block mb-1 text-gray-300">Subtitle</label>
                <input
                  type="text"
                  value={editFormData.subtitle}
                  onChange={(e) => setEditFormData({ ...editFormData, subtitle: e.target.value })}
                  className="w-full bg-[#242424] border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#f06d2f] outline-hidden"
                />
              </div>

              {/* Category & Language Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-bold block mb-1 text-gray-300">Category *</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-[#242424] border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-[#f06d2f] outline-hidden"
                  >
                    {HEALTH_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-heading font-bold block mb-1 text-gray-300">Language *</label>
                  <select
                    value={editFormData.language}
                    onChange={(e) => setEditFormData({ ...editFormData, language: e.target.value })}
                    className="w-full bg-[#242424] border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-[#f06d2f] outline-hidden"
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
                <label className="font-heading font-bold block mb-1 text-gray-300">Location</label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  placeholder="e.g. Chennai, Tamil Nadu"
                  className="w-full bg-[#242424] border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-[#f06d2f] outline-hidden"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="font-heading font-bold block mb-1 text-gray-300">Short Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={editFormData.excerpt}
                  onChange={(e) => setEditFormData({ ...editFormData, excerpt: e.target.value })}
                  className="w-full bg-[#242424] border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-[#f06d2f] outline-hidden leading-relaxed"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="font-heading font-bold block mb-1 text-gray-300">Full Content *</label>
                <textarea
                  required
                  rows={6}
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  className="w-full bg-[#242424] border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-[#f06d2f] outline-hidden leading-relaxed"
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="font-heading font-bold block mb-1 text-gray-300">Cover Image URL</label>
                <input
                  type="text"
                  value={editFormData.heroImageUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, heroImageUrl: e.target.value })}
                  className="w-full bg-[#242424] border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-[#f06d2f] outline-hidden"
                />
              </div>

              {/* Breaking News Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit_breaking"
                  checked={editFormData.isBreaking}
                  onChange={(e) => setEditFormData({ ...editFormData, isBreaking: e.target.checked })}
                  className="rounded border-gray-700 bg-gray-800 text-[#f06d2f] focus:ring-[#f06d2f]"
                />
                <label htmlFor="edit_breaking" className="text-gray-300 cursor-pointer font-semibold">
                  Mark as Breaking News (Display in live homepage ticker)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#f06d2f] hover:bg-[#e05b1d] text-white rounded-xl font-heading font-bold shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{isSaving ? 'Saving...' : 'Update News'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
