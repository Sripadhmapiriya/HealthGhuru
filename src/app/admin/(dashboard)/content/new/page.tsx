import { requireAdmin } from '@/lib/auth/session';
import { ArticleEditorClient } from '../ArticleEditorClient';

export default async function NewArticlePage() {
  await requireAdmin();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="font-heading font-bold text-2xl text-[#1A2E1A] mb-8">Create New Article</h2>
      <ArticleEditorClient />
    </div>
  );
}
