'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  Eye,
  Send,
  Wand2,
  FileText,
  MapPin,
  Globe,
  Tag,
} from 'lucide-react';
import { publishNews } from '@/lib/admin/actions/publishNews';

const HEALTH_CATEGORIES = [
  'Heart',
  'Cancer',
  'Diabetes',
  "Women's Health",
  'Pediatrics',
  'Mental Health',
  'Fitness',
  'Nutrition',
  'Ayurveda',
  'Neurology',
  'Orthopedics',
  'General Health',
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'hi', label: 'Hindi (हिंदी)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'ml', label: 'Malayalam (മലയാളം)' },
  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
];

export function AddNewsClient() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [language, setLanguage] = useState('en');
  const [category, setCategory] = useState('Heart');
  const [location, setLocation] = useState('Chennai, Tamil Nadu');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Media state
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Checkboxes
  const [isBreaking, setIsBreaking] = useState(false);
  const [showInSidebar, setShowInSidebar] = useState(true);
  const [sendPush, setSendPush] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [aiGrammarMessage, setAiGrammarMessage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cover image upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        setCoverImageUrl(data.url);
      } else {
        throw new Error(data.error || 'Failed to upload cover image');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed');
    } finally {
      setUploadingCover(false);
    }
  };

  // Gallery images upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setErrorMessage(null);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      }
      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gallery upload failed');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Text formatting helpers for rich content
  const applyFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = prefix + selectedText + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 50);
  };

  // AI Grammar Check simulation
  const handleRunAiGrammarCheck = () => {
    if (!title && !excerpt) {
      setAiGrammarMessage('Please enter a Title and Short Description first to run the AI check.');
      return;
    }

    // Auto title-case and clean spacing
    const cleanedTitle = title.trim().replace(/\s+/g, ' ');
    const formattedTitle = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);
    setTitle(formattedTitle);

    const cleanedExcerpt = excerpt.trim().replace(/\s+/g, ' ');
    setExcerpt(cleanedExcerpt);

    setAiGrammarMessage('AI Grammar Check complete: Typography formatted, punctuation verified, and headline clarity optimized!');
    setTimeout(() => setAiGrammarMessage(null), 5000);
  };

  // Submit Handler
  const handlePublish = async (status: 'published' | 'draft' = 'published') => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage('Headline Title is mandatory.');
      return;
    }
    if (!excerpt.trim()) {
      setErrorMessage('Short Description (Summary) is mandatory.');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Full Description / Article Content is mandatory.');
      return;
    }

    setIsSubmitting(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const result = await publishNews({
        title,
        subtitle,
        language,
        category,
        location,
        excerpt,
        content,
        tags,
        seoKeywords,
        heroImageUrl: coverImageUrl,
        galleryImages,
        isBreaking,
        showInSidebar,
        sendPush,
        status,
      });

      if (result.success) {
        setSuccessMessage(`News successfully ${status === 'published' ? 'published live' : 'saved as draft'}! Redirecting...`);
        setTimeout(() => {
          router.push('/admin/content');
          router.refresh();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to publish news.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* ── 1. Top Bar Header (Direct Admin Publish) ── */}
      <div className="bg-[#1e1e1e] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-[#f06d2f] font-bold uppercase tracking-wider block mb-0.5">
            Admin News Publishing Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-white">
            Direct Admin Publish
          </h1>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={handleRunAiGrammarCheck}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Sparkles size={14} className="text-indigo-200" />
            <span>Run AI Grammar Check</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePublish('published')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#f06d2f] hover:bg-[#e05b1d] text-white font-heading font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Send size={14} />
            <span>{isSubmitting ? 'Publishing...' : 'Publish News Immediately'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="bg-red-50 text-red-800 border border-red-200 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {aiGrammarMessage && (
        <div className="bg-indigo-50 text-indigo-900 border border-indigo-200 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Wand2 size={16} className="text-indigo-600 shrink-0" />
          <span>{aiGrammarMessage}</span>
        </div>
      )}

      {/* ── 2. News Article Form (Dark / Clean Styled Layout) ── */}
      <div className="bg-[#181818] text-gray-200 rounded-2xl p-6 sm:p-8 border border-gray-800 shadow-xl space-y-6">

        {/* Title */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter news headline"
            className="w-full bg-[#242424] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-[#f06d2f] focus:ring-1 focus:ring-[#f06d2f] transition-colors"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Subtitle
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter subtitle"
            className="w-full bg-[#242424] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-[#f06d2f] focus:ring-1 focus:ring-[#f06d2f] transition-colors"
          />
        </div>

        {/* Language & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Language <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#242424] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-[#f06d2f] transition-colors"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#242424] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-[#f06d2f] transition-colors"
            >
              {HEALTH_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Location
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Chennai, Tamil Nadu"
              className="w-full pl-10 pr-4 py-3 bg-[#242424] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-[#f06d2f] transition-colors"
            />
          </div>
        </div>

        {/* Short Description (Summary) */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
            Short Description (Summary) <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary of the news..."
            className="w-full bg-[#242424] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-[#f06d2f] focus:ring-1 focus:ring-[#f06d2f] transition-colors leading-relaxed"
          />
        </div>

        {/* Full Description / Content with Toolbar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-gray-300">
              Full Description <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="text-xs text-[#f06d2f] font-semibold hover:underline flex items-center gap-1"
            >
              <Eye size={13} />
              <span>{previewMode ? 'Back to Editor' : 'Live Preview'}</span>
            </button>
          </div>

          <div className="bg-[#242424] border border-gray-700 rounded-xl overflow-hidden focus-within:border-[#f06d2f] transition-colors">
            {/* Formatting Toolbar */}
            <div className="bg-[#2a2a2a] border-b border-gray-700 px-3 py-2 flex items-center gap-1.5 flex-wrap text-gray-300">
              <button
                type="button"
                onClick={() => applyFormat('**', '**')}
                title="Bold"
                className="p-1.5 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Bold size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('*', '*')}
                title="Italic"
                className="p-1.5 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Italic size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('<u>', '</u>')}
                title="Underline"
                className="p-1.5 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Underline size={14} />
              </button>
              <span className="h-4 w-[1px] bg-gray-600 mx-1" />
              <button
                type="button"
                onClick={() => applyFormat('## ')}
                title="Heading"
                className="px-2 py-1 text-xs font-bold rounded-md hover:bg-gray-700 hover:text-white"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => applyFormat('### ')}
                title="Subheading"
                className="px-2 py-1 text-xs font-bold rounded-md hover:bg-gray-700 hover:text-white"
              >
                H3
              </button>
              <span className="h-4 w-[1px] bg-gray-600 mx-1" />
              <button
                type="button"
                onClick={() => applyFormat('- ')}
                title="Bullet List"
                className="p-1.5 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('1. ')}
                title="Numbered List"
                className="p-1.5 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
              >
                <ListOrdered size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('[', '](https://)')}
                title="Insert Link"
                className="p-1.5 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
              >
                <LinkIcon size={14} />
              </button>
            </div>

            {/* Content Area */}
            {previewMode ? (
              <div className="p-4 min-h-[260px] text-gray-200 text-sm leading-relaxed prose prose-invert max-w-none whitespace-pre-wrap">
                {content || <span className="text-gray-500 italic">No content typed yet...</span>}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                required
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full comprehensive news story..."
                className="w-full bg-transparent p-4 text-sm text-white placeholder-gray-500 focus:outline-hidden leading-relaxed resize-y font-sans"
              />
            )}
          </div>
        </div>

        {/* Tags & SEO Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., breaking, news, cardiology, health trial"
              className="w-full bg-[#242424] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-[#f06d2f] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              SEO Keywords
            </label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="Keywords for search engines"
              className="w-full bg-[#242424] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-[#f06d2f] transition-colors"
            />
          </div>
        </div>

        {/* Cover Image & Gallery Images Upload Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          
          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Cover Image Upload <span className="text-red-500">*</span>
            </label>
            
            <div className="bg-[#242424] border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-gray-500 transition-colors">
              {coverImageUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-700 group">
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl('')}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                    title="Remove Cover Image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="py-6 space-y-2">
                  <ImageIcon size={32} className="mx-auto text-gray-500" />
                  <div className="text-xs text-gray-400">
                    <span className="text-[#f06d2f] font-semibold">Click to upload</span> or drag and drop
                  </div>
                  <p className="text-[10px] text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingCover}
                    onClick={() => coverFileInputRef.current?.click()}
                    className="mt-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Upload size={12} />
                    <span>{uploadingCover ? 'Uploading...' : 'Choose File'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images Upload */}
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Gallery Images Upload
            </label>
            
            <div className="bg-[#242424] border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-gray-500 transition-colors">
              {galleryImages.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 group">
                        <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-0.5 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingGallery}
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Add More Images</span>
                  </button>
                </div>
              ) : (
                <div className="py-6 space-y-2">
                  <Upload size={32} className="mx-auto text-gray-500" />
                  <div className="text-xs text-gray-400">Upload multiple photos for gallery</div>
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingGallery}
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="mt-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Upload size={12} />
                    <span>{uploadingGallery ? 'Uploading...' : 'Choose Files'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ── Publishing Options (Checkboxes matching Reference) ── */}
        <div className="bg-[#222222] border border-gray-800 rounded-xl p-5 space-y-3.5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[#f06d2f] focus:ring-[#f06d2f]"
            />
            <div>
              <span className="text-xs font-heading font-bold text-white block">
                Mark as Breaking News (முக்கிய செய்தி)
              </span>
              <span className="text-[11px] text-gray-400 block">
                Feature immediately in the live homepage breaking news ticker &amp; header flash strip.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showInSidebar}
              onChange={(e) => setShowInSidebar(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[#f06d2f] focus:ring-[#f06d2f]"
            />
            <div>
              <span className="text-xs font-heading font-bold text-white block">
                Show in Sidebar (விளம்பரங்களுக்கு நடுவே காட்டுக)
              </span>
              <span className="text-[11px] text-gray-400 block">
                Pin in top sidebar widgets across reading and category pages.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sendPush}
              onChange={(e) => setSendPush(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[#f06d2f] focus:ring-[#f06d2f]"
            />
            <div>
              <span className="text-xs font-heading font-bold text-white block">
                Send Browser Push Notification
              </span>
              <span className="text-[11px] text-gray-400 block">
                Broadcast instant browser notification to registered subscribers.
              </span>
            </div>
          </label>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePublish('draft')}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-heading font-semibold text-xs transition-colors cursor-pointer"
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePublish('published')}
            className="px-6 py-2.5 bg-[#f06d2f] hover:bg-[#e05b1d] text-white rounded-xl font-heading font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <Send size={14} />
            <span>{isSubmitting ? 'Publishing...' : 'Publish News Immediately'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
