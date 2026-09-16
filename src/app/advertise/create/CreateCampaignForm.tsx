'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Check, Upload, Calendar, ExternalLink, Phone, Mail,
  Hospital, User, AlertCircle, CheckCircle2, ChevronDown,
  QrCode, Wallet, Smartphone,
} from 'lucide-react';
import { AdSlotPricing } from '@/lib/types/advertisement';

// ── Types ──────────────────────────────────────────────────────────────────
type DurationPlan = 'weekly' | 'monthly';

interface FormData {
  // Step 1
  duration_plan: DurationPlan;
  placement: string;
  // Step 2
  campaign_title: string;
  advertiser_name: string;
  advertiser_type: 'hospital' | 'doctor' | 'clinic' | 'pharmacy';
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  target_url: string;
  start_date: string;
  banner_image_url: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const ADVERTISER_TYPE_OPTIONS = [
  { value: 'hospital', label: '🏥 Hospital' },
  { value: 'doctor',   label: '👨‍⚕️ Doctor / Specialist' },
  { value: 'clinic',   label: '🏪 Clinic' },
  { value: 'pharmacy', label: '💊 Pharmacy' },
];

const SLOT_TAGS: Record<string, string> = {
  hero_banner:     'PRIME PLACEMENT',
  popup:           'HIGH ENGAGEMENT',
  top_banner:      'MAXIMUM REACH',
  floating_footer: 'STICKY VISIBILITY',
  sidebar:         'DEEP READER REACH',
};

const SLOT_SIZES: Record<string, string> = {
  hero_banner:     '970 × 250 px',
  popup:           '600 × 400 px',
  top_banner:      '970 × 90 px',
  floating_footer: 'Responsive Strip',
  sidebar:         '300 × 250 px',
};

const POPULAR_SLOT = 'hero_banner';

// ── Helper ──────────────────────────────────────────────────────────────────
function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ── Step Indicator ──────────────────────────────────────────────────────────
function StepBadge({ num, active, done }: { num: number; active: boolean; done: boolean }) {
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm transition-all ${
        done
          ? 'bg-primary text-white'
          : active
          ? 'bg-primary text-white shadow-lg shadow-primary/30'
          : 'bg-gray-200 text-gray-500'
      }`}
    >
      {done ? <Check size={14} /> : num}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export function CreateCampaignForm({ pricingSlots }: { pricingSlots: AdSlotPricing[] }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay');
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    duration_plan: 'weekly',
    placement: POPULAR_SLOT,
    campaign_title: '',
    advertiser_name: '',
    advertiser_type: 'hospital',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    target_url: 'https://',
    start_date: todayStr(),
    banner_image_url: '',
  });

  // ── Computed pricing ───────────────────────────────────────────────────
  const selectedSlot = pricingSlots.find((s) => s.placement === form.placement);
  const basePrice = selectedSlot
    ? form.duration_plan === 'weekly'
      ? selectedSlot.price_per_week
      : selectedSlot.price_per_month
    : 0;
  const gstAmount = Math.round(basePrice * 0.18 * 100) / 100;
  const totalAmount = basePrice + gstAmount;
  const endDate =
    form.start_date
      ? addDays(form.start_date, form.duration_plan === 'weekly' ? 7 : 30)
      : '';

  // ── File upload ────────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success && json.url) {
        setForm((prev) => ({ ...prev, banner_image_url: json.url }));
      } else {
        setError(json.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  // ── Step validation ────────────────────────────────────────────────────
  const canProceedStep1 = !!form.placement;
  const canProceedStep2 =
    form.campaign_title.trim() &&
    form.advertiser_name.trim() &&
    form.contact_name.trim() &&
    form.contact_email.trim() &&
    form.target_url.startsWith('http') &&
    form.start_date &&
    form.banner_image_url;

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        end_date: endDate,
        base_price: basePrice,
        gst_amount: gstAmount,
        total_amount: totalAmount,
        payment_method: paymentMethod,
      };
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setSubmittedId(json.campaign?.id ?? null);
        setSubmitted(true);
      } else {
        setError(json.error || 'Failed to submit campaign');
      }
    } catch (err: any) {
      setError(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-sm p-12 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h2 className="font-heading font-bold text-xl text-dark mb-2">Campaign Submitted!</h2>
        <p className="text-sm text-text-secondary mb-1">
          Your campaign request has been received. Our team will review and activate it within <strong>24 hours</strong>.
        </p>
        {submittedId && (
          <p className="text-[11px] text-text-muted font-mono mt-2">Reference ID: {submittedId}</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="/advertise"
            className="block w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-heading font-bold text-sm transition-all"
          >
            View My Campaigns
          </a>
          <a
            href="/"
            className="block w-full py-3 border border-border text-text-secondary hover:text-dark rounded-xl font-heading font-semibold text-sm transition-all"
          >
            Back to HealthGhuru
          </a>
        </div>
      </div>
    );
  }

  // ── Header ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Studio badge + Title */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-heading font-bold mb-4">
          🏥 Self-Service Campaign Studio
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-dark">
          Create New Advertisement Campaign
        </h1>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed max-w-2xl">
          Launch your health services advertisement in front of thousands of healthcare readers.
          Follow our <strong>3-step studio</strong> below to select your slot, fill in your details,
          and complete the campaign submission.
        </p>

        {/* Step indicators */}
        <div className="flex items-center gap-3 mt-6">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <StepBadge num={s} active={step === s} done={step > s} />
              <span className={`text-xs font-heading font-semibold hidden sm:block ${step === s ? 'text-primary' : step > s ? 'text-dark' : 'text-text-muted'}`}>
                {s === 1 ? 'Choose Slot & Duration' : s === 2 ? 'Campaign Details' : 'Review & Pay'}
              </span>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 1: Duration + Placement Selection
      ════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-8">
          <div className="flex items-center gap-3">
            <StepBadge num={1} active done={false} />
            <h2 className="font-heading font-bold text-lg text-dark">Select Hosting Duration & Advertisement Placement</h2>
          </div>

          {/* Duration picker */}
          <div>
            <p className="text-sm font-heading font-semibold text-dark mb-4 flex items-center gap-2">
              <Calendar size={15} className="text-primary" /> Choose Campaign Hosting Duration Plan:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {([
                { plan: 'weekly' as DurationPlan, title: 'Weekly Plan (7 Days)', sub: 'Shows 7-day hosting rates for banner slots' },
                { plan: 'monthly' as DurationPlan, title: 'Monthly Plan (30 Days)', sub: 'Shows 30-day hosting rates for banner slots' },
              ] as const).map(({ plan, title, sub }) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, duration_plan: plan }))}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    form.duration_plan === plan
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                      : 'border-border hover:border-text-secondary/40'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                    form.duration_plan === plan ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {form.duration_plan === plan && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="font-heading font-bold text-sm text-dark block">{title}</span>
                    <span className="text-[11px] text-text-secondary">{sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Slot cards */}
          <div>
            <p className="text-sm font-heading font-semibold text-dark mb-4">Select Ad Placement Slot:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pricingSlots.map((slot) => {
                const isSelected = form.placement === slot.placement;
                const isPopular = slot.placement === POPULAR_SLOT;
                const tag = SLOT_TAGS[slot.placement] ?? 'STANDARD';
                const size = SLOT_SIZES[slot.placement] ?? '';
                const price = form.duration_plan === 'weekly' ? slot.price_per_week : slot.price_per_month;
                const planLabel = form.duration_plan === 'weekly' ? 'Weekly' : 'Monthly';

                return (
                  <button
                    key={slot.placement}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, placement: slot.placement }))}
                    className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-border hover:border-text-secondary/40 bg-white'
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-primary text-white text-[10px] font-heading font-bold rounded-full">
                        MOST POPULAR
                      </span>
                    )}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-heading font-bold text-text-secondary uppercase tracking-wider bg-surface border border-border px-2 py-0.5 rounded">
                        {tag}
                      </span>
                      <span className="text-[11px] font-mono text-text-muted flex items-center gap-1">
                        📐 Size: {size}
                      </span>
                    </div>
                    <div className="font-heading font-bold text-base text-dark">{slot.label}</div>
                    <div className="text-primary font-heading font-bold text-lg mt-1">
                      {planLabel}: {formatINR(price)}
                    </div>
                    {slot.description && (
                      <p className="text-xs text-text-secondary mt-1.5 leading-relaxed line-clamp-2">{slot.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-heading font-bold text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50"
            >
              Continue to Campaign Details →
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 2: Campaign Creative & Advertiser Details
      ════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-8">
          <div className="flex items-center gap-3">
            <StepBadge num={2} active done={false} />
            <h2 className="font-heading font-bold text-lg text-dark">Campaign Creative &amp; Advertiser Contact Details</h2>
          </div>

          {/* Selected slot reminder */}
          <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs font-heading font-semibold text-primary">
            <Check size={14} />
            Selected: <span className="font-bold">{pricingSlots.find((s) => s.placement === form.placement)?.label ?? form.placement}</span>
            &nbsp;·&nbsp;
            <span className="capitalize">{form.duration_plan === 'weekly' ? 'Weekly (7 Days)' : 'Monthly (30 Days)'}</span>
            &nbsp;·&nbsp;
            <span>{formatINR(basePrice)} + 18% GST</span>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Campaign Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-dark">Campaign Title *</label>
              <input
                type="text" required
                value={form.campaign_title}
                onChange={(e) => setForm((f) => ({ ...f, campaign_title: e.target.value }))}
                placeholder="e.g. Summer Health Checkup Drive"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>

            {/* Hospital / Business Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-dark flex items-center gap-1">
                <Hospital size={12} /> Hospital / Business Name
              </label>
              <input
                type="text" required
                value={form.advertiser_name}
                onChange={(e) => setForm((f) => ({ ...f, advertiser_name: e.target.value }))}
                placeholder="e.g. Apollo Hospitals"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>

            {/* Advertiser Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-dark">Advertiser Type</label>
              <div className="relative">
                <select
                  value={form.advertiser_type}
                  onChange={(e) => setForm((f) => ({ ...f, advertiser_type: e.target.value as any }))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none bg-white appearance-none"
                >
                  {ADVERTISER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-text-secondary pointer-events-none" />
              </div>
            </div>

            {/* Contact Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-dark flex items-center gap-1">
                <User size={12} /> Advertiser Contact Name *
              </label>
              <input
                type="text" required
                value={form.contact_name}
                onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
                placeholder="Dr. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-dark flex items-center gap-1">
                <Mail size={12} /> Contact Email Address *
              </label>
              <input
                type="email" required
                value={form.contact_email}
                onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
                placeholder="admin@hospital.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-dark flex items-center gap-1">
                <Phone size={12} /> Contact Phone Number
              </label>
              <input
                type="tel"
                value={form.contact_phone}
                onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>

            {/* Target URL */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-heading font-bold text-dark flex items-center gap-1">
                <ExternalLink size={12} /> Target Click Destination URL *
              </label>
              <input
                type="url" required
                value={form.target_url}
                onChange={(e) => setForm((f) => ({ ...f, target_url: e.target.value }))}
                placeholder="https://apollohospitals.com/book-appointment"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none font-mono"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-dark flex items-center gap-1">
                <Calendar size={12} /> Campaign Start Date *
              </label>
              <input
                type="date" required
                value={form.start_date}
                min={todayStr()}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border focus:border-primary outline-none"
              />
            </div>

            {/* End Date (computed) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-dark flex items-center gap-1">
                <Calendar size={12} /> Campaign End Date ({form.duration_plan === 'weekly' ? '7 Days Fixed' : '30 Days Fixed'}) *
              </label>
              <input
                type="text" readOnly
                value={endDate ? new Date(endDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : '—'}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-surface text-text-secondary cursor-not-allowed"
              />
            </div>
          </div>

          {/* Banner upload */}
          <div>
            <label className="block text-xs font-heading font-bold text-dark mb-3">
              Upload Advertisement Banner Image *
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                form.banner_image_url
                  ? 'border-primary/50 bg-primary/3'
                  : 'border-gray-300 hover:border-primary hover:bg-primary/2'
              }`}
            >
              {form.banner_image_url ? (
                <div className="space-y-3">
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-primary/20">
                    <Image src={form.banner_image_url} alt="Banner" fill className="object-cover" unoptimized />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, banner_image_url: '' })); }}
                    className="text-xs text-red-500 hover:text-red-700 font-heading font-semibold"
                  >
                    Remove & Upload Different
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Upload size={22} className={`text-primary ${uploading ? 'animate-bounce' : ''}`} />
                  </div>
                  <p className="font-heading font-bold text-sm text-dark">
                    {uploading ? 'Uploading…' : 'Upload Advertisement Banner Image *'}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Recommended dimensions for <strong>{pricingSlots.find((s) => s.placement === form.placement)?.label}</strong>:&nbsp;
                    <span className="text-primary font-semibold">{SLOT_SIZES[form.placement] ?? '—'}</span>
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">PNG, JPG, or WEBP formats supported (High resolution recommended)</p>
                  <button
                    type="button"
                    className="mt-4 px-5 py-2 bg-primary text-white rounded-lg font-heading font-semibold text-xs"
                  >
                    Choose File from Computer
                  </button>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 border border-border text-text-secondary hover:text-dark rounded-xl font-heading font-semibold text-sm transition-all"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={!canProceedStep2}
              onClick={() => setStep(3)}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-heading font-bold text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review &amp; Pay →
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 3: Review & Payment
      ════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="space-y-5">
          {/* Summary card */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-5">
            <div className="flex items-center gap-3">
              <StepBadge num={3} active done={false} />
              <h2 className="font-heading font-bold text-lg text-dark">Review Hosting Summary &amp; Payment Checkout</h2>
            </div>

            {/* Summary box */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white space-y-2.5">
              {[
                { label: 'Selected Placement Slot', value: pricingSlots.find((s) => s.placement === form.placement)?.label ?? form.placement },
                { label: 'Campaign Duration', value: form.duration_plan === 'weekly' ? '7 Days (Weekly Package)' : '30 Days (Monthly Package)' },
                { label: 'Hospital / Advertiser', value: `${form.advertiser_name} (${form.advertiser_type})` },
                { label: 'Campaign Period', value: `${form.start_date} → ${endDate}` },
                { label: 'Base Price', value: formatINR(basePrice) },
                { label: 'GST (18%)', value: formatINR(gstAmount) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-white/80">{label}:</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
              <div className="border-t border-white/30 pt-3 flex justify-between text-base font-bold">
                <span>Total Payable Fee</span>
                <span className="text-xl">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Payment method selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                  paymentMethod === 'upi' ? 'border-primary bg-primary' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="font-heading font-bold text-sm text-dark block">Dynamic UPI QR Code Payment</span>
                  <span className="text-[11px] text-text-secondary">Scan QR code using GPay, PhonePe, Paytm or Navi</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                  paymentMethod === 'wallet' ? 'border-primary bg-primary' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'wallet' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="font-heading font-bold text-sm text-dark flex items-center gap-1.5">
                    <Wallet size={13} /> Digital Wallet
                  </span>
                  <span className="text-[11px] text-red-500 font-semibold">Balance: ₹0 (Insufficient)</span>
                </div>
              </button>
            </div>
          </div>

          {/* UPI QR Section */}
          {paymentMethod === 'upi' && (
            <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
              <h3 className="font-heading font-bold text-base text-dark mb-5 flex items-center gap-2">
                <Smartphone size={16} className="text-primary" /> Select Payment Method
              </h3>

              {/* UPI App tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {['GPay', 'PhonePe', 'Paytm', 'Navi', 'BHIM'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setSelectedUpiApp(app)}
                    className={`px-4 py-2 rounded-lg text-xs font-heading font-bold transition-all border ${
                      selectedUpiApp === app
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'border-border text-text-secondary hover:text-dark hover:border-text-secondary/40'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>

              {/* QR Code */}
              <div className="border-2 border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 bg-surface/40">
                <QrCode size={120} className="text-dark" strokeWidth={1} />
                <div className="text-center">
                  <p className="font-heading font-bold text-sm text-dark">Scan with {selectedUpiApp}</p>
                  <p className="text-xs text-text-secondary mt-0.5">Pay <strong className="text-primary">{formatINR(totalAmount)}</strong> to HealthGhuru UPI ID</p>
                  <p className="text-[11px] font-mono text-text-muted mt-1">healthghuru@upi</p>
                </div>
                <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center max-w-sm">
                  ⏳ After payment, click <strong>"Submit Campaign"</strong> below. Our team verifies payment within 2 hours.
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-border shadow-sm p-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 border border-border text-text-secondary hover:text-dark rounded-xl font-heading font-semibold text-sm transition-all"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || paymentMethod === 'wallet'}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-heading font-bold text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : '🚀 Submit Campaign'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
