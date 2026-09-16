import { requireAdmin } from '@/lib/auth/session';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AddAdvertisementForm } from './AddAdvertisementForm';

export const dynamic = 'force-dynamic';

export default async function AddAdvertisementPage() {
  await requireAdmin();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <ScrollReveal>
        <SectionHeader
          title="Add Advertisement"
          eyebrow="Advertisements · Create"
          subtitle="Create a new hospital or doctor advertisement campaign. Fill in the advertiser details, choose a placement slot, and upload the banner creative."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <AddAdvertisementForm />
      </ScrollReveal>
    </div>
  );
}
