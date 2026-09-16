import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { AdminCampaignsClient } from './AdminCampaignsClient';

export const dynamic = 'force-dynamic';

export default async function AdminCampaignsPage() {
  await requireAdmin();

  let campaigns: Record<string, unknown>[] = [];
  try {
    const rows = await sql`SELECT * FROM campaign_requests ORDER BY created_at DESC`;
    campaigns = rows as Record<string, unknown>[];
  } catch {
    // table may not exist yet
  }

  return <AdminCampaignsClient initialCampaigns={campaigns} />;
}
