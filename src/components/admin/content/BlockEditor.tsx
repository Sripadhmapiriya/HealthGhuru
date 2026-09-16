'use client';

import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import type { ArticleBlock } from '@/lib/types/article';
import { BlockFields } from './BlockFields';
import { AddBlockMenu } from './AddBlockMenu';
import { useDialog } from '@/components/providers/DialogProvider';
import { IconButton } from '@/components/ui/IconAction';

interface BlockEditorProps {
  blocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const { confirm } = useDialog();

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const updateBlock = (index: number, updated: ArticleBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updated;
    onChange(newBlocks);
  };

  const deleteBlock = async (index: number) => {
    const ok = await confirm({
      title: 'Delete Block',
      description: 'Are you sure you want to delete this content block? This cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'danger'
    });
    if (ok) {
      onChange(blocks.filter((_, i) => i !== index));
    }
  };

  const addBlock = (type: ArticleBlock['type']) => {
    const id = crypto.randomUUID();
    const newBlock = createEmptyBlock(type, id);
    onChange([...blocks, newBlock]);
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="border rounded-[14px] p-4 bg-white shadow-sm"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}
            >
              {blockLabel(block.type)}
            </span>
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
              <div className="p-1">
                <IconButton 
                  icon={ChevronUp} 
                  onClick={() => moveBlock(index, 'up')} 
                  disabled={index === 0}
                  label="Move Up"
                  size={14}
                />
              </div>
              <div className="p-1">
                <IconButton 
                  icon={ChevronDown} 
                  onClick={() => moveBlock(index, 'down')} 
                  disabled={index === blocks.length - 1}
                  label="Move Down"
                  size={14}
                />
              </div>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <div className="p-1 text-red-500">
                <IconButton 
                  icon={Trash2} 
                  onClick={() => deleteBlock(index)} 
                  label="Delete Block"
                  size={14}
                  color="currentColor"
                />
              </div>
            </div>
          </div>
          <BlockFields block={block} onUpdate={(updated) => updateBlock(index, updated)} />
        </div>
      ))}

      <div className="pt-2">
        <AddBlockMenu onAdd={addBlock} />
      </div>
    </div>
  );
}

function blockLabel(type: ArticleBlock['type']): string {
  const labels: Record<ArticleBlock['type'], string> = {
    paragraph: 'Paragraph',
    heading: 'Heading',
    pull_quote: 'Pull Quote',
    key_takeaway: 'Key Takeaway Box',
    image: 'Image',
    tip_callout: 'Tip Callout',
    numbered_list: 'Numbered List',
    divider: 'Divider',
  };
  return labels[type];
}

function createEmptyBlock(type: ArticleBlock['type'], id: string): ArticleBlock {
  switch (type) {
    case 'paragraph': return { type, id, text: '' };
    case 'heading': return { type, id, text: '', level: 2 };
    case 'pull_quote': return { type, id, text: '', attribution: '' };
    case 'key_takeaway': return { type, id, title: '', points: [''] };
    case 'image': return { type, id, url: '', caption: '', alt: '' };
    case 'tip_callout': return { type, id, text: '', icon: 'leaf' };
    case 'numbered_list': return { type, id, title: '', items: [''] };
    case 'divider': return { type, id };
  }
}
