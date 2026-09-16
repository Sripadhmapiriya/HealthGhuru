import type { ArticleBlock } from '../types/article';

export function estimateReadTime(blocks: ArticleBlock[]): number {
  const wordsPerMinute = 200;
  const text = blocks
    .map((b) => {
      if (b.type === 'paragraph' || b.type === 'pull_quote' || b.type === 'tip_callout') return b.text;
      if (b.type === 'heading') return b.text;
      if (b.type === 'key_takeaway') return b.title + ' ' + b.points.join(' ');
      if (b.type === 'numbered_list') return (b.title || '') + ' ' + b.items.join(' ');
      return '';
    })
    .join(' ');
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}
