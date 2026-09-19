/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import Link from 'next/link';
import {
  Users,
  FileText,
  Globe,
  BookOpen,
  Tag,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Megaphone,
  CheckSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { DashboardChartClient } from './DashboardChartClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await requireAdmin();

  // Run all independent analytics and chart queries in parallel
  const [
    totalContent,
    totalArticles,
    activeSources,
    totalUsers,
    totalCategories,
    chartDataRaw,
    recentIngestions,
  ] = await Promise.all([
    sql`SELECT count(*) FROM content_items WHERE status = 'published' AND deleted_at IS NULL`,
    sql`SELECT count(*) FROM content_items WHERE content_type = 'article' AND status = 'published' AND deleted_at IS NULL`,
    sql`SELECT count(*) FROM content_sources WHERE enabled = TRUE`,
    sql`SELECT count(*) FROM users`,
    sql`SELECT count(*) FROM content_categories WHERE is_enabled = TRUE`,
    sql`
      SELECT DATE(published_at) as date, COUNT(*) as count
      FROM content_items
      WHERE published_at >= CURRENT_DATE - INTERVAL '30 days' AND deleted_at IS NULL
      GROUP BY DATE(published_at)
      ORDER BY DATE(published_at) ASC
    `,
    sql`
      SELECT id, title, category, published_at, source_name, content_type
      FROM (
        SELECT i.id, i.title, i.category, i.published_at, i.content_type,
               COALESCE(s.name, 'HealthGuru Wire') as source_name
        FROM content_items i
        LEFT JOIN content_sources s ON i.source_id = s.id
        WHERE i.status = 'published' AND i.deleted_at IS NULL
        ORDER BY i.published_at DESC
        LIMIT 5
      ) r
    `,
  ]);

  // Generate the last 30 days continuous chart data
  const chartData = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const found = chartDataRaw.find((row: any) => {
      const rowDateStr =
        row.date instanceof Date
          ? row.date.toISOString().split('T')[0]
          : new Date(row.date).toISOString().split('T')[0];
      return rowDateStr === dateStr;
    });

    chartData.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: found ? parseInt(found.count) : 0,
    });
  }

  const kpis = [
    {
      label: 'Published Health Stories',
      value: totalContent[0]?.count || 0,
      icon: FileText,
      color: 'text-[#16A34A]',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200/80',
      trend: '+18% this month',
    },
    {
      label: 'Active Taxonomy Categories',
      value: totalCategories[0]?.count || 0,
      icon: Tag,
      color: 'text-[#f06d2f]',
      bg: 'bg-orange-50',
      border: 'border-orange-200/80',
      trend: '20 Core Pillars',
      href: '/admin/categories',
    },
    {
      label: 'Syndicated Content Sources',
      value: activeSources[0]?.count || 0,
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200/80',
      trend: 'Auto-Sync Active',
      href: '/admin/sources',
    },
    {
      label: 'Registered Platform Users',
      value: totalUsers[0]?.count || 0,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200/80',
      trend: 'Active Community',
      href: '/admin/users',
    },
  ];

  const quickActions = [
    {
      title: 'Categories CRUD',
      desc: 'Create, edit & manage news taxonomy and slugs',
      href: '/admin/categories',
      icon: Tag,
      color: 'text-[#f06d2f]',
      bg: 'bg-orange-50',
    },
    {
      title: 'Content Library',
      desc: 'Browse, filter and edit all 20,000+ health articles',
      href: '/admin/content',
      icon: FileText,
      color: 'text-[#16A34A]',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Sponsored Articles',
      desc: 'Manage partner campaigns, clinical approvals & revenue',
      href: '/admin/sponsored-articles',
      icon: Sparkles,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Content Sources',
      desc: 'Configure RSS feeds and medical ingestion pipelines',
      href: '/admin/sources',
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Review Queue',
      desc: 'Verify clinical facts, citations, and pending drafts',
      href: '/admin/review-queue',
      icon: CheckSquare,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Ad Engine',
      desc: 'Configure banners, popups, and revenue placement',
      href: '/admin/advertisements',
      icon: Megaphone,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* ── 1. Top Welcome Banner ── */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-mono font-bold uppercase tracking-wider">
              <Zap size={13} className="text-amber-300" />
              <span>HEALTHGHURU ADMIN CONSOLE</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Welcome back, Administrator
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-body">
              Platform content ingestion, taxonomy classification, sponsored campaigns, and medical editorial workflows are running smoothly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-emerald-900 font-heading font-bold text-xs sm:text-sm shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Tag size={15} className="text-[#f06d2f]" />
              <span>Manage Categories</span>
            </Link>
            <Link
              href="/admin/content"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-heading font-bold text-xs sm:text-sm transition-all duration-200"
            >
              <FileText size={15} />
              <span>View Articles</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Responsive Animated KPI Cards Grid (1 col sm, 2 col md, 4 col xl) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const CardContent = (
            <div
              className={`bg-white rounded-2xl p-5 sm:p-6 border ${kpi.border} shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs font-heading font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {kpi.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
                    {kpi.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-xs`}
                >
                  <Icon size={22} />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-emerald-600 flex items-center gap-1 font-mono">
                  <TrendingUp size={12} />
                  {kpi.trend}
                </span>
                {kpi.href && (
                  <span className="font-heading font-bold text-slate-400 group-hover:text-slate-900 inline-flex items-center gap-0.5 transition-colors">
                    <span>Manage</span>
                    <ArrowRight size={12} />
                  </span>
                )}
              </div>
            </div>
          );

          return kpi.href ? (
            <Link key={idx} href={kpi.href} className="block h-full">
              {CardContent}
            </Link>
          ) : (
            <div key={idx} className="h-full">
              {CardContent}
            </div>
          );
        })}
      </div>

      {/* ── 3. Charts & Ingestion Activity Grid (2 col layout) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity size={16} className="text-[#16A34A]" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                  Content Publishing Velocity
                </h3>
              </div>
              <p className="text-xs text-slate-500">Daily published stories across all categories (Last 30 Days)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200 self-start sm:self-auto">
              Real-time DB Sync
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <DashboardChartClient data={chartData} />
          </div>
        </div>

        {/* Recent Activity Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Latest Content Feed
              </h3>
              <Link href="/admin/content" className="text-xs font-bold text-[#16A34A] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentIngestions.map((item: any, idx: number) => (
                <div
                  key={item.id || idx}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/70 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#f06d2f] px-2 py-0.5 rounded bg-orange-50 border border-orange-200">
                      {item.category || 'Wellness'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.source_name}
                    </span>
                  </div>
                  <h4 className="font-heading font-semibold text-xs text-slate-900 line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Status: Operational</span>
            <span className="text-emerald-600 font-bold">100% Ingestion Health</span>
          </div>
        </div>
      </div>

      {/* ── 4. Quick Action Shortcuts Grid ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
            Quick Administrative Modules
          </h3>
          <span className="text-xs text-slate-400 font-mono">6 Core Workflows</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                href={action.href}
                className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-start gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xs`}
                >
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors flex items-center justify-between">
                    <span>{action.title}</span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 group-hover:text-[#16A34A] transition-all" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
