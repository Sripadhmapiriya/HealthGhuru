'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/context/AuthModalContext';
import {
  Check, Upload, Calendar, ExternalLink, Phone, Mail,
  Hospital, User, AlertCircle, CheckCircle2, ChevronDown,
  Wallet, Smartphone, Sparkles, Copy, CheckCheck,
  ArrowRight, ShieldCheck, Clock, LogIn, UserPlus
} from 'lucide-react';
import { AdSlotPricing } from '@/lib/types/advertisement';

// ── Types ──────────────────────────────────────────────────────────────────
type DurationPlan = 'weekly' | 'monthly';

interface FormData {
  duration_plan: DurationPlan;
  placement: string;
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
  { value: 'hospital', label: '🏥 Hospital / Health System' },
  { value: 'doctor',   label: '👨‍⚕️ Doctor / Specialist' },
  { value: 'clinic',   label: '🏪 Clinic / Diagnostic Center' },
  { value: 'pharmacy', label: '💊 Pharmacy / MedTech' },
];

const SLOT_TAGS: Record<string, string> = {
  hero_banner:     'PRIME PLACEMENT',
  popup:           'DIRECT IMPACT',
  top_banner:      'MAXIMUM REACH',
  floating_footer: 'STEADY REACH',
  sidebar:         'DEEP READER REACH',
};

const SLOT_SIZES: Record<string, string> = {
  hero_banner:     '970 × 250 px',
  popup:           '600 × 500 px',
  top_banner:      '970 × 90 px',
  floating_footer: '300 × 250 px',
  sidebar:         '300 × 250 px',
};

