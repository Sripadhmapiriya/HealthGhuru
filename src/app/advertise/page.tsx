import { sql } from '@/lib/db';
import { CampaignManagerPage } from './CampaignManagerPage';
import { AdSlotPricing } from '@/lib/types/advertisement';

export const dynamic = 'force-dynamic';

export default async function AdvertisePage() {
  // Fetch pricing from DB (fallback to defaults if table missing)
  let pricing: AdSlotPricing[] = [];
  try {
    const rows = await sql`SELECT * FROM ad_slot_pricing WHERE is_available = true ORDER BY price_per_week DESC`;
    pricing = rows as AdSlotPricing[];
  } catch {
    // Use defaults if table not yet created
  }

  return <CampaignManagerPage pricingSlots={pricing} />;
}
