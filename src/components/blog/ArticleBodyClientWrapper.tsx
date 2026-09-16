'use client';

import { useRef } from 'react';
import type { ArticleBlock } from '@/lib/types/article';
import { ReadingProgressBar } from './ReadingProgressBar';
import { ArticleBody } from './ArticleBody';

export function ArticleBodyClientWrapper({ blocks }: { blocks: ArticleBlock[] }) {
  const ref = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <ReadingProgressBar targetRef={ref} />
      <ArticleBody ref={ref} blocks={blocks} />
    </>
  );
}
