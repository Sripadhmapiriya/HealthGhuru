/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { getEmailSettings } from '@/lib/email/mailer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getEmailSettings();
    return NextResponse.json({
      success: true,
      settings: {
        ...settings,
        // Mask password if set
        smtp_pass: settings.smtp_pass ? '••••••••••••' : '',
        has_password: Boolean(settings.smtp_pass),
      },
    });
  } catch (error: any) {
    console.error('Error fetching email settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      smtp_host,
      smtp_port,
      smtp_secure,
      smtp_user,
      smtp_pass,
      from_name,
      from_email,
      admin_notification_email,
      notify_on_sponsorship,
      notify_on_ad_campaign,
      notify_on_subscription,
    } = body;

    // Fetch existing settings to preserve existing password if untouched
    const existing = await getEmailSettings();
    const finalPass =
      smtp_pass && smtp_pass !== '••••••••••••' ? smtp_pass : existing.smtp_pass;

    await sql`
      INSERT INTO email_settings (
        id,
        smtp_host,
        smtp_port,
        smtp_secure,
        smtp_user,
        smtp_pass,
        from_name,
        from_email,
        admin_notification_email,
        notify_on_sponsorship,
        notify_on_ad_campaign,
        notify_on_subscription,
        updated_at
      ) VALUES (
        'default',
        ${smtp_host || 'smtp.gmail.com'},
        ${Number(smtp_port) || 465},
        ${Boolean(smtp_secure)},
        ${smtp_user || ''},
        ${finalPass || ''},
        ${from_name || 'HealthGhuru Desk'},
        ${from_email || 'notifications@healthghuru.com'},
        ${admin_notification_email || 'admin@healthghuru.com'},
        ${Boolean(notify_on_sponsorship)},
        ${Boolean(notify_on_ad_campaign)},
        ${Boolean(notify_on_subscription)},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        smtp_host = EXCLUDED.smtp_host,
        smtp_port = EXCLUDED.smtp_port,
        smtp_secure = EXCLUDED.smtp_secure,
        smtp_user = EXCLUDED.smtp_user,
        smtp_pass = EXCLUDED.smtp_pass,
        from_name = EXCLUDED.from_name,
        from_email = EXCLUDED.from_email,
        admin_notification_email = EXCLUDED.admin_notification_email,
        notify_on_sponsorship = EXCLUDED.notify_on_sponsorship,
        notify_on_ad_campaign = EXCLUDED.notify_on_ad_campaign,
        notify_on_subscription = EXCLUDED.notify_on_subscription,
        updated_at = NOW();
    `;

    revalidatePath('/admin/settings/email');

    return NextResponse.json({
      success: true,
      message: 'Email settings saved successfully.',
    });
  } catch (error: any) {
    console.error('Error saving email settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
