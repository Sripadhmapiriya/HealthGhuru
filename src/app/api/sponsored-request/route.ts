/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { sendSponsorshipEmails } from '@/lib/email/mailer';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_name,
      contact_person,
      phone,
      email,
      website_url,
      package_id,
      package_name,
      video_package_id,
      video_package_name,
      placement,
      publish_date,
      article_content,
      logo_url,
      featured_image_url,
      video_url,
      document_url,
      base_price,
      gst_amount,
      total_amount,
      payment_method = 'upi',
      upi_app = 'GPay',
      utr_reference,
    } = body;

    // Validate mandatory fields
    if (!company_name || !contact_person || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Company Name, Contact Person, Email and Phone are required.' },
        { status: 400 }
      );
    }

    if (!utr_reference || utr_reference.trim().length < 6) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 12-digit UTR / Transaction Reference number.' },
        { status: 400 }
      );
    }

    // 1. Insert into campaign_requests
    const [requestRow] = await sql`
      INSERT INTO campaign_requests (
        campaign_title,
        advertiser_name,
        advertiser_type,
        contact_name,
        contact_email,
        contact_phone,
        target_url,
        placement,
        duration_plan,
        start_date,
        end_date,
        banner_image_url,
        base_price,
        gst_amount,
        total_amount,
        payment_method,
        payment_status,
        payment_reference,
        status,
        admin_notes
      ) VALUES (
        ${package_name || 'Sponsored Article Request'},
        ${company_name},
        'hospital',
        ${contact_person},
        ${email},
        ${phone},
        ${website_url || 'https://healthghuru.com'},
        ${placement || 'Homepage Sponsored Section'},
        'custom',
        ${publish_date ? new Date(publish_date) : new Date()},
        ${publish_date ? new Date(new Date(publish_date).getTime() + 30 * 24 * 3600 * 1000) : new Date(Date.now() + 30 * 24 * 3600 * 1000)},
        ${featured_image_url || logo_url || null},
        ${base_price || 0},
        ${gst_amount || 0},
        ${total_amount || 0},
        ${payment_method},
        'paid',
        ${utr_reference},
        'pending',
        ${`UPI App: ${upi_app} | Video Addon: ${video_package_name || 'None'} | Doc: ${document_url || 'None'}`}
      )
      RETURNING *
    `;

    // 2. Also register in sponsored_articles as submitted inquiry linked to campaign_requests
    // 2. Also register in sponsored_articles as submitted inquiry
    const slug = `${company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-6)}`;
    const formattedPrice = total_amount ? `₹${Number(total_amount).toLocaleString('en-IN')}` : (base_price ? `₹${Number(base_price).toLocaleString('en-IN')}` : '₹20,000');
    try {
      await sql`
        INSERT INTO sponsored_articles (
          title, slug, excerpt, content, featured_image,
          company_name, package_name, package_price, placement, assigned_reporter,
          category, author_name,
          status, review_status,
          requires_medical_review,
          sponsored_label, content_type,
          cta_text, cta_url,
          rights_confirmed
        ) VALUES (
          ${`${package_name || 'Partner Article'} - ${company_name}`},
          ${slug},
          ${article_content ? article_content.slice(0, 200) : 'Partner article submission pending editorial review.'},
          ${article_content || ''},
          ${featured_image_url || null},
          ${company_name},
          ${package_name || 'Event Coverage'},
          ${formattedPrice},
          ${placement || 'homepage_sponsored'},
          'Unassigned',
          'General Health',
          ${contact_person},
          'submitted',
          'pending',
          TRUE,
          'SPONSORED',
          'sponsored_article',
          'Visit Website →',
          ${website_url || null},
          'CONFIRMED'
        )
      `;
    } catch (e) {
      console.warn('Could not dual-create sponsored_article entry:', e);
    }

    // Revalidate admin queues so the new submission is immediately visible
    try {
      revalidatePath('/admin/campaigns');
      revalidatePath('/admin/sponsored-articles');
    } catch {
      // ignore
    }

    // Trigger email notifications in background
    sendSponsorshipEmails({
      ...body,
      request_id: requestRow.id,
    }).catch((mailErr) => console.error('Error triggering sponsorship emails:', mailErr));

    return NextResponse.json({
      success: true,
      request_id: requestRow.id,
      message: 'Sponsor request submitted successfully. Our medical editorial desk will review your submission shortly.',
    });
  } catch (error: any) {
    console.error('Error submitting sponsor request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit sponsor request' },
      { status: 500 }
    );
  }
}
