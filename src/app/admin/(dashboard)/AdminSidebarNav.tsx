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
  ShieldAlert,
  Zap,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  colorClass: string;
  badge?: string;
  badgeType?: 'live' | 'cms' | 'pro' | 'inbox' | 'vetted';
  exact?: boolean;
}

interface NavSection {
  title: string;
  icon: any;
  highlightClass: string;
  dotColor: string;
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
    icon: LayoutDashboard,
    highlightClass: 'bg-sky-500/15 text-sky-950 border-sky-400/40 shadow-xs',
    dotColor: 'bg-sky-500 ring-sky-400/40',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, colorClass: 'bg-sky-100 text-sky-700', exact: true },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell, colorClass: 'bg-amber-100 text-amber-700', badge: 'Live', badgeType: 'live' },
    ],
  },
  {
    title: 'CONTENT & EDITORIAL',
    icon: FileText,
    highlightClass: 'bg-emerald-500/15 text-emerald-950 border-emerald-400/40 shadow-xs',
    dotColor: 'bg-emerald-500 ring-emerald-400/40',
    items: [
      { href: '/admin/homepage-builder', label: 'Homepage Builder', icon: LayoutTemplate, colorClass: 'bg-indigo-100 text-indigo-700', badge: 'Builder', badgeType: 'cms' },
      { href: '/admin/magazines', label: 'Magazine Generator', icon: BookOpen, colorClass: 'bg-emerald-100 text-emerald-700', badge: 'New', badgeType: 'pro' },
      { href: '/admin/add-news', label: 'Add News', icon: PlusCircle, colorClass: 'bg-emerald-100 text-emerald-700' },
      { href: '/admin/all-news', label: 'All News', icon: Newspaper, colorClass: 'bg-teal-100 text-teal-700' },
      { href: '/admin/settings/pages', label: 'Website Pages', icon: Globe, colorClass: 'bg-blue-100 text-blue-700', badge: 'CMS', badgeType: 'cms' },
      { href: '/admin/content', label: 'Content Library', icon: FileText, colorClass: 'bg-violet-100 text-violet-700' },
      { href: '/admin/media', label: 'Media Library', icon: ImageIcon, colorClass: 'bg-purple-100 text-purple-700' },
      { href: '/admin/review-queue', label: 'Review Queue', icon: CheckSquare, colorClass: 'bg-amber-100 text-amber-800', badge: 'Vetted', badgeType: 'vetted' },
      { href: '/admin/categories', label: 'Categories', icon: Tag, colorClass: 'bg-rose-100 text-rose-700' },
      { href: '/admin/sources', label: 'Content Sources', icon: Rss, colorClass: 'bg-orange-100 text-orange-700' },
      { href: '/admin/ingestion', label: 'Ingestion Runs', icon: Activity, colorClass: 'bg-cyan-100 text-cyan-700' },
    ],
  },
  {
    title: 'GROWTH & COMMERCIAL',
    icon: Sparkles,
    highlightClass: 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/15 text-orange-950 border-orange-400/50 shadow-sm',
    dotColor: 'bg-gradient-to-r from-orange-500 to-amber-500 ring-orange-400/40',
    items: [
      { href: '/admin/sponsored-articles', label: 'Sponsored Articles', icon: Sparkles, colorClass: 'bg-gradient-to-tr from-amber-200 to-orange-100 text-orange-800 ring-1 ring-orange-300/60', badge: 'PRO', badgeType: 'pro' },
      { href: '/admin/settings/payment', label: 'Payment Gateway & UPI', icon: CreditCard, colorClass: 'bg-emerald-100 text-emerald-700' },
      { href: '/admin/settings/email', label: 'Email & SMTP Gateway', icon: Mail, colorClass: 'bg-indigo-100 text-indigo-700' },
      { href: '/admin/contact-queries', label: 'Contact Queries', icon: Mail, colorClass: 'bg-sky-100 text-sky-700', badge: 'Inbox', badgeType: 'inbox' },
      { href: '/admin/campaigns', label: 'Campaign Requests', icon: ClipboardList, colorClass: 'bg-emerald-100 text-emerald-700' },
      { href: '/admin/users', label: 'Users', icon: Users, colorClass: 'bg-blue-100 text-blue-700' },
      { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard, colorClass: 'bg-amber-100 text-amber-800' },
    ],
  },
];

