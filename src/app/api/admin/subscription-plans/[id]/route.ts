import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth/auth.config';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Plan ID required' }, { status: 400 });
    }

    await sql`
      DELETE FROM subscription_plans WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: 'Plan deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting plan:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete plan' },
      { status: 500 }
    );
  }
}
