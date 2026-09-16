import { NextRequest, NextResponse } from 'next/server';
import { getActiveAds } from '@/lib/advertisements';
import { AdPlacement } from '@/lib/types/advertisement';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement') as AdPlacement | null;
    const category = searchParams.get('category') || undefined;

    let ads = await getActiveAds(placement || undefined, category);

    // Override any external 404 links from the database to point to a reliable article
    if (ads && Array.isArray(ads)) {
      ads = ads.map((ad: any) => {
        if (ad.target_url && ad.target_url.includes('healthghuru.com')) {
          return { ...ad, target_url: '/blog/boost-immune-system' };
        }
        return ad;
      });
    }

    // Retrieve rotation interval from site_settings
    let rotationInterval = 8;
    try {
      const settings = await sql`
        SELECT value FROM site_settings WHERE key = 'ad_rotation_seconds' LIMIT 1
      `;
      if (settings.length > 0) {
        const val = parseInt(settings[0].value, 10);
        if (!isNaN(val) && val >= 3) {
          rotationInterval = val;
        }
      }
    } catch {
      // fallback to 8s
    }

    return NextResponse.json(
      {
        success: true,
        ads,
        rotation_interval: rotationInterval,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in /api/ads/active:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
