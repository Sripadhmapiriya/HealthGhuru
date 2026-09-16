'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Edit2, Check, X, DollarSign, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { AdSlotPricing } from '@/lib/types/advertisement';

const PLACEMENT_COLORS: Record<string, string> = {
  top_banner: 'bg-blue-50 text-blue-700 border-blue-200',
  hero_banner: 'bg-purple-50 text-purple-700 border-purple-200',
  sidebar: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  floating_footer: 'bg-amber-50 text-amber-700 border-amber-200',
  popup: 'bg-rose-50 text-rose-700 border-rose-200',
};

interface EditState {
  label: string;
  description: string;
  price_per_day: string;
  price_per_week: string;
  price_per_month: string;
}

export function AdSlotPricingClient({ initialPricing }: { initialPricing: AdSlotPricing[] }) {
  const [pricing, setPricing] = useState<AdSlotPricing[]>(initialPricing);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = (slot: AdSlotPricing) => {
    setEditingId(slot.id);
    setEditValues({
      label: slot.label,
      description: slot.description || '',
      price_per_day: slot.price_per_day.toString(),
      price_per_week: slot.price_per_week.toString(),
      price_per_month: slot.price_per_month.toString(),
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues(null);
    setError(null);
  };

  const saveEdit = async (slot: AdSlotPricing) => {
    if (!editValues) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/ad-slot-pricing/${slot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: editValues.label,
          description: editValues.description || null,
          price_per_day: parseFloat(editValues.price_per_day) || 0,
          price_per_week: parseFloat(editValues.price_per_week) || 0,
          price_per_month: parseFloat(editValues.price_per_month) || 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPricing((prev) => prev.map((p) => (p.id === slot.id ? json.pricing : p)));
        setEditingId(null);
        setEditValues(null);
      } else {
        setError(json.error || 'Failed to save');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (slot: AdSlotPricing) => {
    const next = !slot.is_available;
    setPricing((prev) => prev.map((p) => (p.id === slot.id ? { ...p, is_available: next } : p)));
    try {
      const res = await fetch(`/api/admin/ad-slot-pricing/${slot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: next }),
      });
      const json = await res.json();
      if (!json.success) {
        setPricing((prev) => prev.map((p) => (p.id === slot.id ? { ...p, is_available: slot.is_available } : p)));
      }
    } catch {
      setPricing((prev) => prev.map((p) => (p.id === slot.id ? { ...p, is_available: slot.is_available } : p)));
    }
  };

  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-surface/30">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-primary" />
            <h2 className="font-heading font-bold text-lg text-dark">Ad Slot Rate Card</h2>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Set the advertising rates for each placement slot. Hospital and doctor advertisers see these rates when contacting you.
          </p>
        </div>

        <div className="divide-y divide-border">
          {pricing.map((slot) => {
            const isEditing = editingId === slot.id;
            const colorClass = PLACEMENT_COLORS[slot.placement] || 'bg-gray-50 text-gray-700';

            return (
              <div key={slot.id} className={`p-6 transition-colors ${isEditing ? 'bg-primary/2' : 'hover:bg-surface/20'}`}>
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Slot Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-heading font-semibold border ${colorClass}`}>
                        {slot.placement.replace('_', ' ').toUpperCase()}
                      </span>
                      <button
                        onClick={() => toggleAvailability(slot)}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                          slot.is_available ? 'text-emerald-600' : 'text-gray-400'
                        }`}
                      >
                        {slot.is_available ? (
                          <><ToggleRight size={16} className="text-emerald-500" /> Available</>
                        ) : (
                          <><ToggleLeft size={16} className="text-gray-400" /> Unavailable</>
                        )}
                      </button>
                    </div>

                    {isEditing && editValues ? (
                      <div className="space-y-2 mt-2">
                        <input
                          type="text"
                          value={editValues.label}
                          onChange={(e) => setEditValues({ ...editValues, label: e.target.value })}
                          placeholder="Slot label"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                        />
                        <textarea
                          rows={2}
                          value={editValues.description}
                          onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                          placeholder="Description of this ad slot..."
                          className="w-full px-3 py-2 text-xs rounded-lg border border-border focus:border-primary outline-none"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="font-heading font-bold text-base text-dark">{slot.label}</h3>
                        {slot.description && (
                          <p className="text-xs text-text-secondary mt-1">{slot.description}</p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Pricing Grid */}
                  <div className="grid grid-cols-3 gap-3 shrink-0">
                    {[
                      { key: 'price_per_day' as const, label: 'Per Day' },
                      { key: 'price_per_week' as const, label: 'Per Week' },
                      { key: 'price_per_month' as const, label: 'Per Month' },
                    ].map(({ key, label }) => (
                      <div key={key} className="text-center">
                        <div className="text-[10px] font-heading font-semibold text-text-secondary uppercase mb-1">{label}</div>
                        {isEditing && editValues ? (
                          <div className="relative">
                            <span className="absolute left-2 top-2 text-xs text-text-secondary">₹</span>
                            <input
                              type="number" min="0" step="50"
                              value={editValues[key]}
                              onChange={(e) => setEditValues({ ...editValues, [key]: e.target.value })}
                              className="w-28 pl-5 pr-2 py-1.5 text-sm rounded-lg border border-border focus:border-primary outline-none text-center"
                            />
                          </div>
                        ) : (
                          <div className="font-heading font-bold text-lg text-dark">
                            {formatINR(slot[key] as number)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(slot)}
                          disabled={saving}
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors disabled:opacity-50"
                          title="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(slot)}
                        className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors"
                        title="Edit pricing"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {pricing.length === 0 && (
            <div className="p-12 text-center">
              <DollarSign size={32} className="mx-auto text-text-muted mb-3 stroke-[1.5]" />
              <p className="text-sm text-text-secondary">No pricing slots found. Run the database migration to seed default slots.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rate Card Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="font-heading font-bold text-sm text-amber-800 mb-2">📋 Rate Card Tips for Hospitals & Doctors</h3>
        <ul className="text-xs text-amber-700 space-y-1.5 list-disc list-inside">
          <li>Monthly packages offer the best value for sustained brand visibility across HealthGhuru.</li>
          <li>Hero Banner and Top Banner slots deliver the highest impressions due to prominent positioning.</li>
          <li>Popup Modals are ideal for limited-time health campaigns like free checkup drives or specialty launches.</li>
          <li>Sidebar Banners work best for specialty departments targeting long-read health article audiences.</li>
          <li>Contact hospitals directly after they express interest through the <strong>Add Advertisement</strong> form.</li>
        </ul>
      </div>
    </div>
  );
}
