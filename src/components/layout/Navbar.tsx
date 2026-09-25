"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  Bookmark,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Home,
  Newspaper,
  Activity,
  Heart,
  Baby,
  Brain,
  Flame,
  Utensils,
  Leaf,
  Megaphone,
  LogIn,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { DateUtilityBar } from "./DateUtilityBar";
import { MegaMenu } from "./MegaMenu";
import { NavbarHeaderAd } from "./NavbarHeaderAd";
import { useAuthModal } from "@/context/AuthModalContext";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { PublicNotificationBell } from "@/components/notifications/PublicNotificationBell";
import { formatTimeAgo } from "@/lib/utils";

const PRIMARY_CATEGORIES = [
  { label: "Home", href: "/", icon: Home, color: "#16A34A", hoverBg: "hover:bg-emerald-50 hover:text-emerald-700" },
  { label: "Latest News", href: "/latest", icon: Newspaper, color: "#2563EB", hoverBg: "hover:bg-blue-50 hover:text-blue-700" },
  { label: "Cancer", href: "/category/cancer", icon: Activity, color: "#E11D48", hoverBg: "hover:bg-rose-50 hover:text-rose-700" },
  { label: "Heart", href: "/category/heart", icon: Heart, color: "#EF4444", hoverBg: "hover:bg-red-50 hover:text-red-700" },
  { label: "Diabetes", href: "/category/diabetes", icon: Stethoscope, color: "#D97706", hoverBg: "hover:bg-amber-50 hover:text-amber-800" },
  { label: "Women's Health", href: "/category/womens-health", icon: Sparkles, color: "#9333EA", hoverBg: "hover:bg-purple-50 hover:text-purple-700" },
  { label: "Pediatrics", href: "/category/pediatrics", icon: Baby, color: "#0284C7", hoverBg: "hover:bg-sky-50 hover:text-sky-700" },
  { label: "Mental Health", href: "/category/mental-health", icon: Brain, color: "#7C3AED", hoverBg: "hover:bg-violet-50 hover:text-violet-700" },
  { label: "Fitness", href: "/category/fitness", icon: Flame, color: "#EA580C", hoverBg: "hover:bg-orange-50 hover:text-orange-700" },
  { label: "Nutrition", href: "/category/nutrition", icon: Utensils, color: "#059669", hoverBg: "hover:bg-emerald-50 hover:text-emerald-700" },
  { label: "Ayurveda", href: "/category/ayurveda", icon: Leaf, color: "#65A30D", hoverBg: "hover:bg-lime-50 hover:text-lime-800" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const { isSubscribed } = useSubscription();
  const { openLoginModal, requireAuth } = useAuthModal();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveSearchResults, setLiveSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLiveSearchResults([]);
      setIsSearching(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&limit=5`);
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setLiveSearchResults(data.items);
        }
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle ESC key and lock body scroll when search modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener('keydown', handleKeyDown);
    } else if (!mobileDrawerOpen) {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchOpen, mobileDrawerOpen]);

  // Close menus on route change
  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileDrawerOpen(false);
    setUserDropdownOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  // Don't render full navbar on login / subscribe standalones
  if (pathname === "/login" || pathname === "/subscribe") {
    return null;
  }

  const user = session?.user;
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full bg-white text-slate-900 shadow-xs sticky top-0 z-40">
      {/* 1. Main Portal Header Row */}
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-1.5 sm:py-3">
        <div className="flex items-center justify-between gap-1 sm:gap-4">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-1 sm:gap-2.5 min-w-0">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-1 sm:p-2 -ml-0.5 sm:-ml-1 text-slate-800 hover:text-[#16A34A] hover:bg-emerald-50 rounded-lg transition-all active:scale-95 focus:outline-none shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              <Menu size={21} className="sm:w-[26px] sm:h-[26px]" />
            </button>

            {/* HealthGhuru Logo + Tagline */}
            <Link href="/" className="flex flex-col group min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="relative w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 shrink-0 transition-transform group-hover:scale-105 duration-300">
                  <Image
                    src="/images/logo_transparent.png"
                    alt="HealthGhuru Logo"
                    fill
                    sizes="(max-width: 640px) 24px, 48px"
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="font-display text-[17px] sm:text-2xl lg:text-3xl font-black tracking-tight text-[#16A34A] group-hover:text-[#15803D] transition-colors leading-none truncate">
                  HEALTH<span className="text-[#f06d2f]">GHURU</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-heading font-semibold text-emerald-800 tracking-wide mt-0.5 hidden md:block">
                Live Better. Feel Stronger. Every Day.
              </span>
            </Link>
          </div>

          {/* Center: Dynamic High-Impact Leaderboard Sponsor Banner (Desktop only) */}
          <NavbarHeaderAd />

          {/* Right: Search, Notification Bell, User Avatar, Login & Desktop Advertise */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 sm:p-2 text-slate-700 hover:text-[#f06d2f] hover:bg-orange-50/80 rounded-full transition-all active:scale-95 shrink-0"
              aria-label="Search Health News"
            >
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Health Alerts & Notifications Bell */}
            <PublicNotificationBell className="shrink-0" />

            {/* User Profile Avatar / Dropdown */}
            {status === "loading" ? (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 animate-pulse shrink-0" />
            ) : user ? (
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-[#f06d2f]/40 transition-all"
                  aria-label="User profile menu"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#f06d2f] to-[#ea580c] text-white flex items-center justify-center text-[11px] sm:text-xs font-bold font-heading shadow-xs">
                    {userInitials}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        {isSubscribed ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 flex items-center gap-1">
                            <Sparkles size={9} className="text-amber-500" /> VIP Ad-Free
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-gray-500 shrink-0">
                            Free Tier
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#16A34A] hover:bg-emerald-50"
                      >
                        <LayoutDashboard size={14} />
                        <span>Admin News CMS</span>
                      </Link>
                    )}
                    <Link
                      href="/advertise"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#f06d2f] hover:bg-orange-50"
                    >
                      <Megaphone size={14} />
                      <span>Ad Campaign Manager</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50"
                    >
                      <User size={14} />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/account?tab=subscription"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      <CreditCard size={14} />
                      <span>Subscription & Plan</span>
                    </Link>
                    <Link
                      href="/profile#saved"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50"
                    >
                      <Bookmark size={14} />
                      <span>Saved Articles</span>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Login Button (When not logged in) - Compact Icon on mobile, labeled on sm+ */}
            {!user && status !== "loading" && (
              <button
                type="button"
                onClick={() => openLoginModal({ initialMode: "signin" })}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-heading font-bold p-1.5 sm:px-3.5 sm:py-2 rounded-lg shadow-xs hover:shadow transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                aria-label="Sign in"
                title="Sign in"
              >
                <LogIn size={15} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Start Advertising Button (Auth Protected) - Shown on tablet/desktop, hidden on phone to avoid overflow */}
            <button
              type="button"
              onClick={() => {
                requireAuth('/advertise', {
                  intentTitle: 'Hospital & Advertiser Partner Portal',
                  intentSubtitle:
                    'Sign in or register your medical organization to launch, book, and manage ad campaigns on HealthGhuru.',
                });
              }}
              className="hidden md:inline-flex bg-gradient-to-r from-[#f06d2f] to-[#ea580c] hover:from-[#e05a1b] hover:to-[#c2410c] text-white text-xs sm:text-sm font-heading font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all items-center gap-1.5 cursor-pointer"
            >
              <Megaphone size={14} className="text-orange-200" />
              <span>Advertise With Us</span>
            </button>

            {/* Subscribe / VIP Member Button (desktop only) */}
            {isSubscribed ? (
              <Link
                href="/account"
                className="bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-teal-950 text-emerald-100 text-xs sm:text-sm font-heading font-bold px-3.5 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all hidden lg:inline-flex items-center gap-1.5"
              >
                <Sparkles size={13} className="text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>VIP Member</span>
              </Link>
            ) : (
              <Link
                href="/subscribe"
                className="bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#0D5C3A] text-white text-xs sm:text-sm font-heading font-bold px-3.5 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all hidden lg:inline-flex items-center"
              >
                Subscribe
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Advertisement Banner (< lg) */}
      <div className="block lg:hidden w-full px-2.5 sm:px-4 pb-2 pt-0.5 bg-white border-b border-gray-100/70">
        <NavbarHeaderAd isMobile />
      </div>

        {/* Modern Trending Search Modal Overlay */}
        {searchOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-16 p-2.5 sm:px-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSearchOpen(false);
            }}
          >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-emerald-500/20 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in zoom-in-95 duration-200">
              {/* Search Input Bar */}
              <form onSubmit={handleSearchSubmit} className="p-3 sm:p-4 border-b border-gray-100 flex items-center gap-2 sm:gap-3">
                <Search size={20} className="text-[#16A34A] shrink-0 ml-0.5 sm:ml-1" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search symptoms, cardiology, cancer..."
                  className="flex-1 min-w-0 text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none bg-transparent font-medium py-1"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 shrink-0 cursor-pointer"
                    title="Clear query"
                  >
                    <X size={15} />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#16A34A] hover:bg-[#15803D] active:bg-[#15803D] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0 cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={19} />
                </button>
              </form>

              {/* Modal Body: Live Results OR Trending Topics */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-5 sm:space-y-6">
                {searchQuery.trim().length > 0 ? (
                  /* Live Results */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-gray-100 pb-2">
                      <span>Matching Health Reports</span>
                      {isSearching && <span className="text-[#16A34A] animate-pulse">Searching clinical archive...</span>}
                    </div>

                    {isSearching && liveSearchResults.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
                        Searching medical database...
                      </div>
                    ) : liveSearchResults.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {liveSearchResults.map((item) => (
                          <Link
                            key={item.id}
                            href={item.canonical_url || `/article/${item.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="py-2.5 sm:py-3 flex items-start gap-2.5 sm:gap-3 group hover:bg-emerald-50/50 rounded-xl px-2 sm:px-2.5 transition-colors"
                          >
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                              />
                            ) : (
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-emerald-100/60 text-[#16A34A] flex items-center justify-center font-bold text-xs shrink-0">
                                HG
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                                  {item.category || 'Clinical'}
                                </span>
                                <span className="text-[10px] sm:text-[11px] text-slate-400">
                                  {formatTimeAgo(item.published_at)}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 sm:line-clamp-1">
                                {item.title}
                              </h4>
                              <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {item.excerpt || item.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <div className="pt-3 text-center">
                          <button
                            type="button"
                            onClick={handleSearchSubmit}
                            className="text-xs font-bold text-[#16A34A] hover:text-[#15803D] inline-flex items-center gap-1.5 hover:underline cursor-pointer"
                          >
                            <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-slate-500 text-sm">
                        No articles found matching &ldquo;{searchQuery}&rdquo;. Try the trending topics below:
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty state: Trending Searches & Categories */
                  <div className="space-y-5 sm:space-y-6">
                    {/* Trending Searches */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900 mb-2.5">
                        <Flame size={15} className="text-[#f06d2f] fill-[#f06d2f]" />
                        <span>Trending Health Topics</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { title: 'Cardiology Breakthroughs', cat: 'Heart' },
                          { title: 'Gut Microbiome & Probiotics', cat: 'Nutrition' },
                          { title: 'GLP-1 Weight Management', cat: 'Diabetes' },
                          { title: 'Pediatric Immunity & Fevers', cat: 'Pediatrics' },
                          { title: 'Mental Wellness & Sleep Vagus', cat: 'Mental Health' },
                          { title: 'Ayurvedic Superfoods & Triphala', cat: 'Ayurveda' },
                        ].map((trend, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setSearchQuery(trend.title);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all group cursor-pointer gap-2 min-h-[42px]"
                          >
                            <span className="text-xs font-bold text-slate-800 group-hover:text-[#16A34A] truncate">
                              {trend.title}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                              {trend.cat}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Category Chips */}
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2.5">
                        Browse by Category
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {['Cancer', 'Heart', 'Diabetes', "Women's Health", 'Pediatrics', 'Mental Health', 'Nutrition', 'Ayurveda'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              window.location.href = `/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                            }}
                            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-[#16A34A] hover:text-white text-slate-700 transition-all cursor-pointer"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 truncate">
                    Verified Medical Search &bull; Peer-Reviewed Sources
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-slate-400 shrink-0">
                  <span>Press <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-slate-600 text-[10px]">Enter</kbd> to search</span>
                  <span>&bull;</span>
                  <span><kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-slate-600 text-[10px]">Esc</kbd> to close</span>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* 2. Main Category Navigation (Vibrant Logo Theme with Color-Coded Category Icons) */}
      <nav className="w-full bg-white/95 backdrop-blur-md text-slate-800 border-t border-b-2 border-emerald-500/20 relative shadow-xs">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center w-full py-1.5 sm:py-2">
            {/* Category Links List with Color-Coded Icons & Vibrant Active Pill */}
            <div className="flex items-center justify-start w-full overflow-x-auto scrollbar-none gap-1 sm:gap-1.5 text-xs sm:text-sm lg:text-[14px] font-heading font-bold tracking-tight pr-4">
              {PRIMARY_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const currentPath = pathname || "";
                const isActive =
                  cat.href === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(cat.href);

                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className={`min-w-fit whitespace-nowrap px-2.5 sm:px-3.5 lg:px-4 py-1.5 sm:py-2.5 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-200 text-center group ${
                      isActive
                        ? "bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#0D5C3A] text-white font-black shadow-md shadow-emerald-700/25 scale-[1.02]"
                        : `text-slate-700 ${cat.hoverBg} hover:scale-[1.03]`
                    }`}
                  >
                    <IconComponent
                      size={14}
                      className={`shrink-0 transition-transform group-hover:scale-110 sm:w-[15px] sm:h-[15px] ${
                        isActive ? "text-white" : ""
                      }`}
                      style={!isActive ? { color: cat.color } : undefined}
                    />
                    <span>{cat.label}</span>
                  </Link>
                );
              })}

              {/* "MORE ▼" Mega Menu Trigger */}
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`min-w-fit whitespace-nowrap px-2.5 sm:px-3.5 lg:px-4 py-1.5 sm:py-2.5 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all font-heading font-extrabold text-xs sm:text-sm lg:text-[14px] uppercase tracking-wider text-center group cursor-pointer ${
                  megaMenuOpen
                    ? "bg-gradient-to-r from-[#ea580c] to-[#f06d2f] text-white shadow-md shadow-orange-600/25 scale-[1.02]"
                    : "text-[#f06d2f] hover:bg-orange-50 hover:text-[#ea580c] hover:scale-[1.03]"
                }`}
                aria-expanded={megaMenuOpen}
              >
                <span>MORE</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 sm:w-[15px] sm:h-[15px] ${
                    megaMenuOpen ? "rotate-180 text-white" : "text-[#f06d2f] group-hover:translate-y-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Mega Menu Dropdown */}
        <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
      </nav>

      {/* 5. Full Mobile Drawer Navigation */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop with fade-in */}
          <div
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content with slide-in from left */}
          <div className="relative w-full max-w-[325px] xs:max-w-sm bg-white h-full overflow-y-auto z-10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Sticky Compact Drawer Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-3.5 py-2.5 border-b border-gray-100 z-20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 shrink-0">
                  <Image
                    src="/images/logo_transparent.png"
                    alt="HealthGhuru"
                    fill
                    sizes="24px"
                    className="object-contain"
                  />
                </div>
                <span className="font-display font-black text-lg text-[#16A34A] leading-none">
                  HEALTH<span className="text-[#f06d2f]">GHURU</span>
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
                aria-label="Close navigation"
              >
                <X size={16} />
              </button>
            </div>

            {/* Compact Scrollable Body */}
            <div className="p-3 space-y-2.5 flex-1">
              {/* Quick Search Bar */}
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50/50 text-slate-500 rounded-xl border border-gray-200/80 text-xs font-medium transition-all text-left shadow-2xs group cursor-pointer"
              >
                <Search size={14} className="text-[#16A34A] group-hover:scale-110 transition-transform shrink-0" />
                <span className="flex-1 text-slate-400 group-hover:text-slate-600 truncate text-[11px]">Search symptoms, conditions, news...</span>
                <span className="text-[9px] font-bold text-slate-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-2xs shrink-0">
                  Search
                </span>
              </button>

              {/* Compact Auth / User Strip */}
              {user ? (
                <div className="p-2 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 rounded-xl border border-emerald-100 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f06d2f] to-[#ea580c] text-white flex items-center justify-center text-[10px] font-bold font-heading shadow-xs shrink-0">
                      {userInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-[11.5px] font-bold text-slate-900 truncate">{user.name}</p>
                        {isSubscribed && (
                          <span className="text-[7.5px] font-bold uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href="/profile"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 bg-white rounded-lg border border-gray-100"
                      title="Profile"
                    >
                      <User size={13} />
                    </Link>
                    <Link
                      href="/profile#saved"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 bg-white rounded-lg border border-gray-100"
                      title="Saved"
                    >
                      <Bookmark size={13} />
                    </Link>
                    <button
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 bg-white rounded-lg border border-gray-100 cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 text-white rounded-xl shadow-xs border border-emerald-500/20 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1 pl-0.5">
                    <span className="text-[11px] font-heading font-bold text-white block truncate leading-tight">
                      HealthGhuru Portal
                    </span>
                    <span className="text-[9px] text-emerald-300/90 block truncate leading-tight">
                      Join 500k+ readers
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        openLoginModal({ initialMode: "signin" });
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-all cursor-pointer shadow-xs inline-flex items-center gap-1"
                    >
                      <LogIn size={11} />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        openLoginModal({ initialMode: "signup" });
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-white bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#0D5C3A] rounded-lg transition-all cursor-pointer shadow-xs inline-flex items-center gap-1"
                    >
                      <Sparkles size={10} className="text-amber-300" />
                      <span>Join</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Health Categories (Compact 2-Column Grid) */}
              <div>
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <p className="text-[9.5px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    Primary Categories
                  </p>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                    {PRIMARY_CATEGORIES.length + 1} Topics
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {PRIMARY_CATEGORIES.map((cat) => {
                    const IconComponent = cat.icon;
                    const currentPath = pathname || "";
                    const isActive =
                      cat.href === "/"
                        ? currentPath === "/"
                        : currentPath.startsWith(cat.href);

                    return (
                      <Link
                        key={cat.label}
                        href={cat.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all text-[11px] font-heading font-bold ${
                          isActive
                            ? "bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white border-emerald-600 shadow-2xs"
                            : "bg-slate-50/80 hover:bg-white text-slate-700 border-gray-100/90 hover:border-emerald-200"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            isActive ? "bg-white/20 text-white" : "bg-white shadow-2xs"
                          }`}
                          style={!isActive ? { color: cat.color } : undefined}
                        >
                          <IconComponent size={12} />
                        </div>
                        <span className="truncate">{cat.label}</span>
                      </Link>
                    );
                  })}

                  {/* 12th item to balance the 2-column grid */}
                  <Link
                    href="/trending"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-gray-100/90 bg-slate-50/80 hover:bg-white text-slate-700 hover:border-orange-200 transition-all text-[11px] font-heading font-bold"
                  >
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 bg-white shadow-2xs text-[#f06d2f]">
                      <TrendingUp size={12} />
                    </div>
                    <span className="truncate">Trending News</span>
                  </Link>
                </div>
              </div>

              {/* Clinical & Platform Services (Trending 2-Column Grid) */}
              <div className="border-t border-gray-100 pt-2.5">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <p className="text-[9.5px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    Clinical &amp; Platform Services
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Doctor Directory', href: '/doctors', icon: Stethoscope, color: '#16A34A' },
                    { label: 'Hospitals & Clinics', href: '/hospitals', icon: Building2, color: '#2563EB' },
                    { label: 'Medical Research', href: '/research', icon: Sparkles, color: '#9333EA' },
                    { label: 'Calculators (BMI)', href: '/tools', icon: Activity, color: '#EA580C' },
                    { label: 'Health Magazines', href: '/magazines', icon: ShieldCheck, color: '#059669' },
                    { label: 'Advertise With Us', href: '/advertise', icon: Megaphone, color: '#f06d2f', isAd: true },
                  ].map((service) => {
                    const IconComp = service.icon;
                    if (service.isAd) {
                      return (
                        <button
                          key={service.label}
                          type="button"
                          onClick={() => {
                            setMobileDrawerOpen(false);
                            requireAuth('/advertise', {
                              intentTitle: 'Hospital & Advertiser Partner Portal',
                              intentSubtitle: 'Sign in or register your organization to launch ad campaigns on HealthGhuru.',
                            });
                          }}
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-orange-200 bg-orange-50/70 hover:bg-orange-100/70 text-slate-800 transition-all text-[11px] font-heading font-bold text-left cursor-pointer"
                        >
                          <div className="w-5 h-5 rounded-md bg-white text-[#f06d2f] flex items-center justify-center shrink-0 shadow-2xs">
                            <IconComp size={12} />
                          </div>
                          <span className="truncate text-[#f06d2f]">{service.label}</span>
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={service.label}
                        href={service.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-gray-100/90 bg-slate-50/80 hover:bg-white text-slate-700 hover:border-emerald-200 transition-all text-[11px] font-heading font-bold"
                      >
                        <div
                          className="w-5 h-5 rounded-md bg-white flex items-center justify-center shrink-0 shadow-2xs"
                          style={{ color: service.color }}
                        >
                          <IconComp size={12} />
                        </div>
                        <span className="truncate">{service.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Subtle Footer Links */}
              <div className="pt-2 text-center text-[9px] text-slate-400 space-x-2">
                <Link href="/terms" onClick={() => setMobileDrawerOpen(false)} className="hover:underline">
                  Terms
                </Link>
                <span>&bull;</span>
                <Link href="/privacy" onClick={() => setMobileDrawerOpen(false)} className="hover:underline">
                  Privacy
                </Link>
                <span>&bull;</span>
                <Link href="/about" onClick={() => setMobileDrawerOpen(false)} className="hover:underline">
                  About
                </Link>
                <span>&bull;</span>
                <span>&copy; {new Date().getFullYear()} HealthGhuru</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
