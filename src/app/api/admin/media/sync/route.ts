/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { syncLocalMediaFiles } from '@/lib/media-server';

export async function POST() {
  try {
    await requireAdmin();

    const result = await syncLocalMediaFiles();

    return NextResponse.json({
      success: true,
      result,
      message: `Scanned ${result.scanned} files, synced ${result.synced} new assets (${result.skipped} already in database).`,
    });
  } catch (error: any) {
    console.error('Error syncing media assets:', error);
    const statusCode = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: statusCode });
  }
}
