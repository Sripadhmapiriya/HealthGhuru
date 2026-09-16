import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

// GET wallet balance
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let email = searchParams.get('email');

    if (!email) {
      const session = await getSession();
      email = session?.user?.email || null;
    }

    if (!email) {
      return NextResponse.json({ success: true, balance: 0 });
    }

    const rows = await sql`
      SELECT balance FROM user_wallets WHERE email = ${email}
    `;

    const balance = rows.length > 0 ? parseFloat(rows[0].balance) : 0;
    return NextResponse.json({ success: true, balance });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
