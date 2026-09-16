import { sql } from '@/lib/db';
import { CreateCampaignForm } from './CreateCampaignForm';
import { AdSlotPricing } from '@/lib/types/advertisement';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Default pricing if DB tables don't exist yet
const DEFAULT_PRICING: Omit<AdSlotPricing, 'id' | 'created_at' | 'updated_at'>[] = [
  { placement: 'hero_banner',     label: 'Hero Health Panel',        description: 'Wide prime banner below featured health stories — highest visibility editorial slot.',    price_per_day: 1000, price_per_week: 6000,  price_per_month: 20000, is_available: true },
  { placement: 'popup',           label: 'Health Spotlight Popup',   description: 'Full-attention popup shown to readers when they open HealthGhuru — weekly plan only.',    price_per_day: 800,  price_per_week: 4800,  price_per_month: 16000, is_available: true },
  { placement: 'top_banner',      label: 'Top Health Banner',        description: 'Leaderboard above the navbar — maximum reach across all page views.',                     price_per_day: 500,  price_per_week: 3000,  price_per_month: 10000, is_available: true },
  { placement: 'floating_footer', label: 'Sticky Health Bar',        description: 'Fixed bar at the bottom of the viewport — visible on every scroll across all devices.',   price_per_day: 400,  price_per_week: 2400,  price_per_month: 8000,  is_available: true },
  { placement: 'sidebar',         label: 'Sidebar Widget',           description: 'Medium rectangle inside the content sidebar — targets engaged deep-readers.',              price_per_day: 300,  price_per_week: 1800,  price_per_month: 6000,  is_available: true },
];

export default async function CreateCampaignPage() {
  let pricing: AdSlotPricing[] = [];
  try {
    const rows = await sql`SELECT * FROM ad_slot_pricing WHERE is_available = true ORDER BY price_per_week DESC`;
    pricing = rows as AdSlotPricing[];
  } catch {
    // fallback to defaults
  }

  if (pricing.length === 0) {
    pricing = DEFAULT_PRICING.map((p, i) => ({
      ...p,
      id: `default-${i}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Back nav */}
      <div className="bg-white border-b border-border px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/advertise"
            className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft size={15} /> Back to My Campaigns
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreateCampaignForm pricingSlots={pricing} />
      </div>
    </div>
  );
}
