"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Heart,
  Activity,
  Baby,
  Brain,
  Stethoscope,
} from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";

export default function Footer() {
  const pathname = usePathname();
  const { requireAuth } = useAuthModal();

  // Hide on standalone screens
  if (pathname === "/login" || pathname === "/subscribe") {
    return null;
  }

  return (
    <footer className="bg-[#CBF2DB] text-slate-800 pt-12 pb-6 border-t border-emerald-300/70 relative">
      {/* Signature Brand Dual-Gradient Accent Line (Emerald to Coral) */}
      <div className="absolute top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f] bg-[length:200%_100%] animate-gradient-x" />

      <div className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── 4-Column Simple Clean Footer Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10">

          {/* ── Col 1: Logo & Socials ── */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-2">
                <div className="relative w-9 h-9">
                  <Image
                    src="/images/logo_transparent.png"
                    alt="HealthGhuru"
                    fill
                    sizes="36px"
                    className="object-contain"
                  />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-slate-900">
                  HEALTH<span className="text-[#f06d2f]">GHURU</span>
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-700 leading-relaxed max-w-xs font-normal">
              Honest health news, reliable medical information. We bring you every story for your wellbeing.
            </p>

            {/* Circular Social Media Buttons (Matching Screenshot) */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Col 2: QUICK LINKS ── */}
          <div>
            <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#f06d2f] mb-3.5">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-700">
              <li>
                <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#16A34A] transition-colors">
                  <span className="text-[#f06d2f] font-bold">›</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/latest" className="inline-flex items-center gap-1.5 hover:text-[#16A34A] transition-colors">
                  <span className="text-[#f06d2f] font-bold">›</span>
                  <span>Latest News</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="inline-flex items-center gap-1.5 hover:text-[#16A34A] transition-colors">
                  <span className="text-[#f06d2f] font-bold">›</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="inline-flex items-center gap-1.5 hover:text-[#16A34A] transition-colors">
                  <span className="text-[#f06d2f] font-bold">›</span>
                  <span>Advertise With Us</span>
                </Link>
              </li>
              <li>
                <Link href="/sponsored-articles" className="inline-flex items-center gap-1.5 hover:text-[#16A34A] transition-colors">
                  <span className="text-[#f06d2f] font-bold">›</span>
                  <span>Sponsored Articles</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Col 3: POPULAR CATEGORIES ── */}
          <div>
            <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#f06d2f] mb-3.5">
              POPULAR CATEGORIES
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-700">
              <li>
                <Link href="/category/heart" className="inline-flex items-center gap-2 hover:text-[#16A34A] transition-colors">
                  <Heart size={14} className="text-[#f06d2f] shrink-0" />
                  <span>Heart &amp; Cardiology</span>
                </Link>
              </li>
              <li>
                <Link href="/category/cancer" className="inline-flex items-center gap-2 hover:text-[#16A34A] transition-colors">
                  <Activity size={14} className="text-[#f06d2f] shrink-0" />
                  <span>Cancer &amp; Oncology</span>
                </Link>
              </li>
              <li>
                <Link href="/category/diabetes" className="inline-flex items-center gap-2 hover:text-[#16A34A] transition-colors">
                  <Stethoscope size={14} className="text-[#f06d2f] shrink-0" />
                  <span>Diabetes Care</span>
                </Link>
              </li>
              <li>
                <Link href="/category/pediatrics" className="inline-flex items-center gap-2 hover:text-[#16A34A] transition-colors">
                  <Baby size={14} className="text-[#f06d2f] shrink-0" />
                  <span>Pediatrics &amp; Kids</span>
                </Link>
              </li>
              <li>
                <Link href="/category/mental-health" className="inline-flex items-center gap-2 hover:text-[#16A34A] transition-colors">
                  <Brain size={14} className="text-[#f06d2f] shrink-0" />
                  <span>Mental Health</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Col 4: CONTACT US ── */}
          <div className="space-y-2.5 text-xs text-slate-700">
            <Link href="/contact" className="inline-block group">
              <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#f06d2f] group-hover:text-[#e05a1b] transition-colors mb-3.5 flex items-center gap-1">
                <span>CONTACT US</span>
                <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
              </h4>
            </Link>
            <p>
              Email:{' '}
              <a
                href="mailto:info@healthghuru.com"
                className="text-[#f06d2f] font-semibold hover:underline"
              >
                info@healthghuru.com
              </a>
            </p>
            <p className="text-slate-600">
              Chennai, Tamil Nadu, India
            </p>
            <p className="text-[11px] italic text-slate-600 leading-relaxed pt-1">
              HealthGhuru is a digital health media brand dedicated to medical truth and patient wellness.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs font-heading font-bold text-[#16A34A] hover:text-[#15803D] hover:underline"
              >
                <span>Send a Message Online →</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar (Matching Screenshot) ── */}
        <div className="pt-5 border-t border-emerald-300/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-3">
          <p>© {new Date().getFullYear()} HealthGhuru. All Rights Reserved.</p>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center font-medium">
            <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-slate-900 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/disclaimer" className="hover:text-slate-900 transition-colors">
              Disclaimer
            </Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">
              Contact
            </Link>
            <Link href="/admin" className="text-emerald-700 font-semibold hover:text-emerald-900 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
