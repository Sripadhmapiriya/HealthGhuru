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
  Moon,
  Megaphone,
  LogIn,
} from "lucide-react";
import { DateUtilityBar } from "./DateUtilityBar";
import { MegaMenu } from "./MegaMenu";
import { NavbarHeaderAd } from "./NavbarHeaderAd";
import { useAuthModal } from "@/context/AuthModalContext";

const PRIMARY_CATEGORIES = [
  { label: "Home", href: "/", icon: Home },
  { label: "Latest News", href: "/latest", icon: Newspaper },
  { label: "Cancer", href: "/category/cancer", icon: Activity },
  { label: "Heart", href: "/category/heart", icon: Heart },
  { label: "Diabetes", href: "/category/diabetes", icon: Stethoscope },
  { label: "Women's Health", href: "/category/womens-health", icon: Sparkles },
  { label: "Pediatrics", href: "/category/pediatrics", icon: Baby },
  { label: "Mental Health", href: "/category/mental-health", icon: Brain },
  { label: "Fitness", href: "/category/fitness", icon: Flame },
  { label: "Nutrition", href: "/category/nutrition", icon: Utensils },
  { label: "Ayurveda", href: "/category/ayurveda", icon: Leaf },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const { openLoginModal, requireAuth } = useAuthModal();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    <header className="w-full bg-white text-slate-900 shadow-sm sticky top-0 z-40">
      {/* 1. Main Portal Header Row */}
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 -ml-1 text-slate-800 hover:text-[#16A34A] hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <Menu size={26} />
            </button>

            {/* HealthGhuru Logo + Tagline */}
            <Link href="/" className="flex flex-col group">
              <div className="flex items-center gap-2.5">
                <div className="relative w-11 h-11 sm:w-14 sm:h-14 shrink-0">
                  <Image
                    src="/images/logo_transparent.png"
                    alt="HealthGhuru Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#16A34A] group-hover:text-[#15803D] transition-colors leading-none">
                  HEALTH<span className="text-[#f06d2f]">GHURU</span>
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-heading font-semibold text-emerald-800 tracking-wide mt-0.5 hidden xs:block">
                Live Better. Feel Stronger. Every Day.
              </span>
            </Link>
          </div>

          {/* Center: Dynamic High-Impact Leaderboard Sponsor Banner (728x90 style) */}
          <NavbarHeaderAd />

          {/* Right: Search, Dark Mode, Avatar, Subscribe, Login */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-700 hover:text-[#f06d2f] hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Search Health News"
            >
              <Search size={20} />
            </button>

            {/* Dark Mode Indicator Icon */}
            <button
              className="p-2 text-slate-700 hover:text-[#f06d2f] hover:bg-slate-100 rounded-full transition-colors hidden sm:block"
              aria-label="Toggle Theme"
              title="Theme Toggle"
            >
              <Moon size={18} />
            </button>

            {/* User Profile Avatar / Dropdown */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#f06d2f]/40 transition-all"
                  aria-label="User profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f06d2f] to-[#ea580c] text-white flex items-center justify-center text-xs font-bold font-heading shadow-xs">
                    {userInitials}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
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

            {/* Start Advertising Button (Auth Protected) */}
            <button
              type="button"
              onClick={() => {
                requireAuth('/advertise', {
                  intentTitle: 'Hospital & Advertiser Partner Portal',
                  intentSubtitle:
                    'Sign in or register your medical organization to launch, book, and manage ad campaigns on HealthGhuru.',
                });
              }}
              className="bg-[#f06d2f] hover:bg-[#e05a1b] text-white text-xs sm:text-sm font-heading font-bold px-3.5 sm:px-4 py-2 rounded-lg shadow-xs hover:shadow transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Megaphone size={14} className="hidden sm:inline" />
              <span>Advertise With Us</span>
            </button>

            {/* Subscribe Button */}
            <Link
              href="/subscribe"
              className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs sm:text-sm font-heading font-bold px-3.5 sm:px-4 py-2 rounded-lg shadow-xs hover:shadow transition-all hidden sm:inline-flex items-center"
            >
              Subscribe
            </Link>

            {/* Login Button (When not logged in) */}
            {!user && status !== "loading" && (
              <button
                type="button"
                onClick={() => openLoginModal({ initialMode: "signin" })}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-heading font-bold px-3.5 sm:px-4 py-2 rounded-lg shadow-xs hover:shadow transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn size={14} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Search Bar Dropdown (when toggled) */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 animate-in fade-in duration-150"
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search health news, clinical research, doctors, hospitals, treatments..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-emerald-500/30 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-[#16A34A] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#15803D] transition-colors"
            >
              Search
            </button>
          </form>
        )}
      </div>

      {/* 2. Main Category Navigation (Clean White Theme with Equal Spacing & Crisp Icons) */}
      <nav className="w-full bg-white text-slate-800 border-t border-b border-gray-200/90 relative shadow-2xs">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center w-full">
            {/* Category Links List with Icons & Equal Spacing */}
            <div className="flex items-center justify-between w-full overflow-x-auto scrollbar-none text-xs sm:text-sm lg:text-[14.5px] font-heading font-bold tracking-wide">
              {PRIMARY_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isActive =
                  cat.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(cat.href);

                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className={`flex-1 min-w-fit whitespace-nowrap px-2.5 sm:px-3 lg:px-4 py-4 sm:py-5 flex items-center justify-center gap-1.5 transition-all duration-150 relative text-center group ${
                      isActive
                        ? "text-[#16A34A] bg-emerald-50/90 font-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3.5px] after:bg-[#16A34A] shadow-2xs"
                        : "text-slate-700 hover:text-[#16A34A] hover:bg-emerald-50/50"
                    }`}
                  >
                    <IconComponent size={16} className={`shrink-0 transition-colors ${isActive ? "text-[#16A34A]" : "text-slate-500 group-hover:text-[#16A34A]"}`} />
                    <span>{cat.label}</span>
                  </Link>
                );
              })}

              {/* "MORE ▼" Mega Menu Trigger */}
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`flex-1 min-w-fit whitespace-nowrap px-2.5 sm:px-3 lg:px-4 py-4 sm:py-5 flex items-center justify-center gap-1.5 transition-all font-heading font-bold text-xs sm:text-sm lg:text-[14.5px] uppercase tracking-wider relative text-center group ${
                  megaMenuOpen
                    ? "text-[#16A34A] bg-emerald-50/90 font-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3.5px] after:bg-[#16A34A]"
                    : "text-slate-700 hover:text-[#16A34A] hover:bg-emerald-50/50"
                }`}
                aria-expanded={megaMenuOpen}
              >
                <span>MORE</span>
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    megaMenuOpen ? "rotate-180 text-[#16A34A]" : "text-slate-500 group-hover:text-[#16A34A]"
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-sm bg-white h-full overflow-y-auto z-10 shadow-2xl flex flex-col p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 shrink-0">
                  <Image
                    src="/images/logo_transparent.png"
                    alt="HealthGhuru"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-display font-black text-2xl text-[#16A34A]">
                  HEALTH<span className="text-[#f06d2f]">GHURU</span>
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-gray-500 hover:text-black rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Categories list */}
            <div className="py-4 space-y-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold mb-2">
                  Primary Categories
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-heading font-semibold">
                  {PRIMARY_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="p-2 rounded-lg hover:bg-emerald-50 text-[#16A34A]"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Healthcare Ecosystem */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold mb-2">
                  Clinical & Platform Services
                </p>
                <div className="space-y-1 text-xs">
                  <Link
                    href="/doctors"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-emerald-50"
                  >
                    <Stethoscope size={15} className="text-[#16A34A]" />
                    <span>Doctor Directory</span>
                  </Link>
                  <Link
                    href="/hospitals"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-emerald-50"
                  >
                    <Building2 size={15} className="text-[#16A34A]" />
                    <span>Hospitals & Facilities</span>
                  </Link>
                  <Link
                    href="/research"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-emerald-50"
                  >
                    <Sparkles size={15} className="text-[#f06d2f]" />
                    <span>Medical Research Feed</span>
                  </Link>
                  <Link
                    href="/tools"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-emerald-50"
                  >
                    <Sparkles size={15} className="text-[#16A34A]" />
                    <span>Health Calculators (BMI, BMR)</span>
                  </Link>
                  <Link
                    href="/magazines"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-emerald-50"
                  >
                    <ShieldCheck size={15} className="text-[#16A34A]" />
                    <span>Health Magazines</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      requireAuth('/advertise', {
                        intentTitle: 'Hospital & Advertiser Partner Portal',
                        intentSubtitle: 'Sign in or register your organization to launch ad campaigns on HealthGhuru.',
                      });
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg text-[#f06d2f] font-bold hover:bg-orange-50 w-full text-left"
                  >
                    <Megaphone size={15} />
                    <span>Advertise With Us →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Auth button */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              {user ? (
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 rounded-xl"
                >
                  Sign Out ({user.name})
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      openLoginModal({ initialMode: "signin" });
                    }}
                    className="block w-full py-2.5 text-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Sign In to HealthGhuru
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      openLoginModal({ initialMode: "signup" });
                    }}
                    className="block w-full py-2.5 text-center text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
