/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getEmailSettings, sendTestEmail, EmailSettings } from '@/lib/email/mailer';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      target_email,
      smtp_host,
      smtp_port,
      smtp_secure,
      smtp_user,
      smtp_pass,
      from_name,
      from_email,
    } = body;

    // Fetch existing settings
    const existing = await getEmailSettings();

    // Allow testing currently entered credentials before saving
    const testSettings: EmailSettings = {
      ...existing,
      smtp_host: smtp_host || existing.smtp_host,
      smtp_port: smtp_port ? Number(smtp_port) : existing.smtp_port,
      smtp_secure: typeof smtp_secure === 'boolean' ? smtp_secure : existing.smtp_secure,
      smtp_user: smtp_user !== undefined ? smtp_user : existing.smtp_user,
      smtp_pass:
        smtp_pass && smtp_pass !== '••••••••••••' ? smtp_pass : existing.smtp_pass,
      from_name: from_name || existing.from_name,
      from_email: from_email || existing.from_email,
    };

    const recipient = target_email || testSettings.admin_notification_email || testSettings.smtp_user;

    if (!testSettings.smtp_user || !testSettings.smtp_pass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter both an SMTP Username (email) and Password before sending a test.',
        },
        { status: 400 }
      );
    }

    if (!recipient) {
      return NextResponse.json(
        { success: false, error: 'Please specify a recipient email address.' },
        { status: 400 }
      );
    }

    const result = await sendTestEmail(recipient, testSettings);

    return NextResponse.json({
      success: true,
      message: `Test email dispatched successfully to ${recipient}!`,
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('SMTP Diagnostic Error:', error);
    let errorHelp = error.message || 'Failed to connect to SMTP server';

    if (error.code === 'EAUTH') {
      errorHelp =
        'Authentication failed (Invalid username or password). If using Gmail, make sure you are using a 16-character Google App Password (not your personal login password).';
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
      errorHelp =
        'Could not establish connection to the SMTP server. Check the SMTP Host and Port (Port 465 requires SSL, Port 587 requires TLS/STARTTLS).';
    }

    return NextResponse.json({ success: false, error: errorHelp, code: error.code }, { status: 500 });
  }
}
