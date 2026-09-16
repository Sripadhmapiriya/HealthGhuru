'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload, ExternalLink, Sparkles, Check, AlertCircle,
  Hospital, Phone, Wallet, Calendar, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import { AdPlacement } from '@/lib/types/advertisement';
import Image from 'next/image';

const PLACEMENTS: { id: AdPlacement; label: string; desc: string; size: string }[] = [
  { id: 'top_banner', label: 'Top Banner', desc: 'Leaderboard strip above the navbar', size: '728x90 / 970x90' },
  { id: 'hero_banner', label: 'Hero Banner', desc: 'Wide in-feed banner below hero section', size: '1200x250 / 970x250' },
  { id: 'sidebar', label: 'Sidebar Banner', desc: 'Medium rectangle in the sidebar rail', size: '300x250 / 300x600' },
  { id: 'floating_footer', label: 'Floating Footer', desc: 'Fixed sticky strip at the bottom', size: 'Responsive Strip' },
  { id: 'popup', label: 'Health Popup Modal', desc: 'Contextual popup with frequency cap', size: '600x400 Card' },
];

const HEALTH_CATEGORIES = [
  'All', 'Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Pediatrics',
  'Dermatology', 'Nutrition', 'Mental Health', 'Ayurveda', 'Fitness', 'Wellness',
  'Gynecology', 'Ophthalmology', 'Dentistry', 'General Medicine',
];

const ADVERTISER_TYPES = [
  { value: 'hospital', label: '🏥 Hospital' },
  { value: 'doctor', label: '👨‍⚕️ Doctor / Specialist' },
  { value: 'clinic', label: '🏪 Clinic' },
  { value: 'pharmacy', label: '💊 Pharmacy' },
];

export function AddAdvertisementForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    placement: 'top_banner' as AdPlacement,
    image_url: '',
    target_url: 'https://',
    headline: '',
    description: '',
    cta_text: 'Book Appointment',
    category: 'All',
    html_code: '',
    is_active: true,
    advertiser_name: '',
    advertiser_contact: '',
    advertiser_type: 'hospital',
    budget: '',
    start_date: '',
    end_date: '',
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, image_url: json.url }));
      } else {
        setError(json.error || 'Failed to upload image');
      }
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { setError('Campaign title is required'); return; }
    if (!formData.advertiser_name.trim()) { setError('Hospital / Doctor name is required'); return; }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      const res = await fetch('/api/admin/advertisements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSuccess(true);
        setTimeout(() => router.push('/admin/advertisements/all'), 1500);
      } else {
        setError(json.error || 'Failed to create advertisement');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating advertisement');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h2 className="font-heading font-bold text-xl text-dark">Advertisement Created!</h2>
        <p className="text-sm text-text-secondary">Redirecting to all advertisements...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Hospital Advertiser Info ── */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <h3 className="font-heading font-bold text-base text-dark flex items-center gap-2">
          <Hospital size={16} className="text-blue-600" />
          Hospital / Doctor Advertiser Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold text-dark">
              Advertiser Name * <span className="text-text-secondary font-normal">(Hospital / Doctor)</span>
            </label>
            <input
              type="text" required
              value={formData.advertiser_name}
              onChange={(e) => setFormData({ ...formData, advertiser_name: e.target.value })}
              placeholder="e.g. Apollo Hospitals, Dr. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold text-dark">Advertiser Type *</label>
            <select
              value={formData.advertiser_type}
              onChange={(e) => setFormData({ ...formData, advertiser_type: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              {ADVERTISER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold text-dark flex items-center gap-1">
              <Phone size={12} /> Contact
            </label>
            <input
              type="text"
              value={formData.advertiser_contact}
              onChange={(e) => setFormData({ ...formData, advertiser_contact: e.target.value })}
              placeholder="+91 98765 43210 or admin@hospital.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold text-dark flex items-center gap-1">
              <Wallet size={12} /> Campaign Budget (₹)
            </label>
            <input
              type="number" min="0" step="100"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="e.g. 10000"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold text-dark flex items-center gap-1">
              <Calendar size={12} /> Start Date
            </label>
            <input type="date" value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold text-dark flex items-center gap-1">
              <Calendar size={12} /> End Date
            </label>
            <input type="date" value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── Ad Placement ── */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <h3 className="font-heading font-bold text-base text-dark">Ad Placement Slot *</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {PLACEMENTS.map((p) => {
            const isSelected = formData.placement === p.id;
            return (
              <button key={p.id} type="button"
                onClick={() => setFormData({ ...formData, placement: p.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' : 'border-border hover:bg-surface/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading font-semibold text-xs text-dark">{p.label}</span>
                  {isSelected && <Check size={14} className="text-primary" />}
                </div>
                <p className="text-[11px] text-text-secondary line-clamp-2">{p.desc}</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{p.size}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Campaign Info ── */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <h3 className="font-heading font-bold text-base text-dark">Campaign Info</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-heading font-semibold text-dark">Campaign Title (Internal Name) *</label>
            <input type="text" required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Apollo Cardiac Care — Q3 2025"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold text-dark">Health Category</label>
            <select value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none bg-white"
            >
              {HEALTH_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-heading font-semibold text-dark flex items-center gap-1">
            <ExternalLink size={12} /> Target URL (Where users land on click) *
          </label>
          <input type="url" required
            value={formData.target_url}
            onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
            placeholder="https://apollohospitals.com/book-appointment"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* ── Banner Creative ── */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <h3 className="font-heading font-bold text-base text-dark">Banner Creative</h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary border-2 border-dashed border-primary/40 hover:border-primary px-5 py-3 rounded-xl text-sm font-heading font-semibold flex items-center gap-2 transition-all shrink-0">
            <Upload size={16} className={uploading ? 'animate-bounce' : ''} />
            {uploading ? 'Uploading...' : 'Upload Banner Image'}
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
          <input type="text" value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="Or paste image URL (https://...)"
            className="flex-1 px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none font-mono"
          />
        </div>

        {formData.image_url && (
          <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-primary/20 bg-surface">
            <Image src={formData.image_url} alt="Banner preview" fill className="object-cover" unoptimized />
          </div>
        )}
      </div>

      {/* ── Ad Copy ── */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <h3 className="font-heading font-bold text-base text-dark flex items-center gap-2">
          <Sparkles size={15} className="text-primary" /> Ad Copy & Call to Action
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold text-text-secondary">Display Headline</label>
            <input type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. World-Class Cardiac Care at Apollo"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold text-text-secondary">CTA Button Label</label>
            <input type="text"
              value={formData.cta_text}
              onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              placeholder="Book Appointment, Learn More, Call Now"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-heading font-semibold text-text-secondary">Promotional Subtext / Description</label>
          <textarea rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="NABH-accredited hospital with 25+ years of cardiac excellence. 24/7 emergency care available."
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none bg-white"
          />
        </div>
      </div>

      {/* ── Status & Submit ── */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-heading font-semibold text-sm text-dark block">Campaign Active Status</span>
            <span className="text-xs text-text-secondary">When active, this ad is immediately shown in public slots</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2.5 text-sm font-heading font-semibold text-text-secondary hover:text-dark hover:bg-surface rounded-xl transition-colors border border-border flex items-center gap-2"
          >
            <ArrowLeft size={15} /> Cancel
          </button>
          <button type="submit" disabled={loading || uploading}
            className="flex-1 sm:flex-none px-8 py-2.5 text-sm font-heading font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Advertisement'}
          </button>
        </div>
      </div>
    </form>
  );
}
