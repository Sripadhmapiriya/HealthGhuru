/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  Activity,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon_name?: string | null;
  display_order?: number;
  is_enabled?: boolean;
  item_count?: number;
  created_at?: string;
}

interface CategoriesClientProps {
  initialCategories: CategoryItem[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Auto-generate slug when name changes (unless editing and manually set)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
    );
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Reset form
  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setEditingId(null);
  };

  // Start edit mode
  const startEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch updated list
  const refreshCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to refresh categories:', err);
    }
  };

  // Create or Update handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      showToast('Category name and slug are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // UPDATE existing
        const res = await fetch(`/api/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim() || null,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Category "${name}" updated successfully!`, 'success');
          resetForm();
          await refreshCategories();
        } else {
          showToast(data.error?.message || 'Failed to update category', 'error');
        }
      } else {
        // CREATE new
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim() || null,
            displayOrder: categories.length + 1,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Category "${name}" created successfully!`, 'success');
          resetForm();
          await refreshCategories();
        } else {
          showToast(data.error?.message || 'Failed to create category', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category handler
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Category deleted successfully.', 'success');
        setDeleteConfirmId(null);
        if (editingId === id) resetForm();
        await refreshCategories();
      } else {
        showToast(data.error?.message || 'Failed to delete category', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred during deletion', 'error');
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase().trim();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.slug.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query))
    );
  }, [categories, searchQuery]);

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center justify-between border shadow-sm ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' ? (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={18} className="text-red-600 shrink-0" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 ml-4 p-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. Header Section in Light Mode ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏷️</span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Categories CRUD
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage news taxonomy and slugs.
          </p>
        </div>

        {/* Top-Right Live Search Filter & Total Count */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search taxonomy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-[#f06d2f] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-mono shrink-0 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900">{categories.length}</span> Total
          </div>
        </div>
      </div>

      {/* ── 2. Add / Edit Category Form Card (Light Mode) ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        {editingId && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
            <Edit2 size={12} />
            <span>Editing Category Mode</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Field 1: Category Name */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="block text-xs font-heading font-bold text-slate-700">
                Category Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cancer, Heart Health, Nutrition"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-[#f06d2f] transition-all"
              />
            </div>

            {/* Field 2: Slug (Lowercase) */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs font-heading font-bold text-slate-700">
                Slug (Lowercase, e.g. sports)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. cancer, heart, nutrition"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-[#f06d2f] transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-xl font-heading font-bold text-sm text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                  editingId
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                    : 'bg-[#f06d2f] hover:bg-[#e05a1b] shadow-orange-500/20 active:scale-98'
                } disabled:opacity-50`}
              >
                {editingId ? (
                  <>
                    <Edit2 size={15} />
                    <span>Update Category</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Add Category</span>
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  title="Cancel editing"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* ── 3. Categories CRUD Table (Light Mode) ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-heading font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">CATEGORY NAME</th>
                <th className="py-4 px-6">SLUG</th>
                <th className="py-4 px-6">ARTICLES / STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <p className="font-heading font-bold text-slate-700 mb-1">No Categories Found</p>
                    <p className="text-xs text-slate-500">
                      {searchQuery
                        ? `No category matching "${searchQuery}". Try a different keyword.`
                        : 'No categories created yet. Use the form above to add your first health category.'}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-3 text-xs text-[#f06d2f] hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <RotateCcw size={12} /> Clear Filter
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const isBeingEdited = editingId === cat.id;
                  return (
                    <tr
                      key={cat.id}
                      className={`group hover:bg-slate-50/70 transition-colors ${
                        isBeingEdited ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      {/* Category Name */}
                      <td className="py-4 px-6 font-heading font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[#f06d2f] shrink-0" />
                          <span className="group-hover:text-[#16A34A] transition-colors">
                            {cat.name}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5 ml-4.5">
                            {cat.description}
                          </p>
                        )}
                      </td>

                      {/* Slug */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200">
                          {cat.slug}
                        </span>
                      </td>

                      {/* Item Count / Status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{cat.item_count || 0} items</span>
                          </span>
                        </div>
                      </td>

                      {/* Actions (Edit, Delete) */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-4 text-xs font-bold">
                          <button
                            onClick={() => startEdit(cat)}
                            className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(cat.id)}
                            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-900 space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">Delete Category</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete category{' '}
                <strong className="text-slate-900">
                  &ldquo;
                  {categories.find((c) => c.id === deleteConfirmId)?.name || 'this category'}
                  &rdquo;
                </strong>
                ? Any linked sources will be safely detached.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
