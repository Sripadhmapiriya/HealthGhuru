/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaAsset, formatBytes } from '@/lib/media';
import { useToast } from '@/components/providers/ToastProvider';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  allowedTypes?: ('image' | 'video' | 'document' | 'audio')[];
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = ['image'],
  title = 'Select Media from Library',
}: MediaPickerModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch items when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const typeParam = allowedTypes.length === 1 ? allowedTypes[0] : 'all';
      const res = await fetch(`/api/admin/media?type=${typeParam}&limit=60`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('files', f));

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.assets && data.assets.length > 0) {
        toast.success('Media uploaded successfully');
        const newAsset = data.assets[0];
        setItems((prev) => [newAsset, ...prev]);
        setSelectedAsset(newAsset);
      } else {
        toast.error(data.error?.message || 'Upload failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredItems = items.filter((item) => {
    if (allowedTypes.length > 0 && !allowedTypes.includes(item.media_type as any)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (item.title || '').toLowerCase().includes(q) ||
        (item.original_name || '').toLowerCase().includes(q) ||
        (item.alt_text || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirm = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 text-slate-900 flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                <ImageIcon size={18} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">
                  {title}
                </h3>
                <p className="text-xs text-slate-500">
                  Select an existing asset or upload a new one directly.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search & Quick Upload Bar */}
          <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100">
            <div className="relative flex-1 w-full">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search media by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={allowedTypes.includes('image') ? 'image/*' : undefined}
                onChange={(e) => handleUpload(e.target.files)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-heading font-bold shadow-xs transition-colors"
              >
                {isUploading ? (
                  <RefreshCw size={13} className="animate-spin text-emerald-400" />
                ) : (
                  <UploadCloud size={14} />
                )}
                <span>{isUploading ? 'Uploading...' : 'Upload New'}</span>
              </button>
            </div>
          </div>

          {/* Media Grid */}
          <div className="flex-1 overflow-y-auto py-4 min-h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center py-12 text-slate-400">
                <RefreshCw size={24} className="animate-spin text-[#16A34A]" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <p className="font-heading font-bold text-slate-700 text-sm">No Assets Found</p>
                <p className="text-xs text-slate-500">Upload a new file to insert it.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {filteredItems.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  const isImage = asset.media_type === 'image';

                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      onDoubleClick={() => {
                        setSelectedAsset(asset);
                        onSelect(asset);
                        onClose();
                      }}
                      className={`group relative rounded-xl border p-1 cursor-pointer transition-all overflow-hidden flex flex-col bg-white ${
                        isSelected
                          ? 'border-[#16A34A] ring-2 ring-[#16A34A]/20 bg-emerald-50/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Selection Check Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-xs">
                          <Check size={12} />
                        </div>
                      )}

                      <div className="relative w-full aspect-square rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                        {isImage ? (
                          <img
                            src={asset.url}
                            alt={asset.alt_text || asset.original_name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-slate-400 font-mono text-[10px] uppercase">
                            {asset.media_type}
                          </div>
                        )}
                      </div>

                      <div className="p-1.5 flex flex-col">
                        <p className="font-heading font-bold text-[11px] text-slate-900 truncate">
                          {asset.title || asset.original_name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {formatBytes(asset.file_size)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-body">
              {selectedAsset ? (
                <span className="font-medium text-slate-800">
                  Selected: <span className="font-mono">{selectedAsset.original_name}</span> (
                  {formatBytes(selectedAsset.file_size)})
                </span>
              ) : (
                'Select an image or file above'
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedAsset}
                onClick={handleConfirm}
                className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-heading font-bold shadow-xs transition-colors"
              >
                Insert Media
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
