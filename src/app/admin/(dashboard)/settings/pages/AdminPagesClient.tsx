/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Shield,
  Scale,
  AlertTriangle,
  Mail,
  Megaphone,
  Eye,
  Save,
  CheckCircle2,
  ExternalLink,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Eraser,
  Code,
  Sparkles,
  Clock,
  User,
  Monitor,
  Tablet,
  Smartphone,
  X,
  Palette,
  Check,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WebsitePageData {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  meta_description?: string;
  published_by?: string;
  updated_at?: string;
  published_at?: string;
}

const PAGE_TABS = [
  { slug: 'about-us', label: 'About Us', icon: FileText, publicUrl: '/about' },
  { slug: 'privacy-policy', label: 'Privacy Policy', icon: Shield, publicUrl: '/privacy' },
  { slug: 'terms-and-conditions', label: 'Terms & Conditions', icon: Scale, publicUrl: '/terms' },
  { slug: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle, publicUrl: '/disclaimer' },
  { slug: 'contact-us', label: 'Contact Us', icon: Mail, publicUrl: '/contact' },
  { slug: 'advertise-with-us', label: 'Advertise With Us', icon: Megaphone, publicUrl: '/advertise' },
];

const COLOR_PALETTE = [
  { name: 'Default Dark', value: '#0f172a' },
  { name: 'Emerald Primary', value: '#16a34a' },
  { name: 'Health Orange', value: '#f06d2f' },
  { name: 'Muted Slate', value: '#64748b' },
  { name: 'Medical Blue', value: '#2563eb' },
  { name: 'Alert Red', value: '#dc2626' },
  { name: 'Warning Amber', value: '#d97706' },
];

interface AdminPagesClientProps {
  initialPages: WebsitePageData[];
}

