import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MediaLibraryClient } from './MediaLibraryClient';
import { MediaAsset, MediaStats } from '@/lib/media';
import { syncLocalMediaFiles } from '@/lib/media-server';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  await requireAdmin();

  // Run initial lightweight count check; if empty, run a quick auto-sync
  const countRes = await sql`SELECT COUNT(*)::int as count FROM media_assets`;
  const initialCount = Number(countRes[0]?.count || 0);

  if (initialCount === 0) {
    try {
      await syncLocalMediaFiles();
    } catch (e) {
      console.error('Initial media sync error:', e);
    }
  }

  // Fetch initial media items and summary stats
  const [items, statsResult] = await Promise.all([
    sql`
      SELECT 
        id,
        filename,
        original_name,
        url,
        mime_type,
        media_type,
        file_size,
        width,
        height,
        title,
        alt_text,
        caption,
        tags,
        uploaded_by,
        created_at,
        updated_at
      FROM media_assets
      ORDER BY created_at DESC
      LIMIT 100
    `,
    sql`
      SELECT 
        COUNT(*)::int as total_count,
        COALESCE(SUM(file_size), 0)::bigint as total_bytes,
        COUNT(CASE WHEN media_type = 'image' THEN 1 END)::int as image_count,
        COUNT(CASE WHEN media_type = 'video' THEN 1 END)::int as video_count,
        COUNT(CASE WHEN media_type = 'document' THEN 1 END)::int as document_count,
        COUNT(CASE WHEN media_type = 'audio' THEN 1 END)::int as audio_count,
        COUNT(CASE WHEN media_type = 'other' THEN 1 END)::int as other_count
      FROM media_assets
    `,
  ]);

  const rawStats = statsResult[0] || {};
  const stats: MediaStats = {
    totalCount: Number(rawStats.total_count || 0),
    totalBytes: Number(rawStats.total_bytes || 0),
    imageCount: Number(rawStats.image_count || 0),
    videoCount: Number(rawStats.video_count || 0),
    documentCount: Number(rawStats.document_count || 0),
    audioCount: Number(rawStats.audio_count || 0),
    otherCount: Number(rawStats.other_count || 0),
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <AdminPageHeader
        tag="Asset Hub"
        title="Media Library"
        subtitle="Upload, organize, preview, search, tag, inspect metadata, and manage all visual and digital assets across HealthGhuru."
      />

      <MediaLibraryClient
        initialItems={items as unknown as MediaAsset[]}
        initialStats={stats}
      />
    </div>
  );
}
