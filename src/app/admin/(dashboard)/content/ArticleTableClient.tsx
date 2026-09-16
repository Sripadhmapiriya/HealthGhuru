/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { manageArticle } from '@/lib/admin/actions/manageArticle';
import { PillBadge } from '@/components/ui/PillBadge';
import Link from 'next/link';
import { Trash2, Edit } from 'lucide-react';
import { useDialog } from '@/components/providers/DialogProvider';
import { useToast } from '@/components/providers/ToastProvider';

export function ArticleTableClient({ initialArticles }: { initialArticles: any[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const { confirm } = useDialog();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Confirm Deletion',
      description: 'Are you sure you want to delete this article? This is a soft-delete and the history will be retained.',
      confirmLabel: 'Confirm Delete',
      variant: 'danger'
    });
    
    if (!ok) return;

    try {
      await manageArticle({ 
        action: 'delete', 
        id,
        title: 'delete', // placeholder for zod
        slug: 'delete',
        category: 'Fitness',
        excerpt: 'delete',
        readTime: 1,
        status: 'draft'
      });
      setArticles(articles.filter(a => a.id !== id));
      toast.success('Article deleted successfully');
    } catch (e) {
      toast.error('Failed to delete article');
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(46,125,50,0.15)] bg-gray-50/50">
              <th className="px-6 py-4 text-sm font-semibold text-[#1A2E1A]">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#1A2E1A]">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#1A2E1A]">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#1A2E1A]">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#1A2E1A]"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id} className="border-b border-[rgba(46,125,50,0.15)] hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[#1A2E1A]">{article.title}</td>
                <td className="px-6 py-4 text-sm">
                  <PillBadge active={false} className="text-[10px] bg-gray-100 text-gray-800">{article.category}</PillBadge>
                </td>
                <td className="px-6 py-4 text-sm">
                  <PillBadge active={article.status === 'published'} className={article.status === 'draft' ? 'bg-orange-100 text-orange-800' : 'bg-[#EBF5EB] text-[#2E7D32]'}>
                    {article.status.toUpperCase()}
                  </PillBadge>
                </td>
                <td className="px-6 py-4 text-sm text-[#78909C]">
                  <span suppressHydrationWarning>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </td>
                <td className="px-6 py-4 text-sm flex justify-end gap-2">
                  <Link href={`/admin/content/${article.id}/edit`} className="p-2 text-[#78909C] hover:bg-[#EBF5EB] rounded-md transition-colors">
                    <Edit size={16} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(article.id)}
                    className="p-2 text-[#78909C] hover:bg-red-50 hover:text-[#C62828] rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-[#78909C]">No articles found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
