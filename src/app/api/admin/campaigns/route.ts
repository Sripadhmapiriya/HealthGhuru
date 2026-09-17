/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const campaigns = await sql`
      SELECT c.*, a.organization_name AS advertiser_name
      FROM campaigns c
      LEFT JOIN advertisers a ON c.advertiser_id = a.id
      ORDER BY c.created_at DESC
    `;
    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
