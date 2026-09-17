'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  Building2,
  User,
  X,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { SponsoredKPIStats } from '@/lib/types/sponsored';

interface SponsoredCMSClientProps {
  initialArticles: any[];
  sponsors: any[];
  campaigns: any[];
  kpis: SponsoredKPIStats;
}

const STATUS_TABS = [
  { id: 'all', label: 'All Articles' },
  { id: 'submitted', label: 'Client Inquiries' },
  { id: 'published', label: 'Published' },
  { id: 'editorial_review', label: 'Editorial Review' },
  { id: 'medical_review', label: 'Medical Review' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'draft', label: 'Drafts' },
  { id: 'expired', label: 'Expired' },
];

export function SponsoredCMSClient({
  initialArticles,
  sponsors,
  campaigns,
  kpis,
}: SponsoredCMSClientProps) {
  const [articles, setArticles] = useState<any[]>(initialArticles);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState('all');

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [workflowTarget, setWorkflowTarget] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filtered articles
  const filteredArticles = articles.filter((a) => {
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;
    if (selectedSponsor !== 'all' && a.sponsor_id !== selectedSponsor) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title?.toLowerCase().includes(q);
      const matchSlug = a.slug?.toLowerCase().includes(q);
      const matchSponsor = a.sponsor_name?.toLowerCase().includes(q);
      if (!matchTitle && !matchSlug && !matchSponsor) return false;
    }
    return true;
  });

  // Calculate expiring campaigns
  const expiringCampaigns = campaigns.filter((c) => {
    if (c.status !== 'ACTIVE' || !c.end_date) return false;
    const diffDays = (new Date(c.end_date).getTime() - Date.now()) / (1000 * 3600 * 24);
    return diffDays > 0 && diffDays <= 7;
  });

  // Reload data from API
  const refreshData = async () => {
    try {
      const res = await fetch('/api/admin/sponsored-articles');
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error('Failed to refresh articles:', err);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingArticle(null);
    setIsEditorOpen(true);
    setActionError(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (art: any) => {
    setEditingArticle(art);
    setIsEditorOpen(true);
    setActionError(null);
  };

  // Delete Article
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sponsored-articles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setActionSuccess('Article successfully deleted.');
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(data.error || 'Failed to delete article');
      }
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open Workflow Modal
  const handleOpenWorkflow = (art: any) => {
    setWorkflowTarget(art);
    setIsWorkflowOpen(true);
    setActionError(null);
  };

  return (
    <div className="space-y-6">
      
      {/* ── 1. KPI Stats Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-gray-500 font-bold block mb-1">
            Total Articles
          </span>
          <span className="text-2xl font-extrabold text-gray-900 font-heading">
            {kpis.totalArticles}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-[#16A34A] font-bold block mb-1">
            Active Campaigns
          </span>
          <span className="text-2xl font-extrabold text-[#16A34A] font-heading">
            {kpis.activeCampaigns}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-amber-600 font-bold block mb-1">
            In Review
          </span>
          <span className="text-2xl font-extrabold text-amber-600 font-heading">
            {kpis.pendingReviews}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-purple-600 font-bold block mb-1">
            Medical Review
          </span>
          <span className="text-2xl font-extrabold text-purple-600 font-heading">
            {kpis.medicalReviews}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-blue-600 font-bold block mb-1">
            Total Views
          </span>
          <span className="text-2xl font-extrabold text-blue-600 font-heading">
            {kpis.totalViews.toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-[#f06d2f] font-bold block mb-1">
            Average CTR
          </span>
          <span className="text-2xl font-extrabold text-[#f06d2f] font-heading">
            {kpis.avgCtr}%
          </span>
        </div>
      </div>

      {/* ── 2. Campaign Expiration Warning ── */}
      {expiringCampaigns.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-amber-600 shrink-0" size={20} />
            <div className="text-xs text-amber-900">
              <strong className="font-bold">Campaign Expiry Alert: </strong>
              <span>
                {expiringCampaigns.map((c) => `"${c.name}" (ends ${new Date(c.end_date).toLocaleDateString()})`).join(', ')}
              </span>
            </div>
          </div>
          <Link
            href="/admin/campaigns"
            className="text-xs font-bold text-amber-800 hover:underline shrink-0"
          >
            Review Campaigns →
          </Link>
        </div>
      )}

      {/* Success / Error Messages */}
      {actionSuccess && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-lg text-xs font-medium">
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="bg-red-50 text-red-800 border border-red-200 px-4 py-2 rounded-lg text-xs font-medium">
          {actionError}
        </div>
      )}

      {/* ── 3. Action & Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-4 sm:p-5 shadow-2xs space-y-4">
        
        {/* Top Row: Search, Sponsor Filter, Create Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, slug, or sponsor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#16A34A] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Sponsor Selector */}
            <select
              value={selectedSponsor}
              onChange={(e) => setSelectedSponsor(e.target.value)}
              className="text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-[#16A34A]"
            >
              <option value="all">All Sponsors</option>
              {sponsors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={refreshData}
              title="Refresh Articles"
              className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <RefreshCw size={15} />
            </button>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16A34A] text-white text-xs font-heading font-bold rounded-lg hover:bg-[#15803D] shadow-xs transition-colors"
            >
              <Plus size={15} />
              <span>Create Sponsored Article</span>
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-gray-100 pt-3">
          {STATUS_TABS.map((tab) => {
            const active = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[#16A34A] text-white shadow-2xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* ── 4. Article Table ── */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-50/70 border-b border-emerald-100 text-gray-600 uppercase font-mono font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Article Title &amp; Slug</th>
                <th className="px-4 py-3">Sponsor &amp; Campaign</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Workflow Status</th>
                <th className="px-4 py-3 text-center">Views / Clicks</th>
                <th className="px-4 py-3 text-center">CTR</th>
                <th className="px-4 py-3">Published Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-xs">
                    No sponsored articles found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => {
                  const ctr = art.views > 0 ? ((art.clicks / art.views) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={art.id} className="hover:bg-emerald-50/30 transition-colors">
                      {/* Title & Slug */}
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="font-heading font-bold text-gray-900 line-clamp-1 mb-0.5">
                          {art.title}
                        </div>
                        <div className="text-[11px] font-mono text-gray-400 truncate">
                          /{art.slug}
                        </div>
                        {art.is_featured && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded mt-1">
                            ★ FEATURED
                          </span>
                        )}
                      </td>

                      {/* Sponsor & Campaign */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <div className="flex items-center gap-1.5 font-heading font-semibold text-gray-800 truncate">
                          <Building2 size={12} className="text-[#16A34A] shrink-0" />
                          <span className="truncate">{art.sponsor_name || 'No Sponsor'}</span>
                        </div>
                        {art.campaign_name && (
                          <div className="text-[10px] text-gray-400 truncate mt-0.5">
                            Camp: {art.campaign_name}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-[#16A34A] px-2 py-0.5 rounded-md border border-emerald-100">
                          {art.category}
                        </span>
                      </td>

                      {/* Workflow Status */}
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleOpenWorkflow(art)}
                          className="group inline-flex items-center gap-1"
                        >
                          <StatusBadge status={art.status} reviewStatus={art.review_status} />
                          <ChevronRight size={12} className="text-gray-400 group-hover:text-gray-700" />
                        </button>
                      </td>

                      {/* Performance */}
                      <td className="px-4 py-3.5 text-center font-mono">
                        <span className="font-bold text-gray-900">{art.views.toLocaleString()}</span>
                        <span className="text-gray-400 text-[10px]"> / {art.clicks}</span>
                      </td>

                      {/* CTR */}
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-[#f06d2f]">
                        {ctr}%
                      </td>

                      {/* Published Date */}
                      <td className="px-4 py-3.5 text-[11px] text-gray-500 font-mono">
                        {art.published_at ? new Date(art.published_at).toLocaleDateString() : '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right space-x-1 whitespace-nowrap">
                        {art.status === 'published' && (
                          <Link
                            href={`/sponsored-articles/${art.slug}`}
                            target="_blank"
                            title="View Public Article"
                            className="p-1.5 text-gray-400 hover:text-[#16A34A] inline-block"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(art)}
                          title="Edit Article"
                          className="p-1.5 text-gray-400 hover:text-blue-600 inline-block"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(art.id, art.title)}
                          title="Delete Article"
                          className="p-1.5 text-gray-400 hover:text-red-600 inline-block"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Create / Edit Modal ── */}
      {isEditorOpen && (
        <SponsoredArticleEditorModal
          article={editingArticle}
          sponsors={sponsors}
          campaigns={campaigns}
          onClose={() => setIsEditorOpen(false)}
          onSaved={() => {
            setIsEditorOpen(false);
            refreshData();
            setActionSuccess('Article saved successfully.');
            setTimeout(() => setActionSuccess(null), 3000);
          }}
        />
      )}

      {/* ── 6. Workflow Transition Modal ── */}
      {isWorkflowOpen && workflowTarget && (
        <WorkflowTransitionModal
          article={workflowTarget}
          onClose={() => setIsWorkflowOpen(false)}
          onTransitionDone={() => {
            setIsWorkflowOpen(false);
            refreshData();
            setActionSuccess('Workflow status updated.');
            setTimeout(() => setActionSuccess(null), 3000);
          }}
        />
      )}

    </div>
  );
}

// ── Status Badge Component ──
function StatusBadge({ status, reviewStatus }: { status: string; reviewStatus: string }) {
  switch (status) {
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
          <Sparkles size={10} className="text-amber-700" />
          CLIENT INQUIRY
        </span>
      );
    case 'published':
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#16A34A] border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          PUBLISHED
        </span>
      );
    case 'editorial_review':
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          EDITORIAL REVIEW
        </span>
      );
    case 'medical_review':
      return (
        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
          <ShieldCheck size={10} className="text-purple-600" />
          MEDICAL REVIEW
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
          <CheckCircle2 size={10} className="text-blue-600" />
          APPROVED
        </span>
      );
    case 'scheduled':
      return (
        <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
          <Clock size={10} className="text-indigo-600" />
          SCHEDULED
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
          EXPIRED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
          DRAFT
        </span>
      );
  }
}

// ── Editor Modal Component ──
function SponsoredArticleEditorModal({
  article,
  sponsors,
  campaigns,
  onClose,
  onSaved,
}: {
  article: any | null;
  sponsors: any[];
  campaigns: any[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = Boolean(article?.id);

  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    featured_image: article?.featured_image || '',
    sponsor_id: article?.sponsor_id || sponsors[0]?.id || '',
    campaign_id: article?.campaign_id || campaigns[0]?.id || '',
    category: article?.category || 'Heart',
    author_name: article?.author_name || 'HealthGhuru Partner Content Team',
    author_title: article?.author_title || 'Clinical Content Specialist',
    requires_medical_review: article?.requires_medical_review ?? true,
    medical_reviewer_name: article?.medical_reviewer_name || '',
    medical_reviewer_credentials: article?.medical_reviewer_credentials || '',
    is_featured: article?.is_featured ?? false,
    sponsored_label: article?.sponsored_label || 'SPONSORED',
    cta_text: article?.cta_text || 'Read Article →',
    cta_url: article?.cta_url || '',
    status: article?.status || 'draft',
    rights_confirmed: article?.rights_confirmed || 'CONFIRMED',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto generate slug from title if new
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isEditing ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      setError('Title and Slug are mandatory.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/admin/sponsored-articles/${article.id}`
        : '/api/admin/sponsored-articles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onSaved();
      } else {
        setError(data.error || 'Failed to save article.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/60">
          <div>
            <h3 className="font-heading font-bold text-base text-gray-900">
              {isEditing ? 'Edit Sponsored Article' : 'Create Sponsored Article'}
            </h3>
            <span className="text-xs text-gray-500">
              Configure partner content metadata, medical review, and commercial attributes.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-1">
              1. Basic Content
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="font-semibold text-gray-700 block mb-1">Article Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Understanding Early Warning Signs of Heart Disease"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-[#16A34A] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="understanding-heart-disease"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:border-[#16A34A] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-[#16A34A] focus:outline-hidden"
                >
                  <option value="Heart">Heart</option>
                  <option value="Cancer">Cancer</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Women’s Health">Women’s Health</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Nutrition">Nutrition</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-gray-700 block mb-1">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:border-[#16A34A] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-gray-700 block mb-1">Excerpt / Lead Description</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Summary of the clinical story..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-[#16A34A] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-gray-700 block mb-1">Article Content (Markdown)</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write body paragraphs or markdown blocks (## Headings, > Quotes, * Bullet points)..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:border-[#16A34A] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Sponsor & Campaign */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-1">
              2. Commercial &amp; Sponsor Alignment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Assigned Sponsor *</label>
                <select
                  value={formData.sponsor_id}
                  onChange={(e) => setFormData({ ...formData, sponsor_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-[#16A34A] focus:outline-hidden"
                >
                  {sponsors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Campaign</label>
                <select
                  value={formData.campaign_id}
                  onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-[#16A34A] focus:outline-hidden"
                >
                  <option value="">No Campaign (Direct)</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Call-To-Action (CTA) Text</label>
                <input
                  type="text"
                  value={formData.cta_text}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  placeholder="Read Article →"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-[#16A34A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">CTA Target URL</label>
                <input
                  type="url"
                  value={formData.cta_url}
                  onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                  placeholder="https://hospital.com/appointment"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:border-[#16A34A] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Editorial & Medical Review */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-1">
              3. Medical Review &amp; Safety Compliance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 flex items-center gap-2 bg-emerald-50/70 p-3 rounded-lg border border-emerald-100">
                <input
                  type="checkbox"
                  id="req_med"
                  checked={formData.requires_medical_review}
                  onChange={(e) => setFormData({ ...formData, requires_medical_review: e.target.checked })}
                  className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
                />
                <label htmlFor="req_med" className="font-semibold text-gray-900 cursor-pointer">
                  Requires Medical Review (Mandatory for clinical claims or treatment options)
                </label>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Medical Reviewer Name</label>
                <input
                  type="text"
                  value={formData.medical_reviewer_name}
                  onChange={(e) => setFormData({ ...formData, medical_reviewer_name: e.target.value })}
                  placeholder="Dr. Sengottuvelu G."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-[#16A34A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Reviewer Credentials</label>
                <input
                  type="text"
                  value={formData.medical_reviewer_credentials}
                  onChange={(e) => setFormData({ ...formData, medical_reviewer_credentials: e.target.value })}
                  placeholder="MD, DM, FSCAI · Senior Cardiologist"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-[#16A34A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Author Name</label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-[#16A34A] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="feat_check"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
                />
                <label htmlFor="feat_check" className="font-semibold text-gray-900 cursor-pointer">
                  Pin as Featured Sponsored Hero Story
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Content Rights */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="rights_chk"
                checked={formData.rights_confirmed === 'CONFIRMED'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rights_confirmed: e.target.checked ? 'CONFIRMED' : 'PENDING',
                  })
                }
                className="mt-0.5 rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
              />
              <label htmlFor="rights_chk" className="text-gray-700 cursor-pointer leading-normal">
                <strong>Content Rights Confirmed:</strong> I confirm that this partner material has verified permissions, does not infringe medical copyright, and complies with healthcare advertising guidelines.
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-heading font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg font-heading font-bold shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ── Workflow Transition Modal ──
function WorkflowTransitionModal({
  article,
  onClose,
  onTransitionDone,
}: {
  article: any;
  onClose: () => void;
  onTransitionDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/sponsored-articles/${article.id}/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        onTransitionDone();
      } else {
        setError(data.error || 'Workflow transition failed.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h3 className="font-heading font-bold text-sm text-gray-900">
              Workflow Status Transition
            </h3>
            <span className="text-[11px] text-gray-500 truncate block max-w-xs">
              {article.title}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs border border-red-200 p-2.5 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2 text-xs">
          <p className="text-gray-600">
            Current status: <strong className="text-gray-900 uppercase font-mono">{article.status}</strong>
          </p>
          <p className="text-gray-600">
            Medical Review Required:{' '}
            <strong className="text-gray-900">
              {article.requires_medical_review ? 'YES (Strict Sign-off)' : 'NO'}
            </strong>
          </p>

          <div className="pt-3 space-y-2">
            {/* Submit */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleAction('submit')}
              className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-left font-heading font-semibold flex items-center justify-between"
            >
              <span>1. Submit for Editorial Review</span>
              <span className="text-[10px] font-mono uppercase bg-amber-200/60 px-1.5 py-0.5 rounded">Submit</span>
            </button>

            {/* Editorial Approve */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleAction('editorial_approve')}
              className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-left font-heading font-semibold flex items-center justify-between"
            >
              <span>2. Editorial Approve (Route to Medical Review if needed)</span>
              <span className="text-[10px] font-mono uppercase bg-blue-200/60 px-1.5 py-0.5 rounded">Review</span>
            </button>

            {/* Medical Approve */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleAction('medical_approve')}
              className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-lg text-left font-heading font-semibold flex items-center justify-between"
            >
              <span>3. Medical Reviewer Sign-off</span>
              <span className="text-[10px] font-mono uppercase bg-purple-200/60 px-1.5 py-0.5 rounded">Sign-off</span>
            </button>

            {/* Publish Now */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleAction('publish')}
              className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-left font-heading font-semibold flex items-center justify-between"
            >
              <span>4. Publish Live on HealthGhuru</span>
              <span className="text-[10px] font-mono uppercase bg-emerald-200/60 px-1.5 py-0.5 rounded">Publish</span>
            </button>

            {/* Unpublish */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleAction('unpublish')}
              className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-left font-heading font-semibold flex items-center justify-between"
            >
              <span>Revert to Draft (Unpublish)</span>
              <span className="text-[10px] font-mono uppercase bg-gray-200 px-1.5 py-0.5 rounded">Draft</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
