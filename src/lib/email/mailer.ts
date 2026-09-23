/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { sql } from '@/lib/db';
import {
  getTestEmailTemplate,
  getSponsorshipClientEmailTemplate,
  getSponsorshipAdminAlertTemplate,
  getCampaignClientEmailTemplate,
  getCampaignAdminAlertTemplate,
  getSubscriptionWelcomeTemplate,
  getCampaignStatusUpdateTemplate,
  getSponsoredArticleStatusUpdateTemplate,
  getSubscriptionStatusUpdateTemplate,
} from './templates';

export interface EmailSettings {
  id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user: string;
  smtp_pass: string;
  from_name: string;
  from_email: string;
  admin_notification_email: string;
  notify_on_sponsorship: boolean;
  notify_on_ad_campaign: boolean;
  notify_on_subscription: boolean;
}

const DEFAULT_SETTINGS: EmailSettings = {
  id: 'default',
  smtp_host: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtp_port: Number(process.env.SMTP_PORT) || 465,
  smtp_secure: process.env.SMTP_SECURE === 'false' ? false : true,
  smtp_user: process.env.SMTP_USER || '',
  smtp_pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '',
  from_name: process.env.SMTP_FROM_NAME || 'HealthGhuru Desk',
  from_email: process.env.SMTP_FROM_EMAIL || 'notifications@healthghuru.com',
  admin_notification_email: process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@healthghuru.com',
  notify_on_sponsorship: true,
  notify_on_ad_campaign: true,
  notify_on_subscription: true,
};

/**
 * Fetch active email configuration from PostgreSQL or fallback to process.env
 */
export async function getEmailSettings(): Promise<EmailSettings> {
  try {
    const rows = await sql`
      SELECT *
      FROM email_settings
      WHERE id = 'default'
      LIMIT 1
    `;

    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        id: row.id,
        smtp_host: row.smtp_host || DEFAULT_SETTINGS.smtp_host,
        smtp_port: Number(row.smtp_port) || DEFAULT_SETTINGS.smtp_port,
        smtp_secure: Boolean(row.smtp_secure),
        smtp_user: row.smtp_user || DEFAULT_SETTINGS.smtp_user,
        smtp_pass: row.smtp_pass || DEFAULT_SETTINGS.smtp_pass,
        from_name: row.from_name || DEFAULT_SETTINGS.from_name,
        from_email: row.from_email || DEFAULT_SETTINGS.from_email,
        admin_notification_email: row.admin_notification_email || DEFAULT_SETTINGS.admin_notification_email,
        notify_on_sponsorship: row.notify_on_sponsorship !== false,
        notify_on_ad_campaign: row.notify_on_ad_campaign !== false,
        notify_on_subscription: row.notify_on_subscription !== false,
      };
    }
  } catch (err) {
    console.warn('Could not read email_settings table, using defaults:', err);
  }

  return DEFAULT_SETTINGS;
}

/**
 * Build Nodemailer transporter
 */
