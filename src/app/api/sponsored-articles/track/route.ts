/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { recordSponsoredEvent } from '@/lib/sponsored/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      article_id,
      event_type,
      campaign_id,
      sponsor_id,
      destination,
    } = body;

    if (!article_id || !event_type) {
      return NextResponse.json(
        { success: false, error: 'article_id and event_type are required' },
        { status: 400 }
      );
    }

    const validEvents = [
      'SPONSORED_VIEW',
      'SPONSORED_CLICK',
      'SPONSOR_PROFILE_VIEW',
      'CTA_CLICK',
      'SHARE',
    ];

    if (!validEvents.includes(event_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event_type' },
        { status: 400 }
      );
    }

    // Get anonymized session / IP identifier without violating health privacy
    const userAgent = request.headers.get('user-agent') || '';
    const userSession = Buffer.from(userAgent.slice(0, 50)).toString('base64').slice(0, 32);

    await recordSponsoredEvent(article_id, event_type, {
      campaignId: campaign_id,
      sponsorId: sponsor_id,
      userSession,
      destination,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking sponsored event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Tracking failed' },
      { status: 500 }
    );
  }
}