const POPULAR_SLOT = 'hero_banner';

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function addDays(dateStr: string, days: number): string {
  try {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ── Numbered Section Header Component ───────────────────────────────────────
function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-3.5 mb-6">
      <div className="w-8 h-8 rounded-full bg-[#CBF2DB] text-emerald-950 border border-emerald-300/80 flex items-center justify-center font-heading font-extrabold text-sm shadow-xs shrink-0">
        {num}
      </div>
      <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#1E293B]">
        {title}
      </h2>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export function CreateCampaignForm({ pricingSlots }: { pricingSlots: AdSlotPricing[] }) {
  const { data: session } = useSession();
  const { openLoginModal } = useAuthModal();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay' | 'wallet'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay');
  const [utrReference, setUtrReference] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Dynamic Payment Settings from Admin
  const [paymentSettings, setPaymentSettings] = useState<{
    razorpay_enabled: boolean;
    upi_qr_enabled: boolean;
    business_upi_id: string;
    razorpay_key_id: string;
    gst_rate: number;
  }>({
    razorpay_enabled: false,
    upi_qr_enabled: true,
    business_upi_id: 'manishmadhava91@okicici',
    razorpay_key_id: '',
    gst_rate: 18,
  });

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

  // Fetch payment settings from Admin API
  useEffect(() => {
    fetch('/api/payment-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setPaymentSettings(data.settings);
          if (data.settings.razorpay_enabled && !data.settings.upi_qr_enabled) {
            setPaymentMethod('razorpay');
          }
        }
      })
      .catch((err) => console.error('Error fetching payment settings:', err));
  }, []);

  // Automatically pre-fill contact info if user is authenticated
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        contact_name: prev.contact_name || session.user.name || '',
        contact_email: prev.contact_email || session.user.email || '',
      }));
    }
  }, [session]);

  // ── Computed pricing ───────────────────────────────────────────────────
  const selectedSlot = pricingSlots.find((s) => s.placement === form.placement) || pricingSlots[0];
  const basePrice = selectedSlot
    ? form.duration_plan === 'weekly'
      ? selectedSlot.price_per_week
      : selectedSlot.price_per_month
    : 0;
  const effectiveGstRate = typeof paymentSettings.gst_rate === 'number' ? paymentSettings.gst_rate : 18;
  const gstAmount = Math.round(basePrice * (effectiveGstRate / 100) * 100) / 100;
  const totalAmount = basePrice + gstAmount;
  const activeUpiId = paymentSettings.business_upi_id || 'manishmadhava91@okicici';
  const endDate = form.start_date
    ? addDays(form.start_date, form.duration_plan === 'weekly' ? 7 : 30)
    : '';

  const upiDeepLink = `upi://pay?pa=${activeUpiId}&pn=HealthGhuru&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(
    `HealthGhuru-Ad-${form.campaign_title || 'Campaign'}`
  )}`;
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    upiDeepLink
  )}`;

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

  const copyUpiId = () => {
    navigator.clipboard.writeText(activeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const executeCampaignSubmission = async (method: string, refId?: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        end_date: endDate,
        base_price: basePrice,
        gst_amount: gstAmount,
        total_amount: totalAmount,
        payment_method: method,
        utr_number: refId || utrReference.trim(),
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(json.error || 'Failed to submit campaign');
      }
    } catch (err: any) {
      setError(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRazorpayCampaignPay = async () => {
    setSubmitting(true);
    setError(null);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError('Failed to load Razorpay checkout. Please pay with UPI QR Code.');
      setSubmitting(false);
      return;
    }

    try {
      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          receipt: `ad_${Date.now()}`,
          notes: {
            campaign_title: form.campaign_title,
            advertiser: form.advertiser_name,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'HealthGhuru Advertising',
        description: `Ad Campaign: ${form.campaign_title}`,
        image: '/images/logo_transparent.png',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          await executeCampaignSubmission('razorpay', response.razorpay_payment_id);
        },
        prefill: {
          name: form.contact_name,
          email: form.contact_email,
          contact: form.contact_phone,
        },
        theme: {
          color: '#16A34A',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setError(resp.error?.description || 'Payment was unsuccessful. Please try again.');
        setSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Error processing Razorpay payment.');
      setSubmitting(false);
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      openLoginModal({
        initialMode: 'signin',
        intentTitle: 'Partner Sign In Required',
        intentSubtitle: 'Please sign in or create an account to save and activate your advertising campaign.',
      });
      return;
    }

    if (!form.campaign_title.trim()) {
      setError('Please enter a Campaign Title.');
      return;
    }
    if (!form.advertiser_name.trim()) {
      setError('Please enter Hospital / Business Name.');
      return;
    }
    if (!form.contact_name.trim()) {
      setError('Please enter Advertiser Contact Name.');
      return;
    }
    if (!form.contact_email.trim()) {
      setError('Please enter a valid Contact Email Address.');
      return;
    }
    if (!form.target_url.trim() || !form.target_url.startsWith('http')) {
      setError('Please provide a valid Target Click Destination URL (e.g. https://...).');
      return;
    }
    if (!form.banner_image_url) {
      setError('Please upload an Advertisement Banner Image before submitting.');
      return;
    }

    if (paymentMethod === 'razorpay') {
      await handleRazorpayCampaignPay();
      return;
    }

    if (paymentMethod === 'upi') {
      if (!utrReference.trim() || utrReference.trim().length < 6) {
        setError('Please enter the 12-digit UPI / UTR Transaction Reference Number from your payment receipt.');
        return;
      }
      await executeCampaignSubmission('upi', utrReference);
      return;
    }

    setError('Selected payment method is currently unavailable.');
  };

  // ── Success screen ─────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-14 text-center max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50/50">
          <CheckCircle2 size={42} strokeWidth={2.2} className="animate-bounce" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-heading font-bold mb-3">
          <ShieldCheck size={13} /> Payment Received &amp; Pending Approval
        </span>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 mb-3">
          Campaign Submitted Successfully!
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Your campaign request for <strong className="text-gray-900">{form.campaign_title}</strong> has been logged.
          Our medical advertising review team will verify your creative and publish it within <strong>24 hours</strong>.
        </p>
        
        {submittedId && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 inline-block mb-8">
            <span className="text-xs text-gray-500 font-mono">Reference ID: <strong className="text-gray-800 font-bold">{submittedId}</strong></span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/advertise"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-heading font-bold text-sm transition-all shadow-md shadow-emerald-700/20"
          >
            View My Campaigns <ArrowRight size={15} />
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-heading font-semibold text-sm transition-all"
          >
            Back to HealthGhuru
          </a>
        </div>
      </div>
    );
  }

  // ── Single-Page Studio Layout (HealthGhuru Brand Green Theme) ───────────
  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* ── Studio Header ── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-800 rounded-full text-xs font-heading font-bold mb-3">
          <Sparkles size={13} className="text-[#16A34A]" />
          <span className="text-[#16A34A] font-bold">
            Self-Service Campaign Studio
          </span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
          Create New Advertisement Campaign
        </h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-3xl">
          Launch your healthcare services advertisement in front of thousands of readers.
          Follow our single-page studio below to select your slot, choose your hosting duration, and complete instant checkout.
        </p>
      </div>

      {/* Guest Notice Banner */}
      {!session?.user && (
        <div className="p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-gray-900">
                You are designing your ad campaign as a Guest
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Sign in or register an account so we can link your campaign, generate GST invoices, and track performance.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => openLoginModal({
                initialMode: 'signin',
                intentTitle: 'Partner Sign In',
                intentSubtitle: 'Sign in to link this ad campaign to your medical organization.',
              })}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-heading font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn size={14} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => openLoginModal({
                initialMode: 'signup',
                intentTitle: 'Register Organization',
                intentSubtitle: 'Create a free partner account to launch campaigns.',
              })}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#f06d2f] hover:bg-[#e05a1b] text-white rounded-xl text-xs font-heading font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={14} /> Register
            </button>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-3 animate-in fade-in">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1: Duration Plan & Placement Selection
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8">
        <SectionHeader num={1} title="Select Hosting Duration & Advertisement Placement" />

        {/* Duration Plan Picker */}
        <div className="mb-8">
          <p className="text-sm font-heading font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar size={15} className="text-emerald-600" /> Choose Campaign Hosting Duration Plan:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { plan: 'weekly' as DurationPlan, title: 'Weekly Plan (7 Days)', sub: 'Shows 7-day hosting rates for banner slots' },
              { plan: 'monthly' as DurationPlan, title: 'Monthly Plan (30 Days)', sub: 'Shows 30-day hosting rates for banner slots' },
            ] as const).map(({ plan, title, sub }) => {
              const isSelected = form.duration_plan === plan;
              return (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, duration_plan: plan }))}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#16A34A] bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                    isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="font-heading font-bold text-sm text-gray-900 block">{title}</span>
                    <span className="text-xs text-gray-500 mt-0.5 block">{sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Placement Slots Grid */}
        <div>
          <p className="text-sm font-heading font-bold text-gray-800 mb-3">
            Select Ad Placement Slot:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pricingSlots.map((slot) => {
              const isSelected = form.placement === slot.placement;
              const isPopular = slot.placement === POPULAR_SLOT;
              const tag = SLOT_TAGS[slot.placement] ?? 'STANDARD';
              const size = SLOT_SIZES[slot.placement] ?? 'Responsive';
              const price = form.duration_plan === 'weekly' ? slot.price_per_week : slot.price_per_month;
              const planLabel = form.duration_plan === 'weekly' ? 'Weekly' : 'Monthly';

              return (
                <button
                  key={slot.placement}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, placement: slot.placement }))}
                  className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? 'border-[#16A34A] bg-emerald-50/70 shadow-md ring-1 ring-emerald-600/30'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
                  }`}
                >
                  {/* Popular Tag Badge */}
                  {isPopular && (
                    <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-[#CBF2DB] text-emerald-950 border border-emerald-300/80 text-[10px] font-heading font-extrabold uppercase tracking-wider rounded-full shadow-xs">
                      MOST POPULAR
                    </span>
                  )}

                  {/* Checked Icon */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#CBF2DB] text-emerald-950 flex items-center justify-center shadow-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-heading font-extrabold text-gray-600 uppercase tracking-wider bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                    <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                      📐 Size: {size}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {slot.label}
                  </h3>

                  <div className="text-emerald-700 font-heading font-extrabold text-lg mt-1 flex items-baseline gap-1.5">
                    <span>{planLabel}:</span>
                    <span className="text-emerald-700 font-black">{formatINR(price)}</span>
                  </div>

                  {slot.description && (
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                      {slot.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2: Campaign Creative & Advertiser Contact Details
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <SectionHeader num={2} title="Campaign Creative & Advertiser Contact Details" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Campaign Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-gray-800">
              Campaign Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.campaign_title}
              onChange={(e) => setForm((f) => ({ ...f, campaign_title: e.target.value }))}
              placeholder="e.g. Summer Health Checkup Drive"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Hospital / Business Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-gray-800 flex items-center gap-1.5">
              <Hospital size={13} className="text-emerald-600" /> Hospital / Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.advertiser_name}
              onChange={(e) => setForm((f) => ({ ...f, advertiser_name: e.target.value }))}
              placeholder="e.g. Apollo Hospitals"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Advertiser Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-gray-800">
              Advertiser Type
            </label>
            <div className="relative">
              <select
                value={form.advertiser_type}
                onChange={(e) => setForm((f) => ({ ...f, advertiser_type: e.target.value as any }))}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none bg-white appearance-none transition-all"
              >
                {ADVERTISER_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3.5 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Advertiser Contact Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-gray-800 flex items-center gap-1.5">
              <User size={13} className="text-emerald-600" /> Advertiser Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.contact_name}
              onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
              placeholder="Dr. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Contact Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-gray-800 flex items-center gap-1.5">
              <Mail size={13} className="text-emerald-600" /> Contact Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={form.contact_email}
              onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
              placeholder="admin@hospital.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Contact Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-gray-800 flex items-center gap-1.5">
              <Phone size={13} className="text-emerald-600" /> Contact Phone Number
            </label>
            <input
              type="tel"
              value={form.contact_phone}
              onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Target URL */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-heading font-bold text-gray-800 flex items-center gap-1.5">
              <ExternalLink size={13} className="text-emerald-600" /> Target Click Destination URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={form.target_url}
              onChange={(e) => setForm((f) => ({ ...f, target_url: e.target.value }))}
              placeholder="https://apollohospitals.com/book-appointment"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none font-mono text-gray-700 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-gray-800 flex items-center gap-1.5">
              <Calendar size={13} className="text-emerald-600" /> Campaign Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={form.start_date}
              min={todayStr()}
              onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
            />
          </div>

          {/* End Date (Auto-calculated) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-bold text-gray-800 flex items-center gap-1.5">
              <Clock size={13} className="text-emerald-600" /> Campaign End Date ({form.duration_plan === 'weekly' ? '7 Days Fixed' : '30 Days Fixed'}) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              readOnly
              value={endDate ? new Date(endDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : '—'}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-600 font-medium cursor-not-allowed outline-none"
            />
          </div>
        </div>

        {/* Banner Upload Box */}
        <div className="pt-2">
          <div
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
              form.banner_image_url
                ? 'border-emerald-500/60 bg-emerald-50/20'
                : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/10'
            }`}
          >
            {form.banner_image_url ? (
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-emerald-500/30 shadow-md bg-white">
                  <Image
                    src={form.banner_image_url}
                    alt="Uploaded Banner Preview"
                    fill
                    sizes="(max-width: 640px) 100vw, 500px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xs font-heading font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={13} /> Creative Image Ready
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm((f) => ({ ...f, banner_image_url: '' }));
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-heading font-bold underline"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                  <Upload size={26} className={uploading ? 'animate-bounce' : ''} />
                </div>
                <h3 className="font-heading font-extrabold text-base text-gray-900">
                  {uploading ? 'Uploading your creative image…' : 'Upload Advertisement Banner Image *'}
                </h3>
                <p className="text-xs text-gray-500">
                  Recommended dimensions for <strong>{selectedSlot?.label ?? form.placement}</strong>:&nbsp;
                  <span className="text-emerald-700 font-bold">{SLOT_SIZES[form.placement] ?? '970 × 250 px'}</span>
                </p>
                <p className="text-[11px] text-gray-400">
                  PNG, JPG, or WEBP formats supported (High resolution recommended)
                </p>
                <div>
                  <button
                    type="button"
                    className="mt-2 px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-heading font-bold text-xs transition-all shadow-md shadow-emerald-700/20"
                  >
                    Choose File from Computer
                  </button>
                </div>
              </div>
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
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3: Review Hosting Summary & Payment Checkout
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <SectionHeader num={3} title="Review Hosting Summary & Payment Checkout" />

          {/* Mint Green Summary Card */}
          <div className="bg-[#CBF2DB] rounded-2xl p-6 sm:p-7 text-emerald-950 border border-emerald-300/80 shadow-md space-y-3">
            <div className="flex justify-between items-center text-xs sm:text-sm border-b border-emerald-900/15 pb-2.5">
              <span className="text-emerald-900/80 font-medium">Selected Placement Slot:</span>
              <span className="font-bold text-emerald-950 font-heading">{selectedSlot?.label ?? form.placement}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm border-b border-emerald-900/15 pb-2.5">
              <span className="text-emerald-900/80 font-medium">Campaign Duration:</span>
              <span className="font-bold text-emerald-950 font-heading">{form.duration_plan === 'weekly' ? '7 Days (Weekly Package)' : '30 Days (Monthly Package)'}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm border-b border-emerald-900/15 pb-2.5">
              <span className="text-emerald-900/80 font-medium">Base Price:</span>
              <span className="font-bold text-emerald-950 font-mono">{formatINR(basePrice)}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm border-b border-emerald-900/15 pb-2.5">
              <span className="text-emerald-900/80 font-medium">GST ({effectiveGstRate}%):</span>
              <span className="font-bold text-emerald-950 font-mono">{formatINR(gstAmount)}</span>
            </div>
            <div className="pt-2 flex justify-between items-center">
              <span className="font-heading font-extrabold text-base sm:text-lg text-emerald-950">Total Payable Fee:</span>
              <span className="font-heading font-black text-2xl sm:text-3xl text-emerald-950 tracking-tight">{formatINR(totalAmount)}</span>
            </div>
          </div>

          {/* Payment Method Radio Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paymentSettings.upi_qr_enabled && (
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-start gap-3.5 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-[#16A34A] bg-emerald-50/70 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                  paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="font-heading font-bold text-sm text-gray-900 block">Dynamic UPI QR Code</span>
                  <span className="text-xs text-gray-500 mt-0.5 block">Scan QR via GPay, PhonePe, Paytm or Navi</span>
                </div>
              </button>
            )}

            {paymentSettings.razorpay_enabled && (
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`flex items-start gap-3.5 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#f06d2f] bg-orange-50/70 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                  paymentMethod === 'razorpay' ? 'border-[#f06d2f] bg-[#f06d2f]' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'razorpay' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="font-heading font-bold text-sm text-gray-900 block flex items-center justify-between">
                    <span>Razorpay Gateway</span>
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5 block">Cards, NetBanking, and Instant Checkout</span>
                </div>
              </button>
            )}

            <button
              type="button"
              onClick={() => setPaymentMethod('wallet')}
              className={`flex items-start gap-3.5 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                paymentMethod === 'wallet'
                  ? 'border-[#16A34A] bg-emerald-50/70 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white opacity-70'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                paymentMethod === 'wallet' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
              }`}>
                {paymentMethod === 'wallet' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <Wallet size={14} className="text-emerald-600" /> Digital Wallet
                </span>
                <span className="text-xs text-red-600 font-semibold mt-0.5 block">Balance: ₹0 (Insufficient)</span>
              </div>
            </button>
          </div>

          {/* UPI Apps & QR Code Card */}
          {paymentMethod === 'upi' && paymentSettings.upi_qr_enabled && (
            <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 bg-gray-50/50 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <Smartphone size={17} className="text-emerald-600" /> Select Payment App:
                </h3>
                
                {/* UPI App Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {['GPay', 'PhonePe', 'Paytm', 'Navi', 'BHIM'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setSelectedUpiApp(app)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                        selectedUpiApp === app
                          ? 'bg-[#16A34A] text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-white border-2 border-emerald-200/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xs space-y-4">
                <div className="p-3 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                  <img
                    src={qrCodeImgUrl}
                    alt="UPI Payment QR Code"
                    width={200}
                    height={200}
                    className="w-48 h-48 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div>
                  <h4 className="font-heading font-extrabold text-base text-gray-900">
                    Scan with {selectedUpiApp}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pay <strong className="text-emerald-700 font-extrabold">{formatINR(totalAmount)}</strong> to HealthGhuru Official Ad Account
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyUpiId}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 transition-all cursor-pointer"
                >
                  <strong className="text-gray-900">{activeUpiId}</strong>
                  {copiedUpi ? <CheckCheck size={13} className="text-emerald-600" /> : <Copy size={13} className="text-gray-400" />}
                </button>

                {/* 12-digit UTR input */}
                <div className="w-full max-w-md text-left pt-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-800 block">
                    Enter 12-digit UTR / UPI Transaction Reference No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={utrReference}
                    onChange={(e) => setUtrReference(e.target.value)}
                    placeholder="e.g. 421512345678"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] focus:bg-white text-xs font-mono"
                  />
                  <span className="text-[11px] text-gray-500 block">
                    Found in your payment receipt after completing UPI transfer.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Razorpay Preview Card */}
          {paymentMethod === 'razorpay' && paymentSettings.razorpay_enabled && (
            <div className="border border-orange-200 bg-orange-50/40 rounded-2xl p-6 sm:p-8 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-[#f06d2f] flex items-center justify-center mx-auto">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-gray-900">
                  Razorpay Secure Gateway
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                  Pay instantly using Credit Cards, Debit Cards, NetBanking, or Wallet via Razorpay standard modal checkout.
                </p>
              </div>
              <div className="bg-white border border-orange-200 rounded-xl p-3 inline-block font-mono text-xs text-gray-700">
                Total Payable: <strong className="text-gray-900">{formatINR(totalAmount)}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Big Submit Button */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs text-gray-500 block">Total Due:</span>
            <span className="font-heading font-black text-2xl text-[#16A34A]">{formatINR(totalAmount)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting || paymentMethod === 'wallet'}
            className="w-full sm:w-auto px-10 py-4 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-heading font-extrabold text-base transition-all shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:shadow-emerald-700/35 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Submission…</span>
              </>
            ) : paymentMethod === 'razorpay' ? (
              <>
                <Sparkles size={17} />
                <span>Pay Now with Razorpay ({formatINR(totalAmount)})</span>
              </>
            ) : (
              <>
                <span>🚀 Submit Campaign &amp; Pay {formatINR(totalAmount)}</span>
              </>
            )}
          </button>
        </div>
      </div>

    </form>
  );
}
