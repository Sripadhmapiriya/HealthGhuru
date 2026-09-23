'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface SinglePackageOption {
  id: string;
  name: string;
  basePrice: number;
}

interface ComboPackageInfo {
  id: string;
  title: string;
  comboName: string;
  fullPackageName: string;
  price: number;
  items: string[];
  placementCoverage: string;
  preferredPlacement: string;
}

const SINGLE_PACKAGES: SinglePackageOption[] = [
  { id: 'standard', name: 'Sponsored News Article (₹1)', basePrice: 1 },
  { id: 'event', name: 'Event Coverage (₹14,999)', basePrice: 14999 },
  { id: 'seo_premium', name: 'SEO Premium Article (₹14,999)', basePrice: 14999 },
  { id: 'profile', name: 'Company Profile Feature (₹17,999)', basePrice: 17999 },
  { id: 'product_launch', name: 'Product Launch Coverage (₹19,999)', basePrice: 19999 },
  { id: 'brand_story', name: 'Brand Story (₹19,999)', basePrice: 19999 },
];

const COMBO_PACKAGES: ComboPackageInfo[] = [
  {
    id: 'growth',
    title: 'Business Growth',
    comboName: 'Business Growth',
    fullPackageName: 'Business Growth Combo (₹50,000)',
    price: 50000,
    items: [
      '2 Sponsored Articles',
      'Homepage Banner (15 Days)',
      'Instagram Reel',
      'Facebook Promotion',
      'WhatsApp Broadcast',
    ],
    placementCoverage: 'Homepage Banner (15 Days)',
    preferredPlacement: 'Homepage Sponsored Section - 15 Days',
  },
  {
    id: 'starter',
    title: 'Starter Combo',
    comboName: 'Starter Combo',
    fullPackageName: 'Starter Combo (₹25,000)',
    price: 25000,
    items: [
      '1 Sponsored Health Article',
      'Instagram Post',
      'Facebook Post',
      'Sidebar Banner (7 Days)',
    ],
    placementCoverage: 'Sidebar Banner (7 Days)',
    preferredPlacement: 'Sidebar Sponsored Section - 7 Days',
  },
  {
    id: 'premium',
    title: 'Premium Brand',
    comboName: 'Premium Brand',
    fullPackageName: 'Premium Brand Combo (₹1,00,000)',
    price: 100000,
    items: [
      '4 Sponsored Articles',
      'Homepage Banner (30 Days)',
      'Clinical Press Release',
      'Instagram Reel',
      'Facebook Promotion',
      'YouTube Community Post',
      'WhatsApp Broadcast',
    ],
    placementCoverage: 'Homepage Banner (30 Days)',
    preferredPlacement: 'Homepage Sponsored Section - 30 Days',
  },
];

const VIDEO_ADDONS = [
  { id: 'none', name: 'No Video Promotion', price: 0 },
  { id: 'embed', name: 'Promotional Video Embed (+₹9,999)', price: 9999 },
  { id: 'homepage', name: 'Homepage Featured Video (+₹19,999)', price: 19999 },
  { id: 'interview', name: 'Doctor & Specialist Interview Video (+₹34,999)', price: 34999 },
  { id: 'event_video', name: 'Event & Health Camp Video Coverage (+₹39,999)', price: 39999 },
  { id: 'documentary', name: 'Documentary / Hospital Brand Film (+₹75,001)', price: 75001 },
];

function findMatchingCombo(param: string | null): ComboPackageInfo | null {
  if (!param) return null;
  const clean = decodeURIComponent(param).toLowerCase().trim();
  return (
    COMBO_PACKAGES.find(
      (c) =>
        c.id.toLowerCase() === clean ||
        c.title.toLowerCase() === clean ||
        c.comboName.toLowerCase() === clean ||
        clean.includes(c.id.toLowerCase()) ||
        clean.includes(c.title.toLowerCase())
    ) || null
  );
}

