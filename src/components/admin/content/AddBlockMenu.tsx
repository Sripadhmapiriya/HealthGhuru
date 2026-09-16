'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { ArticleBlock } from '@/lib/types/article';

const BLOCK_OPTIONS: { type: ArticleBlock['type']; label: string; description: string }[] = [
  { type: 'paragraph', label: 'Paragraph', description: 'Standard body text' },
  { type: 'heading', label: 'Heading', description: 'Section break with a subtitle' },
  { type: 'pull_quote', label: 'Pull Quote', description: 'Large emphasized quote, breaks up long text' },
  { type: 'key_takeaway', label: 'Key Takeaway Box', description: 'Highlighted summary points in a tinted card' },
  { type: 'image', label: 'Image', description: 'Inline photo with optional caption' },
  { type: 'tip_callout', label: 'Tip Callout', description: 'Small highlighted tip, like a sidebar note' },
  { type: 'numbered_list', label: 'Numbered List', description: 'Ordered steps or items' },
  { type: 'divider', label: 'Divider', description: 'Visual section break' },
];

export function AddBlockMenu({ onAdd }: { onAdd: (type: ArticleBlock['type']) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dashed text-sm font-medium hover:bg-surface-alt transition-colors"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
        type="button"
      >
        <Plus size={16} /> Add Block
      </button>
      
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute z-50 mt-2 w-72 rounded-[14px] bg-white shadow-xl border p-2"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {BLOCK_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => { onAdd(opt.type); setOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#EBF5EB] transition-colors"
                type="button"
              >
                <div className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>{opt.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{opt.description}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
