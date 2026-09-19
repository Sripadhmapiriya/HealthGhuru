'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Save,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  Search,
  Plus,
  LayoutGrid,
  Sidebar as SidebarIcon,
  Flame,
  Award,
  CheckCircle2,
} from 'lucide-react';
import {
  HomepageBuilderConfig,
  TrendingStoryPin,
} from '@/lib/types/homepage-builder';

interface ContentItemSummary {
  id: string;
  title: string;
  slug: string;
  category: string;
  image_url?: string;
  published_at: string;
  view_count?: number;
  subcategory?: string;
}

interface HomepageBuilderClientProps {
  initialConfig: HomepageBuilderConfig;
  articles: ContentItemSummary[];
  shorts?: ContentItemSummary[];
}

export function HomepageBuilderClient({
  initialConfig,
  articles,
}: HomepageBuilderClientProps) {
  // Normalize config sections to guarantee clean title
  const normalizedInitial = useMemo(() => {
    return {
      ...initialConfig,
      sections: initialConfig.sections.map((s) => ({
        ...s,
        title: s.title || s.englishTitle || s.primaryTitle || 'Section',
      })),
      sidebarWidgets: initialConfig.sidebarWidgets.map((w) => ({
        ...w,
        title: w.title || w.englishTitle || w.primaryTitle || 'Widget',
      })),
    };
  }, [initialConfig]);

  // Config state
  const [config, setConfig] = useState<HomepageBuilderConfig>(normalizedInitial);
  const [activeTab, setActiveTab] = useState<'sections' | 'sidebar' | 'trending'>('sections');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Search filters
  const [heroSearch, setHeroSearch] = useState('');
  const [trendingSearch, setTrendingSearch] = useState('');

  // Auto-dismiss toast
  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Save config
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/homepage-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Homepage configuration saved successfully!');
      } else {
        showToast('error', data.error || 'Failed to save configuration');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error saving configuration');
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------------------------------
  // SECTION MANAGER HANDLERS
  // ----------------------------------------------------
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    newSections.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setConfig({ ...config, sections: newSections });
  };

  const toggleSectionEnabled = (index: number) => {
    const newSections = [...config.sections];
    newSections[index].enabled = !newSections[index].enabled;
    setConfig({ ...config, sections: newSections });
  };

  const updateSectionTitle = (index: number, val: string) => {
    const newSections = [...config.sections];
    newSections[index].title = val;
    newSections[index].englishTitle = val;
    newSections[index].primaryTitle = val;
    setConfig({ ...config, sections: newSections });
  };

  // ----------------------------------------------------
  // RIGHT SIDEBAR HANDLERS
  // ----------------------------------------------------
  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...config.sidebarWidgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;

    const temp = newWidgets[index];
    newWidgets[index] = newWidgets[targetIndex];
    newWidgets[targetIndex] = temp;

    newWidgets.forEach((w, idx) => {
      w.order = idx + 1;
    });

    setConfig({ ...config, sidebarWidgets: newWidgets });
  };

  const toggleWidgetEnabled = (index: number) => {
    const newWidgets = [...config.sidebarWidgets];
    newWidgets[index].enabled = !newWidgets[index].enabled;
    setConfig({ ...config, sidebarWidgets: newWidgets });
  };

  const updateWidgetTitle = (index: number, val: string) => {
    const newWidgets = [...config.sidebarWidgets];
    newWidgets[index].title = val;
    newWidgets[index].englishTitle = val;
    newWidgets[index].primaryTitle = val;
    setConfig({ ...config, sidebarWidgets: newWidgets });
  };

  // ----------------------------------------------------
  // TRENDING STORIES HANDLERS
  // ----------------------------------------------------
  const addTrendingStory = (article: ContentItemSummary) => {
    const alreadyPinned = config.pinnedTrending.some((p) => p.id === article.id);
    if (alreadyPinned) return;

    const newPinned: TrendingStoryPin[] = [
      ...config.pinnedTrending,
      {
        id: article.id,
        title: article.title,
        category: article.category,
        rank: config.pinnedTrending.length + 1,
      },
    ];

    setConfig({ ...config, pinnedTrending: newPinned });
  };

  const removeTrendingStory = (id: string) => {
    const newPinned = config.pinnedTrending
      .filter((p) => p.id !== id)
      .map((p, idx) => ({ ...p, rank: idx + 1 }));
    setConfig({ ...config, pinnedTrending: newPinned });
  };

  const moveTrendingStory = (index: number, direction: 'up' | 'down') => {
    const newPinned = [...config.pinnedTrending];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPinned.length) return;

    const temp = newPinned[index];
    newPinned[index] = newPinned[targetIndex];
    newPinned[targetIndex] = temp;

    newPinned.forEach((p, idx) => {
      p.rank = idx + 1;
    });

    setConfig({ ...config, pinnedTrending: newPinned });
  };

  // ----------------------------------------------------
  // FILTERED DATA
  // ----------------------------------------------------
  const filteredHeroArticles = useMemo(() => {
    if (!heroSearch.trim()) return articles.slice(0, 15);
    const q = heroSearch.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.category && a.category.toLowerCase().includes(q))
    );
  }, [articles, heroSearch]);

  const filteredTrendingPool = useMemo(() => {
    const pinnedIds = new Set(config.pinnedTrending.map((p) => p.id));
    const available = articles.filter((a) => !pinnedIds.has(a.id));
    if (!trendingSearch.trim()) return available.slice(0, 15);
    const q = trendingSearch.toLowerCase();
    return available.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.category && a.category.toLowerCase().includes(q))
    );
  }, [articles, config.pinnedTrending, trendingSearch]);

  const selectedHeroArticle = useMemo(() => {
    if (!config.heroStoryId) return null;
    return articles.find((a) => a.id === config.heroStoryId) || null;
  }, [articles, config.heroStoryId]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16 font-body">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-semibold transition-all ${
            toastMessage.type === 'success'
              ? 'bg-primary text-white shadow-primary/30'
              : 'bg-rose-600 text-white shadow-rose-600/30'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* HEADER BAR IN HEALTHGHURU THEME */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <Wrench size={22} />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-dark tracking-tight flex items-center gap-2">
              Dynamic Homepage & Sidebar Builder
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Customize homepage flow, sections, pinned stories, and right sidebar widgets dynamically
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Save Configuration Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-heading font-bold text-sm shadow-sm hover:shadow-md hover:shadow-primary/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS (Sections, Sidebar, Trending) */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all duration-150 cursor-pointer shrink-0 ${
            activeTab === 'sections'
              ? 'bg-primary text-white shadow-xs'
              : 'text-text-secondary hover:text-dark hover:bg-surface border border-transparent'
          }`}
        >
          <LayoutGrid size={16} />
          <span>Homepage Sections</span>
        </button>

        <button
          onClick={() => setActiveTab('sidebar')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all duration-150 cursor-pointer shrink-0 ${
            activeTab === 'sidebar'
              ? 'bg-primary text-white shadow-xs'
              : 'text-text-secondary hover:text-dark hover:bg-surface border border-transparent'
          }`}
        >
          <SidebarIcon size={16} />
          <span>Right Sidebar Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('trending')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all duration-150 cursor-pointer shrink-0 ${
            activeTab === 'trending'
              ? 'bg-primary text-white shadow-xs'
              : 'text-text-secondary hover:text-dark hover:bg-surface border border-transparent'
          }`}
        >
          <Flame size={16} />
          <span>Trending News Manager</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HOMEPAGE SECTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'sections' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: HERO STORY SELECTOR */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-primary" />
                  <h2 className="font-heading font-extrabold text-base text-dark">
                    Hero Story
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wide">
                  PRIMARY LEAD
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Choose the primary large story displayed at the top of the homepage.
              </p>

              {/* Search Bar */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Select dropdown */}
              <select
                value={config.heroStoryId || ''}
                onChange={(e) =>
                  setConfig({ ...config, heroStoryId: e.target.value || null })
                }
                className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-xs text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
              >
                <option value="">-- Select Hero Article (Automatic Lead) --</option>
                {filteredHeroArticles.map((article) => (
                  <option key={article.id} value={article.id}>
                    [{article.category || 'General'}] {article.title}
                  </option>
                ))}
              </select>

              {/* Selected Hero Preview */}
              {selectedHeroArticle ? (
                <div className="bg-emerald-50/60 rounded-xl p-3 border border-primary/20 flex items-start gap-3">
                  {selectedHeroArticle.image_url && (
                    <img
                      src={selectedHeroArticle.image_url}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg shrink-0 border border-emerald-200"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-primary uppercase">
                      PINNED HERO • {selectedHeroArticle.category}
                    </span>
                    <h4 className="text-xs font-heading font-bold text-dark line-clamp-2 mt-0.5">
                      {selectedHeroArticle.title}
                    </h4>
                    <button
                      onClick={() => setConfig({ ...config, heroStoryId: null })}
                      className="mt-2 text-[10px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                    >
                      Reset to Auto Lead
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-surface border border-border text-[11px] text-text-secondary">
                  Currently set to <span className="text-primary font-semibold">Automatic</span> (latest top clinical story).
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: HOMEPAGE SECTION MANAGER */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <LayoutGrid size={18} className="text-primary" />
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-dark">
                  Homepage Section Manager
                </h2>
              </div>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
                {config.sections.filter((s) => s.enabled).length} ACTIVE SECTIONS
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Hide, rename, and arrange the flow order of the homepage sections.
            </p>

            {/* List of Sections */}
            <div className="space-y-3 pt-2">
              {config.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all ${
                    section.enabled
                      ? 'bg-white border-border hover:border-primary/40 shadow-xs'
                      : 'bg-surface border-border/50 opacity-60'
                  }`}
                >
                  {/* Left: Checkbox */}
                  <div className="flex items-center shrink-0">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => toggleSectionEnabled(index)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                  </div>

                  {/* Middle: Title Input & Block Badge */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionTitle(index, e.target.value)}
                      placeholder="Section Title"
                      className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-dark font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        BLOCK ID: {section.blockId}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">
                        #{section.order}
                      </span>
                    </div>
                  </div>

                  {/* Right: Reordering Arrows */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSection(index, 'up')}
                      className="p-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-dark hover:bg-surface-alt disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === config.sections.length - 1}
                      onClick={() => moveSection(index, 'down')}
                      className="p-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-dark hover:bg-surface-alt disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RIGHT SIDEBAR MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'sidebar' && (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <SidebarIcon size={18} className="text-primary" />
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-dark">
                Right Sidebar Widget Manager
              </h2>
            </div>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
              {config.sidebarWidgets.filter((w) => w.enabled).length} ACTIVE WIDGETS
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            Enable/Disable, rename, and change the ordering flow of right sidebar widgets dynamically without touching code.
          </p>

          <div className="space-y-3 pt-2">
            {config.sidebarWidgets.map((widget, index) => {
              const badgeClasses: Record<string, string> = {
                ad: 'bg-orange-50 text-orange-700 border-orange-200',
                trending: 'bg-rose-50 text-rose-700 border-rose-200',
                mostRead: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                newsletter: 'bg-blue-50 text-blue-700 border-blue-200',
                poll: 'bg-purple-50 text-purple-700 border-purple-200',
              };

              const typeLabels: Record<string, string> = {
                ad: 'ADVERTISEMENT',
                trending: 'TRENDING NEWS',
                mostRead: 'MOST READ',
                newsletter: 'NEWSLETTER BRIEFING',
                poll: 'HEALTH POLL',
              };

              return (
                <div
                  key={widget.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-4 rounded-xl border transition-all ${
                    widget.enabled
                      ? 'bg-white border-border hover:border-primary/40 shadow-xs'
                      : 'bg-surface border-border/50 opacity-60'
                  }`}
                >
                  {/* Left: Checkbox */}
                  <div className="flex items-center shrink-0">
                    <input
                      type="checkbox"
                      checked={widget.enabled}
                      onChange={() => toggleWidgetEnabled(index)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                  </div>

                  {/* Middle: Badges and Title Input */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded border ${
                          badgeClasses[widget.type] || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {typeLabels[widget.type] || widget.type}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">
                        Widget ID: {widget.widgetId}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={widget.title}
                      onChange={(e) => updateWidgetTitle(index, e.target.value)}
                      placeholder="Widget Title"
                      className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-dark font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Right: Reorder */}
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveWidget(index, 'up')}
                      className="p-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-dark hover:bg-surface-alt disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === config.sidebarWidgets.length - 1}
                      onClick={() => moveWidget(index, 'down')}
                      className="p-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-dark hover:bg-surface-alt disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TRENDING NEWS MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'trending' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: CURRENT PINNED TRENDING STORIES (01 to 05) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-primary" />
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-dark">
                  Current Pinned Trending Stories
                </h2>
              </div>
              <span className="text-[10px] font-mono text-text-muted font-semibold">
                {config.pinnedTrending.length} PINNED
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              These articles will be ranked 01 to 05 on the website sidebar in this exact order.
            </p>

            {config.pinnedTrending.length === 0 ? (
              <div className="p-8 text-center bg-surface rounded-xl border border-dashed border-border text-text-muted text-xs">
                No custom pinned stories. The homepage will automatically rank stories by views and trending metrics. Use the panel on the right to pin specific articles.
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {config.pinnedTrending.map((story, index) => {
                  const rankStr = String(story.rank || index + 1).padStart(2, '0');
                  return (
                    <div
                      key={story.id}
                      className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-border hover:border-primary/30 shadow-xs"
                    >
                      {/* Big Bold Rank Number */}
                      <span className="font-display font-black text-2xl text-primary shrink-0 w-8">
                        {rankStr}
                      </span>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {story.category && (
                          <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wide block">
                            {story.category}
                          </span>
                        )}
                        <h4 className="text-xs font-heading font-bold text-dark line-clamp-2 leading-snug">
                          {story.title}
                        </h4>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveTrendingStory(index, 'up')}
                          className="p-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-dark hover:bg-surface-alt disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={index === config.pinnedTrending.length - 1}
                          onClick={() => moveTrendingStory(index, 'down')}
                          className="p-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-dark hover:bg-surface-alt disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ChevronDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTrendingStory(story.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: ADD STORIES TO PINNED TRENDING */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-primary" />
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-dark">
                  + Add Stories to Pinned Trending
                </h2>
              </div>
            </div>
            <p className="text-xs text-text-secondary">
              Search published news articles and click &apos;Add&apos; to pin them to the trending list.
            </p>

            {/* Search Input */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={trendingSearch}
                onChange={(e) => setTrendingSearch(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Scrollable list */}
            <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1 divide-y divide-border/60">
              {filteredTrendingPool.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between gap-3 pt-2.5 first:pt-0"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-primary font-bold uppercase">
                      [{article.category || 'General'}]
                    </span>
                    <h4 className="text-xs text-dark line-clamp-2 leading-snug font-medium">
                      {article.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => addTrendingStory(article)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
