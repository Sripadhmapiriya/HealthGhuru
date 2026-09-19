/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  LayoutTemplate,
  PlusCircle,
  Newspaper,
  Tag,
  Users,
  FileText,
  Settings,
  CreditCard,
  Rss,
  Activity,
  CheckSquare,
  Megaphone,
  BarChart2,
  ListFilter,
  Sparkles,
  ClipboardList,
  ChevronDown,
  Mail,
  Image as ImageIcon,
  Bell,
  Globe,
  Search,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  badgeType?: 'live' | 'cms' | 'pro' | 'inbox' | 'vetted';
  exact?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const AD_SUB_LINKS = [
  { href: '/admin/advertisements', label: 'Ad Dashboard', icon: BarChart2, exact: true },
  { href: '/admin/advertisements/all', label: 'All Campaigns', icon: ListFilter },
  { href: '/admin/advertisements/add', label: 'Add Advertisement', icon: PlusCircle },
  { href: '/admin/advertisements/pricing', label: 'Ad Slot Pricing', icon: Tag },
];

const SECTIONS: NavSection[] = [
  {
    title: 'MAIN OVERVIEW',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell, badge: 'Live', badgeType: 'live' },
    ],
  },
  {
    title: 'CONTENT & EDITORIAL',
    items: [
      { href: '/admin/homepage-builder', label: 'Homepage Builder', icon: LayoutTemplate, badge: 'Builder', badgeType: 'cms' },
      { href: '/admin/add-news', label: 'Add News', icon: PlusCircle },
      { href: '/admin/all-news', label: 'All News', icon: Newspaper },
      { href: '/admin/settings/pages', label: 'Website Pages', icon: Globe, badge: 'CMS', badgeType: 'cms' },
      { href: '/admin/content', label: 'Content Library', icon: FileText },
      { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
      { href: '/admin/review-queue', label: 'Review Queue', icon: CheckSquare, badge: 'Vetted', badgeType: 'vetted' },
      { href: '/admin/categories', label: 'Categories', icon: Tag },
      { href: '/admin/sources', label: 'Content Sources', icon: Rss },
      { href: '/admin/ingestion', label: 'Ingestion Runs', icon: Activity },
    ],
  },
  {
    title: 'GROWTH & COMMERCIAL',
    items: [
      { href: '/admin/sponsored-articles', label: 'Sponsored Articles', icon: Sparkles, badge: 'PRO', badgeType: 'pro' },
      { href: '/admin/contact-queries', label: 'Contact Queries', icon: Mail, badge: 'Inbox', badgeType: 'inbox' },
      { href: '/admin/campaigns', label: 'Campaign Requests', icon: ClipboardList },
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    ],
  },
];

