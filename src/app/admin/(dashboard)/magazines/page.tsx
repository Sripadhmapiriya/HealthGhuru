/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  Sparkles,
  Eye,
  Send,
  RefreshCw,
  Layers,
  ChevronRight,
  ExternalLink,
  CheckSquare,
  Square,
  AlertCircle,
  Sliders,
  Share2,
} from 'lucide-react';
import { MagazineReaderModal } from '@/components/admin/magazine/MagazineReaderModal';

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

export default function AdminMagazinesPage() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September (1-indexed)

  const [availableMonths, setAvailableMonths] = useState<any[]>([]);
  const [loadingMonths, setLoadingMonths] = useState(true);

  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'article' | 'news'>('all');
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticleIds, setSelectedArticleIds] = useState<Set<string>>(new Set());
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Magazine Metadata Customization
  const [issueVolume, setIssueVolume] = useState('Vol. 4, Issue 9');
  const [issueTitle, setIssueTitle] = useState('HealthGhuru Monthly — September 2026 Clinical Digest');
  const [editorNote, setEditorNote] = useState('');
  const [coverArticleId, setCoverArticleId] = useState<string>('');

  // Modals & States
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch Available Months on mount
  useEffect(() => {
    async function fetchAvailableMonths() {
      try {
        setLoadingMonths(true);
        const res = await fetch('/api/admin/magazine/articles');
        const data = await res.json();
        if (data.success && Array.isArray(data.months)) {
          setAvailableMonths(data.months);
          if (data.months.length > 0) {
            const first = data.months[0];
            setSelectedYear(Number(first.year));
            setSelectedMonth(Number(first.month));
          }
        }
      } catch (err) {
        console.error('Failed to fetch available months:', err);
      } finally {
        setLoadingMonths(false);
      }
    }
    fetchAvailableMonths();
  }, []);

  // Fetch articles whenever selectedYear, selectedMonth or contentTypeFilter changes
  useEffect(() => {
    async function fetchArticlesForMonth() {
      try {
        setLoadingArticles(true);
        setPublishMessage(null);
        const res = await fetch(
          `/api/admin/magazine/articles?year=${selectedYear}&month=${selectedMonth}&type=${contentTypeFilter}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.articles)) {
          setArticles(data.articles);
          // By default, select all articles from this month
          setSelectedArticleIds(new Set(data.articles.map((a: any) => a.id)));
          if (data.articles.length > 0) {
            setCoverArticleId(data.articles[0].id);
          }

          const mName = MONTH_NAMES[selectedMonth - 1] || 'Monthly';
          setIssueVolume(`Vol. ${selectedYear - 2022}, Issue ${selectedMonth}`);
          setIssueTitle(`HealthGhuru Monthly — ${mName} ${selectedYear} Clinical Digest`);
          setEditorNote(
            `Welcome to the ${mName} ${selectedYear} digital edition of HealthGhuru Magazine. This volume curates ${data.articles.length} peer-reviewed clinical articles, preventive lifestyle protocols, and wellness reports published between day 1 and the end of the month.`
          );
        } else {
          setArticles([]);
          setSelectedArticleIds(new Set());
        }
      } catch (err) {
        console.error('Failed to fetch articles for month:', err);
        setArticles([]);
      } finally {
        setLoadingArticles(false);
      }
    }

    fetchArticlesForMonth();
  }, [selectedYear, selectedMonth, contentTypeFilter]);

  // Active articles filtered by selection
  const activeArticles = useMemo(() => {
    const selectedList = articles.filter((a) => selectedArticleIds.has(a.id));
    if (coverArticleId) {
      const coverIdx = selectedList.findIndex((a) => a.id === coverArticleId);
      if (coverIdx > 0) {
        const [coverItem] = selectedList.splice(coverIdx, 1);
        selectedList.unshift(coverItem);
      }
    }
    return selectedList;
  }, [articles, selectedArticleIds, coverArticleId]);

  const monthName = MONTH_NAMES[selectedMonth - 1] || 'Current';

  // Toggle single article selection
  const toggleArticle = (id: string) => {
    const updated = new Set(selectedArticleIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedArticleIds(updated);
  };

  // Select all or none
  const toggleSelectAll = () => {
    if (selectedArticleIds.size === articles.length) {
      setSelectedArticleIds(new Set());
    } else {
      setSelectedArticleIds(new Set(articles.map((a) => a.id)));
    }
  };

  // Trigger Print / PDF Download (Opens clean full-page multi-page print document)
  const handlePrintPdf = () => {
    window.open(
      `/magazines/print?year=${selectedYear}&month=${selectedMonth}&autoPrint=true`,
      '_blank'
    );
  };

  // Export articles as JSON
  const handleExportJson = () => {
    const exportData = {
      magazine_title: issueTitle,
      volume: issueVolume,
      year: selectedYear,
      month: selectedMonth,
      month_name: monthName,
      exported_at: new Date().toISOString(),
      total_articles: activeArticles.length,
      editor_note: editorNote,
      articles: activeArticles,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HealthGhuru-Magazine-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Publish compiled magazine to public `/magazines` shelf
  const handlePublishToShelf = async () => {
    if (activeArticles.length === 0) {
      setPublishMessage({
        type: 'error',
        text: 'Please select at least one article to publish a magazine edition.',
      });
      return;
    }

    try {
      setIsPublishing(true);
      setPublishMessage(null);

      const slug = `healthghuru-magazine-${selectedYear}-${monthName.toLowerCase()}`;
      const coverImage = activeArticles[0]?.image_url || '/images/fitness_pillar.png';

      const res = await fetch('/api/admin/magazine/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: issueTitle,
          slug,
          excerpt: `Official ${monthName} ${selectedYear} monthly digital digest featuring ${activeArticles.length} clinical reports, preventive living guides, and research updates.`,
          description: editorNote,
          image_url: coverImage,
          published_at: new Date(Date.UTC(selectedYear, selectedMonth - 1, 1)).toISOString(),
          category: 'Monthly Periodical',
          author_name: 'HealthGhuru Editorial Board',
          raw_metadata: {
            issueVolume,
            year: selectedYear,
            month: selectedMonth,
            monthName,
            articleCount: activeArticles.length,
            articleIds: activeArticles.map((a) => a.id),
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPublishMessage({
          type: 'success',
          text: `Success! "${issueTitle}" has been published to the public /magazines shelf.`,
        });
      } else {
        setPublishMessage({
          type: 'error',
          text: data.error || 'Failed to publish magazine.',
        });
      }
    } catch (err: any) {
      console.error('Error publishing magazine:', err);
      setPublishMessage({
        type: 'error',
        text: err.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Screen Admin UI */}
      <div className="space-y-8">
        {/* Header Title & Status */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-amber-400" />
              <span>HealthGhuru Digital Periodicals</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              Monthly Magazine Generator &amp; Publisher
            </h1>
            <p className="text-sm text-emerald-100/80 max-w-2xl">
              Select any month (Day 1 to 31, repeatable for all months) to automatically convert published website articles into a formatted A4 Digital Magazine with cover, table of contents, and 1-click PDF download.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsReaderOpen(true)}
              disabled={activeArticles.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              <Eye size={15} />
              <span>Preview Digital Reader</span>
            </button>

            <button
              onClick={() =>
                window.open(
                  `/magazines/print?year=${selectedYear}&month=${selectedMonth}&autoPrint=true`,
                  '_blank'
                )
              }
              disabled={activeArticles.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/40 text-white text-xs font-bold transition-all disabled:opacity-50"
              title="Open full-page clean print preview in new tab"
            >
              <ExternalLink size={14} />
              <span>Clean Print Tab</span>
            </button>

            <button
              onClick={handlePrintPdf}
              disabled={activeArticles.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50"
            >
              <Printer size={15} />
              <span>Download Magazine PDF</span>
            </button>
          </div>
        </div>

        {/* Month & Year Selection Bar */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <h2 className="font-heading font-bold text-dark text-base">
                Select Month &amp; Timeframe (Day 1 to 31)
              </h2>
            </div>

            {/* Filter by Type & Year Selector */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Content Type Filter */}
              <div className="flex bg-surface rounded-xl p-1 border border-border">
                {[
                  { key: 'all', label: 'All Content' },
                  { key: 'article', label: 'Articles' },
                  { key: 'news', label: 'News' },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setContentTypeFilter(t.key as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      contentTypeFilter === t.key
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-text-secondary hover:text-dark'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Year Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-muted">Year:</span>
                <div className="flex bg-surface rounded-xl p-1 border border-border">
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedYear === y
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-text-secondary hover:text-dark'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 12 Months Grid */}
          <div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2.5">
              Available Months (Repeatable for all months of the year):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {MONTH_NAMES.map((m, idx) => {
                const monthNum = idx + 1;
                const isSelected = selectedMonth === monthNum;
                const matchFound = availableMonths.find(
                  (am) => Number(am.year) === selectedYear && Number(am.month) === monthNum
                );
                const count = matchFound ? Number(matchFound.article_count) : 0;

                return (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(monthNum)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1 ${
                      isSelected
                        ? 'bg-gradient-to-b from-emerald-600 to-teal-700 border-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20'
                        : count > 0
                        ? 'bg-emerald-50/50 border-emerald-200/80 text-dark hover:border-emerald-400'
                        : 'bg-surface/50 border-border/60 text-text-muted hover:border-border'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight">{m.slice(0, 3)}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : count > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {count} arts
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeframe Info & Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50 text-xs text-text-secondary bg-surface/40 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="font-bold text-dark">Active Date Window:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-border">
                {selectedYear}-{String(selectedMonth).padStart(2, '0')}-01 &mdash;{' '}
                {selectedYear}-{String(selectedMonth).padStart(2, '0')}-
                {new Date(selectedYear, selectedMonth, 0).getDate()} (Day 1 to{' '}
                {new Date(selectedYear, selectedMonth, 0).getDate()})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span>
                Articles Found: <strong className="text-emerald-700">{articles.length}</strong>
              </span>
              <span>&bull;</span>
              <span>
                Selected for Magazine:{' '}
                <strong className="text-orange-600">{activeArticles.length}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Magazine Metadata Customization */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Sliders size={18} className="text-primary" />
            <h2 className="font-heading font-bold text-dark text-base">
              Magazine Edition Details &amp; Customization
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark uppercase tracking-wider">
                Issue Volume / Serial No.
              </label>
              <input
                type="text"
                value={issueVolume}
                onChange={(e) => setIssueVolume(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface/30 text-sm font-medium text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. Vol. 4, Issue 9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark uppercase tracking-wider">
                Magazine Cover Title / Headline
              </label>
              <input
                type="text"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface/30 text-sm font-medium text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. HealthGhuru Monthly — September 2026 Clinical Digest"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark uppercase tracking-wider">
              Letter from the Editor / Editorial Foreword
            </label>
            <textarea
              rows={3}
              value={editorNote}
              onChange={(e) => setEditorNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface/30 text-xs sm:text-sm font-normal text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Editorial introduction outlining this month's scientific breakthroughs, preventive health themes, and clinical guidance."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark uppercase tracking-wider">
                Cover Story Article (Page 1 Spotlight)
              </label>
              <select
                value={coverArticleId}
                onChange={(e) => setCoverArticleId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface/30 text-xs sm:text-sm font-medium text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {articles.map((art) => (
                  <option key={art.id} value={art.id}>
                    [{art.category || 'Article'}] {art.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                onClick={handlePublishToShelf}
                disabled={isPublishing || activeArticles.length === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
              >
                {isPublishing ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                <span>Publish to Public /magazines Shelf</span>
              </button>

              <button
                onClick={handleExportJson}
                disabled={activeArticles.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-50"
                title="Download raw articles data as JSON"
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {publishMessage && (
            <div
              className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                publishMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {publishMessage.type === 'success' ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
              )}
              <span className="flex-1">{publishMessage.text}</span>
              {publishMessage.type === 'success' && (
                <a
                  href="/magazines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold flex items-center gap-1 ml-auto"
                >
                  View Public Shelf <ExternalLink size={12} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Articles List & Selection Table */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              <h2 className="font-heading font-bold text-dark text-base">
                Published Articles in {monthName} {selectedYear} ({articles.length})
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                {selectedArticleIds.size === articles.length ? (
                  <>
                    <Square size={14} />
                    <span>Deselect All</span>
                  </>
                ) : (
                  <>
                    <CheckSquare size={14} />
                    <span>Select All ({articles.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {loadingArticles ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw size={24} className="animate-spin text-primary mx-auto" />
              <p className="text-xs text-text-muted">
                Scanning published database articles for {monthName} {selectedYear}...
              </p>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-12 text-center bg-surface/40 rounded-xl border border-dashed border-border space-y-2">
              <FileText size={32} className="text-slate-300 mx-auto" />
              <h4 className="font-bold text-dark text-sm">
                No Published Articles Found for {monthName} {selectedYear}
              </h4>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Articles published between Day 1 and Day{' '}
                {new Date(selectedYear, selectedMonth, 0).getDate()} will automatically populate here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {articles.map((art) => {
                const isSelected = selectedArticleIds.has(art.id);
                const isCover = art.id === coverArticleId;

                return (
                  <div
                    key={art.id}
                    onClick={() => toggleArticle(art.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3.5 items-start ${
                      isSelected
                        ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                        : 'bg-white border-border/70 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      {isSelected ? (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      ) : (
                        <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300" />
                      )}
                    </div>

                    {art.image_url ? (
                      <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={art.image_url}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.2 rounded-full">
                          {art.category || 'Clinical'}
                        </span>
                        {isCover && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.2 rounded-full">
                            ★ Cover Story
                          </span>
                        )}
                        <span className="text-[10px] text-text-muted ml-auto">
                          {new Date(art.published_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-xs text-dark line-clamp-1 leading-snug">
                        {art.title}
                      </h4>

                      <p className="text-[11px] text-text-secondary line-clamp-1">
                        {art.excerpt || art.description}
                      </p>

                      <div className="text-[10px] text-text-muted">
                        By {art.author_name || 'Staff Editor'} &bull; {art.reading_time || 4} min read
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Flipbook/Reader Modal */}
      <MagazineReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        onDownloadPdf={handlePrintPdf}
        year={selectedYear}
        month={selectedMonth}
        monthName={monthName}
        issueVolume={issueVolume}
        issueTitle={issueTitle}
        editorNote={editorNote}
        articles={activeArticles}
      />
    </div>
  );
}
