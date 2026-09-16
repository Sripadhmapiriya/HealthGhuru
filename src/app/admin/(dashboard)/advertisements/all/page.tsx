import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AdvertisementsClient } from '../AdvertisementsClient';
import { Advertisement } from '@/lib/types/advertisement';

export const dynamic = 'force-dynamic';

export default async function AllAdvertisementsPage() {
  await requireAdmin();

  let ads: Advertisement[] = [];
  try {
    const rows = await sql`SELECT * FROM advertisements ORDER BY created_at DESC`;
    ads = rows as Advertisement[];
  } catch {
    // DB columns may not exist yet — run scripts/migrate-ads-v2.sql
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <ScrollReveal>
        <SectionHeader
          title="All Advertisements"
          eyebrow="Advertisements · Manage"
          subtitle="Browse, search, filter and manage all hospital and doctor advertisement campaigns."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <AdvertisementsClient initialAds={ads as Advertisement[]} />
      </ScrollReveal>
    </div>
  );
}