export function createTransporter(settings: EmailSettings) {
  return nodemailer.createTransport({
    host: settings.smtp_host,
    port: settings.smtp_port,
    secure: settings.smtp_secure, // true for 465, false for 587
    auth: {
      user: settings.smtp_user,
      pass: settings.smtp_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Send generic email
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  settingsOverride,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  settingsOverride?: EmailSettings;
}) {
  const settings = settingsOverride || (await getEmailSettings());

  if (!settings.smtp_user || !settings.smtp_pass) {
    console.warn('⚠️ SMTP user or password not configured. Email skipped:', subject);
    return { success: false, error: 'SMTP credentials are not configured in settings.' };
  }

  try {
    const transporter = createTransporter(settings);
    const fromAddress = `"${settings.from_name}" <${settings.from_email || settings.smtp_user}>`;

    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo_transparent.png');
    const attachments: any[] = [];
    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: 'healthghuru-logo.png',
        path: logoPath,
        cid: 'healthghuru-logo',
      });
    }

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
      text: text || '',
      attachments,
    });

    console.log(`✉️ [HealthGhuru Mailer] Dispatched to ${to} | Subject: "${subject}" | ID: ${info.messageId}`);

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ [HealthGhuru Mailer] Error sending to ${to}:`, error.message || error);
    return { success: false, error: error.message || 'Failed to dispatch email' };
  }
}

/**
 * Test SMTP connection and dispatch test message
 */
export async function sendTestEmail(targetEmail: string, settingsOverride?: EmailSettings) {
  const settings = settingsOverride || (await getEmailSettings());
  const transporter = createTransporter(settings);

  // 1. Verify connection
  await transporter.verify();

  // 2. Dispatch test message via sendEmail (includes logo attachments and console logging)
  const template = getTestEmailTemplate(targetEmail);
  return await sendEmail({
    to: targetEmail,
    subject: `HealthGhuru SMTP Diagnostic Test [${new Date().toLocaleTimeString('en-IN')}]`,
    html: template.html,
    text: template.text,
    settingsOverride: settings,
  });
}

/**
 * Trigger Sponsorship Emails
 */
export async function sendSponsorshipEmails(requestData: any) {
  try {
    const settings = await getEmailSettings();
    if (!settings.smtp_user || !settings.smtp_pass) return;

    // 1. Send confirmation to client
    if (requestData.email) {
      const clientTmpl = getSponsorshipClientEmailTemplate(requestData);
      await sendEmail({
        to: requestData.email,
        subject: `Sponsorship Request Received: ${requestData.company_name} - HealthGhuru`,
        html: clientTmpl.html,
        text: clientTmpl.text,
        settingsOverride: settings,
      }).catch((e) => console.error('Error sending client sponsorship email:', e));
    }

    // 2. Send notification to admin if enabled
    if (settings.notify_on_sponsorship && settings.admin_notification_email) {
      const adminTmpl = getSponsorshipAdminAlertTemplate(requestData);
      await sendEmail({
        to: settings.admin_notification_email,
        subject: `[New Sponsor Request] ${requestData.company_name} - ${requestData.package_name}`,
        html: adminTmpl.html,
        text: adminTmpl.text,
        settingsOverride: settings,
      }).catch((e) => console.error('Error sending admin sponsorship alert:', e));
    }
  } catch (err) {
    console.error('Error in sendSponsorshipEmails:', err);
  }
}

/**
 * Trigger Ad Campaign Emails
 */
export async function sendCampaignEmails(campaignData: any) {
  try {
    const settings = await getEmailSettings();
    if (!settings.smtp_user || !settings.smtp_pass) return;

    // 1. Send confirmation to advertiser
    if (campaignData.contact_email) {
      const clientTmpl = getCampaignClientEmailTemplate(campaignData);
      await sendEmail({
        to: campaignData.contact_email,
        subject: `Ad Campaign Logged: ${campaignData.campaign_title} - HealthGhuru`,
        html: clientTmpl.html,
        text: clientTmpl.text,
        settingsOverride: settings,
      }).catch((e) => console.error('Error sending advertiser email:', e));
    }

    // 2. Send notification to admin if enabled
    if (settings.notify_on_ad_campaign && settings.admin_notification_email) {
      const adminTmpl = getCampaignAdminAlertTemplate(campaignData);
      await sendEmail({
        to: settings.admin_notification_email,
        subject: `[New Ad Booking] ${campaignData.campaign_title} (${campaignData.advertiser_name})`,
        html: adminTmpl.html,
        text: adminTmpl.text,
        settingsOverride: settings,
      }).catch((e) => console.error('Error sending admin ad alert:', e));
    }
  } catch (err) {
    console.error('Error in sendCampaignEmails:', err);
  }
}

/**
 * Trigger Subscription Welcome Email
 */
export async function sendSubscriptionEmails(subscriptionData: any) {
  try {
    const settings = await getEmailSettings();
    if (!settings.smtp_user || !settings.smtp_pass) return;

    if (subscriptionData.email) {
      const welcomeTmpl = getSubscriptionWelcomeTemplate(subscriptionData);
      await sendEmail({
        to: subscriptionData.email,
        subject: `Welcome to HealthGhuru ${subscriptionData.planName || 'Membership'}!`,
        html: welcomeTmpl.html,
        text: welcomeTmpl.text,
        settingsOverride: settings,
      }).catch((e) => console.error('Error sending subscription welcome email:', e));
    }
  } catch (err) {
    console.error('Error in sendSubscriptionEmails:', err);
  }
}

/**
 * Trigger Ad Campaign Status Update Email (Active/Approved, Rejected, Pending)
 */
export async function sendCampaignStatusUpdateEmail(
  campaign: any,
  newStatus: string,
  adminNotes?: string
) {
  try {
    const recipientEmail = campaign.contact_email;
    if (!recipientEmail || !recipientEmail.includes('@')) return;

    const settings = await getEmailSettings();
    if (!settings.smtp_user || !settings.smtp_pass) return;

    const tmpl = getCampaignStatusUpdateTemplate(campaign, newStatus, adminNotes);
    await sendEmail({
      to: recipientEmail,
      subject: tmpl.subject,
      html: tmpl.html,
      text: tmpl.text,
      settingsOverride: settings,
    }).catch((e) => console.error('Error sending campaign status email:', e));
  } catch (err) {
    console.error('Error in sendCampaignStatusUpdateEmail:', err);
  }
}

/**
 * Trigger Sponsored Article Status Update Email (Published/Approved, Rejected, Review)
 */
export async function sendSponsoredArticleStatusUpdateEmail(
  article: any,
  newStatus: string,
  reviewerNotes?: string,
  recipientEmail?: string
) {
  try {
    const toEmail = recipientEmail || article.contact_email || article.author_email;
    if (!toEmail || !toEmail.includes('@')) return;

    const settings = await getEmailSettings();
    if (!settings.smtp_user || !settings.smtp_pass) return;

    const tmpl = getSponsoredArticleStatusUpdateTemplate(article, newStatus, reviewerNotes);
    await sendEmail({
      to: toEmail,
      subject: tmpl.subject,
      html: tmpl.html,
      text: tmpl.text,
      settingsOverride: settings,
    }).catch((e) => console.error('Error sending sponsored article status email:', e));
  } catch (err) {
    console.error('Error in sendSponsoredArticleStatusUpdateEmail:', err);
  }
}

/**
 * Trigger Subscription Status Update Email (Active, Cancelled, Expired)
 */
export async function sendSubscriptionStatusUpdateEmail(
  subscriptionData: any,
  newStatus: string
) {
  try {
    if (!subscriptionData.email) return;

    const settings = await getEmailSettings();
    if (!settings.smtp_user || !settings.smtp_pass) return;

    const tmpl = getSubscriptionStatusUpdateTemplate(subscriptionData, newStatus);
    await sendEmail({
      to: subscriptionData.email,
      subject: tmpl.subject,
      html: tmpl.html,
      text: tmpl.text,
      settingsOverride: settings,
    }).catch((e) => console.error('Error sending subscription status email:', e));
  } catch (err) {
    console.error('Error in sendSubscriptionStatusUpdateEmail:', err);
  }
}

