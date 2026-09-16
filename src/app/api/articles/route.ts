/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const articles = await sql`
      SELECT * FROM articles 
      WHERE status = 'published' AND deleted_at IS NULL
      ORDER BY publish_date DESC
    `;

    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
