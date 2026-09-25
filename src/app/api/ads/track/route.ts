import { NextRequest, NextResponse } from 'next/server';
import { recordAdMetric } from '@/lib/advertisements';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let body: any = null;
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch {
      body = null;
    }

    const { adId, type } = body || {};

    if (!adId || !type || (type !== 'impression' && type !== 'click')) {
      return NextResponse.json({ success: false, error: 'Invalid parameters: adId and type required' }, { status: 400 });
    }

    // Safely skip fallback or static non-UUID ad IDs without throwing DB errors
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adId);
    if (!isUuid) {
      return NextResponse.json({ success: true, tracked: false, reason: 'non_db_ad' });
    }

    await recordAdMetric(adId, type);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking ad metric:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
