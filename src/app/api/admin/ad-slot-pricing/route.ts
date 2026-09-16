import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pricing = await sql`
      SELECT * FROM ad_slot_pricing
      ORDER BY created_at ASC
    `;
    return NextResponse.json({ success: true, pricing });
  } catch (error: any) {
    console.error('Error fetching ad slot pricing:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      placement,
      label,
      description,
      price_per_day = 0,
      price_per_week = 0,
      price_per_month = 0,
      is_available = true,
    } = body;

    if (!placement || !label) {
      return NextResponse.json(
        { success: false, error: 'Placement and label are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO ad_slot_pricing (
        placement, label, description, price_per_day, price_per_week, price_per_month, is_available
      ) VALUES (
        ${placement}, ${label}, ${description || null},
        ${price_per_day}, ${price_per_week}, ${price_per_month}, ${is_available}
      )
      ON CONFLICT (placement) DO UPDATE SET
        label = EXCLUDED.label,
        description = EXCLUDED.description,
        price_per_day = EXCLUDED.price_per_day,
        price_per_week = EXCLUDED.price_per_week,
        price_per_month = EXCLUDED.price_per_month,
        is_available = EXCLUDED.is_available,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    return NextResponse.json({ success: true, pricing: result[0] });
  } catch (error: any) {
    console.error('Error upserting ad slot pricing:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
