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
} from "lucide-react";
import { DateUtilityBar } from "./DateUtilityBar";
import { MegaMenu } from "./MegaMenu";

const PRIMARY_CATEGORIES = [
  { label: "HOME", href: "/" },
  { label: "LATEST", href: "/latest" },
  { label: "CANCER", href: "/category/cancer" },
  { label: "HEART", href: "/category/heart" },
  { label: "DIABETES", href: "/category/diabetes" },
  { label: "WOMEN'S HEALTH", href: "/category/womens-health" },
  { label: "PEDIATRICS", href: "/category/pediatrics" },
  { label: "MENTAL HEALTH", href: "/category/mental-health" },
  { label: "FITNESS", href: "/category/fitness" },
  { label: "NUTRITION", href: "/category/nutrition" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
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
    : "U";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full bg-white text-[#1A2E1A] shadow-xs sticky top-0 z-40">
      {/* 1. Dynamic Date & Utility Bar */}
      <DateUtilityBar />

      {/* 2. Main Portal Header */}
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Hamburger Button (Mobile Drawer & Mega Menu Toggle) */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 -ml-1 text-[#1B5E20] hover:bg-[#F5FAF5] rounded-xl transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <Menu size={22} />
            </button>

            {/* HealthGhuru Logo + Tagline */}
            <Link href="/" className="flex flex-col group">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                  <Image
                    src="/images/logo_transparent.png"
                    alt="HealthGhuru Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1B5E20] group-hover:text-[#2E7D32] transition-colors leading-none">
                  HEALTH<span className="text-[#f06d2f]">GHURU</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-heading font-semibold text-[#4A6741] tracking-wide mt-0.5 hidden xs:block">
                Live Better. Feel Stronger. Every Day.
              </span>
            </Link>
          </div>

          {/* Center: Header Advertisement Banner (Hospital / Healthcare Sponsor) */}
          <div className="hidden md:flex flex-1 items-center justify-center max-w-xl xl:max-w-2xl px-2">
            <a
              href="/hospitals/national-cancer-research-care-centre"
              className="w-full bg-[#F5FAF5] hover:bg-[#eaf5ea] border border-[#2E7D32]/20 rounded-xl p-2 flex items-center justify-between gap-3 group transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                  <Image
                    src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=200&q=80"
                    alt="National Cancer Research Center"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider font-bold bg-[#1B5E20] text-white px-1 py-0.5 rounded">
                      SPONSORED
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500 truncate">
                      National Cancer Care Centre
                    </span>
                  </div>
                  <p className="text-xs font-heading font-bold text-[#1A2E1A] group-hover:text-[#2E7D32] truncate">
                    Molecular Biomarker & Early Screening Panels Open
                  </p>
                </div>
              </div>
              <span className="shrink-0 bg-[#f06d2f] text-white text-[11px] font-bold px-3 py-1.5 rounded-full group-hover:brightness-110 shadow-xs hidden lg:inline-flex items-center gap-1">
                <span>Evaluate</span>
                <ArrowRight size={10} />
              </span>
            </a>
          </div>

          {/* Right: Search, Auth, Subscribe */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#4A6741] hover:text-[#1B5E20] hover:bg-[#F5FAF5] rounded-full transition-colors"
              aria-label="Search Health News"
            >
              <Search size={19} />
            </button>

            {/* User Account / Login */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#2E7D32]/30 transition-all"
                  aria-label="User profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-xs font-bold font-heading">
                    {userInitials}
                  </div>
                  <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-[#1A2E1A] truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1B5E20] hover:bg-[#F5FAF5]"
                      >
                        <LayoutDashboard size={14} />
                        <span>Admin News CMS</span>
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#F5FAF5]"
                    >
                      <User size={14} />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/profile#saved"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#F5FAF5]"
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
            ) : (
              <Link
                href="/login"
                className="text-xs font-heading font-bold text-[#1B5E20] hover:text-[#2E7D32] px-2.5 py-1.5 rounded-lg transition-colors hidden sm:block"
              >
                Login
              </Link>
            )}

            {/* Subscribe Button */}
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#f06d2f] to-[#ff8a57] hover:brightness-110 text-white text-xs font-heading font-bold px-3.5 sm:px-4 py-2 rounded-full shadow-sm hover:shadow transition-all"
            >
              <span>Subscribe</span>
            </Link>
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
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#2E7D32]/30 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-[#1B5E20] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#2E7D32] transition-colors"
            >
              Search
            </button>
          </form>
        )}
      </div>

      {/* 3. Main Category Navigation (News Portal Category Bar) */}
      <nav className="w-full bg-[#1B5E20] text-white border-t border-b border-[#144718] relative shadow-inner">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Category Links List */}
            <div className="flex items-center overflow-x-auto scrollbar-none py-0.5 text-xs font-heading font-bold tracking-wider">
              {PRIMARY_CATEGORIES.map((cat) => {
                const isActive =
                  cat.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(cat.href);

                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className={`whitespace-nowrap px-3 sm:px-4 py-2.5 border-b-2 transition-all duration-150 ${
                      isActive
                        ? "border-[#f06d2f] text-white bg-white/10"
                        : "border-transparent text-emerald-100/90 hover:text-white hover:bg-white/5 hover:border-white/40"
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}

              {/* "MORE ▼" Mega Menu Trigger */}
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`flex items-center gap-1 whitespace-nowrap px-3 sm:px-4 py-2.5 border-b-2 transition-all font-heading font-bold text-xs uppercase tracking-wider ${
                  megaMenuOpen
                    ? "border-[#f06d2f] text-[#ffd6c1] bg-white/15"
                    : "border-transparent text-emerald-100 hover:text-white hover:bg-white/5"
                }`}
                aria-expanded={megaMenuOpen}
              >
                <span>MORE</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    megaMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Quick Live Breaking Tag on desktop right */}
            <div className="hidden xl:flex items-center gap-2 pl-4 py-1 shrink-0 text-[11px] font-mono text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>LIVE EDITIONS</span>
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
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7">
                  <Image
                    src="/images/logo_transparent.png"
                    alt="HealthGhuru"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-display font-bold text-xl text-[#1B5E20]">
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
                      className="p-2 rounded-lg hover:bg-[#F5FAF5] text-[#1B5E20]"
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
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-[#F5FAF5]"
                  >
                    <Stethoscope size={15} className="text-[#2E7D32]" />
                    <span>Doctor Directory</span>
                  </Link>
                  <Link
                    href="/hospitals"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-[#F5FAF5]"
                  >
                    <Building2 size={15} className="text-[#2E7D32]" />
                    <span>Hospitals & Facilities</span>
                  </Link>
                  <Link
                    href="/research"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-[#F5FAF5]"
                  >
                    <Sparkles size={15} className="text-[#f06d2f]" />
                    <span>Medical Research Feed</span>
                  </Link>
                  <Link
                    href="/tools"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-[#F5FAF5]"
                  >
                    <Sparkles size={15} className="text-[#2E7D32]" />
                    <span>Health Calculators (BMI, BMR)</span>
                  </Link>
                  <Link
                    href="/magazines"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-[#F5FAF5]"
                  >
                    <ShieldCheck size={15} className="text-[#2E7D32]" />
                    <span>Health Magazines</span>
                  </Link>
                  <Link
                    href="/advertise"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg text-[#f06d2f] font-bold hover:bg-orange-50"
                  >
                    <span>Advertise With Us →</span>
                  </Link>
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
                <Link
                  href="/login"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block w-full py-2.5 text-center text-xs font-bold text-white bg-[#1B5E20] hover:bg-[#2E7D32] rounded-xl"
                >
                  Sign In to HealthGhuru
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
