import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AdSlotPricingClient } from './AdSlotPricingClient';
import { AdSlotPricing } from '@/lib/types/advertisement';

export const dynamic = 'force-dynamic';

export default async function AdSlotPricingPage() {
  await requireAdmin();

  let pricing: AdSlotPricing[] = [];
  try {
    const rows = await sql`SELECT * FROM ad_slot_pricing ORDER BY created_at ASC`;
    pricing = rows as AdSlotPricing[];
  } catch {
    // Table may not exist yet — user needs to run migration
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <ScrollReveal>
        <SectionHeader
          title="Ad Slot Pricing"
          eyebrow="Advertisements · Rate Card"
          subtitle="Manage the advertising rate card for hospitals and doctors. Set per-day, per-week, and per-month rates for each placement slot."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        {pricing.length === 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <h3 className="font-heading font-bold text-red-700 mb-2">⚠️ Database Tables Missing</h3>
            <p className="text-sm text-red-600">
              Run the migration script first:{' '}
              <code className="bg-red-100 px-2 py-0.5 rounded font-mono text-xs">scripts/migrate-ads-v2.sql</code>
              {' '}in your Neon/Postgres database console.
            </p>
          </div>
        ) : (
          <AdSlotPricingClient initialPricing={pricing} />
        )}
      </ScrollReveal>
    </div>
  );
}