export function AdminSidebarNav() {
  const pathname = usePathname() || '';
  const isAdsSection = pathname.startsWith('/admin/advertisements');
  const [adsOpen, setAdsOpen] = useState(isAdsSection || pathname.includes('advertisements'));
  const [navSearch, setNavSearch] = useState('');

  const isLinkActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  // Filter sections if admin types in search input
  const filteredSections = useMemo(() => {
    if (!navSearch.trim()) return SECTIONS;
    const q = navSearch.toLowerCase();
    return SECTIONS.map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (i) => i.label.toLowerCase().includes(q) || i.href.toLowerCase().includes(q)
      ),
    })).filter((sec) => sec.items.length > 0 || (sec.title === 'GROWTH & COMMERCIAL' && 'advertisements'.includes(q)));
  }, [navSearch]);

  const renderBadge = (item: NavItem) => {
    if (!item.badge) return null;

    if (item.badgeType === 'live') {
      return (
        <span className="relative z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{item.badge}</span>
        </span>
      );
    }

    if (item.badgeType === 'cms') {
      return (
        <span className="relative z-10 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-extrabold tracking-wide shadow-2xs">
          {item.badge}
        </span>
      );
    }

    if (item.badgeType === 'pro') {
      return (
        <span className="relative z-10 px-2 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-mono font-extrabold shadow-2xs">
          {item.badge}
        </span>
      );
    }

    if (item.badgeType === 'inbox') {
      return (
        <span className="relative z-10 px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-mono font-bold shadow-2xs">
          {item.badge}
        </span>
      );
    }

    if (item.badgeType === 'vetted') {
      return (
        <span className="relative z-10 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-bold shadow-2xs">
          {item.badge}
        </span>
      );
    }

    return (
      <span className="relative z-10 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
        {item.badge}
      </span>
    );
  };

  return (
    <div className="space-y-5 flex-1 py-1">
      {/* ── Quick Search Filter Bar ── */}
      <div className="relative px-1">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={navSearch}
          onChange={(e) => setNavSearch(e.target.value)}
          placeholder="Quick search navigation..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/90 focus:bg-white text-[11px] font-medium text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400 shadow-2xs"
        />
        {navSearch && (
          <button
            onClick={() => setNavSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Grouped Nav Sections ── */}
      {filteredSections.map((section) => (
        <div key={section.title} className="space-y-1.5">
          {/* Section Header */}
          <div className="px-3 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              {section.title}
            </span>
            <span className="text-[9px] font-mono text-slate-300 font-semibold">
              {section.items.length + (section.title === 'GROWTH & COMMERCIAL' ? 1 : 0)}
            </span>
          </div>

          {/* Section Nav Items */}
          <nav className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = isLinkActive(item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs sm:text-[13px] transition-all duration-200 outline-none ${
                    isActive
                      ? 'text-emerald-950 font-bold bg-emerald-500/10 border border-emerald-500/25 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium hover:translate-x-1'
                  }`}
                >
                  {/* Left Active Glow Indicator Strip */}
                  {isActive && (
                    <motion.span
                      layoutId="sidebarActiveIndicator"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-r-full shadow-sm shadow-emerald-500/50"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Icon Container with Micro-interaction */}
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: isActive ? 0 : 2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative z-10 p-1.5 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 ring-2 ring-emerald-600/20'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                    }`}
                  >
                    <Icon size={15} />
                  </motion.div>

                  {/* Label */}
                  <span className="relative z-10 flex-1 truncate transition-transform duration-200">
                    {item.label}
                  </span>

                  {/* Badge */}
                  {renderBadge(item)}
                </Link>
              );
            })}

            {/* Inject Collapsible Advertisements group in Section 3 (Growth & Commercial) */}
            {section.title === 'GROWTH & COMMERCIAL' && (
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setAdsOpen((o) => !o)}
                  className={`group w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs sm:text-[13px] transition-all duration-200 outline-none cursor-pointer ${
                    isAdsSection
                      ? 'text-emerald-950 font-bold bg-emerald-500/10 border border-emerald-500/25 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium hover:translate-x-1'
                  }`}
                >
                  {isAdsSection && (
                    <motion.span
                      layoutId="sidebarActiveIndicator"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-r-full shadow-sm shadow-emerald-500/50"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isAdsSection
                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                    }`}
                  >
                    <Megaphone size={15} />
                  </motion.div>

                  <span className="flex-1 text-left truncate">
                    Advertisements
                  </span>

                  <motion.div
                    animate={{ rotate: adsOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400 group-hover:text-slate-700"
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </button>

                {/* Animated Collapsible Sub-tree with guide line */}
                <AnimatePresence initial={false}>
                  {adsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden pl-6 pr-1 mt-1 space-y-0.5 border-l-2 border-emerald-500/20 ml-5"
                    >
                      {AD_SUB_LINKS.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = sub.exact
                          ? pathname === sub.href
                          : pathname.startsWith(sub.href);

                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            prefetch={true}
                            className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg font-heading text-xs transition-all duration-150 relative ${
                              isSubActive
                                ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                isSubActive
                                  ? 'bg-emerald-500 scale-125 ring-2 ring-emerald-300'
                                  : 'bg-slate-300 group-hover:bg-emerald-400'
                              }`}
                            />
                            <SubIcon
                              size={13}
                              className={isSubActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'}
                            />
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>
        </div>
      ))}

      {/* ── System Preferences & Live Engine Card ── */}
      <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
        <Link
          href="/admin/settings"
          prefetch={true}
          className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading text-xs sm:text-[13px] transition-all duration-200 ${
            pathname.startsWith('/admin/settings') && !pathname.startsWith('/admin/settings/pages')
              ? 'text-emerald-950 font-bold bg-emerald-500/10 border border-emerald-500/25 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium hover:translate-x-1'
          }`}
        >
          {pathname.startsWith('/admin/settings') && !pathname.startsWith('/admin/settings/pages') && (
            <motion.span
              layoutId="sidebarActiveIndicator"
              className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-r-full shadow-sm shadow-emerald-500/50"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}

          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
            className={`p-1.5 rounded-lg transition-colors ${
              pathname.startsWith('/admin/settings') && !pathname.startsWith('/admin/settings/pages')
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
            }`}
          >
            <Settings size={15} />
          </motion.div>
          <span className="flex-1 truncate">System Settings</span>
        </Link>

        {/* Live System Health Widget */}
        <div className="mx-0.5 p-3.5 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-heading font-extrabold text-slate-900 tracking-tight">
                HealthGhuru Engine
              </span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100/80 text-emerald-800 font-bold">
              99.9%
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight mb-2.5">
            Neon PostgreSQL &amp; Medical Ingestion active.
          </p>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 text-[11px] font-heading font-semibold transition-all shadow-2xs group"
          >
            <span>Visit Public Site</span>
            <ExternalLink size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
