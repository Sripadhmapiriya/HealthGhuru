import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { EmailSettingsClient } from './EmailSettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminEmailSettingsPage() {
  await requireAdmin();

  let settings = {
    smtp_host: 'smtp.gmail.com',
    smtp_port: 465,
    smtp_secure: true,
    smtp_user: '',
    smtp_pass: '',
    from_name: 'HealthGhuru Desk',
    from_email: 'notifications@healthghuru.com',
    admin_notification_email: 'admin@healthghuru.com',
    notify_on_sponsorship: true,
    notify_on_ad_campaign: true,
    notify_on_subscription: true,
  };

  try {
    const rows = await sql`
      SELECT *
      FROM email_settings
      WHERE id = 'default'
      LIMIT 1
    `;

    if (rows.length > 0) {
      const r = rows[0];
      settings = {
        smtp_host: r.smtp_host || 'smtp.gmail.com',
        smtp_port: Number(r.smtp_port) || 465,
        smtp_secure: Boolean(r.smtp_secure),
        smtp_user: r.smtp_user || '',
        smtp_pass: r.smtp_pass ? '••••••••••••' : '',
        from_name: r.from_name || 'HealthGhuru Desk',
        from_email: r.from_email || 'notifications@healthghuru.com',
        admin_notification_email: r.admin_notification_email || 'admin@healthghuru.com',
        notify_on_sponsorship: r.notify_on_sponsorship !== false,
        notify_on_ad_campaign: r.notify_on_ad_campaign !== false,
        notify_on_subscription: r.notify_on_subscription !== false,
      };
    }
  } catch (err) {
    console.error('Error loading email settings page:', err);
  }

  return <EmailSettingsClient initialSettings={settings} />;
}
