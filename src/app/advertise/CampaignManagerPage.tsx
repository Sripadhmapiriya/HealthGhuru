'use client';

import Link from 'next/link';
import { Megaphone, PlusCircle, Clock, CheckCircle2, XCircle, AlertCircle, Eye, Hospital } from 'lucide-react';
import { AdSlotPricing } from '@/lib/types/advertisement';
import { useEffect, useState } from 'react';

interface CampaignRequest {
  id: string;
  campaign_title: string;
  advertiser_name: string;
  advertiser_type: string;
  placement: string;
  duration_plan: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  payment_status: string;
  status: string;
  created_at: string;
  banner_image_url?: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: 'Pending Review',  color: 'bg-amber-50 text-amber-700 border-amber-200',   icon: Clock },
  approved:  { label: 'Approved',        color: 'bg-blue-50 text-blue-700 border-blue-200',       icon: CheckCircle2 },
  active:    { label: 'Live',            color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  rejected:  { label: 'Rejected',        color: 'bg-red-50 text-red-700 border-red-200',          icon: XCircle },
  completed: { label: 'Completed',       color: 'bg-gray-100 text-gray-600 border-gray-200',      icon: CheckCircle2 },
};

const PLACEMENT_LABELS: Record<string, string> = {
  top_banner: 'Top Banner',
  hero_banner: 'Hero Health Panel',
  sidebar: 'Sidebar Widget',
  floating_footer: 'Sticky Health Bar',
  popup: 'Health Spotlight Popup',
};

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Payment Pending', color: 'text-amber-600' },
  paid:    { label: 'Paid',            color: 'text-emerald-600' },
  failed:  { label: 'Payment Failed',  color: 'text-red-600' },
};

export function CampaignManagerPage({ pricingSlots }: { pricingSlots: AdSlotPricing[] }) {
  const [campaigns, setCampaigns] = useState<CampaignRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campaigns')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCampaigns(d.campaigns); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Megaphone size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl text-dark">Ad Campaign Manager</h1>
                <p className="text-xs text-text-secondary">
                  Host your hospital or clinic advertisements directly on HealthGhuru&apos;s health portal.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Wallet balance badge (placeholder) */}
              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-xs font-heading font-semibold text-text-secondary">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wide">Wallet Balance</span>
                <span className="font-bold text-dark">₹0</span>
              </div>
              <Link
                href="/advertise/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-heading font-bold transition-all shadow-md shadow-primary/20"
              >
                <PlusCircle size={16} /> Start New Campaign
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Campaigns List ── */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-text-secondary">Loading your campaigns…</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-16 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
              <Megaphone size={28} className="text-text-muted stroke-[1.5]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-dark mb-1">No Campaigns Found</h3>
            <p className="text-sm text-text-secondary mb-6">
              You haven&apos;t submitted any advertisement campaigns yet.
            </p>
            <Link
              href="/advertise/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-heading font-bold transition-all shadow-md"
            >
              Create Your First Campaign
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-base text-dark">Your Campaigns ({campaigns.length})</h2>
            {campaigns.map((c) => {
              const st = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.pending;
              const pmt = PAYMENT_STATUS[c.payment_status] ?? PAYMENT_STATUS.pending;
              const StatusIcon = st.icon;
              return (
                <div key={c.id} className="bg-white rounded-2xl border border-border shadow-sm p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Hospital size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-sm text-dark">{c.campaign_title}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${st.color}`}>
                        <StatusIcon size={11} /> {st.label}
                      </span>
                    </div>
                    <div className="text-xs text-text-secondary mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                      <span>{c.advertiser_name}</span>
                      <span>{PLACEMENT_LABELS[c.placement] ?? c.placement}</span>
                      <span className="capitalize">{c.duration_plan === 'weekly' ? '7 Days' : '30 Days'}</span>
                      <span>{new Date(c.start_date).toLocaleDateString('en-IN')} – {new Date(c.end_date).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-heading font-bold text-base text-dark">{formatINR(c.total_amount)}</div>
                    <div className={`text-[11px] font-semibold ${pmt.color}`}>{pmt.label}</div>
                  </div>
                  <Link
                    href={`/advertise/campaigns/${c.id}`}
                    className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors shrink-0"
                  >
                    <Eye size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Why Advertise on HealthGhuru ── */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <h2 className="font-heading font-bold text-lg text-dark mb-6">Why Advertise on HealthGhuru?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: '1.4M+', sub: 'Monthly Health Readers', color: 'text-primary' },
              { label: '3.8 min', sub: 'Avg. Session Duration', color: 'text-blue-600' },
              { label: '40+', sub: 'Hospital Partners', color: 'text-purple-600' },
              { label: '100%', sub: 'Medical Audience', color: 'text-emerald-600' },
            ].map((s) => (
              <div key={s.label} className="bg-surface/60 rounded-xl p-5 text-center border border-border">
                <div className={`font-heading font-bold text-3xl ${s.color}`}>{s.label}</div>
                <div className="text-xs text-text-secondary mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Available Slots Preview ── */}
        {pricingSlots.length > 0 && (
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg text-dark">Available Ad Placements</h2>
              <Link href="/advertise/create" className="text-xs font-heading font-semibold text-primary hover:underline">
                Create Campaign →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pricingSlots.map((slot) => (
                <Link
                  key={slot.id}
                  href="/advertise/create"
                  className="group p-4 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all bg-surface/40"
                >
                  <div className="font-heading font-bold text-sm text-dark group-hover:text-primary transition-colors">{slot.label}</div>
                  {slot.description && <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">{slot.description}</p>}
                  <div className="mt-3 font-heading font-bold text-primary text-base">
                    Weekly: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(slot.price_per_week)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