interface AdminSidebarNavProps {
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

export function AdminSidebarNav({ isCollapsed = false, onNavigate }: AdminSidebarNavProps) {
  const pathname = usePathname() || '';
  const isAdsSection = pathname.startsWith('/admin/advertisements');
  const [adsOpen, setAdsOpen] = useState(isAdsSection || pathname.includes('advertisements'));
  const [navSearch, setNavSearch] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

  const renderBadge = (item: NavItem, isActive: boolean) => {
    if (!item.badge) return null;

    if (isActive) {
      return (
        <span className="relative z-10 px-2 py-0.5 rounded-md bg-white text-emerald-800 text-[10px] font-mono font-extrabold shadow-sm">
          {item.badge}
        </span>
      );
    }

    if (item.badgeType === 'live') {
      return (
        <span className="relative z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-extrabold shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{item.badge}</span>
        </span>
      );
    }

    if (item.badgeType === 'cms') {
      return (
        <span className="relative z-10 px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-mono font-extrabold tracking-wide shadow-xs">
          {item.badge}
        </span>
      );
    }

    if (item.badgeType === 'pro') {
      return (
        <span className="relative z-10 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white text-[10px] font-mono font-extrabold shadow-xs shadow-orange-500/20">
          {item.badge}
        </span>
      );
    }

    if (item.badgeType === 'inbox') {
      return (
        <span className="relative z-10 px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-300 text-[10px] font-mono font-bold shadow-2xs">
          {item.badge}
        </span>
      );
    }

    if (item.badgeType === 'vetted') {
      return (
        <span className="relative z-10 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold shadow-2xs">
          {item.badge}
        </span>
      );
    }

    return (
      <span className="relative z-10 px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-mono font-bold">
        {item.badge}
      </span>
    );
  };

  return (
    <div className={`flex-1 py-1 ${isCollapsed ? 'space-y-4' : 'space-y-6'}`}>
      {/* ── Quick Search Filter Bar (Expanded Mode) ── */}
      {!isCollapsed && (
        <div className="relative px-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Search navigation..."
            className="w-full pl-8 pr-3 py-2 bg-white/90 hover:bg-white focus:bg-white text-[12px] font-medium text-slate-800 rounded-xl border border-emerald-900/15 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400 shadow-2xs"
          />
          {navSearch && (
            <button
              onClick={() => setNavSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* ── Grouped Nav Sections ── */}
      {filteredSections.map((section) => {
        const SectionIcon = section.icon;

        return (
          <div key={section.title} className="space-y-2">
            {/* ── Section Header with ENLARGED & HIGHLIGHTED Styling ── */}
            {!isCollapsed ? (
              <div className="px-1">
                <div
                  className={`px-3 py-1.5 rounded-xl border flex items-center justify-between transition-all ${section.highlightClass}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ring-2 ${section.dotColor} shrink-0 animate-pulse`} />
                    <span className="text-[12px] sm:text-[13px] font-black tracking-wider uppercase font-heading truncate">
                      {section.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-white/80 border border-current/20 shrink-0">
                    {section.items.length + (section.title === 'GROWTH & COMMERCIAL' ? 1 : 0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-1">
                <div
                  className={`w-8 h-1 rounded-full ${section.title === 'GROWTH & COMMERCIAL' ? 'bg-orange-400' : section.title === 'CONTENT & EDITORIAL' ? 'bg-emerald-400' : 'bg-sky-400'}`}
                  title={section.title}
                />
              </div>
            )}

            {/* Section Nav Items */}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = isLinkActive(item);

                return (
                  <div key={item.href} className="relative">
                    <Link
                      href={item.href}
                      prefetch={true}
                      onClick={() => onNavigate?.()}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`group relative flex items-center rounded-xl font-heading text-[13px] transition-all duration-200 outline-none cursor-pointer ${
                        isCollapsed
                          ? 'justify-center p-2.5'
                          : 'gap-3 px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#047857] text-white shadow-md shadow-emerald-700/25 font-bold border border-emerald-500/50'
                          : 'text-slate-700 hover:text-emerald-950 hover:bg-white/90 hover:shadow-xs font-semibold hover:translate-x-1 border border-transparent hover:border-emerald-300/40'
                      }`}
                    >
                      {/* Left Active Glow Indicator Strip */}
                      {isActive && (
                        <motion.span
                          layoutId="sidebarActiveIndicator"
                          className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}

                      {/* Icon Container with Colorful Background & Micro-interaction */}
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: isActive ? 0 : 3 }}
                        whileTap={{ scale: 0.92 }}
                        className={`relative z-10 p-2 rounded-xl transition-all duration-200 shrink-0 ${
                          isActive
                            ? 'bg-white/25 text-white shadow-xs backdrop-blur-xs ring-1 ring-white/40'
                            : `${item.colorClass} group-hover:scale-105 shadow-2xs`
                        }`}
                      >
                        <Icon size={16} />
                      </motion.div>

                      {/* Label (Expanded Mode) */}
                      {!isCollapsed && (
                        <span className="relative z-10 flex-1 truncate transition-colors duration-200 text-[13.5px]">
                          {item.label}
                        </span>
                      )}

                      {/* Badge (Expanded Mode) */}
                      {!isCollapsed && renderBadge(item, isActive)}
                    </Link>

                    {/* Collapsed Mode Tooltip Popover */}
                    {isCollapsed && hoveredItem === item.href && (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-heading font-bold shadow-xl border border-slate-700 whitespace-nowrap flex items-center gap-2"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500 text-white">
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}

              {/* Collapsible Advertisements group in Section 3 (Growth & Commercial) */}
              {section.title === 'GROWTH & COMMERCIAL' && (
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setAdsOpen((o) => !o)}
                    className={`group w-full relative flex items-center rounded-xl font-heading text-[13px] transition-all duration-200 outline-none cursor-pointer ${
                      isCollapsed
                        ? 'justify-center p-2.5'
                        : 'gap-3 px-3 py-2.5'
                    } ${
                      isAdsSection
                        ? 'bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#047857] text-white shadow-md shadow-emerald-700/25 font-bold border border-emerald-500/50'
                        : 'text-slate-700 hover:text-emerald-950 hover:bg-white/90 hover:shadow-xs font-semibold hover:translate-x-1 border border-transparent hover:border-emerald-300/40'
                    }`}
                    title={isCollapsed ? 'Advertisements Engine' : undefined}
                  >
                    {isAdsSection && (
                      <motion.span
                        layoutId="sidebarActiveIndicator"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className={`relative z-10 p-2 rounded-xl transition-all duration-200 shrink-0 ${
                        isAdsSection
                          ? 'bg-white/25 text-white shadow-xs ring-1 ring-white/40'
                          : 'bg-rose-100 text-rose-700 group-hover:scale-105 shadow-2xs'
                      }`}
                    >
                      <Megaphone size={16} />
                    </motion.div>

                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left truncate text-[13.5px]">
                          Advertisements
                        </span>
                        <motion.div
                          animate={{ rotate: adsOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={isAdsSection ? 'text-white' : 'text-slate-400 group-hover:text-emerald-800'}
                        >
                          <ChevronDown size={15} />
                        </motion.div>
                      </>
                    )}
                  </button>

                  {/* Animated Collapsible Sub-tree with colorful guide line */}
                  <AnimatePresence initial={false}>
                    {adsOpen && !isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden pl-5 pr-1 mt-1.5 space-y-1 border-l-2 border-emerald-500/40 ml-5"
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
                              onClick={() => onNavigate?.()}
                              className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl font-heading text-xs transition-all duration-150 relative ${
                                isSubActive
                                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                  : 'text-slate-600 hover:text-emerald-950 hover:bg-white/80 font-medium'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                  isSubActive
                                    ? 'bg-white scale-125 ring-2 ring-white/50'
                                    : 'bg-emerald-400 group-hover:scale-125'
                                }`}
                              />
                              <SubIcon
                                size={14}
                                className={isSubActive ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-700'}
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
        );
      })}

      {/* ── System Preferences & Live Engine Card ── */}
      <div className={`border-t border-emerald-900/10 space-y-2.5 ${isCollapsed ? 'pt-2 flex flex-col items-center' : 'pt-3'}`}>
        <Link
          href="/admin/settings"
          prefetch={true}
          onClick={() => onNavigate?.()}
          className={`group relative flex items-center rounded-xl font-heading text-[13px] transition-all duration-200 cursor-pointer ${
            isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
          } ${
            pathname.startsWith('/admin/settings') && !pathname.startsWith('/admin/settings/pages') && !pathname.startsWith('/admin/settings/email') && !pathname.startsWith('/admin/settings/payment')
              ? 'bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#047857] text-white shadow-md shadow-emerald-700/25 font-bold border border-emerald-500/50'
              : 'text-slate-700 hover:text-emerald-950 hover:bg-white/90 hover:shadow-xs font-semibold hover:translate-x-1 border border-transparent hover:border-emerald-300/40'
          }`}
          title={isCollapsed ? 'System Settings' : undefined}
        >
          {pathname.startsWith('/admin/settings') && !pathname.startsWith('/admin/settings/pages') && !pathname.startsWith('/admin/settings/email') && !pathname.startsWith('/admin/settings/payment') && (
            <motion.span
              layoutId="sidebarActiveIndicator"
              className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}

          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
            className={`p-2 rounded-xl transition-all shrink-0 ${
              pathname.startsWith('/admin/settings') && !pathname.startsWith('/admin/settings/pages') && !pathname.startsWith('/admin/settings/email') && !pathname.startsWith('/admin/settings/payment')
                ? 'bg-white/25 text-white shadow-xs ring-1 ring-white/40'
                : 'bg-slate-200/80 text-slate-700 group-hover:scale-105 shadow-2xs'
            }`}
          >
            <Settings size={16} />
          </motion.div>
          {!isCollapsed && <span className="flex-1 truncate text-[13.5px]">System Settings</span>}
        </Link>

        {/* Live System Health Widget (Expanded Mode) */}
        {!isCollapsed && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white/90 via-[#F4FAF6] to-emerald-50 border border-emerald-500/25 shadow-xs backdrop-blur-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-emerald-300" />
                </span>
                <span className="text-[12px] font-heading font-black text-emerald-950 tracking-tight">
                  HealthGhuru Engine
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold shadow-2xs">
                99.9%
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-snug mb-2.5 font-medium">
              Neon PostgreSQL &amp; Medical Ingestion active.
            </p>

            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200/90 hover:border-emerald-400 text-emerald-800 hover:text-emerald-950 text-xs font-heading font-bold transition-all shadow-2xs group"
            >
              <span>Visit Public Site</span>
              <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-emerald-600" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

