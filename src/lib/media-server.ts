/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { sql } from '@/lib/db';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { inferMimeType, getMediaTypeFromMime } from '@/lib/media';

export async function getImageDimensions(buffer: Buffer): Promise<{ width?: number; height?: number }> {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
    };
  } catch {
    return {};
  }
}

/**
 * Scans public/uploads (and optionally public/images) and syncs untracked files into media_assets table
 */
export async function syncLocalMediaFiles(): Promise<{
  scanned: number;
  synced: number;
  skipped: number;
  errors: number;
}> {
  let scanned = 0;
  let synced = 0;
  let skipped = 0;
  let errors = 0;

  // 1. Fetch all existing registered URLs in one fast query
  const existingRows = await sql`SELECT url FROM media_assets`;
  const existingUrls = new Set<string>(existingRows.map((r: any) => r.url));

  const targetDirs = [
    { dir: join(process.cwd(), 'public', 'uploads'), urlPrefix: '/uploads/' },
    { dir: join(process.cwd(), 'public', 'images'), urlPrefix: '/images/' },
    { dir: join(process.cwd(), 'public', 'images', 'articles'), urlPrefix: '/images/articles/' },
  ];

  for (const { dir, urlPrefix } of targetDirs) {
    try {
      const files = await readdir(dir, { withFileTypes: true });
      for (const entry of files) {
        if (!entry.isFile()) continue;

        scanned++;
        const filename = entry.name;
        // Ignore hidden or temporary system files
        if (filename.startsWith('.') || filename.endsWith('.tmp')) continue;

        const url = `${urlPrefix}${filename}`;
        const filePath = join(dir, filename);

        if (existingUrls.has(url)) {
          skipped++;
          continue;
        }

        try {
          const fileStats = await stat(filePath);
          const mimeType = inferMimeType(filename);
          const mediaType = getMediaTypeFromMime(mimeType, filename);

          let width: number | null = null;
          let height: number | null = null;

          if (mediaType === 'image' && !filename.endsWith('.svg')) {
            try {
              const meta = await sharp(filePath).metadata();
              width = meta.width ?? null;
              height = meta.height ?? null;
            } catch {
              // Non-fatal if sharp cannot parse file
            }
          }

          // Generate human readable title from filename
          const cleanTitle = filename
            .replace(/^\d+-\d+-/, '') // remove timestamp prefixes
            .replace(/\.[^/.]+$/, '') // remove extension
            .replace(/[-_]/g, ' ')
            .trim();

          await sql`
            INSERT INTO media_assets (
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
              tags
            ) VALUES (
              ${filename},
              ${filename},
              ${url},
              ${mimeType},
              ${mediaType},
              ${fileStats.size},
              ${width},
              ${height},
              ${cleanTitle},
              ${cleanTitle},
              ARRAY['system-sync']
            )
            ON CONFLICT (url) DO NOTHING
          `;

          existingUrls.add(url);
          synced++;
        } catch (itemErr) {
          console.error(`Error syncing media file ${filename}:`, itemErr);
          errors++;
        }
      }
    } catch {
      // Directory may not exist yet, ignore
    }
  }

  return { scanned, synced, skipped, errors };
}
