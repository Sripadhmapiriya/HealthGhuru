'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, FileText,
  X, Check, AlertCircle, Hospital, Calendar, ExternalLink, Upload,
} from 'lucide-react';
import { SponsoredArticle } from '@/lib/types/advertisement';
import Image from 'next/image';

const ADVERTISER_TYPES = [
  { value: 'hospital', label: '🏥 Hospital' },
  { value: 'doctor', label: '👨‍⚕️ Doctor / Specialist' },
  { value: 'clinic', label: '🏪 Clinic' },
  { value: 'pharmacy', label: '💊 Pharmacy' },
];

function SponsoredArticleModal({
  isOpen,
  onClose,
  articleToEdit,
  onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  articleToEdit: SponsoredArticle | null;
  onSaved: (article: SponsoredArticle, isNew: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    article_id: articleToEdit?.article_id || '',
    article_title: articleToEdit?.article_title || '',
    article_slug: articleToEdit?.article_slug || '',
    advertiser_name: articleToEdit?.advertiser_name || '',
    advertiser_type: articleToEdit?.advertiser_type || 'hospital',
    advertiser_logo_url: articleToEdit?.advertiser_logo_url || '',
    sponsor_label: articleToEdit?.sponsor_label || 'Sponsored by',
    cta_text: articleToEdit?.cta_text || 'Learn More',
    cta_url: articleToEdit?.cta_url || '',
    is_active: articleToEdit?.is_active ?? true,
    start_date: articleToEdit?.start_date ? articleToEdit.start_date.split('T')[0] : '',
    end_date: articleToEdit?.end_date ? articleToEdit.end_date.split('T')[0] : '',
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, advertiser_logo_url: json.url }));
      } else {
        setError(json.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.article_title || !formData.article_slug || !formData.advertiser_name) {
      setError('Article title, slug and advertiser name are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = articleToEdit
        ? `/api/admin/sponsored-articles/${articleToEdit.id}`
        : '/api/admin/sponsored-articles';
      const method = articleToEdit ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        article_id: formData.article_id || formData.article_slug,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        cta_url: formData.cta_url || null,
        advertiser_logo_url: formData.advertiser_logo_url || null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        onSaved(json.article, !articleToEdit);
        onClose();
      } else {
        setError(json.error || 'Failed to save');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-8">
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50">
          <div>
            <h2 className="font-heading font-bold text-lg text-dark">
              {articleToEdit ? 'Edit Sponsored Article' : 'Link Sponsored Article'}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">Associate a health article with a hospital or doctor sponsor.</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-dark hover:bg-surface rounded-full">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Article Info */}
          <div className="space-y-3 p-4 bg-surface/40 rounded-xl border border-border">
            <h4 className="text-xs font-heading font-bold text-dark flex items-center gap-1.5">
              <FileText size={13} /> Article Details
            </h4>
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-heading font-semibold text-dark mb-1">Article Title *</label>
                <input type="text" required
                  value={formData.article_title}
                  onChange={(e) => setFormData({ ...formData, article_title: e.target.value })}
                  placeholder="e.g. 5 Signs You Need a Cardiac Check-Up"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-heading font-semibold text-dark mb-1">Article Slug * <span className="text-text-secondary font-normal">(URL path)</span></label>
                <input type="text" required
                  value={formData.article_slug}
                  onChange={(e) => setFormData({ ...formData, article_slug: e.target.value })}
                  placeholder="e.g. 5-signs-cardiac-checkup"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:border-primary outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Advertiser Info */}
          <div className="space-y-3 p-4 bg-blue-50/40 rounded-xl border border-blue-200">
            <h4 className="text-xs font-heading font-bold text-blue-800 flex items-center gap-1.5">
              <Hospital size={13} /> Hospital / Doctor Sponsor
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-heading font-semibold text-dark mb-1">Sponsor Name *</label>
                <input type="text" required
                  value={formData.advertiser_name}
                  onChange={(e) => setFormData({ ...formData, advertiser_name: e.target.value })}
                  placeholder="e.g. Apollo Hospitals"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-heading font-semibold text-dark mb-1">Sponsor Type</label>
                <select value={formData.advertiser_type}
                  onChange={(e) => setFormData({ ...formData, advertiser_type: e.target.value as 'hospital' | 'doctor' | 'clinic' | 'pharmacy' })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:border-primary outline-none bg-white"
                >
                  {ADVERTISER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold text-dark mb-1">Sponsor Badge Label</label>
              <input type="text"
                value={formData.sponsor_label}
                onChange={(e) => setFormData({ ...formData, sponsor_label: e.target.value })}
                placeholder="Sponsored by"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>

            {/* Logo upload */}
            <div>
              <label className="block text-[11px] font-heading font-semibold text-dark mb-2">Sponsor Logo</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
                  <Upload size={13} className={uploading ? 'animate-bounce' : ''} />
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="hidden" />
                </label>
                {formData.advertiser_logo_url && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-blue-200">
                    <Image src={formData.advertiser_logo_url} alt="logo" fill className="object-contain p-1" unoptimized />
                  </div>
                )}
                {formData.advertiser_logo_url && (
                  <button type="button" onClick={() => setFormData({ ...formData, advertiser_logo_url: '' })}
                    className="text-xs text-red-500 hover:text-red-700"
                  >Remove</button>
                )}
              </div>
            </div>
          </div>

          {/* CTA & Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-heading font-semibold text-dark mb-1 flex items-center gap-1">
                <ExternalLink size={10} /> CTA URL <span className="font-normal text-text-secondary">(optional)</span>
              </label>
              <input type="url"
                value={formData.cta_url}
                onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                placeholder="https://hospital.com/contact"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-heading font-semibold text-dark mb-1">CTA Button Text</label>
              <input type="text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Book Appointment"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-heading font-semibold text-dark mb-1 flex items-center gap-1"><Calendar size={10} /> Start Date</label>
              <input type="date" value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-heading font-semibold text-dark mb-1 flex items-center gap-1"><Calendar size={10} /> End Date</label>
              <input type="date" value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border">
            <div>
              <span className="font-heading font-semibold text-xs text-dark block">Active Status</span>
              <span className="text-[11px] text-text-secondary">Show this sponsored badge on the article</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-end gap-3 bg-surface/50">
          <button type="button" onClick={onClose}
            className="px-5 py-2 text-xs font-heading font-semibold text-text-secondary hover:text-dark hover:bg-surface rounded-lg border border-border"
          >Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={loading}
            className="px-6 py-2 text-xs font-heading font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-md disabled:opacity-50"
          >
            {loading ? 'Saving...' : articleToEdit ? 'Update' : 'Link Article'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SponsoredArticlesClient({ initialArticles }: { initialArticles: SponsoredArticle[] }) {
  const [articles, setArticles] = useState<SponsoredArticle[]>(initialArticles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<SponsoredArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = articles.filter((a) =>
    searchQuery === '' ||
    a.article_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.advertiser_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (article: SponsoredArticle) => {
    const next = !article.is_active;
    setArticles((prev) => prev.map((a) => (a.id === article.id ? { ...a, is_active: next } : a)));
    try {
      const res = await fetch(`/api/admin/sponsored-articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: next }),
      });
      const json = await res.json();
      if (!json.success) {
        setArticles((prev) => prev.map((a) => (a.id === article.id ? { ...a, is_active: article.is_active } : a)));
      }
    } catch {
      setArticles((prev) => prev.map((a) => (a.id === article.id ? { ...a, is_active: article.is_active } : a)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this sponsorship?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/sponsored-articles/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {}
    finally { setDeletingId(null); }
  };

  const handleSaved = (article: SponsoredArticle, isNew: boolean) => {
    if (isNew) setArticles((prev) => [article, ...prev]);
    else setArticles((prev) => prev.map((a) => (a.id === article.id ? article : a)));
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl p-5 border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-2.5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by article title or sponsor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border focus:border-primary outline-none"
          />
        </div>
        <button
          onClick={() => { setArticleToEdit(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-heading font-semibold transition-all shadow-md shadow-primary/20 shrink-0"
        >
          <Plus size={16} /> Link Sponsored Article
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText size={40} className="mx-auto text-text-muted stroke-[1.5]" />
            <h3 className="font-heading font-bold text-base text-dark">No sponsored articles yet</h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              {searchQuery ? 'Try adjusting your search.' : 'Link your first hospital-sponsored article to display a sponsor badge.'}
            </p>
            <button
              onClick={() => { setArticleToEdit(null); setIsModalOpen(true); }}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium"
            >
              <Plus size={14} /> Link First Article
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-border text-[11px] font-heading font-semibold text-text-secondary uppercase tracking-wider">
                  <th className="py-3.5 px-5">Article</th>
                  <th className="py-3.5 px-4">Hospital / Doctor Sponsor</th>
                  <th className="py-3.5 px-4">Badge Label</th>
                  <th className="py-3.5 px-4">Campaign Dates</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-surface/30 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-heading font-bold text-dark line-clamp-1">{article.article_title}</div>
                      <div className="text-[11px] text-text-secondary font-mono">/{article.article_slug}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {article.advertiser_logo_url && (
                          <div className="relative w-7 h-7 rounded-md overflow-hidden border border-border shrink-0">
                            <Image src={article.advertiser_logo_url} alt={article.advertiser_name} fill className="object-contain p-0.5" unoptimized />
                          </div>
                        )}
                        <div>
                          <div className="font-heading font-semibold text-dark line-clamp-1">{article.advertiser_name}</div>
                          <div className="text-[10px] text-text-secondary capitalize">{article.advertiser_type || 'hospital'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[11px] font-medium">
                        {article.sponsor_label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-text-secondary whitespace-nowrap">
                      {article.start_date ? new Date(article.start_date).toLocaleDateString('en-IN') : '—'}
                      {' → '}
                      {article.end_date ? new Date(article.end_date).toLocaleDateString('en-IN') : 'Ongoing'}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(article)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          article.is_active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {article.is_active ? <><CheckCircle2 size={12} /> Active</> : <><XCircle size={12} /> Paused</>}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setArticleToEdit(article); setIsModalOpen(true); }}
                          className="p-1.5 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={deletingId === article.id}
                          className="p-1.5 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove sponsorship"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SponsoredArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        articleToEdit={articleToEdit}
        onSaved={handleSaved}
      />
    </div>
  );
}
