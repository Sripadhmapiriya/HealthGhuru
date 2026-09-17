'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  CreditCard,
  Rss,
  Activity,
  CheckSquare,
  Layers,
  Megaphone,
  BarChart2,
  ListFilter,
  PlusCircle,
  DollarSign,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { IconAction } from '@/components/ui/IconAction';

const AD_SUB_LINKS = [
  { href: '/admin/advertisements', label: 'Ad Dashboard', icon: BarChart2 },
  { href: '/admin/advertisements/all', label: 'All Advertisements', icon: ListFilter },
  { href: '/admin/advertisements/add', label: 'Add Advertisement', icon: PlusCircle },
  { href: '/admin/advertisements/pricing', label: 'Ad Slot Pricing', icon: DollarSign },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const isAdsSection = pathname.startsWith('/admin/advertisements');
  const [adsOpen, setAdsOpen] = useState(isAdsSection);

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/content', label: 'Content Library', icon: FileText },
    { href: '/admin/sponsored-articles', label: 'Sponsored Articles', icon: Sparkles },
    { href: '/admin/review-queue', label: 'Review Queue', icon: CheckSquare },
    { href: '/admin/sources', label: 'Content Sources', icon: Rss },
    { href: '/admin/ingestion', label: 'Ingestion Runs', icon: Activity },
    { href: '/admin/categories', label: 'Taxonomy', icon: Layers },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/admin/campaigns', label: 'Campaign Requests', icon: ClipboardList },
  ];

  return (
    <>
      <nav className="space-y-1 mt-4 flex-1">
        {/* Regular Links */}
        {links.slice(0, 2).map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
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

        {/* ── ADVERTISEMENTS collapsible group ── */}
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

        {/* Remaining links */}
        {links.slice(2).map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
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
