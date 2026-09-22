/* eslint-disable @typescript-eslint/no-explicit-any */

function emailWrapper(content: string, previewText: string = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HealthGhuru</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 36px 12px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04);
    }
    .header {
      background: linear-gradient(135deg, #064E3B 0%, #047857 52%, #0D9488 100%);
      padding: 36px 24px 30px 24px;
      text-align: center;
      position: relative;
    }
    .header-stripe {
      height: 4px;
      background: linear-gradient(90deg, #F97316 0%, #FBBF24 35%, #10B981 70%, #059669 100%);
      width: 100%;
    }
    .logo-container {
      text-align: center;
      margin: 0 auto;
    }
    .logo-badge {
      display: inline-block;
      width: 68px;
      height: 68px;
      border-radius: 18px;
      background-color: #ffffff;
      padding: 6px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22), 0 0 0 3px rgba(255, 255, 255, 0.35);
      margin: 0 auto 14px auto;
      box-sizing: border-box;
    }
    .logo-badge img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      border: 0;
    }
    .logo-text {
      color: #ffffff;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.5px;
      line-height: 1.15;
      margin: 0;
      text-align: center;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
    .logo-sub-badge {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #E6F7ED;
      font-size: 11px;
      letter-spacing: 1.6px;
      text-transform: uppercase;
      font-weight: 700;
      padding: 5px 16px;
      border-radius: 9999px;
      margin-top: 10px;
    }
    .body {
      padding: 36px 32px 30px 32px;
    }
    .badge {
      display: inline-block;
      padding: 5px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      line-height: 1.2;
    }
    .badge-success {
      background-color: #DCFCE7;
      color: #15803D;
      border: 1px solid #BBF7D0;
    }
    .badge-orange {
      background-color: #FFEDD5;
      color: #C2410C;
      border: 1px solid #FED7AA;
    }
    .badge-blue {
      background-color: #E0F2FE;
      color: #0369A1;
      border: 1px solid #BAE6FD;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: #0F172A;
      margin: 18px 0 12px 0;
      line-height: 1.3;
      letter-spacing: -0.4px;
    }
    .text {
      font-size: 15px;
      line-height: 1.65;
      color: #334155;
      margin: 0 0 20px 0;
    }
    .info-card {
      background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 22px;
      margin: 24px 0;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #E2E8F0;
      font-size: 14px;
    }
    .info-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .info-row:first-child {
      padding-top: 0;
    }
    .info-label {
      color: #64748B;
      font-weight: 600;
      font-size: 13px;
    }
    .info-value {
      color: #0F172A;
      font-weight: 700;
      text-align: right;
    }
    .total-box {
      background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
      border: 1px solid #86EFAC;
      border-radius: 14px;
      padding: 18px 24px;
      margin: 24px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.08);
    }
    .total-title {
      font-weight: 800;
      font-size: 15px;
      color: #065F46;
      letter-spacing: -0.2px;
    }
    .total-amount {
      font-weight: 900;
      font-size: 24px;
      color: #064E3B;
      letter-spacing: -0.5px;
    }
    .btn {
      display: inline-block;
      padding: 13px 32px;
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: #ffffff !important;
      font-weight: 700;
      font-size: 14px;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
      letter-spacing: 0.2px;
    }
    .btn-orange {
      background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%);
      box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35);
    }
    .footer {
      background-color: #F8FAFC;
      padding: 28px 24px;
      text-align: center;
      border-top: 1px solid #E2E8F0;
      font-size: 12px;
      color: #64748B;
      line-height: 1.6;
    }
    .footer a {
      color: #059669;
      text-decoration: none;
      font-weight: 700;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .footer-divider {
      height: 1px;
      background-color: #E2E8F0;
      margin: 16px auto;
      max-width: 240px;
    }
  </style>
</head>
<body>
  <span style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;color:#f8fafc;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${previewText}
  </span>
  <div class="wrapper">
    <div class="container">
      <!-- Top Accent Stripe -->
      <div class="header-stripe"></div>

      <!-- Centered Header -->
      <div class="header">
        <div class="logo-container">
          <!-- Centered Logo Badge -->
          <div class="logo-badge">
            <img src="cid:healthghuru-logo" alt="HealthGhuru Logo" width="56" height="56" />
          </div>

          <!-- Centered Brand Title -->
          <div class="logo-text">
            HEALTH<span style="color: #F97316;">GHURU</span>
          </div>

          <!-- Centered Tagline Pill -->
          <div>
            <span class="logo-sub-badge">
              Live Better &bull; Feel Stronger &bull; Every Day
            </span>
          </div>
        </div>
      </div>

      <!-- Main Body Content -->
      <div class="body">
        ${content}
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #334155;">HealthGhuru Media &amp; Health Publishing Network</p>
        <p style="margin: 0 0 6px 0;">Need assistance or support? Reach our desk at <a href="mailto:support@healthghuru.com">support@healthghuru.com</a></p>
        <div class="footer-divider"></div>
        <p style="margin: 0 0 4px 0; font-size: 11px; color: #94A3B8;">
          This is an official transactional message dispatched from HealthGhuru.
        </p>
        <p style="margin: 0; font-size: 11px; color: #94A3B8;">
          &copy; ${new Date().getFullYear()} HealthGhuru. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ── 1. Diagnostic Test Email Template ───────────────────────────────────────
export function getTestEmailTemplate(adminEmail: string): { html: string; text: string } {
  const content = `
    <div style="text-align: center; margin-bottom: 8px;">
      <span class="badge badge-success">&#x2714; Diagnostics Passed</span>
    </div>
    <h1 class="title" style="text-align: center;">SMTP Gateway Connection Verified!</h1>
    <p class="text" style="text-align: center; color: #475569; max-width: 480px; margin: 0 auto 24px auto;">
      Hello Admin, your <strong>HealthGhuru SMTP Mailer</strong> is connected and operating seamlessly. Automated transactional notifications for commercial bookings, sponsors, and member subscriptions are fully active.
    </p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Recipient Mailbox</span>
        <span class="info-value" style="color: #0F172A; font-family: monospace;">${adminEmail}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Server Timestamp</span>
        <span class="info-value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
      </div>
      <div class="info-row">
        <span class="info-label">SMTP Gateway</span>
        <span class="info-value" style="color: #059669;">Nodemailer &bull; HealthGhuru Hostinger Engine</span>
      </div>
      <div class="info-row">
        <span class="info-label">Delivery Status</span>
        <span class="info-value" style="color: #059669; font-weight: 800;">● Active &amp; Verified</span>
      </div>
    </div>

    <div style="text-align: center; margin-top: 26px;">
      <a href="http://localhost:3000/admin/settings/email" class="btn">
        Open Email &amp; SMTP Settings &rarr;
      </a>
    </div>
  `;
  return {
    html: emailWrapper(content, 'HealthGhuru SMTP gateway is connected and operational.'),
    text: `HealthGhuru SMTP Connection Test\n\nYour SMTP gateway is working properly.\nRecipient: ${adminEmail}\nTimestamp: ${new Date().toISOString()}`,
  };
}

// ── 2. Sponsorship Client Confirmation Email ─────────────────────────────────
export function getSponsorshipClientEmailTemplate(data: any): { html: string; text: string } {
  const formatINR = (val: number) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  const content = `
    <span class="badge badge-orange">Sponsorship Request Received</span>
    <h1 class="title">Thank you, ${data.contact_person || 'Partner'}!</h1>
    <p class="text">
      We have received your sponsorship booking request for <strong>${data.company_name}</strong>. Our editorial desk has queued your draft article and media assets for verification and publication scheduling.
    </p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Company / Organization:</span>
        <span class="info-value">${data.company_name}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Selected Package:</span>
        <span class="info-value">${data.package_name || 'Standard Package'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Placement Target:</span>
        <span class="info-value">${data.placement || 'Homepage Sponsored Section'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Payment Method:</span>
        <span class="info-value">${data.payment_method === 'razorpay' ? 'Razorpay Online' : 'UPI QR Transfer'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Transaction / UTR No.:</span>
        <span class="info-value" style="font-family: monospace;">${data.utr_reference || 'N/A'}</span>
      </div>
    </div>

    <div class="total-box">
      <div class="total-title">Total Amount Paid</div>
      <div class="total-amount">${formatINR(data.total_amount)}</div>
    </div>

    <p class="text">
      <strong>Next Steps:</strong> A dedicated HealthGhuru commercial editor will inspect your media assets and contact you at <strong>${data.email}</strong> within 12–24 business hours with live preview links.
    </p>
  `;

  return {
    html: emailWrapper(content, `Sponsorship received for ${data.company_name} - HealthGhuru`),
    text: `HealthGhuru Sponsorship Received\n\nThank you ${data.contact_person}!\nCompany: ${data.company_name}\nPackage: ${data.package_name}\nTotal: ${formatINR(data.total_amount)}\nUTR: ${data.utr_reference}`,
  };
}

// ── 3. Sponsorship Admin Notification Alert ─────────────────────────────────
export function getSponsorshipAdminAlertTemplate(data: any): { html: string; text: string } {
  const formatINR = (val: number) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  const content = `
    <span class="badge badge-orange">🚨 New Commercial Sponsor Booking</span>
    <h1 class="title">New Sponsor Inquiry: ${data.company_name}</h1>
    <p class="text">
      A client has submitted a sponsorship request on HealthGhuru with payment reference. Review the submission below.
    </p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Company Name:</span>
        <span class="info-value">${data.company_name}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Contact Person:</span>
        <span class="info-value">${data.contact_person}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${data.email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Phone:</span>
        <span class="info-value">${data.phone}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Selected Package:</span>
        <span class="info-value">${data.package_name}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Placement:</span>
        <span class="info-value">${data.placement}</span>
      </div>
      <div class="info-row">
        <span class="info-label">UTR / Payment ID:</span>
        <span class="info-value" style="font-family: monospace; color: #b45309;">${data.utr_reference || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Total Amount:</span>
        <span class="info-value" style="color: #16A34A;">${formatINR(data.total_amount)}</span>
      </div>
    </div>

    <div style="text-align: center; margin-top: 20px;">
      <a href="http://localhost:3000/admin/sponsored-articles" class="btn">Review in Admin CMS &rarr;</a>
    </div>
  `;

  return {
    html: emailWrapper(content, `[Action Required] New Sponsor Request: ${data.company_name}`),
    text: `New Sponsor Booking:\nCompany: ${data.company_name}\nContact: ${data.contact_person} (${data.email}, ${data.phone})\nPackage: ${data.package_name}\nAmount: ${formatINR(data.total_amount)}\nUTR: ${data.utr_reference}`,
  };
}

// ── 4. Ad Campaign Advertiser Confirmation Email ─────────────────────────────
export function getCampaignClientEmailTemplate(data: any): { html: string; text: string } {
  const formatINR = (val: number) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  const content = `
    <span class="badge badge-blue">Ad Campaign Submitted</span>
    <h1 class="title">Campaign Logged: ${data.campaign_title}</h1>
    <p class="text">
      Hello ${data.contact_name || 'Partner'},<br><br>
      Your advertisement campaign request for <strong>${data.advertiser_name}</strong> has been received by HealthGhuru Advertising Operations.
    </p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Campaign Title:</span>
        <span class="info-value">${data.campaign_title}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Placement Slot:</span>
        <span class="info-value">${data.placement}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Plan Duration:</span>
        <span class="info-value">${data.duration_plan === 'weekly' ? '7 Days (Weekly)' : '30 Days (Monthly)'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Start Date:</span>
        <span class="info-value">${data.start_date || 'Immediate'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Target URL:</span>
        <span class="info-value"><a href="${data.target_url}" target="_blank" style="color: #16A34A;">${data.target_url}</a></span>
      </div>
    </div>

    <div class="total-box">
      <div class="total-title">Total Campaign Fee</div>
      <div class="total-amount">${formatINR(data.total_amount)}</div>
    </div>

    <p class="text">
      Our ad compliance team verifies creative resolution and compliance before launching. We will notify you once your ad begins serving impressions!
    </p>
  `;

  return {
    html: emailWrapper(content, `Ad campaign received for ${data.campaign_title} - HealthGhuru`),
    text: `HealthGhuru Ad Campaign Logged\n\nCampaign: ${data.campaign_title}\nAdvertiser: ${data.advertiser_name}\nTotal: ${formatINR(data.total_amount)}`,
  };
}

// ── 5. Ad Campaign Admin Alert ──────────────────────────────────────────────
export function getCampaignAdminAlertTemplate(data: any): { html: string; text: string } {
  const formatINR = (val: number) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  const content = `
    <span class="badge badge-blue">📢 New Advertisement Campaign</span>
    <h1 class="title">New Ad: ${data.campaign_title}</h1>
    <p class="text">
      A new ad campaign booking has been placed on HealthGhuru.
    </p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Advertiser:</span>
        <span class="info-value">${data.advertiser_name} (${data.advertiser_type || 'hospital'})</span>
      </div>
      <div class="info-row">
        <span class="info-label">Contact:</span>
        <span class="info-value">${data.contact_name} &bull; ${data.contact_email} &bull; ${data.contact_phone || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Placement Slot:</span>
        <span class="info-value">${data.placement}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Duration:</span>
        <span class="info-value">${data.duration_plan}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Total Fee:</span>
        <span class="info-value" style="color: #16A34A;">${formatINR(data.total_amount)}</span>
      </div>
    </div>

    <div style="text-align: center; margin-top: 20px;">
      <a href="http://localhost:3000/admin/advertisements" class="btn">View in Ad Manager &rarr;</a>
    </div>
  `;

  return {
    html: emailWrapper(content, `[Action Required] New Ad Campaign: ${data.campaign_title}`),
    text: `New Ad Campaign:\nTitle: ${data.campaign_title}\nAdvertiser: ${data.advertiser_name}\nTotal: ${formatINR(data.total_amount)}`,
  };
}

// ── 6. Member Subscription Welcome Email ─────────────────────────────────────
export function getSubscriptionWelcomeTemplate(data: any): { html: string; text: string } {
  const content = `
    <span class="badge badge-success">Membership Activated</span>
    <h1 class="title">Welcome to HealthGhuru, ${data.name || 'Member'}!</h1>
    <p class="text">
      Your <strong>${data.planName || data.planId?.toUpperCase() || 'Premium'}</strong> membership is active. You now enjoy an ad-free reading experience, verified clinical reports, digital magazine access, and premium wellness tools.
    </p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Member Name:</span>
        <span class="info-value">${data.name || 'Valued Member'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Account Email:</span>
        <span class="info-value">${data.email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Membership Tier:</span>
        <span class="info-value">${data.planName || data.planId || 'Premium'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Billing Cycle:</span>
        <span class="info-value">${data.billingCycle || 'Annual'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value" style="color: #16A34A;">Active / Ad-Free</span>
      </div>
    </div>

    <div style="text-align: center; margin-top: 20px;">
      <a href="http://localhost:3000/dashboard" class="btn">Access Member Dashboard &rarr;</a>
    </div>
  `;

  return {
    html: emailWrapper(content, `Welcome to HealthGhuru Premium - Membership Active`),
    text: `Welcome to HealthGhuru!\n\nYour ${data.planName || 'Premium'} membership is now active for ${data.email}.`,
  };
}

// ── 7. Ad Campaign Status Update Email (Publish / Reject / Pending) ────────────
export function getCampaignStatusUpdateTemplate(
  campaign: any,
  newStatus: string,
  adminNotes?: string
): { html: string; text: string; subject: string } {
  const normalized = (newStatus || '').toLowerCase();
  const isApproved = normalized === 'active' || normalized === 'approved' || normalized === 'published';
  const isRejected = normalized === 'rejected';

  let badgeHtml = '<span class="badge badge-blue">Status Update</span>';
  let title = 'HealthGhuru Campaign Status Update';
  let subject = `Update on your HealthGhuru Ad Campaign: ${campaign.campaign_title || 'Campaign'}`;
  let message = `The status of your campaign has been updated to <strong>${newStatus}</strong>.`;

  if (isApproved) {
    badgeHtml = '<span class="badge badge-success">Campaign Live & Published</span>';
    title = 'Your Ad Campaign is Live!';
    subject = `Your Ad Campaign "${campaign.campaign_title}" is Live on HealthGhuru!`;
    message = `Great news! Your advertisement campaign has been reviewed, approved, and is now active across HealthGhuru. Readers and healthcare professionals can now view and engage with your campaign.`;
  } else if (isRejected) {
    badgeHtml = '<span class="badge badge-orange">Campaign Rejected</span>';
    title = 'Update on Your Ad Campaign';
    subject = `Important Update: HealthGhuru Campaign "${campaign.campaign_title}"`;
    message = `Our editorial and compliance desk reviewed your campaign submission. Unfortunately, we are unable to publish your ad campaign in its current form.`;
  } else {
    badgeHtml = '<span class="badge badge-blue">In Review</span>';
    title = 'Campaign Under Review';
    subject = `HealthGhuru Campaign In Review: "${campaign.campaign_title}"`;
    message = `Your ad campaign submission is currently being reviewed by our healthcare editorial team.`;
  }

  const content = `
    ${badgeHtml}
    <h1 class="title">${title}</h1>
    <p class="text">${message}</p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Campaign Title:</span>
        <span class="info-value"><strong>${campaign.campaign_title || 'Ad Campaign'}</strong></span>
      </div>
      <div class="info-row">
        <span class="info-label">Current Status:</span>
        <span class="info-value" style="font-weight: 700; color: ${isApproved ? '#16A34A' : isRejected ? '#DC2626' : '#2563EB'};">
          ${(newStatus || 'Updated').toUpperCase()}
        </span>
      </div>
      ${campaign.placement ? `
      <div class="info-row">
        <span class="info-label">Placement Slot:</span>
        <span class="info-value">${campaign.placement}</span>
      </div>` : ''}
      ${campaign.start_date ? `
      <div class="info-row">
        <span class="info-label">Schedule:</span>
        <span class="info-value">${new Date(campaign.start_date).toLocaleDateString()} &mdash; ${campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'}</span>
      </div>` : ''}
    </div>

    ${adminNotes ? `
    <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <div style="font-size: 13px; font-weight: 700; color: #991B1B; margin-bottom: 4px;">Reviewer Notes / Feedback:</div>
      <div style="font-size: 14px; color: #7F1D1D; line-height: 1.5;">${adminNotes}</div>
    </div>` : ''}

    ${isRejected ? `
    <p class="text" style="font-size: 13px; color: #64748B;">
      If payment was completed, the eligible amount has been credited to your HealthGhuru wallet balance or queued for refund. Please contact our commercial desk if you would like assistance revising your creative.
    </p>` : ''}

    <div style="text-align: center; margin-top: 24px;">
      <a href="http://localhost:3000/advertise" class="btn">Visit Advertising Portal &rarr;</a>
    </div>
  `;

  return {
    html: emailWrapper(content, subject),
    text: `${title}\n\nCampaign: ${campaign.campaign_title}\nStatus: ${newStatus}\n${adminNotes ? 'Notes: ' + adminNotes : ''}`,
    subject,
  };
}

// ── 8. Sponsored Article Status Update Email (Publish / Reject / Pending) ─────
export function getSponsoredArticleStatusUpdateTemplate(
  article: any,
  newStatus: string,
  reviewerNotes?: string,
  liveUrl?: string
): { html: string; text: string; subject: string } {
  const normalized = (newStatus || '').toLowerCase();
  const isApproved = normalized === 'published' || normalized === 'approved';
  const isRejected = normalized === 'rejected';

  let badgeHtml = '<span class="badge badge-blue">Article Update</span>';
  let title = 'HealthGhuru Sponsored Article Update';
  let subject = `Update on your Article Submission: ${article.title || 'Sponsored Article'}`;
  let message = `The publication status of your sponsored article has been updated to <strong>${newStatus}</strong>.`;

  if (isApproved) {
    badgeHtml = '<span class="badge badge-success">Published Live</span>';
    title = 'Your Article is Published on HealthGhuru!';
    subject = `Your Sponsored Article "${article.title}" is Live on HealthGhuru!`;
    message = `Congratulations! Your sponsored article has completed clinical editorial review and is now live for our global readership.`;
  } else if (isRejected) {
    badgeHtml = '<span class="badge badge-orange">Submission Rejected</span>';
    title = 'Update on Your Article Submission';
    subject = `Important Update: HealthGhuru Article Submission "${article.title}"`;
    message = `Our healthcare editorial and medical review board evaluated your article submission. Unfortunately, we cannot publish this submission in its current form.`;
  } else {
    badgeHtml = '<span class="badge badge-blue">Under Medical Review</span>';
    title = 'Article Under Review';
    subject = `HealthGhuru Article in Editorial Review: "${article.title}"`;
    message = `Your sponsored article is actively undergoing multi-stage fact-checking and clinical verification.`;
  }

  const effectiveLiveUrl = liveUrl || (article.slug ? `http://localhost:3000/sponsored-articles/${article.slug}` : 'http://localhost:3000/sponsored-articles');

  const content = `
    ${badgeHtml}
    <h1 class="title">${title}</h1>
    <p class="text">${message}</p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Article Title:</span>
        <span class="info-value"><strong>${article.title || 'Sponsored Healthcare Article'}</strong></span>
      </div>
      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value" style="font-weight: 700; color: ${isApproved ? '#16A34A' : isRejected ? '#DC2626' : '#2563EB'};">
          ${(newStatus || 'Updated').toUpperCase()}
        </span>
      </div>
      ${article.company_name || article.sponsor_name ? `
      <div class="info-row">
        <span class="info-label">Organization:</span>
        <span class="info-value">${article.company_name || article.sponsor_name}</span>
      </div>` : ''}
      ${article.category ? `
      <div class="info-row">
        <span class="info-label">Category:</span>
        <span class="info-value">${article.category}</span>
      </div>` : ''}
    </div>

    ${reviewerNotes ? `
    <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <div style="font-size: 13px; font-weight: 700; color: #991B1B; margin-bottom: 4px;">Editorial / Clinical Review Notes:</div>
      <div style="font-size: 14px; color: #7F1D1D; line-height: 1.5;">${reviewerNotes}</div>
    </div>` : ''}

    <div style="text-align: center; margin-top: 24px;">
      <a href="${effectiveLiveUrl}" class="btn">${isApproved ? 'Read Your Article Live &rarr;' : 'Visit Sponsored Portal &rarr;'}</a>
    </div>
  `;

  return {
    html: emailWrapper(content, subject),
    text: `${title}\n\nArticle: ${article.title}\nStatus: ${newStatus}\n${reviewerNotes ? 'Notes: ' + reviewerNotes : ''}`,
    subject,
  };
}

// ── 9. Member Subscription Status Update Email ───────────────────────────────
export function getSubscriptionStatusUpdateTemplate(
  data: any,
  newStatus: string
): { html: string; text: string; subject: string } {
  const isCancelledOrExpired = newStatus === 'cancelled' || newStatus === 'expired';
  const badgeHtml = isCancelledOrExpired
    ? '<span class="badge badge-orange">Subscription Update</span>'
    : '<span class="badge badge-success">Membership Active</span>';
  const title = isCancelledOrExpired
    ? 'Your HealthGhuru Subscription Status'
    : 'Your HealthGhuru Membership is Active';
  const subject = `HealthGhuru Membership Update: ${newStatus.toUpperCase()}`;

  const content = `
    ${badgeHtml}
    <h1 class="title">${title}</h1>
    <p class="text">
      ${isCancelledOrExpired
        ? 'Your HealthGhuru membership status has changed to <strong>' + newStatus + '</strong>. Renew today to keep enjoying ad-free reading and premium health insights.'
        : 'Your membership is active and all premium features are available to you.'}
    </p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Account:</span>
        <span class="info-value">${data.email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Membership Tier:</span>
        <span class="info-value">${data.planName || data.planId || 'Premium'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Current Status:</span>
        <span class="info-value" style="font-weight: 700; color: ${isCancelledOrExpired ? '#DC2626' : '#16A34A'};">
          ${newStatus.toUpperCase()}
        </span>
      </div>
    </div>

    <div style="text-align: center; margin-top: 20px;">
      <a href="http://localhost:3000/subscribe" class="btn">Manage Subscription &rarr;</a>
    </div>
  `;

  return {
    html: emailWrapper(content, subject),
    text: `${title}\n\nEmail: ${data.email}\nStatus: ${newStatus}`,
    subject,
  };
}