export function AdminPagesClient({ initialPages }: AdminPagesClientProps) {
  // State for loaded pages indexed by slug
  const [pages, setPages] = useState<Record<string, WebsitePageData>>(() => {
    const map: Record<string, WebsitePageData> = {};
    for (const p of initialPages) {
      map[p.slug] = p;
    }
    return map;
  });

  const [activeSlug, setActiveSlug] = useState<string>('about-us');
  const [isHtmlMode, setIsHtmlMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);

  // Editable fields for the active page
  const activePage = pages[activeSlug] || {
    slug: activeSlug,
    title: PAGE_TABS.find((t) => t.slug === activeSlug)?.label || '',
    subtitle: '',
    content: '<p>Start writing content here...</p>',
    meta_description: '',
    updated_at: new Date().toISOString(),
    published_by: 'Super Admin',
  };

  const [currentContent, setCurrentContent] = useState<string>(activePage.content);
  const [currentTitle, setCurrentTitle] = useState<string>(activePage.title);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>(activePage.subtitle || '');
  const [currentMetaDesc, setCurrentMetaDesc] = useState<string>(activePage.meta_description || '');

  const editorRef = useRef<HTMLDivElement>(null);

  // Sync state whenever activeSlug changes
  useEffect(() => {
    const p = pages[activeSlug];
    if (p) {
      setCurrentContent(p.content || '');
      setCurrentTitle(p.title || '');
      setCurrentSubtitle(p.subtitle || '');
      setCurrentMetaDesc(p.meta_description || '');
      if (editorRef.current && !isHtmlMode) {
        editorRef.current.innerHTML = p.content || '';
      }
    } else {
      const fallback = PAGE_TABS.find((t) => t.slug === activeSlug);
      setCurrentTitle(fallback?.label || '');
      setCurrentSubtitle('');
      setCurrentContent('<p>Start typing content...</p>');
      setCurrentMetaDesc('');
      if (editorRef.current && !isHtmlMode) {
        editorRef.current.innerHTML = '<p>Start typing content...</p>';
      }
    }
    setSaveSuccess(false);
    setErrorMessage(null);
  }, [activeSlug, isHtmlMode]);

  // Keep editor div in sync if visual mode is toggled on
  useEffect(() => {
    if (!isHtmlMode && editorRef.current) {
      editorRef.current.innerHTML = currentContent;
    }
  }, [isHtmlMode]);

  // Handle content changes in visual editor
  const handleEditorInput = () => {
    if (editorRef.current) {
      setCurrentContent(editorRef.current.innerHTML);
    }
  };

  // Formatting helpers using execCommand
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (isHtmlMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setCurrentContent(editorRef.current.innerHTML);
    }
  };

  const handleFormatBlock = (tag: string) => {
    if (tag === 'callout') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const text = selection.toString() || 'Important medical or policy notice here.';
        const calloutHtml = `<div class="bg-primary/5 border-l-4 border-primary p-4 rounded-r-xl my-4 text-slate-800 font-medium">${text}</div>`;
        document.execCommand('insertHTML', false, calloutHtml);
        if (editorRef.current) {
          setCurrentContent(editorRef.current.innerHTML);
        }
      }
      return;
    }
    executeCommand('formatBlock', tag);
  };

  const handleInsertLink = () => {
    const url = window.prompt('Enter link URL (e.g. https://healthghuru.com/privacy or /about):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleSetColor = (color: string) => {
    executeCommand('foreColor', color);
    setColorPickerOpen(false);
  };

  // Save & Publish handler
  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const contentToSave = isHtmlMode
        ? currentContent
        : editorRef.current?.innerHTML || currentContent;

      const res = await fetch(`/api/admin/pages/${activeSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentTitle,
          subtitle: currentSubtitle,
          content: contentToSave,
          metaDescription: currentMetaDesc,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to save page');
      }

      // Update local pages map
      setPages((prev) => ({
        ...prev,
        [activeSlug]: data.page,
      }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Save error:', err);
      setErrorMessage(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const activeTabInfo = PAGE_TABS.find((t) => t.slug === activeSlug) || PAGE_TABS[0];
  const formattedUpdatedDate = activePage.updated_at
    ? new Date(activePage.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Just now';

  return (
    <div className="space-y-6">
      {/* ── Page Header matching NewsGhuru Style ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FileText size={20} />
            </span>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
              Website Pages CMS
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage, format, and publish live content for all public-facing pages on HealthGhuru.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-heading font-semibold transition-all shadow-2xs hover:shadow-xs"
          >
            <Eye size={15} className="text-slate-600" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs sm:text-sm font-heading font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 size={15} className="text-emerald-200" />
                <span>Published!</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save &amp; Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Status Toast Alerts ── */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium shadow-xs"
          >
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>
              <strong>{currentTitle || activeTabInfo.label}</strong> has been updated and published live to the public website!
            </span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-medium shadow-xs"
          >
            <AlertTriangle size={18} className="text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation Tabs (Matching NewsGhuru Screenshot) ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-2 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 min-w-max">
          {PAGE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSlug === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => setActiveSlug(tab.slug)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Editor Container ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Page Information Bar */}
        <div className="p-5 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                {currentTitle || activeTabInfo.label}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[11px] font-mono">
                {activeTabInfo.publicUrl}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock size={12} /> Last updated: {formattedUpdatedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User size={12} /> By {activePage.published_by || 'Super Admin'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={activeTabInfo.publicUrl}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 text-xs font-heading font-medium transition-colors shadow-2xs"
            >
              <span>View Live Page</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Form Meta Fields (Page Title & SEO Meta Description) */}
        <div className="p-5 border-b border-slate-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
              Page Title
            </label>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="e.g. About Us"
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
              SEO Meta Description
            </label>
            <input
              type="text"
              value={currentMetaDesc}
              onChange={(e) => setCurrentMetaDesc(e.target.value)}
              placeholder="Search engine summary..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-800"
            />
          </div>
        </div>

        {/* ── Rich Formatting Toolbar (Matching NewsGhuru Style) ── */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1 text-slate-700">
          {/* Format Block Select */}
          <select
            onChange={(e) => handleFormatBlock(e.target.value)}
            defaultValue="p"
            disabled={isHtmlMode}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-heading font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-40"
          >
            <option value="p">Normal Text</option>
            <option value="h1">Heading 1 (Main)</option>
            <option value="h2">Heading 2 (Section)</option>
            <option value="h3">Heading 3 (Subsection)</option>
            <option value="h4">Heading 4</option>
            <option value="callout">Callout Box (Highlight)</option>
            <option value="blockquote">Quote Block</option>
          </select>

          <div className="h-5 w-px bg-slate-300 mx-1" />

          {/* Basic Text Styling */}
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            disabled={isHtmlMode}
            title="Bold (Ctrl+B)"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <Bold size={15} />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('italic')}
            disabled={isHtmlMode}
            title="Italic (Ctrl+I)"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <Italic size={15} />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('underline')}
            disabled={isHtmlMode}
            title="Underline (Ctrl+U)"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <Underline size={15} />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            disabled={isHtmlMode}
            title="Strikethrough"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <Strikethrough size={15} />
          </button>

          <div className="h-5 w-px bg-slate-300 mx-1" />

          {/* Text Color Picker Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setColorPickerOpen((o) => !o)}
              disabled={isHtmlMode}
              title="Text Color"
              className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <Palette size={15} />
            </button>

            {colorPickerOpen && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-xl shadow-xl border border-slate-200 z-30 flex flex-col gap-1 w-44">
                <p className="text-[10px] font-heading font-bold text-slate-400 px-2 uppercase">
                  Select Text Color
                </p>
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleSetColor(c.value)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 text-xs font-medium text-slate-700 w-full text-left"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: c.value }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-slate-300 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            disabled={isHtmlMode}
            title="Bulleted List"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <List size={15} />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            disabled={isHtmlMode}
            title="Numbered List"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <ListOrdered size={15} />
          </button>

          <div className="h-5 w-px bg-slate-300 mx-1" />

          {/* Alignment */}
          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            disabled={isHtmlMode}
            title="Align Left"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <AlignLeft size={15} />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            disabled={isHtmlMode}
            title="Align Center"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <AlignCenter size={15} />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            disabled={isHtmlMode}
            title="Align Right"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <AlignRight size={15} />
          </button>

          <div className="h-5 w-px bg-slate-300 mx-1" />

          {/* Insert Link & Clean formatting */}
          <button
            type="button"
            onClick={handleInsertLink}
            disabled={isHtmlMode}
            title="Insert Link"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <LinkIcon size={15} />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            disabled={isHtmlMode}
            title="Clear Formatting"
            className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 transition-colors"
          >
            <Eraser size={15} />
          </button>

          {/* Switch Visual / Code mode */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!isHtmlMode && editorRef.current) {
                  setCurrentContent(editorRef.current.innerHTML);
                }
                setIsHtmlMode((m) => !m);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                isHtmlMode
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Code size={14} />
              <span>{isHtmlMode ? 'Visual Editor' : 'HTML Code'}</span>
            </button>
          </div>
        </div>

        {/* ── Content Canvas Area ── */}
        <div className="min-h-[480px] p-6 sm:p-10 bg-white">
          {isHtmlMode ? (
            <textarea
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              rows={22}
              className="w-full p-4 font-mono text-xs sm:text-sm bg-slate-900 text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed border border-slate-800"
              placeholder="Enter HTML markup directly..."
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              suppressContentEditableWarning
              className="outline-none min-h-[400px] text-slate-800 leading-relaxed text-sm sm:text-base selection:bg-emerald-100 selection:text-emerald-900 prose prose-slate max-w-none
                [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mb-4 [&_h1]:mt-6
                [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_h2]:mt-6
                [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-5
                [&_h4]:font-heading [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-slate-900 [&_h4]:mb-2 [&_h4]:mt-4
                [&_p]:mb-4 [&_p]:text-slate-600 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5 [&_ul_li]:text-slate-600
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5 [&_ol_li]:text-slate-600
                [&_a]:text-emerald-600 [&_a]:underline [&_a]:font-medium hover:[&_a]:text-emerald-700
                [&_strong]:text-slate-900 [&_strong]:font-bold
                [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-700 [&_blockquote]:my-4"
            />
          )}
        </div>

        {/* ── Footer Publish Action Bar ── */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            <span>Slug: </span>
            <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono">
              {activeSlug}
            </code>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-heading font-semibold transition-colors"
            >
              <Eye size={14} />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndPublish}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-heading font-bold shadow-sm transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save &amp; Publish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Responsive Live Preview Modal ── */}
      <AnimatePresence>
        {previewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Modal Top Control Bar */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-heading font-bold text-sm">
                    Live Page Preview: {currentTitle || activeTabInfo.label}
                  </span>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center bg-slate-800 rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                      previewDevice === 'desktop' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Desktop (100%)"
                  >
                    <Monitor size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                      previewDevice === 'tablet' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tablet (768px)"
                  >
                    <Tablet size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                      previewDevice === 'mobile' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Mobile (420px)"
                  >
                    <Smartphone size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Preview Body */}
              <div className="flex-1 bg-slate-100 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
                <div
                  className={`bg-white rounded-2xl shadow-md border border-slate-200 transition-all duration-300 overflow-hidden ${
                    previewDevice === 'desktop'
                      ? 'w-full max-w-4xl'
                      : previewDevice === 'tablet'
                      ? 'w-[768px]'
                      : 'w-[420px]'
                  }`}
                >
                  {/* Mock Public Website Header */}
                  <div className="bg-[#0F172A] text-white p-4 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-display font-extrabold text-white">
                        Health<span className="text-emerald-500">Ghuru</span>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      Preview: {activeTabInfo.publicUrl}
                    </span>
                  </div>

                  {/* Public Page Content */}
                  <div className="p-6 sm:p-12">
                    <div className="mb-6 pb-6 border-b border-slate-200">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-heading font-semibold mb-3">
                        <Sparkles size={13} />
                        <span>HealthGhuru Public Page</span>
                      </div>
                      <h1 className="font-display text-2xl sm:text-4xl text-slate-900 font-extrabold mb-2">
                        {currentTitle || activeTabInfo.label}
                      </h1>
                      {currentSubtitle && (
                        <p className="text-slate-600 text-sm sm:text-base">
                          {currentSubtitle}
                        </p>
                      )}
                    </div>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: isHtmlMode
                          ? currentContent
                          : editorRef.current?.innerHTML || currentContent,
                      }}
                      className="text-slate-700 leading-relaxed text-sm sm:text-base
                        [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mb-4 [&_h1]:mt-6
                        [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_h2]:mt-6
                        [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-5
                        [&_p]:mb-4 [&_p]:text-slate-600 [&_p]:leading-relaxed
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5 [&_ul_li]:text-slate-600
                        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5 [&_ol_li]:text-slate-600
                        [&_a]:text-emerald-600 [&_a]:underline [&_a]:font-medium
                        [&_strong]:text-slate-900 [&_strong]:font-bold"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
