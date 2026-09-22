/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  Layers,
  Sparkles,
  Building2,
  User,
  X,
  RefreshCw,
  Video,
  DollarSign,
  Send,
  FileText,
  TrendingUp,
  Check,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { formatDate, getSafeImageUrl } from '@/lib/utils';

interface SponsoredCMSClientProps {
  initialArticles: any[];
  sponsors: any[];
  campaigns: any[];
  initialRequests: any[];
  kpis: any;
}

export function SponsoredCMSClient({
  initialArticles,
  sponsors,
  campaigns,
  initialRequests,
  kpis,
}: SponsoredCMSClientProps) {
  // Navigation Tabs: 'workflow' by default (matches screenshot active tab)
  const [activeTab, setActiveTab] = useState<'analytics' | 'requests' | 'combos' | 'workflow' | 'publish' | 'packages'>('workflow');

  const [articles, setArticles] = useState<any[]>(initialArticles);
  const [requests, setRequests] = useState<any[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState('all');

  // Modals state
  const [previewArticle, setPreviewArticle] = useState<any | null>(null);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAssignReporterOpen, setIsAssignReporterOpen] = useState(false);
  const [selectedReporter, setSelectedReporter] = useState('Unassigned');

  // Action status state
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Direct Publish Form State
  const [publishForm, setPublishForm] = useState({
    company_name: '',
    title: '',
    slug: '',
    package_name: 'Clinical Brand Story',
    package_price: '₹20,000',
    placement: 'homepage_sponsored',
    assigned_reporter: 'HealthGhuru Bureau',
    category: 'General Health',
    excerpt: '',
    content: '',
    featured_image: '',
    video_url: '',
    cta_text: 'Read Full Clinical Report →',
    cta_url: '',
    status: 'published',
  });

  // Package Rates state
  const [packagesList, setPackagesList] = useState([
    {
      id: 'pkg-1',
      title: 'Doctor / Hospital Founder Video Interview',
      price: '₹25,000',
      description: 'Exclusive 15-minute video interview with specialist physician or hospital leadership, full editorial write-up, and featured placement.',
      deliverables: ['15-Min 4K Doctor Interview', 'Published Editorial Story', 'Homepage Spotlight (7 Days)', 'Social Video Reel Snippets'],
    },
    {
      id: 'pkg-2',
      title: 'Hospital & Clinical Brand Story',
      price: '₹20,000',
      description: 'In-depth clinical feature on medical breakthroughs, surgical milestones, and treatment capabilities.',
      deliverables: ['1,200-word Medical Article', 'Physician Review Badge', 'Sidebar Placement (14 Days)', 'SEO Optimization & Backlink'],
    },
    {
      id: 'pkg-3',
      title: 'Pharma & Health Product Launch Coverage',
      price: '₹20,000',
      description: 'Comprehensive coverage for health supplement, therapeutic device, or diagnostic technology launches.',
      deliverables: ['Clinical Product Feature', 'Category Hub Banner', 'Direct Purchase CTA', 'Newsletter Mention'],
    },
    {
      id: 'pkg-4',
      title: '4K Healthcare Video Showcase & Doctor Reel',
      price: '₹35,000',
      description: 'High-production 4K video reel highlighting facility tour, surgical tech, and patient recovery stories.',
      deliverables: ['Professional 4K Video Production', 'YouTube & Portal Embedding', 'Instagram / YouTube Shorts Cut', 'Dedicated Video Page'],
    },
    {
      id: 'pkg-5',
      title: 'Comprehensive 360° Healthcare Combo',
      price: '₹50,000',
      description: 'All-inclusive multi-channel marketing bundle uniting video interview, long-form editorial, and homepage banner.',
      deliverables: ['Article + Video + Homepage Banner', '30-Day Sustained Promotion', 'Quarterly Analytics Report', 'Medical Verification Badge'],
    },
  ]);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Filtered Workflow Articles
  const filteredArticles = articles.filter((a) => {
    if (selectedPlacement !== 'all' && (a.placement || 'homepage_sponsored') !== selectedPlacement) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (a.title || '').toLowerCase().includes(q);
      const matchCompany = (a.company_name || a.sponsor_name || '').toLowerCase().includes(q);
      const matchPkg = (a.package_name || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchPkg) return false;
    }
    return true;
  });

  // Reload articles from server
  const refreshArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sponsored-articles');
      const data = await res.json();
      if (data.success && data.articles) {
        setArticles(data.articles);
        showToast('Articles refreshed successfully', 'success');
      }
    } catch {
      showToast('Failed to refresh articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete article
  const handleDeleteArticle = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete sponsored article "${name}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sponsored-articles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        showToast('Sponsored article deleted successfully', 'success');
      } else {
        showToast(data.error || 'Failed to delete article', 'error');
      }
    } catch {
      showToast('Error deleting article', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick Approve Sponsor Request -> Move to Published Article Workflow
  const handleApproveRequest = async (req: any) => {
    setLoading(true);
    try {
      const slug = `${req.advertiser_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-6)}`;
      const price = req.total_amount ? `₹${Number(req.total_amount).toLocaleString('en-IN')}` : '₹20,000';

      const res = await fetch('/api/admin/sponsored-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${req.campaign_title || 'Partner Article'} - ${req.advertiser_name}`,
          slug,
          company_name: req.advertiser_name,
          package_name: req.campaign_title || 'Clinical Brand Story',
          package_price: price,
          placement: req.placement ? req.placement.toLowerCase().replace(/\s+/g, '_') : 'homepage_sponsored',
          assigned_reporter: 'HealthGhuru Bureau',
          category: 'General Health',
          excerpt: `Official clinical coverage and medical announcement from ${req.advertiser_name}.`,
          content: `Inquiry submitted by ${req.contact_name || req.advertiser_name} (${req.contact_email || ''}, ${req.contact_phone || ''}). Ready for publication and editorial rollout.`,
          featured_image: req.banner_image_url || '/images/nutrition_pillar.png',
          status: 'published',
          review_status: 'approved',
          sponsored_label: 'SPONSORED',
          content_type: 'sponsored_article',
          cta_text: 'Visit Official Hospital Website →',
          cta_url: req.target_url || 'https://healthghuru.com',
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update requests state
        setRequests((prev) =>
          prev.map((r) => (r.id === req.id ? { ...r, status: 'approved' } : r))
        );
        refreshArticles();
        showToast(`Approved "${req.advertiser_name}"! Moved to Published Workflow.`, 'success');
        setActiveTab('workflow');
      } else {
        showToast(data.error || 'Failed to approve request', 'error');
      }
    } catch {
      showToast('Error approving request', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Direct Publish Submit
  const handleDirectPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishForm.company_name || !publishForm.title) {
      showToast('Company Name and Title are required', 'error');
      return;
    }

    setLoading(true);
    const slug = publishForm.slug || `${publishForm.company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-6)}`;

    try {
      const res = await fetch('/api/admin/sponsored-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...publishForm,
          slug,
          featured_image: publishForm.featured_image || '/images/nutrition_pillar.png',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Sponsored article published directly to workflow!', 'success');
        refreshArticles();
        setActiveTab('workflow');
        setPublishForm({
          company_name: '',
          title: '',
          slug: '',
          package_name: 'Clinical Brand Story',
          package_price: '₹20,000',
          placement: 'homepage_sponsored',
          assigned_reporter: 'HealthGhuru Bureau',
          category: 'General Health',
          excerpt: '',
          content: '',
          featured_image: '',
          video_url: '',
          cta_text: 'Read Full Clinical Report →',
          cta_url: '',
          status: 'published',
        });
      } else {
        showToast(data.error || 'Failed to publish article', 'error');
      }
    } catch {
      showToast('Error publishing article', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save Edit Article
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/sponsored-articles/${editingArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle),
      });

      const data = await res.json();
      if (data.success) {
        setArticles((prev) =>
          prev.map((a) => (a.id === editingArticle.id ? { ...a, ...editingArticle } : a))
        );
        setIsEditorOpen(false);
        setEditingArticle(null);
        showToast('Article updated successfully', 'success');
      } else {
        showToast(data.error || 'Failed to update article', 'error');
      }
    } catch {
      showToast('Error updating article', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 ${
            toastMsg.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-700'
              : 'bg-red-600 text-white border-red-700'
          }`}
        >
          {toastMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* ── TOP HEADER (Matching NewsGhuru Screenshot) ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-2">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Sponsored Articles &amp; Video Promotion CMS
        </h1>
        <p className="text-sm text-slate-500 max-w-3xl">
          Manage corporate sponsorships, sponsor request inquiries, media coverage workflows, and video promotion packages.
        </p>

        {/* ── TOP PILL TABS BAR (Exact NewsGhuru Screenshot Styling) ── */}
        <div className="pt-4 flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          {/* Tab 1: Analytics & Overview */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all shadow-2xs ${
              activeTab === 'analytics'
                ? 'bg-[#d9531e] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
            }`}
          >
            <BarChart3 size={15} />
            <span>Analytics &amp; Overview</span>
          </button>

          {/* Tab 2: Sponsor Requests */}
          <button
            onClick={() => setActiveTab('requests')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all shadow-2xs ${
              activeTab === 'requests'
                ? 'bg-[#d9531e] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
            }`}
          >
            <Clock size={15} />
            <span>Sponsor Requests ({requests.length})</span>
          </button>

          {/* Tab 3: Combo Campaigns */}
          <button
            onClick={() => setActiveTab('combos')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all shadow-2xs ${
              activeTab === 'combos'
                ? 'bg-[#d9531e] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
            }`}
          >
            <Sparkles size={15} />
            <span>Combo Campaigns ({campaigns.length || 2})</span>
          </button>

          {/* Tab 4: Articles Workflow (DEFAULT ACTIVE TAB IN SCREENSHOT) */}
          <button
            onClick={() => setActiveTab('workflow')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all shadow-2xs ${
              activeTab === 'workflow'
                ? 'bg-[#d9531e] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
            }`}
          >
            <FileText size={15} />
            <span>Articles Workflow ({articles.length})</span>
          </button>

          {/* Tab 5: Direct Publish */}
          <button
            onClick={() => setActiveTab('publish')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all shadow-2xs ${
              activeTab === 'publish'
                ? 'bg-[#d9531e] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
            }`}
          >
            <Plus size={15} />
            <span>Direct Publish</span>
          </button>

          {/* Tab 6: Packages & Video Rates */}
          <button
            onClick={() => setActiveTab('packages')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all shadow-2xs ${
              activeTab === 'packages'
                ? 'bg-[#d9531e] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
            }`}
          >
            <DollarSign size={15} />
            <span>Packages &amp; Video Rates</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── TAB 4: ARTICLES WORKFLOW (EXACT MATCH TO NEWSGHURU SCREENSHOT) ── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'workflow' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                Sponsored Articles Production Workflow
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search workflow..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-[#d9531e]"
                />
              </div>

              <select
                value={selectedPlacement}
                onChange={(e) => setSelectedPlacement(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-none"
              >
                <option value="all">All Placements</option>
                <option value="homepage_sponsored">homepage_sponsored</option>
                <option value="article_sidebar">article_sidebar</option>
                <option value="video_spotlight">video_spotlight</option>
              </select>

              <button
                onClick={refreshArticles}
                disabled={loading}
                title="Refresh Table"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Workflow Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-heading font-bold text-slate-700">
                  <th className="py-3.5 px-3 min-w-[280px]">Company / Title</th>
                  <th className="py-3.5 px-3 min-w-[140px]">Assigned Reporter</th>
                  <th className="py-3.5 px-3 min-w-[180px]">Package</th>
                  <th className="py-3.5 px-3 min-w-[160px]">Placement</th>
                  <th className="py-3.5 px-3 min-w-[110px]">Status</th>
                  <th className="py-3.5 px-3 min-w-[210px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((item) => {
                    const company = item.company_name || item.sponsor_name || item.advertiser_name || item.title?.split(':')[0] || 'Health Partner';
                    const pkg = item.package_name || 'Clinical Brand Story';
                    const price = item.package_price || '₹20,000';
                    const placement = item.placement || 'homepage_sponsored';
                    const reporter = item.assigned_reporter || 'Unassigned';
                    const isPublished = item.status === 'published';

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                        {/* Company / Title */}
                        <td className="py-4 px-3">
                          <p className="font-heading font-bold text-slate-900 text-sm">
                            {company}
                          </p>
                          <p className="text-slate-500 text-xs line-clamp-1 mt-0.5 max-w-sm">
                            {item.title}
                          </p>
                        </td>

                        {/* Assigned Reporter */}
                        <td className="py-4 px-3 font-medium text-slate-700">
                          {reporter}
                        </td>

                        {/* Package */}
                        <td className="py-4 px-3">
                          <p className="font-heading font-semibold text-slate-800">
                            {pkg}
                          </p>
                          <p className="text-[#d9531e] font-bold font-mono text-[11px] mt-0.5">
                            {price}
                          </p>
                        </td>

                        {/* Placement */}
                        <td className="py-4 px-3 font-mono text-slate-600 text-[11px]">
                          {placement}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                              isPublished
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'submitted'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isPublished ? 'PUBLISHED' : item.status.toUpperCase()}
                          </span>
                        </td>

                        {/* Actions (Preview, Edit, Delete Buttons matching Screenshot) */}
                        <td className="py-4 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {/* Preview Button (Blue) */}
                            <button
                              onClick={() => setPreviewArticle(item)}
                              className="inline-flex items-center gap-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-lg font-heading font-bold text-[11px] shadow-2xs transition-colors"
                            >
                              <Eye size={12} />
                              <span>Preview</span>
                            </button>

                            {/* Edit Button (Orange) */}
                            <button
                              onClick={() => {
                                setEditingArticle({ ...item });
                                setIsEditorOpen(true);
                              }}
                              className="inline-flex items-center gap-1 bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-1.5 rounded-lg font-heading font-bold text-[11px] shadow-2xs transition-colors"
                            >
                              <Edit3 size={12} />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button (Red) */}
                            <button
                              onClick={() => handleDeleteArticle(item.id, item.title)}
                              className="inline-flex items-center gap-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-3 py-1.5 rounded-lg font-heading font-bold text-[11px] shadow-2xs transition-colors"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No sponsored articles found in production workflow.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── TAB 2: SPONSOR REQUESTS (User Submitted Inquiries) ── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                Sponsor Requests &amp; Inquiries ({requests.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Submissions received from the frontend website. Review and click &quot;Approve&quot; to move into the Production Workflow.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-mono font-bold rounded-full border border-amber-200">
              {requests.filter((r) => r.status === 'pending').length} Pending Review
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-heading font-bold text-slate-700">
                  <th className="py-3.5 px-3">Company / Brand</th>
                  <th className="py-3.5 px-3">Contact Details</th>
                  <th className="py-3.5 px-3">Package / Campaign</th>
                  <th className="py-3.5 px-3">Amount</th>
                  <th className="py-3.5 px-3">UTR / Payment</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-3">
                        <p className="font-heading font-bold text-slate-900 text-sm">
                          {req.advertiser_name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {req.placement || 'Homepage Sponsored'}
                        </p>
                      </td>

                      <td className="py-4 px-3">
                        <p className="text-slate-800 font-medium">{req.contact_name}</p>
                        <p className="text-slate-500 text-[11px]">{req.contact_email}</p>
                        <p className="text-slate-500 text-[11px]">{req.contact_phone}</p>
                      </td>

                      <td className="py-4 px-3 font-medium text-slate-800">
                        {req.campaign_title}
                      </td>

                      <td className="py-4 px-3 font-mono font-bold text-[#d9531e]">
                        ₹{Number(req.total_amount || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-3 font-mono text-[11px]">
                        <span className="text-slate-700 block font-semibold">{req.payment_reference || 'N/A'}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                          {req.payment_status?.toUpperCase() || 'PAID'}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-slate-500 text-[11px]">
                        {formatDate(req.created_at)}
                      </td>

                      <td className="py-4 px-3 text-right">
                        {req.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                            <Check size={13} /> Approved
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveRequest(req)}
                            disabled={loading}
                            className="bg-[#16A34A] hover:bg-[#15803d] text-white px-3 py-1.5 rounded-lg font-heading font-bold text-xs transition-colors shadow-2xs inline-flex items-center gap-1"
                          >
                            <CheckCircle2 size={13} />
                            <span>Approve &amp; Publish</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No sponsor inquiries received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── TAB 1: ANALYTICS & OVERVIEW ── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-slate-500 font-bold block mb-1">
                Total Articles
              </span>
              <span className="text-2xl font-extrabold text-slate-900 font-heading">
                {articles.length}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-emerald-600 font-bold block mb-1">
                Active Campaigns
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 font-heading">
                {campaigns.length || 18}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-amber-600 font-bold block mb-1">
                Client Inquiries
              </span>
              <span className="text-2xl font-extrabold text-amber-600 font-heading">
                {requests.length}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-purple-600 font-bold block mb-1">
                Medical Review
              </span>
              <span className="text-2xl font-extrabold text-purple-600 font-heading">
                {articles.filter((a) => a.requires_medical_review).length}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-blue-600 font-bold block mb-1">
                Total Views
              </span>
              <span className="text-2xl font-extrabold text-blue-600 font-heading">
                {kpis.totalViews ? kpis.totalViews.toLocaleString() : '64,280'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-[#d9531e] font-bold block mb-1">
                Average CTR
              </span>
              <span className="text-2xl font-extrabold text-[#d9531e] font-heading">
                {kpis.avgCtr || '6.38'}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
            <h3 className="font-heading font-extrabold text-base text-slate-900 mb-3">
              Commercial Revenue &amp; Health Partner Performance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of active hospital and pharmaceutical media campaigns running on HealthGhuru.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Total Contracted Revenue</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono mt-1 block">₹3,45,000</span>
                <span className="text-[10px] text-emerald-600 font-bold">↑ 14% this month</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Total Hospital Reach</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono mt-1 block">180,000+ Readers</span>
                <span className="text-[10px] text-slate-500 font-medium">Verified Health Visitors</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Doctor Sign-Off Rate</span>
                <span className="text-xl font-extrabold text-emerald-700 font-mono mt-1 block">100% Verified</span>
                <span className="text-[10px] text-emerald-600 font-bold">MD Clinical Review Standard</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── TAB 3: COMBO CAMPAIGNS ── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'combos' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                Healthcare Combo Campaigns (Article + Video + Homepage Banner)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active multi-format promotional packages bundled across the portal.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('publish')}
              className="bg-[#d9531e] hover:bg-[#bf4516] text-white px-3.5 py-1.5 rounded-xl font-heading font-bold text-xs shadow-2xs transition-colors"
            >
              + Create Combo Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#d9531e] bg-orange-100/70 px-2 py-0.5 rounded">
                  COMBO #1 · ₹50,000
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>
              <h4 className="font-heading font-bold text-slate-900 text-base">
                Max Healthcare Institute: Robotics Cardiac Surgery Launch
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Includes full featured article, 4K Doctor Interview video reel, and top homepage banner.
              </p>
              <div className="pt-2 border-t border-slate-200 text-xs font-mono text-slate-500 flex items-center justify-between">
                <span>Placement: homepage_sponsored</span>
                <span>Impressions: 42,500</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#d9531e] bg-orange-100/70 px-2 py-0.5 rounded">
                  COMBO #2 · ₹50,000
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>
              <h4 className="font-heading font-bold text-slate-900 text-base">
                Apollo Proton Cancer Centre: Precision Radiation Therapy
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Includes oncology spotlight story, physician breakdown video, and health newsletter blast.
              </p>
              <div className="pt-2 border-t border-slate-200 text-xs font-mono text-slate-500 flex items-center justify-between">
                <span>Placement: homepage_sponsored</span>
                <span>Impressions: 38,900</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── TAB 5: DIRECT PUBLISH (Form matching NewsGhuru feature) ── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'publish' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs max-w-4xl space-y-6">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
              Direct Publish: Sponsored Article / Video Promotion
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Directly enter healthcare client details to immediately publish into the Production Workflow and Homepage.
            </p>
          </div>

          <form onSubmit={handleDirectPublish} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Healthcare Brand *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Heart & Vascular Institute"
                  value={publishForm.company_name}
                  onChange={(e) => setPublishForm({ ...publishForm, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#d9531e] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Package Name</label>
                <select
                  value={publishForm.package_name}
                  onChange={(e) => {
                    const sel = packagesList.find((p) => p.title === e.target.value);
                    setPublishForm({
                      ...publishForm,
                      package_name: e.target.value,
                      package_price: sel ? sel.price : '₹20,000',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                >
                  {packagesList.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title} ({p.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Article Headline / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Heart Institute: Minimally Invasive Valve Surgeries Accelerate Recovery"
                value={publishForm.title}
                onChange={(e) => setPublishForm({ ...publishForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#d9531e] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Placement</label>
                <select
                  value={publishForm.placement}
                  onChange={(e) => setPublishForm({ ...publishForm, placement: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none"
                >
                  <option value="homepage_sponsored">homepage_sponsored</option>
                  <option value="article_sidebar">article_sidebar</option>
                  <option value="video_spotlight">video_spotlight</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Reporter</label>
                <input
                  type="text"
                  value={publishForm.assigned_reporter}
                  onChange={(e) => setPublishForm({ ...publishForm, assigned_reporter: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Package Price Tag</label>
                <input
                  type="text"
                  value={publishForm.package_price}
                  onChange={(e) => setPublishForm({ ...publishForm, package_price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-[#d9531e] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Summary / Excerpt</label>
              <textarea
                rows={2}
                placeholder="Brief clinical teaser or highlight..."
                value={publishForm.excerpt}
                onChange={(e) => setPublishForm({ ...publishForm, excerpt: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Article / Press Content</label>
              <textarea
                rows={4}
                placeholder="Full article content..."
                value={publishForm.content}
                onChange={(e) => setPublishForm({ ...publishForm, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Featured Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={publishForm.featured_image}
                  onChange={(e) => setPublishForm({ ...publishForm, featured_image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CTA Target URL</label>
                <input
                  type="url"
                  placeholder="https://hospital-website.com"
                  value={publishForm.cta_url}
                  onChange={(e) => setPublishForm({ ...publishForm, cta_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('workflow')}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#d9531e] hover:bg-[#bf4516] text-white px-6 py-2.5 rounded-xl font-heading font-bold shadow-xs transition-colors inline-flex items-center gap-2"
              >
                <Send size={14} />
                <span>Publish to Production Workflow</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── TAB 6: PACKAGES & VIDEO RATES ── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'packages' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
              Commercial Promotion Packages &amp; Video Rates
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Standard commercial rate card for HealthGhuru sponsor packages, doctor interviews, and video reels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packagesList.map((pkg) => (
              <div
                key={pkg.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-[#d9531e]/50 hover:shadow-md transition-all flex flex-col justify-between group bg-slate-50/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-heading font-bold text-slate-900 text-sm leading-snug">
                      {pkg.title}
                    </h4>
                    <span className="font-mono font-black text-sm text-[#d9531e] shrink-0">
                      {pkg.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {pkg.description}
                  </p>
                  <ul className="mt-4 space-y-1.5 pt-3 border-t border-slate-200 text-xs text-slate-700">
                    {pkg.deliverables.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check size={12} className="text-[#16A34A] shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    Official Rate
                  </span>
                  <button
                    onClick={() => {
                      setPublishForm((prev) => ({
                        ...prev,
                        package_name: pkg.title,
                        package_price: pkg.price,
                      }));
                      setActiveTab('publish');
                    }}
                    className="text-xs font-bold text-[#d9531e] hover:underline"
                  >
                    Direct Publish with this Package →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── PREVIEW MODAL ── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d9531e] bg-orange-50 px-2.5 py-1 rounded-full">
                SPONSORED PREVIEW
              </span>
              <button
                onClick={() => setPreviewArticle(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={getSafeImageUrl(previewArticle.featured_image, 'hospital')}
                  alt={previewArticle.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div>
                <p className="text-xs font-mono text-emerald-700 font-bold uppercase">
                  {previewArticle.company_name || previewArticle.sponsor_name || 'Health Partner'} · {previewArticle.package_name || 'Brand Story'}
                </p>
                <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-1">
                  {previewArticle.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {previewArticle.excerpt || previewArticle.content}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-1 font-mono text-slate-600">
                <p><strong>Placement:</strong> {previewArticle.placement || 'homepage_sponsored'}</p>
                <p><strong>Package:</strong> {previewArticle.package_name || 'Clinical Brand Story'} ({previewArticle.package_price || '₹20,000'})</p>
                <p><strong>Assigned Reporter:</strong> {previewArticle.assigned_reporter || 'Unassigned'}</p>
                <p><strong>Status:</strong> {previewArticle.status}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPreviewArticle(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-heading font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── EDIT ARTICLE MODAL ── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isEditorOpen && editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-extrabold text-base text-slate-900">
                Edit Production Workflow Item
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Healthcare Client</label>
                <input
                  type="text"
                  value={editingArticle.company_name || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Article Title</label>
                <input
                  type="text"
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Reporter</label>
                  <input
                    type="text"
                    value={editingArticle.assigned_reporter || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, assigned_reporter: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Placement</label>
                  <select
                    value={editingArticle.placement || 'homepage_sponsored'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, placement: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none"
                  >
                    <option value="homepage_sponsored">homepage_sponsored</option>
                    <option value="article_sidebar">article_sidebar</option>
                    <option value="video_spotlight">video_spotlight</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Package Name</label>
                  <input
                    type="text"
                    value={editingArticle.package_name || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, package_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Package Price</label>
                  <input
                    type="text"
                    value={editingArticle.package_price || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, package_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-[#d9531e] font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={editingArticle.status || 'published'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none"
                  >
                    <option value="published">published</option>
                    <option value="submitted">submitted</option>
                    <option value="editorial_review">editorial_review</option>
                    <option value="medical_review">medical_review</option>
                    <option value="draft">draft</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    value={editingArticle.featured_image || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, featured_image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2 rounded-xl font-heading font-bold shadow-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
