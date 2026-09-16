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
    // Auto-sync any campaign_requests that might not be in advertisements
    try {
      const requests = await sql`
        SELECT * FROM campaign_requests cr
        WHERE NOT EXISTS (
          SELECT 1 FROM advertisements a WHERE a.title = cr.campaign_title
        )
      `;

      for (const req of requests) {
        const contactSummary = `${req.contact_name} (${req.contact_email}${req.contact_phone ? ' / ' + req.contact_phone : ''})`;
        const isActive = req.status === 'active' || req.status === 'approved';
        await sql`
          INSERT INTO advertisements (
            title, placement, image_url, target_url,
            headline, cta_text, category, is_active,
            advertiser_name, advertiser_contact, advertiser_type,
            budget, start_date, end_date, status, payment_status, payment_method, priority
          ) VALUES (
            ${req.campaign_title},
            ${req.placement},
            ${req.banner_image_url || null},
            ${req.target_url},
            ${req.campaign_title},
            'Book Appointment',
            'All',
            ${isActive},
            ${req.advertiser_name},
            ${contactSummary},
            ${req.advertiser_type || 'hospital'},
            ${req.total_amount || 0},
            ${req.start_date},
            ${req.end_date},
            ${req.status || 'pending'},
            ${req.payment_status || 'pending'},
            ${req.payment_method || 'upi'},
            'Medium'
          )
        `;
      }
    } catch (syncError) {
      console.error('Non-blocking sync error:', syncError);
    }

    const rows = await sql`SELECT * FROM advertisements ORDER BY created_at DESC`;
    ads = rows as Advertisement[];
  } catch {
    // Fallback if table error
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
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
