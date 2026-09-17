/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sponsors = await sql`
      SELECT s.*, a.organization_name AS advertiser_name
      FROM sponsors s
      LEFT JOIN advertisers a ON s.advertiser_id = a.id
      ORDER BY s.name ASC
    `;
    return NextResponse.json({ success: true, sponsors });
  } catch (error: any) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
