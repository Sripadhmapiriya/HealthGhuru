/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import {
  getSponsoredArticleBySlug,
  getRelatedSponsoredArticles,
  getEditorialHealthArticles,
} from '@/lib/sponsored/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug parameter is required' }, { status: 400 });
    }

    const article = await getSponsoredArticleBySlug(slug);
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Sponsored article not found' },
        { status: 404 }
      );
    }

    // Fetch related content concurrently
    const [relatedSponsored, relatedEditorial] = await Promise.all([
      getRelatedSponsoredArticles(article.category, article.id, 3),
      getEditorialHealthArticles(article.category, 3),
    ]);

    return NextResponse.json({
      success: true,
      article,
      relatedSponsored,
      relatedEditorial,
    });
  } catch (error: any) {
    console.error('Error fetching sponsored article by slug:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
