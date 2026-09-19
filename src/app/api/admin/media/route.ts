/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { getMediaTypeFromMime, inferMimeType } from '@/lib/media';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all';
    const tag = searchParams.get('tag') || '';
    const sort = searchParams.get('sort') || 'created_at-desc';
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build dynamic conditions safely
    let baseQuery = sql`
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
      WHERE 1=1
    `;

    if (type !== 'all') {
      baseQuery = sql`${baseQuery} AND media_type = ${type}`;
    }

    if (tag.trim()) {
      baseQuery = sql`${baseQuery} AND ${tag.trim()} = ANY(tags)`;
    }

    if (search.trim()) {
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      baseQuery = sql`${baseQuery} AND (
        LOWER(filename) LIKE ${searchPattern} OR 
        LOWER(original_name) LIKE ${searchPattern} OR 
        LOWER(COALESCE(title, '')) LIKE ${searchPattern} OR 
        LOWER(COALESCE(alt_text, '')) LIKE ${searchPattern}
      )`;
    }

    // Apply sorting
    if (sort === 'created_at-asc') {
      baseQuery = sql`${baseQuery} ORDER BY created_at ASC`;
    } else if (sort === 'file_size-desc') {
      baseQuery = sql`${baseQuery} ORDER BY file_size DESC`;
    } else if (sort === 'file_size-asc') {
      baseQuery = sql`${baseQuery} ORDER BY file_size ASC`;
    } else if (sort === 'name-asc') {
      baseQuery = sql`${baseQuery} ORDER BY LOWER(original_name) ASC`;
    } else if (sort === 'name-desc') {
      baseQuery = sql`${baseQuery} ORDER BY LOWER(original_name) DESC`;
    } else {
      // Default: created_at DESC
      baseQuery = sql`${baseQuery} ORDER BY created_at DESC`;
    }

    baseQuery = sql`${baseQuery} LIMIT ${limit} OFFSET ${offset}`;

    // Execute query and compute aggregate stats
    const [items, statsResult] = await Promise.all([
      baseQuery,
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
    const stats = {
      totalCount: Number(rawStats.total_count || 0),
      totalBytes: Number(rawStats.total_bytes || 0),
      imageCount: Number(rawStats.image_count || 0),
      videoCount: Number(rawStats.video_count || 0),
      documentCount: Number(rawStats.document_count || 0),
      audioCount: Number(rawStats.audio_count || 0),
      otherCount: Number(rawStats.other_count || 0),
    };

    return NextResponse.json({
      success: true,
      items,
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching media assets:', error);
    const statusCode = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: statusCode });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await requireAdmin();

    const data = await req.formData();
    const files = data.getAll('files') as File[];
    const singleFile = data.get('file') as File | null;

    const filesToUpload: File[] = [];
    if (files && files.length > 0) {
      filesToUpload.push(...files);
    } else if (singleFile) {
      filesToUpload.push(singleFile);
    }

    if (filesToUpload.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'No files provided for upload' } },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // already exists
    }

    const uploadedAssets = [];

    for (const file of filesToUpload) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${uniqueSuffix}-${sanitizedName}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);

      const fileUrl = `/uploads/${filename}`;
      const mimeType = file.type || inferMimeType(file.name);
      const mediaType = getMediaTypeFromMime(mimeType, file.name);

      let width: number | null = null;
      let height: number | null = null;

      if (mediaType === 'image' && !file.name.endsWith('.svg')) {
        try {
          const meta = await sharp(buffer).metadata();
          width = meta.width ?? null;
          height = meta.height ?? null;
        } catch {
          // non-fatal
        }
      }

      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .trim();

      const inserted = await sql`
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
          uploaded_by,
          tags
        ) VALUES (
          ${filename},
          ${file.name},
          ${fileUrl},
          ${mimeType},
          ${mediaType},
          ${buffer.length},
          ${width},
          ${height},
          ${cleanTitle},
          ${cleanTitle},
          ${(adminUser as any)?.id || null}::uuid,
          ARRAY['upload']
        )
        RETURNING *
      `;

      if (inserted && inserted[0]) {
        uploadedAssets.push(inserted[0]);
      }
    }

    return NextResponse.json({
      success: true,
      assets: uploadedAssets,
      // For backward compatibility with single-file upload calls
      url: uploadedAssets[0]?.url,
    });
  } catch (error: any) {
    console.error('Error uploading media assets:', error);
    const statusCode = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: statusCode });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Array of media IDs is required' } },
        { status: 400 }
      );
    }

    // Fetch the URLs of files being deleted so we can remove them from filesystem if they are in uploads
    const assets = await sql`
      SELECT id, url, filename FROM media_assets WHERE id = ANY(${ids}::uuid[])
    `;

    for (const asset of assets) {
      if (asset.url && asset.url.startsWith('/uploads/')) {
        const filePath = join(process.cwd(), 'public', 'uploads', asset.filename);
        try {
          await unlink(filePath);
        } catch {
          // File might already be gone
        }
      }
    }

    // Delete records from database
    await sql`
      DELETE FROM media_assets WHERE id = ANY(${ids}::uuid[])
    `;

    return NextResponse.json({
      success: true,
      deletedCount: assets.length,
    });
  } catch (error: any) {
    console.error('Error deleting media assets:', error);
    const statusCode = error.message === 'Unauthorized' || error.message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: statusCode });
  }
}
