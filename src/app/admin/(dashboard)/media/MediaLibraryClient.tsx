/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useMemo, useRef } from 'react';
import {
  Image as ImageIcon,
  Film,
  FileText,
  Music,
  HardDrive,
  UploadCloud,
  Search,
  Grid,
  List,
  Trash2,
  Copy,
  Check,
  Download,
  ExternalLink,
  RefreshCw,
  X,
  Plus,
  Layers,
  Sparkles,
  Info,
  CheckSquare,
  Square,
  Eye,
  Calendar,
  FileType,
  Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaAsset, MediaStats, formatBytes } from '@/lib/media';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/providers/ToastProvider';

interface MediaLibraryClientProps {
  initialItems: MediaAsset[];
  initialStats: MediaStats;
}

export function MediaLibraryClient({ initialItems, initialStats }: MediaLibraryClientProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core state
  const [items, setItems] = useState<MediaAsset[]>(initialItems);
  const [stats, setStats] = useState<MediaStats>(initialStats);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('created_at-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers
  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Bulk / Single delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  // Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Fetch updated media items from API
  const refreshMedia = async () => {
    try {
      const res = await fetch(`/api/admin/media?type=${selectedType}&search=${encodeURIComponent(searchQuery)}&sort=${sortOption}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch media assets:', err);
    }
  };

  // Upload handler (accepts FileList or File[])
  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Uploading ${files.length} file(s)...`);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Successfully uploaded ${data.assets?.length || 1} asset(s)!`);
        await refreshMedia();
      } else {
        toast.error(data.error?.message || 'Upload failed');
      }
    } catch (err: any) {
      toast.error('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Sync local storage handler
  const handleSyncStorage = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/admin/media/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Storage Synchronized', data.message);
        await refreshMedia();
      } else {
        toast.error(data.error?.message || 'Failed to sync storage');
      }
    } catch (err: any) {
      toast.error('Sync failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSyncing(false);
    }
  };

  // Copy URL with feedback
  const handleCopyUrl = (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    toast.success('URL Copied to Clipboard', fullUrl);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Open asset detail drawer
  const openAssetDetail = (asset: MediaAsset) => {
    setActiveAsset(asset);
    setEditTitle(asset.title || asset.original_name);
    setEditAltText(asset.alt_text || '');
    setEditCaption(asset.caption || '');
    setEditTags(asset.tags || []);
    setIsEditing(false);
  };

  // Save metadata changes
  const handleSaveMetadata = async () => {
    if (!activeAsset) return;

    try {
      const res = await fetch(`/api/admin/media/${activeAsset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          alt_text: editAltText.trim(),
          caption: editCaption.trim(),
          tags: editTags,
        }),
      });

      const data = await res.json();
      if (data.success && data.asset) {
        setItems((prev) => prev.map((item) => (item.id === activeAsset.id ? data.asset : item)));
        setActiveAsset(data.asset);
        setIsEditing(false);
        toast.success('Media metadata updated successfully');
      } else {
        toast.error(data.error?.message || 'Failed to update metadata');
      }
    } catch (err: any) {
      toast.error('Update error: ' + (err.message || 'Unknown error'));
    }
  };

  // Tag helper
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (cleanTag && !editTags.includes(cleanTag)) {
      setEditTags([...editTags, cleanTag]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((t) => t !== tagToRemove));
  };

  // Selection toggle
  const toggleSelectAsset = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  // Trigger delete modal
  const promptDeleteSingle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteTargetIds([id]);
    setDeleteModalOpen(true);
  };

  const promptDeleteBulk = () => {
    if (selectedIds.length === 0) return;
    setDeleteTargetIds(selectedIds);
    setDeleteModalOpen(true);
  };

  // Execute deletion
  const handleConfirmDelete = async () => {
    if (deleteTargetIds.length === 0) return;

    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: deleteTargetIds }),
      });

      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((item) => !deleteTargetIds.includes(item.id)));
        setSelectedIds((prev) => prev.filter((id) => !deleteTargetIds.includes(id)));
        if (activeAsset && deleteTargetIds.includes(activeAsset.id)) {
          setActiveAsset(null);
        }
        toast.success(`Deleted ${deleteTargetIds.length} media asset(s)`);
        await refreshMedia();
      } else {
        toast.error(data.error?.message || 'Failed to delete asset(s)');
      }
    } catch (err: any) {
      toast.error('Deletion error: ' + (err.message || 'Unknown error'));
    } finally {
      setDeleteModalOpen(false);
      setDeleteTargetIds([]);
    }
  };

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedType !== 'all' && item.media_type !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = (item.title || '').toLowerCase().includes(query);
        const matchOrig = (item.original_name || '').toLowerCase().includes(query);
        const matchAlt = (item.alt_text || '').toLowerCase().includes(query);
        const matchMime = (item.mime_type || '').toLowerCase().includes(query);
        const matchTag = (item.tags || []).some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchOrig && !matchAlt && !matchMime && !matchTag) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'created_at-asc') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortOption === 'file_size-desc') {
        return (b.file_size || 0) - (a.file_size || 0);
      }
      if (sortOption === 'file_size-asc') {
        return (a.file_size || 0) - (b.file_size || 0);
      }
      if (sortOption === 'name-asc') {
        return (a.original_name || '').localeCompare(b.original_name || '');
      }
      if (sortOption === 'name-desc') {
        return (b.original_name || '').localeCompare(a.original_name || '');
      }
      // default: created_at-desc
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [items, selectedType, searchQuery, sortOption]);

  // Helper for icon based on media type
  const renderMediaTypeIcon = (type: string, size = 18) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={size} className="text-emerald-600" />;
      case 'video':
        return <Film size={size} className="text-blue-600" />;
      case 'document':
        return <FileText size={size} className="text-amber-600" />;
      case 'audio':
        return <Music size={size} className="text-purple-600" />;
      default:
        return <FileType size={size} className="text-slate-600" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ── 1. Storage & Asset Metrics Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Assets */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1">
              Total Assets
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
              {stats.totalCount}
            </p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100">
            <ImageIcon size={22} />
          </div>
        </div>

        {/* Total Storage Used */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1">
              Storage Used
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 font-mono">
              {formatBytes(stats.totalBytes)}
            </p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-orange-50 text-[#f06d2f] flex items-center justify-center border border-orange-100">
            <HardDrive size={22} />
          </div>
        </div>

        {/* Images Count */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1">
              Visual Images
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
              {stats.imageCount}
            </p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Sparkles size={22} />
          </div>
        </div>

        {/* Docs & Multimedia */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-1">
              Docs &amp; Video
            </p>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
              {stats.documentCount + stats.videoCount + stats.audioCount}
            </p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Layers size={22} />
          </div>
        </div>
      </div>

      {/* ── 2. Drag & Drop Upload Zone ── */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-[#16A34A] bg-emerald-50/50 scale-[1.005] shadow-md'
            : 'border-slate-300 hover:border-slate-400 bg-white shadow-2xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${
              isDragging
                ? 'bg-[#16A34A] text-white scale-110'
                : 'bg-emerald-50 text-[#16A34A] border border-emerald-100'
            }`}
          >
            {isUploading ? (
              <RefreshCw size={26} className="animate-spin text-[#16A34A]" />
            ) : (
              <UploadCloud size={28} />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
              {isUploading
                ? uploadProgress || 'Uploading assets...'
                : isDragging
                ? 'Drop your files here to upload instantly'
                : 'Click or Drag & Drop media to upload'}
            </h3>
            <p className="text-xs text-slate-500 font-body max-w-md mx-auto">
              Supports JPEG, PNG, WebP, SVG, MP4, PDF, and audio formats up to 25MB per file.
            </p>
          </div>

          {!isUploading && (
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-heading font-bold shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>Browse Computer</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Filters, Search, View Controls & Actions Bar ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Media Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
            {[
              { label: 'All Files', value: 'all', count: stats.totalCount },
              { label: 'Images', value: 'image', count: stats.imageCount },
              { label: 'Videos', value: 'video', count: stats.videoCount },
              { label: 'Documents', value: 'document', count: stats.documentCount },
              { label: 'Audio', value: 'audio', count: stats.audioCount },
            ].map((tab) => {
              const isActive = selectedType === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedType(tab.value)}
                  className={`text-xs font-heading font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-black/20 text-white' : 'bg-white text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sync Storage Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSyncStorage}
              disabled={isSyncing}
              title="Scan public/uploads and public/images to register any local files"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin text-[#16A34A]' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Storage'}</span>
            </button>
          </div>
        </div>

        {/* Search, Sort, Select All & View Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by filename, title, alt text, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Select All Toggle Button */}
            {filteredItems.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-heading font-semibold text-slate-700 transition-colors shrink-0"
              >
                {selectedIds.length === filteredItems.length ? (
                  <CheckSquare size={14} className="text-[#16A34A]" />
                ) : (
                  <Square size={14} className="text-slate-400" />
                )}
                <span>Select All</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-heading font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            >
              <option value="created_at-desc">Newest Added</option>
              <option value="created_at-asc">Oldest Added</option>
              <option value="file_size-desc">Largest File Size</option>
              <option value="file_size-asc">Smallest File Size</option>
              <option value="name-asc">Filename (A-Z)</option>
              <option value="name-desc">Filename (Z-A)</option>
            </select>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid View"
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table/List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Sticky Bulk Action Bar ── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="sticky bottom-4 z-30 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-between gap-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="font-heading font-bold text-xs sm:text-sm">
                {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const selectedAssets = items.filter((i) => selectedIds.includes(i.id));
                  const urls = selectedAssets
                    .map((a) => (a.url.startsWith('http') ? a.url : `${window.location.origin}${a.url}`))
                    .join('\n');
                  navigator.clipboard.writeText(urls);
                  toast.success(`Copied ${selectedIds.length} URLs to clipboard`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-heading font-bold text-slate-200 transition-colors"
              >
                <Copy size={13} />
                <span>Copy URLs</span>
              </button>

              <button
                onClick={promptDeleteBulk}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-heading font-bold text-white shadow-xs transition-colors"
              >
                <Trash2 size={13} />
                <span>Delete Selected</span>
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors"
                title="Deselect All"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 5. Media Grid & Table Rendering ── */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ImageIcon size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-slate-800 text-base">No Media Assets Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `No items matching "${searchQuery}". Try a different keyword.`
                : 'Upload images, videos, documents or sync local files to get started.'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#16A34A] hover:underline font-bold inline-flex items-center gap-1"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* ── GRID VIEW ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredItems.map((asset) => {
            const isSelected = selectedIds.includes(asset.id);
            const isImage = asset.media_type === 'image';
            const isVideo = asset.media_type === 'video';

            return (
              <div
                key={asset.id}
                onClick={() => openAssetDetail(asset)}
                className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer shadow-2xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#16A34A] ring-2 ring-[#16A34A]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Checkbox badge */}
                <button
                  type="button"
                  onClick={(e) => toggleSelectAsset(asset.id, e)}
                  className={`absolute top-2.5 left-2.5 z-10 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/60'
                  }`}
                >
                  {isSelected ? <Check size={14} /> : <Plus size={14} />}
                </button>

                {/* Media Type Badge */}
                <span className="absolute top-2.5 right-2.5 z-10 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  {asset.mime_type.split('/').pop()?.toUpperCase() || asset.media_type}
                </span>

                {/* Media Thumbnail Container */}
                <div className="relative w-full aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img
                      src={asset.url}
                      alt={asset.alt_text || asset.title || asset.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : isVideo ? (
                    <div className="flex flex-col items-center justify-center text-blue-600 gap-1 p-2 text-center">
                      <Film size={32} />
                      <span className="text-[10px] font-mono font-bold text-slate-600 truncate max-w-full">
                        VIDEO
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 gap-1 p-2 text-center">
                      {renderMediaTypeIcon(asset.media_type, 32)}
                      <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">
                        {asset.media_type}
                      </span>
                    </div>
                  )}

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                    <button
                      type="button"
                      onClick={(e) => handleCopyUrl(asset.url, e)}
                      title="Copy URL"
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 transition-colors shadow-xs"
                    >
                      {copiedUrl === asset.url ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => promptDeleteSingle(asset.id, e)}
                      title="Delete Asset"
                      className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white transition-colors shadow-xs"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Caption & Metadata Footer */}
                <div className="p-3 flex-1 flex flex-col justify-between bg-white border-t border-slate-100">
                  <p
                    className="font-heading font-bold text-xs text-slate-900 truncate"
                    title={asset.title || asset.original_name}
                  >
                    {asset.title || asset.original_name}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
                    <span>{formatBytes(asset.file_size)}</span>
                    {asset.width && asset.height && (
                      <span>{asset.width}x{asset.height}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── LIST / TABLE VIEW ── */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-heading font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                    />
                  </th>
                  <th className="py-3.5 px-4">PREVIEW</th>
                  <th className="py-3.5 px-4">NAME &amp; TITLE</th>
                  <th className="py-3.5 px-4">TYPE</th>
                  <th className="py-3.5 px-4">DIMENSIONS</th>
                  <th className="py-3.5 px-4">SIZE</th>
                  <th className="py-3.5 px-4">DATE ADDED</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((asset) => {
                  const isSelected = selectedIds.includes(asset.id);
                  const isImage = asset.media_type === 'image';

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => openAssetDetail(asset)}
                      className={`group hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectAsset(asset.id)}
                          className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                        />
                      </td>

                      {/* Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {isImage ? (
                            <img
                              src={asset.url}
                              alt={asset.alt_text || asset.original_name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            renderMediaTypeIcon(asset.media_type, 20)
                          )}
                        </div>
                      </td>

                      {/* Title & Filename */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-heading font-bold text-slate-900 truncate">
                          {asset.title || asset.original_name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono truncate">
                          {asset.filename}
                        </p>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-heading font-semibold border border-slate-200">
                          {renderMediaTypeIcon(asset.media_type, 12)}
                          <span className="capitalize">{asset.media_type}</span>
                        </span>
                      </td>

                      {/* Dimensions */}
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {asset.width && asset.height ? `${asset.width} × ${asset.height}` : '—'}
                      </td>

                      {/* Size */}
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {formatBytes(asset.file_size)}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        <span suppressHydrationWarning>{formatDate(asset.created_at)}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleCopyUrl(asset.url, e)}
                            title="Copy Direct URL"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            {copiedUrl === asset.url ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => openAssetDetail(asset)}
                            title="View Asset Details"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => promptDeleteSingle(asset.id, e)}
                            title="Delete Asset"
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 6. Asset Detail & Metadata Modal ── */}
      <AnimatePresence>
        {activeAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[92vh] overflow-y-auto space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#16A34A] px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                      {activeAsset.media_type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {formatBytes(activeAsset.file_size)}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 truncate max-w-xl">
                    {activeAsset.title || activeAsset.original_name}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveAsset(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body: 2 Columns (Preview & Metadata) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Preview Box (7 cols) */}
                <div className="lg:col-span-7 flex flex-col space-y-3">
                  <div className="relative w-full aspect-video bg-slate-900/5 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden group">
                    {activeAsset.media_type === 'image' ? (
                      <img
                        src={activeAsset.url}
                        alt={activeAsset.alt_text || activeAsset.title || activeAsset.original_name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : activeAsset.media_type === 'video' ? (
                      <video
                        src={activeAsset.url}
                        controls
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
                        {renderMediaTypeIcon(activeAsset.media_type, 48)}
                        <p className="font-heading font-bold text-slate-700 text-sm">
                          {activeAsset.original_name}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">{activeAsset.mime_type}</p>
                      </div>
                    )}
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleCopyUrl(activeAsset.url)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-heading font-bold transition-colors"
                    >
                      {copiedUrl === activeAsset.url ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copiedUrl === activeAsset.url ? 'URL Copied!' : 'Copy Direct URL'}</span>
                    </button>

                    <a
                      href={activeAsset.url}
                      download={activeAsset.original_name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-heading font-bold transition-colors"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </a>

                    <a
                      href={activeAsset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Right: Metadata & Editable Fields (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* File Info Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <p className="font-heading font-bold text-slate-700 text-xs uppercase tracking-wider mb-2">
                      Asset Specifications
                    </p>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 font-mono">Original Name:</span>
                      <span className="font-mono truncate max-w-[170px]" title={activeAsset.original_name}>
                        {activeAsset.original_name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 font-mono">File Size:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatBytes(activeAsset.file_size)}
                      </span>
                    </div>

                    {activeAsset.width && activeAsset.height && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 font-mono">Dimensions:</span>
                        <span className="font-mono text-slate-800">
                          {activeAsset.width} × {activeAsset.height} px
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 font-mono">MIME Type:</span>
                      <span className="font-mono text-slate-800">{activeAsset.mime_type}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 font-mono">Uploaded:</span>
                      <span className="font-mono text-slate-800" suppressHydrationWarning>
                        {formatDate(activeAsset.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Editable Metadata Form */}
                  <div className="space-y-3">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                        Title / Label
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Descriptive title"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>

                    {/* Alt Text (SEO/A11y) */}
                    <div>
                      <label className="flex items-center justify-between text-xs font-heading font-bold text-slate-700 mb-1">
                        <span>Alt Text (SEO &amp; Accessibility)</span>
                        <span className="text-[10px] text-[#16A34A] font-mono">Recommended</span>
                      </label>
                      <input
                        type="text"
                        value={editAltText}
                        onChange={(e) => setEditAltText(e.target.value)}
                        placeholder="Describe image for screen readers"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                      />
                    </div>

                    {/* Caption */}
                    <div>
                      <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                        Caption / Note
                      </label>
                      <textarea
                        rows={2}
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="Optional editorial caption or attribution..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none resize-none"
                      />
                    </div>

                    {/* Tag Manager */}
                    <div>
                      <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                        Tags &amp; Collections
                      </label>
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {editTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-medium border border-slate-200"
                          >
                            <span>#{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="Add tag (e.g. nutrition, banner)"
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-heading font-bold transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Save Changes Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => promptDeleteSingle(activeAsset.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold hover:underline"
                      >
                        Delete Asset
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveMetadata}
                        className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-heading font-bold shadow-xs transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 7. Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Delete {deleteTargetIds.length} Asset(s)?
                  </h3>
                  <p className="text-xs text-slate-500">
                    This will delete database records and files permanently.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete the selected media? Any articles or pages referencing these URLs may experience broken images.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setDeleteTargetIds([]);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
