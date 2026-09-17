'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAdmin } from '@/lib/auth/session';
import { canManageArticles } from '@/lib/admin/permissions';
import { sql } from '@/lib/db';
import { writeAuditLog } from './auditLog';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

export interface NewsPublishPayload {
  id?: string;
  title: string;
  subtitle?: string;
  slug?: string;
  language: string;
  category: string;
  location?: string;
  excerpt: string;
  content: string;
  tags?: string[];
  seoKeywords?: string;
  heroImageUrl?: string;
  galleryImages?: string[];
  isBreaking?: boolean;
  showInSidebar?: boolean;
  sendPush?: boolean;
  status?: 'published' | 'draft';
}

export async function publishNews(payload: NewsPublishPayload) {
  const session = await requireAdmin();
  if (!canManageArticles(session)) {
    throw new Error('Unauthorized');
  }

  const {
    title,
    subtitle = '',
    language = 'en',
    category = 'Heart',
    location = '',
    excerpt,
    content,
    tags = [],
    seoKeywords = '',
    heroImageUrl = '',
    galleryImages = [],
    isBreaking = false,
    showInSidebar = false,
    sendPush = false,
    status = 'published',
  } = payload;

  if (!title.trim()) {
    throw new Error('Title is mandatory');
  }
  if (!excerpt.trim()) {
    throw new Error('Short description (summary) is mandatory');
  }

  // Generate clean slug
  const baseSlug = (payload.slug && payload.slug.trim())
    ? payload.slug.trim()
    : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
  const slug = `${baseSlug}-${uniqueSuffix}`.slice(0, 240);

  const wordCount = (content || '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  const articleId = payload.id || randomUUID();
  const authorName = session.user.name || 'HealthGhuru Editorial Team';
  const authorAvatar = session.user.image || '/images/exercise_plank.png';
  const authorCredential = 'MD, Healthcare & Clinical Journalism';

  // Format blocks for rich article view
  const paragraphs = (content || '')
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const blocks = paragraphs.map((text) => ({
    type: 'paragraph',
    id: randomUUID(),
    text,
  }));

  // 1. Write to articles table
  await sql`
    INSERT INTO articles (
      id, title, slug, category, excerpt, read_time, status, publish_date,
      hero_image_url, hero_image_alt, author_name, author_avatar, author_credential,
      tags, blocks, updated_at
    )
    VALUES (
      ${articleId}::uuid,
      ${title},
      ${slug},
      ${category},
      ${excerpt},
      ${readTime},
      ${status},
      ${status === 'published' ? sql`CURRENT_TIMESTAMP` : null},
      ${heroImageUrl || null},
      ${title},
      ${authorName},
      ${authorAvatar},
      ${authorCredential},
      ${tags},
      ${JSON.stringify(blocks)}::jsonb,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      category = EXCLUDED.category,
      excerpt = EXCLUDED.excerpt,
      read_time = EXCLUDED.read_time,
      status = EXCLUDED.status,
      hero_image_url = EXCLUDED.hero_image_url,
      tags = EXCLUDED.tags,
      blocks = EXCLUDED.blocks,
      updated_at = CURRENT_TIMESTAMP
  `;

  // 2. Write to unified content_items table for public feed synchronization
  try {
    const rawMetadata = {
      subtitle,
      location,
      gallery_images: galleryImages,
      show_in_sidebar: showInSidebar,
      send_push: sendPush,
      seo_keywords: seoKeywords,
    };

    await sql`
      INSERT INTO content_items (
        id, content_type, title, slug, excerpt, description, canonical_url,
        image_url, author_name, published_at, status, language,
        category, is_external, is_featured, is_trending, is_breaking, is_editor_pick, is_verified,
        quality_score, relevance_score, raw_metadata, created_at, updated_at
      )
      VALUES (
        ${articleId}::uuid,
        'article',
        ${title},
        ${slug},
        ${excerpt},
        ${content},
        ${'/article/' + slug},
        ${heroImageUrl || null},
        ${authorName},
        ${status === 'published' ? sql`CURRENT_TIMESTAMP` : null},
        ${status},
        ${language},
        ${category},
        FALSE,
        TRUE,
        FALSE,
        ${isBreaking},
        TRUE,
        TRUE,
        98.0,
        98.0,
        ${JSON.stringify(rawMetadata)}::jsonb,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        description = EXCLUDED.description,
        image_url = EXCLUDED.image_url,
        category = EXCLUDED.category,
        language = EXCLUDED.language,
        status = EXCLUDED.status,
        is_breaking = EXCLUDED.is_breaking,
        raw_metadata = EXCLUDED.raw_metadata,
        updated_at = CURRENT_TIMESTAMP
    `;

    // Sync tags
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        if (!tagName.trim()) continue;
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const tagRes = await sql`
          INSERT INTO content_tags (name, slug)
          VALUES (${tagName.trim()}, ${tagSlug})
          ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;
        if (tagRes.length > 0) {
          await sql`
            INSERT INTO content_item_tags (content_item_id, tag_id)
            VALUES (${articleId}::uuid, ${tagRes[0].id}::uuid)
            ON CONFLICT (content_item_id, tag_id) DO NOTHING
          `;
        }
      }
    }
  } catch (contentSyncErr) {
    console.error('Warning: Failed to sync news article to content_items:', contentSyncErr);
  }

  // Write audit log
  await writeAuditLog({
    adminUserId: session.user.id,
    actionType: 'article_create',
    targetTable: 'articles',
    targetId: articleId,
    afterValue: { title, category, status, isBreaking, language },
  });

  // 3. Instant Real-Time User Panel Cache Revalidation
  try {
    revalidatePath('/');
    revalidatePath('/latest');
    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    revalidatePath(`/category/${categorySlug}`);
    revalidatePath(`/article/${slug}`);
    revalidatePath('/admin/content');
    revalidatePath('/admin/add-news');
  } catch (revalErr) {
    console.warn('Revalidation warning in publishNews:', revalErr);
  }

  return { success: true, id: articleId, slug };
}
