/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  BookOpen,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { MagazinePrintView } from './MagazinePrintView';

interface MagazineReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadPdf: () => void;
  year: number;
  month: number;
  monthName: string;
  issueVolume: string;
  issueTitle: string;
  editorNote: string;
  articles: any[];
}

export function MagazineReaderModal({
  isOpen,
  onClose,
  onDownloadPdf,
  year,
  month,
  monthName,
  issueVolume,
  issueTitle,
  editorNote,
  articles,
}: MagazineReaderModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-hidden">
      <div
        className={`bg-slate-900 border border-slate-700 rounded-2xl flex flex-col transition-all duration-300 shadow-2xl overflow-hidden ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[92vh]'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <BookOpen size={16} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <span>{issueTitle}</span>
                <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                  {monthName} {year} &bull; {articles.length} Articles
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Print-ready digital magazine preview &bull; {issueVolume}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Printer size={13} />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600/80 text-slate-300 hover:text-white transition-all text-xs"
              title="Close Preview"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/60 flex justify-center">
          <div className="w-full max-w-[210mm] bg-white rounded-lg shadow-2xl overflow-hidden">
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
    </div>
  );
}
