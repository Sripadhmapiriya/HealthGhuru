'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Tag,
  Megaphone,
  BarChart2,
  ListFilter,
  PlusCircle,
  Newspaper,
  FileText,
  Sparkles,
  CheckSquare,
  Rss,
  Zap,
  Users,
  CreditCard,
  ClipboardList,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { IconAction } from '@/components/ui/IconAction';

const AD_SUB_LINKS = [
  { href: '/admin/advertisements', label: 'Ad Dashboard', icon: BarChart2 },
  { href: '/admin/advertisements/all', label: 'All Advertisements', icon: ListFilter },
  { href: '/admin/advertisements/add', label: 'Add Advertisement', icon: PlusCircle },
  { href: '/admin/advertisements/pricing', label: 'Ad Slot Pricing', icon: Tag },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const isAdsSection = pathname.startsWith('/admin/advertisements');
  const [adsOpen, setAdsOpen] = useState(isAdsSection);

  // Top navigation links matching the original HealthGhuru sidebar,
  // with the two new pages: Add News & All News seamlessly integrated
  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'Categories', icon: Tag },
    // Advertisements accordion rendered separately right here
    { href: '/admin/content', label: 'Content Library', icon: FileText },
    { href: '/admin/add-news', label: 'Add News', icon: PlusCircle },
    { href: '/admin/all-news', label: 'All News', icon: Newspaper },
    { href: '/admin/sponsored-articles', label: 'Sponsored Articles', icon: Sparkles },
    { href: '/admin/review-queue', label: 'Review Queue', icon: CheckSquare },
    { href: '/admin/sources', label: 'Content Sources', icon: Rss },
    { href: '/admin/ingestion', label: 'Ingestion Runs', icon: Zap },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/admin/campaigns', label: 'Campaign Requests', icon: ClipboardList },
  ];

  const renderLink = (link: { href: string; label: string; icon: any }) => {
    const Icon = link.icon;
    const isActive =
      link.href === '/admin'
        ? pathname === '/admin'
        : pathname === link.href || pathname.startsWith(`${link.href}/`);

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
        <span>{link.label}</span>
      </Link>
    );
  };

  return (
    <>
      <nav className="space-y-1 mt-2 flex-1 overflow-y-auto min-h-0 pr-1">
        {/* Dashboard */}
        {renderLink(navLinks[0])}

        {/* Categories */}
        {renderLink(navLinks[1])}

        {/* ── ADVERTISEMENTS collapsible group ── */}
        <div>
          <button
            type="button"
            onClick={() => setAdsOpen((o) => !o)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-heading font-medium text-sm transition-all duration-150 border-l-4 cursor-pointer ${
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
                const isSubActive =
                  sub.href === '/admin/advertisements'
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
                    <span>{sub.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Library, Add News, All News, and remaining links */}
        {navLinks.slice(2).map((link) => renderLink(link))}
      </nav>

      {/* Settings at the bottom */}
      <div className="mt-auto pt-3 border-t border-border shrink-0">
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
            <Settings
              size={18}
              className={pathname.startsWith('/admin/settings') ? 'text-primary' : 'text-text-secondary'}
            />
          </IconAction>
          <span>Settings</span>
        </Link>
      </div>
    </>
  );
}
