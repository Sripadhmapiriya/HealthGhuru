'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Megaphone, Clock, CheckCircle2, XCircle, Eye, Trash2, Hospital } from 'lucide-react';

type CampaignRequest = {
  id: string;
  campaign_title: string;
  advertiser_name: string;
  advertiser_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  target_url: string;
  placement: string;
  duration_plan: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  banner_image_url?: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: 'Pending',  color: 'bg-amber-50 text-amber-700 border-amber-200',  icon: Clock },
  approved:  { label: 'Approved', color: 'bg-blue-50 text-blue-700 border-blue-200',     icon: CheckCircle2 },
  active:    { label: 'Live',     color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  rejected:  { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200',        icon: XCircle },
  completed: { label: 'Completed',color: 'bg-gray-100 text-gray-600 border-gray-200',    icon: CheckCircle2 },
};

const PLACEMENT_LABELS: Record<string, string> = {
  top_banner: 'Top Health Banner', hero_banner: 'Hero Health Panel',
  sidebar: 'Sidebar Widget', floating_footer: 'Sticky Health Bar', popup: 'Health Spotlight Popup',
};

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function AdminCampaignsClient({ initialCampaigns }: { initialCampaigns: any[] }) {
  const [campaigns, setCampaigns] = useState<CampaignRequest[]>(initialCampaigns as CampaignRequest[]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<CampaignRequest | null>(null);

  const updateStatus = async (id: string, status: string, payment_status?: string) => {
    setUpdating(id);
    const res = await fetch(`/api/campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, payment_status }),
    });
    const json = await res.json();
    if (json.success) {
      setCampaigns((prev) => prev.map((c) => (c.id === id ? json.campaign : c)));
      if (selected?.id === id) setSelected(json.campaign);
    }
    setUpdating(null);
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Delete this campaign request?')) return;
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const pendingCount = campaigns.filter((c) => c.status === 'pending').length;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-xl text-dark flex items-center gap-2">
            <Megaphone size={20} className="text-primary" /> Campaign Requests
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">Self-service campaigns submitted by hospitals and doctors</p>
        </div>
        {pendingCount > 0 && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-heading font-bold">
            {pendingCount} Pending Review
          </span>
        )}
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-16 text-center">
          <Megaphone size={32} className="mx-auto text-text-muted mb-3 stroke-[1.5]" />
          <p className="font-heading font-semibold text-dark">No campaign requests yet</p>
          <p className="text-xs text-text-secondary mt-1">Hospitals and doctors submit campaigns via /advertise</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-3 space-y-3">
            {campaigns.map((c) => {
              const st = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.pending;
              const StIcon = st.icon;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all ${
                    selected?.id === c.id ? 'border-primary ring-1 ring-primary/30' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Hospital size={15} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading font-bold text-sm text-dark truncate">{c.campaign_title}</div>
                        <div className="text-[11px] text-text-secondary truncate">{c.advertiser_name} · {PLACEMENT_LABELS[c.placement] ?? c.placement}</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold shrink-0 ${st.color}`}>
                      <StIcon size={10} /> {st.label}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-text-secondary">{new Date(c.created_at).toLocaleDateString('en-IN')}</span>
                    <span className="font-heading font-bold text-primary">{formatINR(c.total_amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sticky top-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-dark">Campaign Details</h3>
                  <button onClick={() => deleteCampaign(selected.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Campaign', value: selected.campaign_title },
                    { label: 'Advertiser', value: `${selected.advertiser_name} (${selected.advertiser_type})` },
                    { label: 'Contact', value: `${selected.contact_name} · ${selected.contact_email}` },
                    { label: 'Phone', value: selected.contact_phone || '—' },
                    { label: 'Placement', value: PLACEMENT_LABELS[selected.placement] ?? selected.placement },
                    { label: 'Duration', value: selected.duration_plan === 'weekly' ? '7 Days' : '30 Days' },
                    { label: 'Period', value: `${selected.start_date} → ${selected.end_date}` },
                    { label: 'Total', value: formatINR(selected.total_amount) },
                    { label: 'Payment', value: selected.payment_method?.toUpperCase() + ' — ' + selected.payment_status },
                    { label: 'Target URL', value: selected.target_url },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-2">
                      <span className="text-text-muted w-20 shrink-0">{label}:</span>
                      <span className="text-dark font-semibold break-all">{value}</span>
                    </div>
                  ))}
                </div>

                {selected.banner_image_url && (
                  <div>
                    <p className="text-[10px] font-heading font-semibold text-text-muted mb-1 uppercase">Banner</p>
                    <img src={selected.banner_image_url} alt="banner" className="w-full rounded-lg border border-border object-cover max-h-24" />
                  </div>
                )}

                {/* Admin actions */}
                <div className="space-y-2">
                  <p className="text-[10px] font-heading font-bold text-text-muted uppercase">Admin Approval &amp; Publishing</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={updating === selected.id}
                      onClick={() => updateStatus(selected.id, 'active', 'paid')}
                      className="py-2.5 px-3 rounded-xl text-xs font-heading font-bold transition-all bg-primary hover:bg-primary-dark text-white shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 col-span-2"
                    >
                      <CheckCircle2 size={14} /> Approve &amp; Publish Live
                    </button>
                    <button
                      type="button"
                      disabled={updating === selected.id}
                      onClick={() => updateStatus(selected.id, 'pending', 'pending')}
                      className="py-2 rounded-xl text-xs font-heading font-bold transition-all bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
                    >
                      Mark Pending
                    </button>
                    <button
                      type="button"
                      disabled={updating === selected.id}
                      onClick={() => updateStatus(selected.id, 'rejected')}
                      className="py-2 rounded-xl text-xs font-heading font-bold transition-all bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={updating === selected.id}
                      onClick={() => updateStatus(selected.id, 'completed')}
                      className="py-2 rounded-xl text-xs font-heading font-bold transition-all bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50 col-span-2"
                    >
                      Mark Completed / Expired
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface rounded-2xl border border-dashed border-border p-10 text-center flex flex-col items-center justify-center h-full min-h-48">
                <Eye size={24} className="text-text-muted mb-2 stroke-[1.5]" />
                <p className="text-sm text-text-secondary font-heading font-semibold">Click a campaign to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
