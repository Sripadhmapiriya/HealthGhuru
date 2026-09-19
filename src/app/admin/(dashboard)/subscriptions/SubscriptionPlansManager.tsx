'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types/subscription-plan';

interface SubscriptionPlansManagerProps {
  initialPlans: SubscriptionPlan[];
}

export function SubscriptionPlansManager({ initialPlans }: SubscriptionPlansManagerProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [currency, setCurrency] = useState('INR');
  const [durationLabel, setDurationLabel] = useState('1 Month');
  const [durationMonths, setDurationMonths] = useState<number | ''>(1);
  const [isRecommended, setIsRecommended] = useState(false);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Populate form for editing
  const startEditing = (plan: SubscriptionPlan) => {
    setEditingPlanId(plan.id);
    setName(plan.name);
    setPrice(plan.price);
    setCurrency(plan.currency || 'INR');
    setDurationLabel(plan.duration_label);
    setDurationMonths(plan.duration_months);
    setIsRecommended(plan.is_recommended);
    setBenefits([...(plan.benefits || [])]);
    setBenefitInput('');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setEditingPlanId(null);
    setName('');
    setPrice('');
    setCurrency('INR');
    setDurationLabel('1 Month');
    setDurationMonths(1);
    setIsRecommended(false);
    setBenefits([]);
    setBenefitInput('');
  };

  // Add a benefit tag
  const handleAddBenefit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = benefitInput.trim();
    if (!trimmed) return;
    if (!benefits.includes(trimmed)) {
      setBenefits([...benefits, trimmed]);
    }
    setBenefitInput('');
  };

  // Remove a benefit tag
  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, idx) => idx !== index));
  };

  // Save (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price === '' || !durationLabel.trim() || durationMonths === '') {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<SubscriptionPlan> = {
        id: editingPlanId || undefined,
        name: name.trim(),
        price: Number(price),
        currency,
        duration_label: durationLabel.trim(),
        duration_months: Number(durationMonths),
        is_recommended: isRecommended,
        benefits,
        display_order: editingPlanId
          ? plans.find((p) => p.id === editingPlanId)?.display_order || 1
          : plans.length + 1,
      };

      const res = await fetch('/api/admin/subscription-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save subscription plan.');
      }

      // Re-fetch all plans
      const fetchRes = await fetch('/api/admin/subscription-plans');
      const fetchData = await fetchRes.json();
      if (fetchData.success && fetchData.plans) {
        setPlans(fetchData.plans);
      }

      showToast(
        'success',
        editingPlanId
          ? 'Subscription plan updated successfully!'
          : 'Subscription plan created successfully!'
      );
      resetForm();
    } catch (err: any) {
      showToast('error', err.message || 'Error saving plan');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete plan
  const handleDelete = async (id: string, planName: string) => {
    if (!confirm(`Are you sure you want to delete the "${planName}" plan?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/subscription-plans/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete plan.');
      }

      setPlans(plans.filter((p) => p.id !== id));
      if (editingPlanId === id) resetForm();
      showToast('success', `Plan "${planName}" deleted.`);
    } catch (err: any) {
      showToast('error', err.message || 'Error deleting plan');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-semibold transition-all ${
            toastMessage.type === 'success'
              ? 'bg-primary text-white shadow-primary/30'
              : 'bg-rose-600 text-white shadow-rose-600/30'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <Award size={22} />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-dark tracking-tight">
              Subscription Plans Manager
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Configure and manage subscription plans, member perks, and pricing dynamically.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Plans Grid + Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ACTIVE PLANS CARDS */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl p-6 border transition-all duration-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md ${
                  plan.is_recommended
                    ? 'border-accent/40 ring-2 ring-accent/15'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                {/* RECOMMENDED BADGE */}
                {plan.is_recommended && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#f06d2f] to-[#ea580c] text-white text-[10px] font-heading font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-xs flex items-center gap-1">
                    <Sparkles size={11} /> RECOMMENDED
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <h3 className="font-heading font-extrabold text-xl text-dark mb-1">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 my-2">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-primary">
                      ₹{plan.price}
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      / {plan.duration_label}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-text-muted">
                    Duration: {plan.duration_months} Month(s)
                  </p>

                  {/* Benefits */}
                  <div className="mt-4 pt-4 border-t border-border/80 space-y-2">
                    <p className="text-xs font-heading font-bold text-dark uppercase tracking-wider">
                      Benefits:
                    </p>
                    {plan.benefits && plan.benefits.length > 0 ? (
                      <ul className="space-y-1.5">
                        {plan.benefits.map((b, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-text-secondary leading-snug"
                          >
                            <Check size={14} className="text-primary shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-text-muted italic">No benefits listed.</p>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(plan)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-alt text-text-secondary hover:text-dark text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === plan.id}
                    onClick={() => handleDelete(plan.id, plan.name)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {deletingId === plan.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {plans.length === 0 && (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-border text-text-muted">
              No subscription plans configured yet. Use the form on the right to add plans.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ADD / EDIT PLAN FORM */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-border shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-heading font-extrabold text-lg text-dark flex items-center gap-2">
              {editingPlanId ? (
                <>
                  <Edit2 size={18} className="text-primary" />
                  <span>Edit Plan</span>
                </>
              ) : (
                <>
                  <Plus size={18} className="text-primary" />
                  <span>Add Plan</span>
                </>
              )}
            </h3>
            {editingPlanId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-text-muted hover:text-dark font-medium cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plan Name */}
            <div>
              <label className="block text-xs font-heading font-bold text-dark uppercase mb-1">
                Plan Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 1 Month, 1 Year, Annual VIP"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Price (INR) */}
            <div>
              <label className="block text-xs font-heading font-bold text-dark uppercase mb-1">
                Price (INR) *
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="e.g. 129, 999"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Duration Label */}
            <div>
              <label className="block text-xs font-heading font-bold text-dark uppercase mb-1">
                Duration Label *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 1 Month, 6 Months, 1 Year, LIFETIME"
                value={durationLabel}
                onChange={(e) => setDurationLabel(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Duration (Months) */}
            <div>
              <label className="block text-xs font-heading font-bold text-dark uppercase mb-1">
                Duration (Months) *
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder="e.g. 1, 6, 12, 999"
                value={durationMonths}
                onChange={(e) =>
                  setDurationMonths(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Mark as Recommended */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecommended}
                  onChange={(e) => setIsRecommended(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-xs font-semibold text-dark">
                  Mark as Recommended Plan
                </span>
              </label>
            </div>

            {/* Subscription Benefits */}
            <div className="pt-2 border-t border-border space-y-2">
              <label className="block text-xs font-heading font-bold text-dark uppercase mb-1">
                Subscription Benefits
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a benefit..."
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                  className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-xs text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => handleAddBenefit()}
                  className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors cursor-pointer shrink-0"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Benefits list tags */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                {benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-dark"
                  >
                    <span className="truncate flex-1">{b}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      className="text-text-muted hover:text-rose-600 p-0.5 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:opacity-95 text-white font-heading font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingPlanId ? 'Update Plan' : 'Create Plan'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
