import { NextRequest, NextResponse } from 'next/server';
import { getSponsoredArticles, getSponsoredArticleBySlug } from '@/lib/sponsored/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // If querying by slug directly via this endpoint
    if (slug) {
      const article = await getSponsoredArticleBySlug(slug);
      if (!article) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, article, articles: [article] });
    }

    const category = searchParams.get('category') || undefined;
    const sponsor_type = searchParams.get('sponsor_type') || undefined;
    const q = searchParams.get('q') || undefined;
    const sort = (searchParams.get('sort') as 'latest' | 'most_read' | 'featured') || 'latest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);

    const data = await getSponsoredArticles({
      category,
      sponsor_type,
      q,
      sort,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      articles: data.articles,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    });
  } catch (error: any) {
    console.error('Error in GET /api/sponsored-articles:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch sponsored articles' },
      { status: 500 }
    );
  }
}
