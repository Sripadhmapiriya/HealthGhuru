/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { randomUUID } from 'crypto';
import { createAdminNotification } from '@/lib/notifications-server';

// PUBLIC: Submit a contact message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, category, language } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: { message: 'Name is required' } }, { status: 400 });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ success: false, error: { message: 'A valid email address is required' } }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: { message: 'Message content is required' } }, { status: 400 });
    }

    const selectedLanguage = (language && language.trim()) ? language.trim() : 'English';
    const newId = randomUUID();
    await sql`
      INSERT INTO contact_queries (
        id, name, email, phone, subject, message, category, language, status, created_at, updated_at
      ) VALUES (
        ${newId}::uuid,
        ${name.trim()},
        ${email.trim().toLowerCase()},
        ${phone ? phone.trim() : null},
        ${subject ? subject.trim() : (category || 'General Inquiry')},
        ${message.trim()},
        ${category || 'General Inquiry'},
        ${selectedLanguage},
        'unread',
        NOW(),
        NOW()
      );
    `;

    // Trigger admin notification asynchronously
    try {
      await createAdminNotification(
        `New Inquiry (${selectedLanguage}): ${name.trim()}`,
        `${subject ? subject.trim() : 'General Inquiry'} — "${message.trim().slice(0, 80)}${message.trim().length > 80 ? '...' : ''}"`,
        '/admin/contact-queries',
        'contact',
        'high',
        'Mail'
      );
    } catch (notifErr) {
      console.error('Non-critical notification trigger error:', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received. Our team will get back to you shortly.',
      id: newId,
    });
  } catch (error: any) {
    console.error('Error submitting contact query:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to submit contact query' } },
      { status: 500 }
    );
  }
}

// ADMIN ONLY: Fetch contact queries list with filters
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let queries;
    if (status && status !== 'all') {
      queries = await sql`
        SELECT *
        FROM contact_queries
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT 200
      `;
    } else {
      queries = await sql`
        SELECT *
        FROM contact_queries
        ORDER BY created_at DESC
        LIMIT 200
      `;
    }

    // Counts for KPIs
    const [counts] = await sql`
      SELECT 
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'unread' OR status = 'pending')::int as unread,
        COUNT(*) FILTER (WHERE status = 'reviewed' OR status = 'read')::int as reviewed,
        COUNT(*) FILTER (WHERE status = 'replied')::int as replied
      FROM contact_queries
    `;

    return NextResponse.json({
      success: true,
      queries,
      counts: counts || { total: 0, unread: 0, reviewed: 0, replied: 0 },
    });
  } catch (error: any) {
    const code = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: code });
  }
}
