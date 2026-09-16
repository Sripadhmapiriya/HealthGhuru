import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SettingsForm } from './SettingsForm';

export default async function AdminSettingsPage() {
  const session = await requireAdmin();

  const users = await sql`SELECT name, email FROM users WHERE id = ${session.user.id}::uuid`;
  const user = users[0];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <ScrollReveal>
        <SectionHeader 
          title="Account Settings" 
          eyebrow="Admin Console"
          subtitle="Manage your admin account credentials."
        />
      </ScrollReveal>
      
      <ScrollReveal delay={0.2} className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(46,125,50,0.08)] border border-border p-6">
        <SettingsForm user={user} />
      </ScrollReveal>
    </div>
  );
}
