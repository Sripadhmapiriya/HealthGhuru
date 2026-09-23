import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      description,
      image_url,
      published_at,
      author_name = 'HealthGhuru Editorial Board',
      category = 'Periodical',
      raw_metadata,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: 'Title and slug are required.' },
        { status: 400 }
      );
    }

    // Check if a magazine with this slug already exists
    const existing = await sql`
      SELECT id FROM content_items
      WHERE slug = ${slug} AND content_type = 'magazine' AND deleted_at IS NULL
      LIMIT 1;
    `;

    const metadataJson = JSON.stringify(raw_metadata || {});
    const publishDate = published_at ? new Date(published_at) : new Date();

    let resultId: string;

    if (existing.length > 0) {
      // Update existing
      resultId = existing[0].id;
      await sql`
        UPDATE content_items
        SET 
          title = ${title},
          excerpt = ${excerpt || ''},
          description = ${description || ''},
          image_url = ${image_url || '/images/fitness_pillar.png'},
          author_name = ${author_name},
          category = ${category},
          raw_metadata = ${metadataJson}::jsonb,
          updated_at = NOW()
        WHERE id = ${resultId};
      `;
    } else {
      // Insert new magazine
      const inserted = await sql`
        INSERT INTO content_items (
          content_type,
          title,
          slug,
          excerpt,
          description,
          canonical_url,
          image_url,
          author_name,
          published_at,
          status,
          category,
          is_featured,
          is_verified,
          raw_metadata,
          created_at,
          updated_at
        ) VALUES (
          'magazine',
          ${title},
          ${slug},
          ${excerpt || ''},
          ${description || ''},
          ${`/magazines/${slug}`},
          ${image_url || '/images/fitness_pillar.png'},
          ${author_name},
          ${publishDate.toISOString()},
          'published',
          ${category},
          TRUE,
          TRUE,
          ${metadataJson}::jsonb,
          NOW(),
          NOW()
        )
        RETURNING id;
      `;
      resultId = inserted[0].id;
    }

    return NextResponse.json({
      success: true,
      magazineId: resultId,
      slug,
      message: 'Magazine edition published successfully to HealthGhuru shelf!',
    });
  } catch (error: any) {
    console.error('Error publishing magazine:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to publish magazine.' },
      { status: 500 }
    );
  }
}