export function SponsorRequestForm() {
  const searchParams = useSearchParams();

  const comboParam = searchParams.get('combo');
  const packageParam = searchParams.get('package');

  // Check if a combo was matched
  const [activeCombo, setActiveCombo] = useState<ComboPackageInfo | null>(() =>
    findMatchingCombo(comboParam)
  );

  const [selectedSinglePkgId, setSelectedSinglePkgId] = useState(() => packageParam || 'standard');
  const [selectedVideoId, setSelectedVideoId] = useState('none');
  const [placement, setPlacement] = useState('Homepage Sponsored Section');
  const [publishDate, setPublishDate] = useState('');

  // Contact Details
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Content & Files
  const [articleContent, setArticleContent] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

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
  const [paymentMode, setPaymentMode] = useState<'upi' | 'razorpay'>('upi');

  // Payment State
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay');
  const [utrReference, setUtrReference] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Fetch payment settings from Admin API
  useEffect(() => {
    fetch('/api/payment-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setPaymentSettings(data.settings);
          if (data.settings.razorpay_enabled && !data.settings.upi_qr_enabled) {
            setPaymentMode('razorpay');
          }
        }
      })
      .catch((err) => console.error('Error fetching payment settings:', err));
  }, []);

  // React to URL changes
  useEffect(() => {
    const cParam = searchParams.get('combo');
    const pParam = searchParams.get('package');
    const matched = findMatchingCombo(cParam);
    setActiveCombo(matched);
    if (pParam) {
      setSelectedSinglePkgId(pParam);
    }
  }, [searchParams]);

  // Current single package & video addon
  const currentSinglePkg =
    SINGLE_PACKAGES.find((p) => p.id === selectedSinglePkgId) || SINGLE_PACKAGES[0];
  const currentVideo = VIDEO_ADDONS.find((v) => v.id === selectedVideoId) || VIDEO_ADDONS[0];

  // Price calculations with dynamic GST rate
  const isComboMode = Boolean(activeCombo);
  const basePrice = isComboMode && activeCombo ? activeCombo.price : currentSinglePkg.basePrice;
  const videoPrice = isComboMode ? 0 : currentVideo.price;
  const subTotal = basePrice + videoPrice;
  const effectiveGstRate = typeof paymentSettings.gst_rate === 'number' ? paymentSettings.gst_rate : 18;
  const gstAmount = Number(((subTotal * effectiveGstRate) / 100).toFixed(2));
  const totalPayable = Number((subTotal + gstAmount).toFixed(2));
  const activeUpiId = paymentSettings.business_upi_id || 'manishmadhava91@okicici';

  // Format currency helpers matching exact screenshots
  const formatBaseCurrency = (val: number) => {
    if (val % 1 === 0) {
      return `₹${val.toLocaleString('en-IN')}`;
    }
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatTaxOrTotalCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Copy UPI handler
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(activeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Upload helper
  const uploadSingleFile = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
    } catch {
      // ignore
    }
    return '';
  };

  const activeTitle = isComboMode && activeCombo ? activeCombo.title : currentSinglePkg.name;
  const upiDeepLink = `upi://pay?pa=${activeUpiId}&pn=HealthGhuru&am=${totalPayable}&cu=INR&tn=${encodeURIComponent(
    `HealthGhuru-${activeTitle}`
  )}`;
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    upiDeepLink
  )}`;

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

  const finalizeSubmission = async (method: 'upi' | 'razorpay', refId: string) => {
    setLoading(true);
    setError(null);

    try {
      let finalLogoUrl = '';
      let finalBannerUrl = '';
      let finalVideoUrl = '';
      let finalDocUrl = '';

      if (logoFile) finalLogoUrl = await uploadSingleFile(logoFile);
      if (bannerFile) finalBannerUrl = await uploadSingleFile(bannerFile);
      if (videoFile) finalVideoUrl = await uploadSingleFile(videoFile);
      if (docFile) finalDocUrl = await uploadSingleFile(docFile);

      const packageName = isComboMode && activeCombo
        ? activeCombo.fullPackageName
        : currentSinglePkg.name;

      const placementValue = isComboMode && activeCombo
        ? activeCombo.preferredPlacement
        : placement;

      const payload = {
        company_name: companyName,
        contact_person: contactPerson,
        phone,
        email,
        website_url: websiteUrl,
        package_id: isComboMode && activeCombo ? activeCombo.id : currentSinglePkg.id,
        package_name: packageName,
        video_package_id: isComboMode ? 'none' : currentVideo.id,
        video_package_name: isComboMode ? 'Combo Included' : currentVideo.name,
        placement: placementValue,
        publish_date: publishDate,
        article_content: articleContent,
        logo_url: finalLogoUrl,
        featured_image_url: finalBannerUrl,
        video_url: finalVideoUrl,
        document_url: finalDocUrl,
        base_price: basePrice,
        gst_amount: gstAmount,
        total_amount: totalPayable,
        payment_method: method,
        upi_app: method === 'upi' ? selectedUpiApp : 'Razorpay Gateway',
        utr_reference: refId.trim(),
      };

      const res = await fetch('/api/sponsored-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessData(data);
      } else {
        setError(data.error || 'Failed to submit sponsor request.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your request.');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayCheckout = async () => {
    if (!companyName || !contactPerson || !email || !phone) {
      setError('Please fill in all mandatory contact information before proceeding to payment.');
      return;
    }

    setLoading(true);
    setError(null);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError('Failed to load Razorpay secure checkout. Please use UPI QR Code payment.');
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPayable,
          receipt: `spn_${Date.now()}`,
          notes: {
            company_name: companyName,
            package_name: activeTitle,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initiate Razorpay order.');
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'HealthGhuru',
        description: `Sponsorship: ${activeTitle}`,
        image: '/images/logo_transparent.png',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          await finalizeSubmission('razorpay', response.razorpay_payment_id);
        },
        prefill: {
          name: contactPerson,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#f06d2f',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setError(resp.error?.description || 'Payment was unsuccessful. Please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Error creating Razorpay order.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactPerson || !email || !phone) {
      setError('Please fill in all mandatory contact information.');
      return;
    }

    if (paymentMode === 'razorpay') {
      await handleRazorpayCheckout();
      return;
    }

    if (!utrReference.trim() || utrReference.trim().length < 6) {
      setError('Please enter the 12-digit UPI / UTR Transaction Reference Number from your payment receipt.');
      return;
    }

    await finalizeSubmission('upi', utrReference);
  };

  // Success view
  if (successData) {
    return (
      <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
            Sponsor Request Received!
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Thank you, <strong className="text-gray-900">{contactPerson}</strong>. Your sponsorship request for{' '}
            <strong className="text-gray-900">{companyName}</strong> has been received by HealthGhuru’s commercial editorial desk.
          </p>
        </div>

        <div className="bg-emerald-50/70 rounded-2xl p-5 text-left text-xs text-gray-700 space-y-2 border border-emerald-100">
          <div className="flex justify-between py-1 border-b border-emerald-100">
            <span className="font-medium text-gray-500">Request Reference ID:</span>
            <span className="font-mono font-bold text-emerald-900">{successData.request_id}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-emerald-100">
            <span className="font-medium text-gray-500">Selected Package:</span>
            <span className="font-bold text-gray-900">
              {isComboMode && activeCombo ? activeCombo.fullPackageName : currentSinglePkg.name}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-emerald-100">
            <span className="font-medium text-gray-500">UTR / Reference No:</span>
            <span className="font-mono font-bold text-gray-900">{utrReference}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-emerald-100">
            <span className="font-medium text-gray-500">Total Amount Paid:</span>
            <span className="font-mono font-extrabold text-[#f06d2f]">{formatTaxOrTotalCurrency(totalPayable)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-medium text-gray-500">Payment Status:</span>
            <span className="font-bold text-[#16A34A] uppercase">Under Verification</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          Our clinical editorial and design team will verify the payment and contact you within 24 business hours to finalize the draft and schedule publication.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/sponsored-articles"
            className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors"
          >
            Back to Sponsored Section
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-emerald-100/90 shadow-xs overflow-hidden max-w-4xl mx-auto">
      
      {/* ── Form Header (Matching Reference Screenshot) ── */}
      <div className="p-6 sm:p-10 border-b border-gray-100 text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full text-[#f06d2f] text-[10px] font-mono font-bold uppercase tracking-wider">
          <Sparkles size={12} />
          <span>SPONSOR INQUIRY PORTAL</span>
        </div>

        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-gray-900 tracking-tight">
          Sponsor Request Portal
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          Submit your business or event details. Our editorial &amp; reporting team will draft your coverage and publish upon approval.
        </p>
      </div>

      {error && (
        <div className="mx-6 sm:mx-10 mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 text-xs text-gray-800">
        
        {/* ── COMBO PACKAGE HIGHLIGHT BOX (Matching Theme) ── */}
        {isComboMode && activeCombo && (
          <div className="bg-[#CBF2DB]/30 border border-emerald-300 rounded-2xl p-5 sm:p-6 text-left space-y-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-emerald-200/80 pb-3">
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#15803D]">
                Selected Combo Package: {activeCombo.comboName}
              </h2>
              <div className="text-sm font-semibold text-gray-800">
                Price: <span className="font-heading font-extrabold text-base text-[#15803D]">₹{activeCombo.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700">
                Included Services (Read-only):
              </div>
              <div className="flex flex-wrap gap-2">
                {activeCombo.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-[#CBF2DB] text-emerald-950 border border-emerald-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 1. Organization & Contact Details (Matching Image 3) ── */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
            <span className="text-[#f06d2f] font-mono font-bold">1.</span>
            <span>Organization &amp; Contact Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 block mb-1.5">
                Company / Institution Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Vel Tech College"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] focus:bg-white text-xs transition-colors"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1.5">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Rahul R"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] focus:bg-white text-xs transition-colors"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] focus:bg-white text-xs transition-colors"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@company.com"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] focus:bg-white text-xs transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-gray-700 block mb-1.5">
                Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://www.company.com"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] focus:bg-white text-xs transition-colors font-mono"
              />
            </div>
          </div>
        </section>

        {/* ── 2. Package, Workflow & Placement Settings (Matching Image 3) ── */}
        <section className="space-y-4 pt-6 border-t border-gray-100">
          <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
            <span className="text-[#f06d2f] font-mono font-bold">2.</span>
            <span>Package, Workflow &amp; Placement Settings</span>
          </h2>

          {isComboMode && activeCombo ? (
            /* Combo Mode: Exact layout from Image 3 */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">
                  Selected Package
                </label>
                <div className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-heading font-bold text-xs text-gray-900">
                  {activeCombo.fullPackageName}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">
                  Placement Coverage
                </label>
                <div className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-heading font-bold text-xs text-gray-900">
                  {activeCombo.placementCoverage}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">
                  Preferred Placement
                </label>
                <div className="w-full px-3.5 py-2.5 bg-[#CBF2DB]/35 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs font-heading font-semibold text-gray-900 shadow-2xs">
                  <span className="text-[#16A34A] text-sm">📍</span>
                  <span>{activeCombo.preferredPlacement}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">
                  Preferred Publish Date
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] text-xs font-mono"
                />
              </div>
            </div>
          ) : (
            /* Single Article Mode */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">
                  Preferred Article Package <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSinglePkgId}
                  onChange={(e) => setSelectedSinglePkgId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] font-heading font-semibold text-xs text-gray-900"
                >
                  {SINGLE_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">
                  Optional Video Promotion
                </label>
                <select
                  value={selectedVideoId}
                  onChange={(e) => setSelectedVideoId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] font-heading font-semibold text-xs text-gray-900"
                >
                  {VIDEO_ADDONS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">
                  Preferred Placement
                </label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] font-heading font-medium text-xs text-gray-900"
                >
                  <option value="Homepage Sponsored Section">Homepage Sponsored Section</option>
                  <option value="Category Sponsored Section">Category Sponsored Section</option>
                  <option value="Dedicated Article Hub">Dedicated Article Hub</option>
                  <option value="All Placements">All Placements (Maximum Reach)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1.5">
                  Preferred Publish Date
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] text-xs font-mono"
                />
              </div>
            </div>
          )}
        </section>

        {/* ── 3. Event Details & Media Assets (Matching Image 3 & 4) ── */}
        <section className="space-y-4 pt-6 border-t border-gray-100">
          <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
            <span className="text-[#f06d2f] font-mono font-bold">3.</span>
            <span>Event Details &amp; Media Assets</span>
          </h2>

          <div>
            <label className="font-semibold text-gray-700 block mb-1.5">
              Article Content / Brief Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              placeholder="Enter your ready-made article content, press release, or brief event highlights for coverage..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] focus:bg-white text-xs leading-relaxed"
            />
          </div>

          {/* 4 Uploaders with Required tags (Matching Image 3 & 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Logo */}
            <div>
              <label className="font-semibold text-gray-800 block text-xs mb-1">
                Company Logo <span className="text-red-500">*</span>
              </label>
              <div className="border border-orange-300 rounded-lg p-1 bg-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>
              <span className="text-[10px] text-red-500 font-semibold block mt-0.5">Required</span>
            </div>

            {/* Featured Image */}
            <div>
              <label className="font-semibold text-gray-800 block text-xs mb-1">
                Featured Image / Brand Banner <span className="text-red-500">*</span>
              </label>
              <div className="border border-orange-300 rounded-lg p-1 bg-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>
              <span className="text-[10px] text-red-500 font-semibold block mt-0.5">Required</span>
            </div>

            {/* Promotional Video */}
            <div>
              <label className="font-semibold text-gray-800 block text-xs mb-1">
                Promotional Video (MP4)
              </label>
              <div className="border border-gray-300 rounded-lg p-1 bg-white">
                <input
                  type="file"
                  accept="video/mp4,video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Sponsor Documents */}
            <div>
              <label className="font-semibold text-gray-800 block text-xs mb-1">
                Sponsor Documents (PDF/Word) <span className="text-red-500">*</span>
              </label>
              <div className="border border-orange-300 rounded-lg p-1 bg-white">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                  className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>
              <span className="text-[10px] text-red-500 font-semibold block mt-0.5">Required</span>
            </div>
          </div>
        </section>

        {/* ── 4. Price Summary Card (Matching Theme Footer Color) ── */}
        <div className="rounded-2xl p-6 bg-[#CBF2DB] border border-emerald-300 text-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span>Base Package Price:</span>
            <span className="font-mono font-bold text-sm text-slate-900">{formatBaseCurrency(basePrice)}</span>
          </div>

          {!isComboMode && videoPrice > 0 && (
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>Video Addon Price:</span>
              <span className="font-mono font-bold text-sm text-slate-900">{formatBaseCurrency(videoPrice)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-700 pb-2.5 border-b border-emerald-300/80">
            <span>GST ({effectiveGstRate}%):</span>
            <span className="font-mono font-bold text-sm text-slate-900">{formatTaxOrTotalCurrency(gstAmount)}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-heading font-extrabold text-base sm:text-lg text-slate-950">
              Total Payable Amount
            </span>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-950">
              {formatTaxOrTotalCurrency(totalPayable)}
            </span>
          </div>
        </div>

        {/* ── 5. Payment Section ── */}
        <section className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-sm sm:text-base text-gray-900">
              Select Payment Method
            </h2>
            {paymentSettings.razorpay_enabled && paymentSettings.upi_qr_enabled && (
              <span className="text-[11px] text-gray-500 font-mono">2 Gateways Active</span>
            )}
          </div>

          {/* Payment Method Selector if both enabled */}
          {paymentSettings.razorpay_enabled && paymentSettings.upi_qr_enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMode('upi')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  paymentMode === 'upi'
                    ? 'border-[#16A34A] bg-emerald-50/70 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-heading font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between">
                  <span>Dynamic UPI QR Code</span>
                  {paymentMode === 'upi' && (
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  )}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Instant scan &amp; pay via GPay, PhonePe, Paytm, BHIM
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('razorpay')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  paymentMode === 'razorpay'
                    ? 'border-[#f06d2f] bg-orange-50/70 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-heading font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between">
                  <span>Razorpay Gateway</span>
                  {paymentMode === 'razorpay' ? (
                    <span className="w-2 h-2 rounded-full bg-[#f06d2f]" />
                  ) : (
                    <span className="text-[10px] bg-orange-100 text-orange-800 font-mono px-1.5 py-0.5 rounded">Cards &amp; NetBanking</span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Pay securely with Credit/Debit Cards, NetBanking
                </div>
              </button>
            </div>
          )}

          {/* If UPI is selected or only UPI is available */}
          {paymentMode === 'upi' && paymentSettings.upi_qr_enabled && (
            <div className="space-y-4">
              {/* UPI App Selection Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                {['GPay', 'PhonePe', 'Paytm', 'Navi', 'BHIM'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setSelectedUpiApp(app)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                      selectedUpiApp === app
                        ? 'bg-[#16A34A] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>

              {/* QR Code Card */}
              <div className="border border-emerald-300 rounded-2xl p-6 sm:p-8 bg-white flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
                <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-xs">
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

                {/* UPI ID / VPA with Copy */}
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-mono shadow-2xs">
                  <span className="text-gray-500 font-sans text-[11px]">UPI ID / VPA:</span>
                  <strong className="text-gray-900">{activeUpiId}</strong>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-white bg-[#16A34A] hover:bg-[#15803D] px-2.5 py-1 rounded-md ml-2 transition-colors cursor-pointer"
                  >
                    {copiedUpi ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                  </button>
                </div>
              </div>

              {/* 12-digit UTR input */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-900 block">
                  Enter 12-digit UTR / Transaction Reference No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={utrReference}
                  onChange={(e) => setUtrReference(e.target.value)}
                  placeholder="e.g. 421512345678"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] focus:bg-white text-xs font-mono"
                />
                <span className="text-[11px] text-gray-500 block">
                  Find the 12-digit UTR/Ref No. in your GPay / PhonePe / Paytm payment receipt.
                </span>
              </div>
            </div>
          )}

          {/* If Razorpay is selected */}
          {paymentMode === 'razorpay' && paymentSettings.razorpay_enabled && (
            <div className="border border-orange-200 bg-orange-50/40 rounded-2xl p-6 sm:p-8 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-[#f06d2f] flex items-center justify-center mx-auto">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-gray-900">
                  Razorpay Secure Online Checkout
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                  You will be directed to Razorpay standard payment modal to complete payment via Credit Cards, Debit Cards, NetBanking, or UPI.
                </p>
              </div>
              <div className="bg-white border border-orange-200 rounded-xl p-3 inline-block font-mono text-xs text-gray-700">
                Amount to pay: <strong className="text-gray-900">{formatTaxOrTotalCurrency(totalPayable)}</strong>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#f06d2f] hover:bg-[#e05b1d] text-white text-sm font-heading font-bold rounded-xl shadow-md shadow-orange-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Processing...</span>
              ) : paymentMode === 'razorpay' ? (
                <>
                  <Sparkles size={17} />
                  <span>Pay Now via Razorpay ({formatTaxOrTotalCurrency(totalPayable)})</span>
                </>
              ) : (
                <>
                  <Check size={17} strokeWidth={3} />
                  <span>Confirm UPI Payment</span>
                </>
              )}
            </button>
          </div>
        </section>

      </form>
    </div>
  );
}
