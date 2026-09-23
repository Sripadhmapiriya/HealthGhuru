/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LogOut,
  ExternalLink,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSidebarNav } from './AdminSidebarNav';
import { AdminNotificationBell } from '@/components/admin/notifications/AdminNotificationBell';

interface AdminLayoutClientProps {
  children: ReactNode;
  signOutAction: () => Promise<void>;
}

export function AdminLayoutClient({ children, signOutAction }: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Determine current page title from pathname
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard Overview';
    if (pathname.startsWith('/admin/magazines')) return 'Magazine Publishing & Generator';
    if (pathname.startsWith('/admin/notifications')) return 'Notification Center';
    if (pathname.startsWith('/admin/categories')) return 'Taxonomy & Categories';
    if (pathname.startsWith('/admin/contact-queries')) return 'Contact Queries';
    if (pathname.startsWith('/admin/content')) return 'Content Library';
    if (pathname.startsWith('/admin/media')) return 'Media Library';
    if (pathname.startsWith('/admin/sponsored-articles')) return 'Sponsored Articles';
    if (pathname.startsWith('/admin/review-queue')) return 'Review Queue';
    if (pathname.startsWith('/admin/sources')) return 'Content Sources';
    if (pathname.startsWith('/admin/ingestion')) return 'Ingestion Runs';
    if (pathname.startsWith('/admin/advertisements')) return 'Advertisement Engine';
    if (pathname.startsWith('/admin/users')) return 'User Management';
    if (pathname.startsWith('/admin/subscriptions')) return 'Subscription Management';
    if (pathname.startsWith('/admin/campaigns')) return 'Campaign Requests';
    if (pathname.startsWith('/admin/settings/email')) return 'Email & SMTP Gateway';
    if (pathname.startsWith('/admin/settings/payment')) return 'Payment Gateway & UPI';
    if (pathname.startsWith('/admin/settings/pages')) return 'Website Pages CMS';
    if (pathname.startsWith('/admin/settings')) return 'System Settings';
    return 'Admin Console';
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex overflow-hidden print:h-auto print:overflow-visible print:block">
      {/* ── 1. Desktop Persistent Animated Sidebar (lg and above) ── */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 288 }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
        className="hidden lg:flex h-full bg-gradient-to-b from-[#FAFDFB] via-[#F3FAF6] to-[#EBF6F0] border-r border-emerald-500/20 flex-col z-30 shrink-0 shadow-[4px_0_24px_rgba(22,163,74,0.06)] select-none backdrop-blur-md relative print:hidden"
      >
        <div className={`flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 hover:scrollbar-thumb-emerald-400 ${isCollapsed ? 'p-3 items-center' : 'p-4 sm:p-5'}`}>
          {/* Brand Logo & Collapse Toggle */}
          <div className={`pb-3.5 mb-2 border-b border-emerald-900/10 flex items-center shrink-0 w-full ${isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between'}`}>
            {!isCollapsed ? (
              <>
                <Link href="/admin" className="inline-block transition-transform hover:scale-102">
                  <div className="relative w-36 h-10">
                    <Image
                      src="/images/logo_transparent.png"
                      alt="HealthGhuru Logo"
                      fill
                      sizes="144px"
                      className="object-contain object-left"
                      priority
                    />
                  </div>
                </Link>
                <div className="flex items-center gap-1.5">
                  <div className="px-2 py-0.5 rounded-md bg-emerald-100/90 text-emerald-800 border border-emerald-300/80 text-[10px] font-mono font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Admin</span>
                  </div>
                  <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-100/70 transition-all cursor-pointer"
                    title="Collapse sidebar to mini-mode"
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full flex flex-col items-center gap-2">
                <Link href="/admin" className="transition-transform hover:scale-105" title="HealthGhuru Dashboard">
                  <div className="w-11 h-11 rounded-xl bg-white p-1.5 border border-emerald-300/80 shadow-xs flex items-center justify-center">
                    <div className="relative w-8 h-8">
                      <Image
                        src="/images/logo_transparent.png"
                        alt="HealthGhuru Logo"
                        fill
                        sizes="32px"
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-100/70 transition-all cursor-pointer mt-1"
                  title="Expand sidebar"
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen size={17} />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links with Fluid Animations */}
          <AdminSidebarNav isCollapsed={isCollapsed} />

          {/* Bottom Sign Out */}
          <div className="mt-auto pt-3 border-t border-emerald-900/10 shrink-0 w-full">
            <form action={signOutAction}>
              <button
                type="submit"
                className={`group w-full flex items-center rounded-xl font-heading font-semibold text-xs text-slate-600 hover:text-red-600 hover:bg-red-50/90 border border-transparent hover:border-red-200/60 transition-all duration-200 cursor-pointer ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                }`}
                title={isCollapsed ? 'Sign Out Console' : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600 group-hover:border-red-200 transition-colors shadow-2xs">
                    <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                  {!isCollapsed && <span className="text-[13px]">Sign Out Console</span>}
                </div>
                {!isCollapsed && (
                  <ChevronRight size={13} className="text-slate-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.aside>

      {/* ── 2. Mobile / Tablet Drawer Sidebar (<lg) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-xs lg:hidden"
            />

            {/* Slide-in Drawer with matching colorful background */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-gradient-to-b from-[#FAFDFB] via-[#F3FAF6] to-[#EBF6F0] border-r border-emerald-500/20 z-50 flex flex-col p-5 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-emerald-900/10 shrink-0">
                <Link href="/admin">
                  <div className="relative w-36 h-10">
                    <Image
                      src="/images/logo_transparent.png"
                      alt="HealthGhuru Logo"
                      fill
                      sizes="144px"
                      className="object-contain object-left"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/80 border border-slate-200/80 text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <AdminSidebarNav onNavigate={() => setMobileMenuOpen(false)} />

              <div className="mt-auto pt-3 border-t border-emerald-900/10 shrink-0">
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-heading font-semibold text-xs text-slate-600 hover:text-red-600 hover:bg-red-50/90 border border-transparent hover:border-red-200/60 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600 group-hover:border-red-200 transition-colors shadow-2xs">
                        <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                      </div>
                      <span className="text-[13px]">Sign Out Console</span>
                    </div>
                    <ChevronRight size={13} className="text-slate-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── 3. Main Content Area (Header + Scrollable Children) ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden print:h-auto print:overflow-visible print:block">
        {/* Sticky Admin Topbar */}
        <header className="h-16 sm:h-20 shrink-0 bg-white/95 border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-8 z-20 shadow-2xs backdrop-blur-md print:hidden">
          {/* Left: Mobile Toggle / Desktop Collapse Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 lg:hidden transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Quick Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors border border-slate-200/80 cursor-pointer shadow-2xs"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle Sidebar Collapse"
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>

            {/* Breadcrumb Title with Upgraded Typography */}
            <div className="min-w-0">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span>Admin Console</span>
                <ChevronRight size={10} />
                <span className="text-[#16A34A]">{getPageTitle()}</span>
              </div>
              <h1 className="font-heading font-extrabold text-base sm:text-xl text-slate-900 truncate tracking-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right: Actions, Live Indicator, Site Link & Admin Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Live Indicator Pill */}
            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE SYSTEM</span>
            </div>

            {/* View Live Website Button */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs font-heading font-bold transition-all shadow-2xs"
            >
              <span className="hidden sm:inline">View Site</span>
              <ExternalLink size={13} />
            </Link>

            {/* Admin Notifications Center */}
            <AdminNotificationBell />

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#16A34A] to-[#f06d2f] text-white flex items-center justify-center font-heading font-bold text-xs sm:text-sm shadow-xs ring-2 ring-emerald-500/20">
                AD
              </div>
              <div className="hidden xl:block text-left">
                <p className="font-heading font-bold text-xs text-slate-900 leading-tight">Admin User</p>
                <p className="text-[10px] text-slate-500 font-mono">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content with Smooth Scroll */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-emerald-300 print:p-0 print:overflow-visible print:h-auto print:block">
          {children}
        </main>
      </div>
    </div>
  );
}

