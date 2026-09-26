import 'server-only';
import { sql } from '@/lib/db';

export interface RelatedToolArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  reading_time?: number;
  published_at: string;
}

export async function getRelatedArticlesForTool(
  category = 'nutrition',
  limit = 3
): Promise<RelatedToolArticle[]> {
  try {
    const cleanCategory = category.toLowerCase();
    const rows = await sql`
      SELECT 
        id, 
        title, 
        slug, 
        excerpt, 
        image_url, 
        category,
        COALESCE(duration_seconds, 240) as duration_seconds,
        published_at
      FROM content_items
      WHERE status = 'published'
        AND deleted_at IS NULL
        AND (
          LOWER(category) LIKE ${'%' + cleanCategory + '%'}
          OR LOWER(title) LIKE ${'%' + cleanCategory + '%'}
        )
      ORDER BY is_featured DESC, published_at DESC
      LIMIT ${limit}
    `;

    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      excerpt: r.excerpt,
      image_url: r.image_url,
      category: r.category,
      reading_time: Math.ceil((r.duration_seconds || 240) / 60),
      published_at: r.published_at,
    }));
  } catch (error) {
    console.error('Failed to get related articles for health tool:', error);
    return [];
  }
}

export interface RelatedToolVideo {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  subcategory: string | null;
  duration_seconds: number | null;
  canonical_url: string | null;
  is_short?: boolean;
}

export async function getRelatedVideosForTool(
  category = 'nutrition',
  limit = 3
): Promise<RelatedToolVideo[]> {
  try {
    const cleanCategory = category.toLowerCase();

    // 1. Try matching by category or title
    let rows = await sql`
      SELECT 
        id, 
        title, 
        slug, 
        excerpt, 
        image_url, 
        category,
        subcategory,
        duration_seconds,
        canonical_url
      FROM content_items
      WHERE content_type = 'video'
        AND status = 'published'
        AND deleted_at IS NULL
        AND (
          LOWER(category) LIKE ${'%' + cleanCategory + '%'}
          OR LOWER(title) LIKE ${'%' + cleanCategory + '%'}
        )
      ORDER BY is_featured DESC, published_at DESC
      LIMIT ${limit}
    `;

    // 2. If fewer than requested, backfill with most popular/latest published videos
    if (rows.length < limit) {
      const existingIds = rows.map((r: any) => r.id);
      const needed = limit - rows.length;

      const fallbackRows = existingIds.length > 0
        ? await sql`
            SELECT 
              id, 
              title, 
              slug, 
              excerpt, 
              image_url, 
              category,
              subcategory,
              duration_seconds,
              canonical_url
            FROM content_items
            WHERE content_type = 'video'
              AND status = 'published'
              AND deleted_at IS NULL
              AND NOT (id = ANY(${existingIds}::uuid[]))
            ORDER BY published_at DESC
            LIMIT ${needed}
          `
        : await sql`
            SELECT 
              id, 
              title, 
              slug, 
              excerpt, 
              image_url, 
              category,
              subcategory,
              duration_seconds,
              canonical_url
            FROM content_items
            WHERE content_type = 'video'
              AND status = 'published'
              AND deleted_at IS NULL
            ORDER BY published_at DESC
            LIMIT ${needed}
          `;
      rows = [...rows, ...fallbackRows];
    }

    if (rows.length === 0) {
      // Curated clinical video guides if no DB records exist
      return [
        {
          id: 'hg-vid-1',
          title: 'Understanding Energy Balance, BMR, and Daily Calorie Deficits',
          slug: 'understanding-energy-balance-bmr-and-daily-calorie-deficits',
          excerpt: 'Clinical explainer on how metabolic rate dictates fat loss and muscle retention with doctor-guided nutritional tips.',
          image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
          category: 'Nutrition & Metabolism',
          subcategory: 'video',
          duration_seconds: 480,
          canonical_url: 'https://youtube.com',
          is_short: false,
        },
        {
          id: 'hg-vid-2',
          title: 'Hydration Science: How Much Water Your Body Actually Needs Daily',
          slug: 'hydration-science-how-much-water-your-body-actually-needs-daily',
          excerpt: 'Explore renal electrolyte filtration, physical activity hydration offsets, and cellular water distribution.',
          image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
          category: 'Hydration & Fitness',
          subcategory: 'video',
          duration_seconds: 360,
          canonical_url: 'https://youtube.com',
          is_short: false,
        },
        {
          id: 'hg-vid-3',
          title: 'Circadian Sleep Cycles: Mastering 90-Minute REM & Deep Sleep',
          slug: 'circadian-sleep-cycles-mastering-90-minute-rem-and-deep-sleep',
          excerpt: 'Neurological breakdown of sleep latency, restorative delta waves, and how to wake up without morning grogginess.',
          image_url: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80',
          category: 'Cardio & Sleep',
          subcategory: 'video',
          duration_seconds: 420,
          canonical_url: 'https://youtube.com',
          is_short: false,
        },
      ];
    }

    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      excerpt: r.excerpt,
      image_url: r.image_url,
      category: r.category || 'Health Guide',
      subcategory: r.subcategory,
      duration_seconds: r.duration_seconds,
      canonical_url: r.canonical_url,
      is_short:
        r.subcategory === 'short' ||
        Boolean(r.canonical_url?.includes('/shorts/') || r.canonical_url?.includes('instagram.com')),
    }));
  } catch (error) {
    console.error('Failed to get related videos for health tool:', error);
    return [];
  }
}
