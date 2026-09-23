/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Metadata } from 'next';
import { sql } from '@/lib/db';
import { MagazinePrintView } from '@/components/admin/magazine/MagazinePrintView';
import { PrintActionHeader } from '@/components/admin/magazine/PrintActionHeader';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface PrintPageProps {
  searchParams: {
    year?: string;
    month?: string;
    autoPrint?: string;
  };
}

export async function generateMetadata({ searchParams }: PrintPageProps): Promise<Metadata> {
  const year = searchParams.year ? parseInt(searchParams.year, 10) : new Date().getFullYear();
  const month = searchParams.month ? parseInt(searchParams.month, 10) : new Date().getMonth() + 1;
  const monthName = MONTH_NAMES[month - 1] || 'Edition';

  return {
    title: `HealthGhuru Magazine — ${monthName} ${year} Edition (Print & PDF)`,
    description: `Official digital health magazine compiling all verified news and articles published in ${monthName} ${year}.`,
  };
}

export default async function StandaloneMagazinePrintPage({ searchParams }: PrintPageProps) {
  const year = searchParams.year ? parseInt(searchParams.year, 10) : new Date().getFullYear();
  const month = searchParams.month ? parseInt(searchParams.month, 10) : new Date().getMonth() + 1;
  const autoPrint = searchParams.autoPrint === 'true';

  const monthName = MONTH_NAMES[month - 1] || 'Current';
  const issueVolume = `Vol. ${year - 2022}, Issue ${month}`;
  const issueTitle = `HealthGhuru Monthly — ${monthName} ${year} Clinical Digest`;
  const editorNote = `Welcome to the ${monthName} ${year} digital edition of HealthGhuru Magazine. This volume curates all verified clinical articles, preventive lifestyle protocols, and evidence-based reports published across our portal between day 1 and the end of the month.`;

  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const lastDayOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  const now = new Date();
  const isCurrentMonth = (now.getUTCFullYear() === year && (now.getUTCMonth() + 1) === month);
  const effectiveEndDate = isCurrentMonth ? now : lastDayOfMonth;

  const coverageText = isCurrentMonth
    ? `Compiled Through ${now.getUTCDate()} ${monthName} ${year} (Day 1 to ${now.getUTCDate()})`
    : `${monthName} 1–${lastDayOfMonth.getUTCDate()}, ${year} (Complete Monthly Edition)`;

  // Directly query the database for all news and articles for this month
  const rawArticles = await sql`
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

  const articles = rawArticles.map((a: any) => ({
    ...a,
    reading_time: a.duration_seconds ? Math.ceil(a.duration_seconds / 60) : 4,
  }));

  const totalPages = Math.ceil(articles.length / 2) + 2;

  return (
    <div className="min-h-screen bg-[#0F172A] pb-16 print:bg-white print:pb-0">
      {/* Floating Action Header (Hidden in Print) */}
      <PrintActionHeader
        issueTitle={issueTitle}
        articleCount={articles.length}
        totalPages={totalPages}
        autoPrint={autoPrint}
      />

      {/* Screen Container Centering the Magazine Document */}
      <div className="py-6 sm:py-10 px-2 sm:px-6 flex justify-center print:p-0 print:m-0 print:block">
        <div className="w-full max-w-[210mm] print:w-auto print:max-w-none">
          {articles.length === 0 ? (
            <div className="p-16 bg-white rounded-xl shadow-xl text-center text-slate-800 space-y-3">
              <h2 className="text-2xl font-bold font-heading">No Magazine Articles Found</h2>
              <p className="text-sm text-slate-500">
                No published news or articles were found for {monthName} {year}.
              </p>
            </div>
          ) : (
            <MagazinePrintView
              year={year}
              month={month}
              monthName={monthName}
              issueVolume={issueVolume}
              issueTitle={issueTitle}
              editorNote={editorNote}
              articles={articles}
              coverageText={coverageText}
              isMidMonth={isCurrentMonth}
            />
          )}
        </div>
      </div>
    </div>
  );
}
