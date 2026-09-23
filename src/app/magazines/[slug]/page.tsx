/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { sql } from '@/lib/db';
import { MagazinePrintView } from '@/components/admin/magazine/MagazinePrintView';
import { HealthDisclaimer } from '@/components/media/HealthDisclaimer';
import {
  BookOpen,
  Calendar,
  Download,
  ArrowLeft,
  Printer,
  Sparkles,
  Layers,
  Share2,
} from 'lucide-react';
import { formatMonthYear } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface MagazineSlugProps {
  params: {
    slug: string;
  };
}

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

export async function generateMetadata({ params }: MagazineSlugProps): Promise<Metadata> {
  const { slug } = params;
  const items = await sql`
    SELECT title, excerpt, description, image_url
    FROM content_items
    WHERE slug = ${slug} AND content_type = 'magazine' AND deleted_at IS NULL
    LIMIT 1;
  `;

  if (items.length === 0) {
    return {
      title: 'Magazine Issue | HealthGhuru',
      description: 'Official digital health magazine edition from HealthGhuru.',
    };
  }

  const mag = items[0];
  return {
    title: `${mag.title} | HealthGhuru Digital Periodical`,
    description: mag.excerpt || mag.description || 'Verified evidence-based clinical and lifestyle reports.',
    openGraph: {
      title: mag.title,
      description: mag.excerpt || mag.description,
      images: mag.image_url ? [mag.image_url] : [],
    },
  };
}

export default async function MagazineIssuePage({ params }: MagazineSlugProps) {
  const { slug } = params;

  const items = await sql`
    SELECT *
    FROM content_items
    WHERE slug = ${slug} AND content_type = 'magazine' AND deleted_at IS NULL
    LIMIT 1;
  `;

  if (items.length === 0) {
    notFound();
  }

  const mag = items[0];
  const publishDate = new Date(mag.published_at);
  const year = mag.raw_metadata?.year || publishDate.getUTCFullYear();
  const month = mag.raw_metadata?.month || (publishDate.getUTCMonth() + 1);
  const monthName = MONTH_NAMES[month - 1] || 'Edition';

  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  // Query all published news and articles for this month
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
      AND i.published_at <= ${endDate.toISOString()}
    ORDER BY i.is_featured DESC, i.published_at DESC;
  `;

  const articles = rawArticles.map((a: any) => ({
    ...a,
    reading_time: a.duration_seconds ? Math.ceil(a.duration_seconds / 60) : 4,
  }));

  const issueVolume = mag.raw_metadata?.issueVolume || `Vol. ${year - 2022}, Issue ${month}`;
  const issueTitle = mag.title || `HealthGhuru Monthly — ${monthName} ${year} Clinical Digest`;
  const editorNote =
    mag.description ||
    `Welcome to the ${monthName} ${year} digital edition of HealthGhuru Magazine. This volume curates ${articles.length} peer-reviewed clinical articles, preventive lifestyle protocols, and wellness reports published across our portal between day 1 and the end of the month.`;

  const printUrl = `/magazines/print?year=${year}&month=${month}&autoPrint=true`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Top Banner Navigation */}
      <div className="bg-slate-950 border-b border-slate-800 py-4">
        <div className="site-container flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/magazines"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Magazine Editions</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={printUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-lg shadow-orange-500/25 transition-all"
            >
              <Download size={14} />
              <span>Download Issue PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Issue Header */}
      <div className="site-container pt-8 pb-10 space-y-6">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-amber-400" />
              <span>Official Digital Periodical &bull; {issueVolume}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white leading-tight">
              {issueTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar size={13} className="text-emerald-400" />
                <span>Published: {monthName} {year}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Layers size={13} className="text-emerald-400" />
                <span>{articles.length} Verified Stories Included</span>
              </span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-semibold">Day 1 to {new Date(year, month, 0).getDate()}</span>
            </div>

            <p className="text-sm text-slate-300/90 leading-relaxed pt-2">
              {mag.excerpt || editorNote}
            </p>
          </div>
        </div>

        {/* Magazine A4 View Container */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
              <BookOpen size={14} /> Full Digital Issue Preview (A4 Format)
            </span>
            <a
              href={printUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-orange-400 hover:underline font-bold inline-flex items-center gap-1"
            >
              <Printer size={13} /> Open Printable PDF Version
            </a>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-4 sm:p-10 flex justify-center shadow-inner">
            <div className="w-full max-w-[210mm] bg-white rounded-lg shadow-2xl overflow-hidden text-slate-900">
              <MagazinePrintView
                year={year}
                month={month}
                monthName={monthName}
                issueVolume={issueVolume}
                issueTitle={issueTitle}
                editorNote={editorNote}
                articles={articles}
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <HealthDisclaimer />
        </div>
      </div>
    </div>
  );
}
