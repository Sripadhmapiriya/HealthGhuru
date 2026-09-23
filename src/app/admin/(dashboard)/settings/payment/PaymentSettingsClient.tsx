/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Eye,
  Check,
} from 'lucide-react';

interface PaymentSettingsClientProps {
  initialSettings: {
    razorpay_enabled: boolean;
    upi_qr_enabled: boolean;
    business_upi_id: string;
    razorpay_key_id: string;
    razorpay_key_secret: string;
    gst_rate: number;
  };
}

export function PaymentSettingsClient({ initialSettings }: PaymentSettingsClientProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Payment settings saved successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to save payment settings', 'error');
      }
    } catch {
      showToast('Error saving payment settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const activeUpiId = settings.business_upi_id || 'manishmadhava91@okicici';
  const previewUpiString = `upi://pay?pa=${activeUpiId}&pn=HealthGhuru&cu=INR&tn=TestPayment`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(previewUpiString)}`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-700'
              : 'bg-red-600 text-white border-red-700'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Payment Gateway &amp; UPI Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage visible payment methods (Razorpay &amp; Dynamic UPI QR Code), set your business UPI ID, and configure tax rates.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── CARD 1: Payment Method Visibility Controls ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-orange-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-[#ea580c]" />
            <h2 className="font-heading font-bold text-base text-slate-900">
              Payment Method Visibility Controls
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Enable or hide payment options displayed to readers across Subscriptions, Advertisements, and Sponsorships checkouts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Razorpay Checkbox */}
            <label
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                settings.razorpay_enabled
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={settings.razorpay_enabled}
                onChange={(e) => setSettings({ ...settings, razorpay_enabled: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-[#ea580c] rounded focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="font-heading font-bold text-sm text-slate-900 block">
                  Razorpay Gateway
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Credit/Debit Cards, Netbanking
                </span>
              </div>
            </label>

            {/* Dynamic UPI QR Code Checkbox */}
            <label
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                settings.upi_qr_enabled
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={settings.upi_qr_enabled}
                onChange={(e) => setSettings({ ...settings, upi_qr_enabled: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-[#ea580c] rounded focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="font-heading font-bold text-sm text-slate-900 block">
                  Dynamic UPI QR Code
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  GPay, PhonePe, Paytm, Navi, BHIM
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* ── CARD 2: Business UPI ID & Live QR Preview ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-[#16A34A]" />
            <h2 className="font-heading font-bold text-base text-slate-900">
              Business UPI ID &amp; Live QR Preview
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            Enter your business UPI ID (VPA). A Dynamic QR Code with <strong>exact auto-prefilled checkout amounts</strong> will be generated and previewed live below!
          </p>

          <div>
            <label className="font-heading font-bold text-xs text-slate-700 block mb-1.5">
              Business UPI ID (VPA)
            </label>
            <input
              type="text"
              required
              value={settings.business_upi_id}
              onChange={(e) => setSettings({ ...settings, business_upi_id: e.target.value })}
              placeholder="e.g. manishmadhava91@okicici"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/30 focus:border-[#ea580c]"
            />
            <span className="text-[11px] text-slate-500 block mt-1">
              Payments sent to this UPI ID will go directly to your linked business bank account.
            </span>
          </div>

          {/* Live Generated QR Box */}
          <div className="p-6 rounded-2xl border-2 border-emerald-500/80 bg-white max-w-sm mx-auto text-center space-y-3 shadow-xs">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100/70 text-emerald-800 text-[11px] font-mono font-bold px-3 py-1 rounded-full">
              <Eye size={12} />
              <span>Live Generated QR Code Preview</span>
            </div>

            <div className="relative w-44 h-44 mx-auto bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-center">
              <Image
                src={qrCodeUrl}
                alt="Live UPI QR Code"
                width={170}
                height={170}
                className="object-contain"
                unoptimized
              />
            </div>

            <div>
              <p className="font-heading font-bold text-xs text-slate-900">
                UPI ID: <span className="text-[#ea580c] font-mono">{activeUpiId}</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto leading-tight">
                Scan with GPay or PhonePe to test. When saved, this QR will be generated live with <strong>auto-prefilled checkout amounts</strong> on both websites!
              </p>
            </div>
          </div>

          {/* Automated Dynamic QR Generation Active Callout */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
            <Sparkles size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <strong className="font-heading font-bold block mb-0.5">
                Automated Dynamic QR Generation Active
              </strong>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Scanning the generated QR code in GPay, PhonePe, Paytm, Navi, or BHIM automatically prefills the exact payable amount for subscriptions, ads, and sponsorships.
              </p>
            </div>
          </div>
        </div>

        {/* ── CARD 3: Razorpay API Keys & GST Tax Rate ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
          <h2 className="font-heading font-bold text-base text-slate-900">
            Razorpay API Keys &amp; GST Tax Rate
          </h2>

          <div className="space-y-4">
            <div>
              <label className="font-heading font-bold text-xs text-slate-700 block mb-1.5">
                Razorpay Key ID
              </label>
              <input
                type="text"
                value={settings.razorpay_key_id}
                onChange={(e) => setSettings({ ...settings, razorpay_key_id: e.target.value })}
                placeholder="rzp_live_xxx or rzp_test_xxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/30 focus:border-[#ea580c]"
              />
            </div>

            <div>
              <label className="font-heading font-bold text-xs text-slate-700 block mb-1.5">
                Razorpay Key Secret
              </label>
              <input
                type="password"
                value={settings.razorpay_key_secret}
                onChange={(e) => setSettings({ ...settings, razorpay_key_secret: e.target.value })}
                placeholder="Enter secret key"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/30 focus:border-[#ea580c]"
              />
            </div>

            <div>
              <label className="font-heading font-bold text-xs text-slate-700 block mb-1.5">
                GST Tax Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={settings.gst_rate}
                onChange={(e) => setSettings({ ...settings, gst_rate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/30 focus:border-[#ea580c]"
              />
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTON (Exact Full-Width Orange Button from Screenshot) ── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-heading font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <Check size={18} />
          <span>{loading ? 'Saving Settings...' : 'Save Payment Settings'}</span>
        </button>
      </form>
    </div>
  );
}
