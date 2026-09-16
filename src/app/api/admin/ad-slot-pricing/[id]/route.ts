import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      label,
      description,
      price_per_day,
      price_per_week,
      price_per_month,
      is_available,
    } = body;

    const result = await sql`
      UPDATE ad_slot_pricing
      SET
        label = COALESCE(${label}, label),
        description = ${description !== undefined ? description : sql`description`},
        price_per_day = COALESCE(${price_per_day}, price_per_day),
        price_per_week = COALESCE(${price_per_week}, price_per_week),
        price_per_month = COALESCE(${price_per_month}, price_per_month),
        is_available = COALESCE(${is_available}, is_available),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}::uuid
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: 'Pricing slot not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, pricing: result[0] });
  } catch (error: any) {
    console.error('Error updating ad slot pricing:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
