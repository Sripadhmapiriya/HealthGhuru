import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { ArticleEditorClient } from '../../ArticleEditorClient';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({ params }: { params: { articleId: string } }) {
  await requireAdmin();

  const articles = await sql`
    SELECT *
    FROM articles
    WHERE id = ${params.articleId}::uuid AND deleted_at IS NULL
  `;

  if (!articles[0]) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="font-heading font-bold text-2xl text-[#1A2E1A] mb-8">Edit Article</h2>
      <ArticleEditorClient initialArticle={articles[0]} />
    </div>
  );
}
