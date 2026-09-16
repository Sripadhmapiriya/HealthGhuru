import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const rows = await sql`
      SELECT value FROM site_settings WHERE key = 'ad_rotation_seconds' LIMIT 1
    `;

    const interval = rows.length > 0 ? parseInt(rows[0].value, 10) : 8;

    return NextResponse.json({
      success: true,
      rotation_interval_seconds: isNaN(interval) ? 8 : interval,
    });
  } catch (err: any) {
    return NextResponse.json({ success: true, rotation_interval_seconds: 8 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const interval = parseInt(body.rotation_interval_seconds || '8', 10);

    if (isNaN(interval) || interval < 3 || interval > 60) {
      return NextResponse.json(
        { success: false, error: 'Interval must be between 3 and 60 seconds' },
        { status: 400 }
      );
    }

    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('ad_rotation_seconds', ${interval.toString()}, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({
      success: true,
      rotation_interval_seconds: interval,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
