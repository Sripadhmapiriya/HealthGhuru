import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');

    const typeParam = searchParams.get('type') || 'all';

    // If no month/year specified, return the list of months that have articles
    if (!yearParam || !monthParam) {
      const monthsAvailable = await sql`
        SELECT 
          TO_CHAR(published_at, 'YYYY-MM') as month_key,
          TO_CHAR(published_at, 'Month YYYY') as month_label,
          EXTRACT(YEAR FROM published_at) as year,
          EXTRACT(MONTH FROM published_at) as month,
          COUNT(*) as article_count
        FROM content_items
        WHERE status = 'published' 
          AND deleted_at IS NULL
          AND content_type IN ('news', 'article', 'health_tip')
        GROUP BY 
          TO_CHAR(published_at, 'YYYY-MM'),
          TO_CHAR(published_at, 'Month YYYY'),
          EXTRACT(YEAR FROM published_at),
          EXTRACT(MONTH FROM published_at)
        ORDER BY month_key DESC;
      `;

      return NextResponse.json({
        success: true,
        months: monthsAvailable,
      });
    }

    const year = parseInt(yearParam, 10);
    const month = parseInt(monthParam, 10);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { success: false, error: 'Invalid year or month format.' },
        { status: 400 }
      );
    }

    // Start of the month: Year-MM-01 00:00:00
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    // End of the month: Last day (e.g. 28, 29, 30, or 31) 23:59:59.999
    const lastDayOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    
    // Check if downloading mid-month for the current month
    const now = new Date();
    const isCurrentMonth = (now.getUTCFullYear() === year && (now.getUTCMonth() + 1) === month);
    // If downloading in-between the month, collect all stories published up to right now
    const effectiveEndDate = isCurrentMonth ? now : lastDayOfMonth;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const mName = monthNames[month - 1] || 'Month';
    const coverageText = isCurrentMonth
      ? `Compiled Through ${now.getUTCDate()} ${mName} ${year} (Day 1 to ${now.getUTCDate()})`
      : `${mName} 1–${lastDayOfMonth.getUTCDate()}, ${year} (Complete Monthly Edition)`;

    let articles;
    if (typeParam === 'news') {
      articles = await sql`
        SELECT 
          i.id,
          i.title,
          i.slug,
          i.content_type,
          i.category,
          i.author_name,
          i.image_url,
          i.excerpt,
          i.description,
          i.canonical_url,
          i.duration_seconds,
          i.published_at,
          i.raw_metadata,
          a.blocks as article_blocks,
          a.author_credential,
          s.name as source_name
        FROM content_items i
        LEFT JOIN content_sources s ON i.source_id = s.id
        LEFT JOIN articles a ON (a.slug = i.slug OR a.id = i.id)
        WHERE i.status = 'published' 
          AND i.deleted_at IS NULL
          AND i.content_type = 'news'
          AND i.published_at >= ${startDate.toISOString()}
          AND i.published_at <= ${effectiveEndDate.toISOString()}
        ORDER BY i.is_featured DESC, i.published_at DESC;
      `;
    } else if (typeParam === 'article') {
      articles = await sql`
        SELECT 
          i.id,
          i.title,
          i.slug,
          i.content_type,
          i.category,
          i.author_name,
          i.image_url,
          i.excerpt,
          i.description,
          i.canonical_url,
          i.duration_seconds,
          i.published_at,
          i.raw_metadata,
          a.blocks as article_blocks,
          a.author_credential,
          s.name as source_name
        FROM content_items i
        LEFT JOIN content_sources s ON i.source_id = s.id
        LEFT JOIN articles a ON (a.slug = i.slug OR a.id = i.id)
        WHERE i.status = 'published' 
          AND i.deleted_at IS NULL
          AND i.content_type = 'article'
          AND i.published_at >= ${startDate.toISOString()}
          AND i.published_at <= ${effectiveEndDate.toISOString()}
        ORDER BY i.is_featured DESC, i.published_at DESC;
      `;
    } else {
      articles = await sql`
        SELECT 
          i.id,
          i.title,
          i.slug,
          i.content_type,
          i.category,
          i.author_name,
          i.image_url,
          i.excerpt,
          i.description,
          i.canonical_url,
          i.duration_seconds,
          i.published_at,
          i.raw_metadata,
          a.blocks as article_blocks,
          a.author_credential,
          s.name as source_name
        FROM content_items i
        LEFT JOIN content_sources s ON i.source_id = s.id
        LEFT JOIN articles a ON (a.slug = i.slug OR a.id = i.id)
        WHERE i.status = 'published' 
          AND i.deleted_at IS NULL
          AND i.content_type IN ('news', 'article', 'health_tip')
          AND i.published_at >= ${startDate.toISOString()}
          AND i.published_at <= ${effectiveEndDate.toISOString()}
        ORDER BY i.is_featured DESC, i.published_at DESC;
      `;
    }

    // Map reading_time cleanly
    const formattedArticles = articles.map((a: any) => ({
      ...a,
      reading_time: a.duration_seconds ? Math.ceil(a.duration_seconds / 60) : 4,
    }));

    return NextResponse.json({
      success: true,
      year,
      month,
      type: typeParam,
      is_mid_month: isCurrentMonth,
      coverage_text: coverageText,
      dateRange: {
        start: startDate.toISOString(),
        end: effectiveEndDate.toISOString(),
        startDay: 1,
        endDay: isCurrentMonth ? now.getUTCDate() : lastDayOfMonth.getUTCDate(),
      },
      count: formattedArticles.length,
      articles: formattedArticles,
    });
  } catch (error: any) {
    console.error('Error fetching magazine articles:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch magazine articles.' },
      { status: 500 }
    );
  }
}
