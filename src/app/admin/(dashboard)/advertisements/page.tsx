import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AdsDashboardClient } from './AdsDashboardClient';
import { Advertisement } from '@/lib/types/advertisement';
import Link from 'next/link';
import { ListFilter, PlusCircle, DollarSign, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAdvertisementsPage() {
  await requireAdmin();

  let ads: Advertisement[] = [];
  try {
    const rows = await sql`SELECT * FROM advertisements ORDER BY created_at DESC`;
    ads = rows as Advertisement[];
  } catch {
    // DB columns may not exist yet — run scripts/migrate-ads-v2.sql
  }

  const quickLinks = [
    { href: '/admin/advertisements/all', label: 'All Advertisements', icon: ListFilter, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { href: '/admin/advertisements/add', label: 'Add Advertisement', icon: PlusCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { href: '/admin/advertisements/pricing', label: 'Ad Slot Pricing', icon: DollarSign, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { href: '/admin/advertisements/sponsored', label: 'Sponsored Articles', icon: FileText, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeader
            title="Ad Dashboard"
            eyebrow="Advertisements · HealthGhuru"
            subtitle="Overview of hospital and doctor advertisement campaigns, performance metrics, and revenue."
          />
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin/advertisements/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-heading font-semibold transition-all shadow-md shadow-primary/20"
            >
              <PlusCircle size={15} /> New Ad
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Navigation Cards */}
      <ScrollReveal delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-4 rounded-xl border bg-white hover:shadow-md transition-all group ${link.color}`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${link.color}`}>
                  <Icon size={16} />
                </div>
                <span className="font-heading font-semibold text-sm text-dark group-hover:text-primary transition-colors">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Main Dashboard */}
      <ScrollReveal delay={0.1}>
        <AdsDashboardClient initialAds={ads as Advertisement[]} />
      </ScrollReveal>
    </div>
  );
}
