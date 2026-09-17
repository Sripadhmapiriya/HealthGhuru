'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  Rss,
  Activity,
  Layers,
  Megaphone,
  BarChart2,
  ListFilter,
  PlusCircle,
  Tag,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Newspaper,
  Clock,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { IconAction } from '@/components/ui/IconAction';

const AD_SUB_LINKS = [
  { href: '/admin/advertisements', label: 'Ad Dashboard', icon: BarChart2 },
  { href: '/admin/advertisements/all', label: 'All Advertisements', icon: ListFilter },
  { href: '/admin/advertisements/add', label: 'Add Advertisement', icon: PlusCircle },
  { href: '/admin/advertisements/pricing', label: 'Ad Slot Pricing', icon: Tag },
];

const NEWS_LINKS = [
  { href: '/admin/add-news', label: 'Add News', icon: PlusCircle, isAdd: true },
  { href: '/admin/review-queue', label: 'Pending Approval', icon: Clock },
  { href: '/admin/all-news', label: 'All News', icon: Newspaper },
  { href: '/admin/all-news?status=published', label: 'Published News', icon: CheckCircle2 },
  { href: '/admin/all-news?filter=breaking', label: 'Breaking News', icon: Zap },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const isAdsSection = pathname.startsWith('/admin/advertisements');
  const [adsOpen, setAdsOpen] = useState(isAdsSection);

  const commercialLinks = [
    { href: '/admin/sponsored-articles', label: 'Sponsored Articles', icon: Newspaper },
    { href: '/admin/campaigns', label: 'Campaign Requests', icon: ClipboardList },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  ];

  const systemLinks = [
    { href: '/admin/categories', label: 'Taxonomy', icon: Layers },
    { href: '/admin/sources', label: 'Content Sources', icon: Rss },
    { href: '/admin/ingestion', label: 'Ingestion Runs', icon: Activity },
    { href: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <>
      <nav className="space-y-4 mt-4 flex-1">
        {/* Dashboard Top Link */}
        <Link
          href="/admin"
          prefetch={true}
          data-cursor="tab"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-heading font-medium text-sm transition-all duration-150 border-l-4 ${
            pathname === '/admin'
              ? 'bg-primary/10 text-primary border-primary font-semibold'
              : 'text-text-secondary hover:text-dark hover:bg-surface border-transparent'
          }`}
        >
          <IconAction context="nav">
            <LayoutDashboard size={18} className={pathname === '/admin' ? 'text-primary' : 'text-text-secondary'} />
          </IconAction>
          Dashboard
        </Link>

        {/* ── 1. NEWS MANAGEMENT ── */}
        <div className="space-y-1">
          <div className="px-4 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            News Management
          </div>
          {NEWS_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = link.isAdd 
              ? pathname === '/admin/add-news' 
              : pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                prefetch={true}
                data-cursor="tab"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-heading font-medium text-sm transition-all duration-150 border-l-4 ${
                  link.isAdd && isActive
                    ? 'bg-[#f06d2f] text-white border-[#f06d2f] font-bold shadow-xs'
                    : isActive
                    ? 'bg-primary/10 text-primary border-primary font-semibold'
                    : 'text-text-secondary hover:text-dark hover:bg-surface border-transparent'
                }`}
              >
                <IconAction context="nav">
                  <Icon size={18} className={link.isAdd && isActive ? 'text-white' : isActive ? 'text-primary' : 'text-text-secondary'} />
                </IconAction>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── 2. COMMERCIAL & ADVERTISEMENTS ── */}
        <div className="space-y-1">
          <div className="px-4 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            Advertisements &amp; Revenue
          </div>

          {/* ADVERTISEMENTS collapsible group */}
          <div>
            <button
              onClick={() => setAdsOpen((o) => !o)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-heading font-medium text-sm transition-all duration-150 border-l-4 ${
                isAdsSection
                  ? 'bg-primary/10 text-primary border-primary font-semibold'
                  : 'text-text-secondary hover:text-dark hover:bg-surface border-transparent'
              }`}
            >
              <Megaphone size={18} className={isAdsSection ? 'text-primary' : 'text-text-secondary'} />
              <span className="flex-1 text-left">Advertisements</span>
              {adsOpen ? (
                <ChevronDown size={14} className="text-text-secondary" />
              ) : (
                <ChevronRight size={14} className="text-text-secondary" />
              )}
            </button>

            {adsOpen && (
              <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-border pl-3">
                {AD_SUB_LINKS.map((sub) => {
                  const Icon = sub.icon;
                  const isSubActive = sub.href === '/admin/advertisements'
                    ? pathname === '/admin/advertisements'
                    : pathname.startsWith(sub.href);
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      prefetch={true}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-heading text-xs transition-all duration-150 ${
                        isSubActive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-text-secondary hover:text-dark hover:bg-surface'
                      }`}
                    >
                      <Icon size={14} className={isSubActive ? 'text-primary' : 'text-text-secondary'} />
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Commercial Links */}
          {commercialLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                data-cursor="tab"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-heading font-medium text-sm transition-all duration-150 border-l-4 ${
                  isActive
                    ? 'bg-primary/10 text-primary border-primary font-semibold'
                    : 'text-text-secondary hover:text-dark hover:bg-surface border-transparent'
                }`}
              >
                <IconAction context="nav">
                  <Icon size={18} className={isActive ? 'text-primary' : 'text-text-secondary'} />
                </IconAction>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── 3. DATA & SYSTEM ── */}
        <div className="space-y-1">
          <div className="px-4 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            System &amp; Data
          </div>
          {systemLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                data-cursor="tab"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-heading font-medium text-sm transition-all duration-150 border-l-4 ${
                  isActive
                    ? 'bg-primary/10 text-primary border-primary font-semibold'
                    : 'text-text-secondary hover:text-dark hover:bg-surface border-transparent'
                }`}
              >
                <IconAction context="nav">
                  <Icon size={18} className={isActive ? 'text-primary' : 'text-text-secondary'} />
                </IconAction>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <Link
          href="/admin/settings"
          prefetch={true}
          data-cursor="tab"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-heading font-medium text-sm transition-all duration-150 border-l-4 ${
            pathname.startsWith('/admin/settings')
              ? 'bg-primary/10 text-primary border-primary font-semibold'
              : 'text-text-secondary hover:text-dark hover:bg-surface border-transparent'
          }`}
        >
          <IconAction context="nav">
            <Settings size={18} className={pathname.startsWith('/admin/settings') ? 'text-primary' : 'text-text-secondary'} />
          </IconAction>
          Settings
        </Link>
      </div>
    </>
  );
}
