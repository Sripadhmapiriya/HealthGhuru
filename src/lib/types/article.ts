export type ArticleBlock =
  | { type: 'paragraph'; id: string; text: string }
  | { type: 'heading'; id: string; text: string; level: 2 | 3 }
  | { type: 'pull_quote'; id: string; text: string; attribution?: string }
  | { type: 'key_takeaway'; id: string; title: string; points: string[] }
  | { type: 'image'; id: string; url: string; caption?: string; alt: string }
  | { type: 'tip_callout'; id: string; text: string; icon?: 'leaf' | 'heart' | 'moon' | 'check' }
  | { type: 'numbered_list'; id: string; title?: string; items: string[] }
  | { type: 'divider'; id: string };

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: 'Nutrition' | 'Fitness' | 'Sleep' | 'Mental Health';
  matchedGoalCategory?: string;
  excerpt: string;
  heroImageUrl: string;
  heroImageAlt: string;
  author: { name: string; avatarUrl: string; credential?: string };
  blocks: ArticleBlock[];
  tags: string[];
  readTime: number;
  status: 'draft' | 'published';
  publishedAt: string | null;
  updatedAt: string;
}
