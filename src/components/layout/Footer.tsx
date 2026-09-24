"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Heart,
  Activity,
  Baby,
  Brain,
  Stethoscope,
  ArrowRight,
  Mail,
  MapPin,
  Lock,
} from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";

export default function Footer() {
  const pathname = usePathname();
  // Safe hook usage
  let requireAuth: any = null;
  try {
    const auth = useAuthModal();
    requireAuth = auth.requireAuth;
  } catch {
    // Graceful fallback
  }

  // Hide on standalone auth/subscription screens
  if (pathname === "/login" || pathname === "/subscribe") {
    return null;
  }

  return (
    <footer className="relative bg-[#091410] text-slate-300 pt-8 sm:pt-10 pb-5 border-t border-emerald-950/80 overflow-hidden">
      {/* Signature Brand Dual-Gradient Accent Ribbon (Emerald to Sunset Orange) */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f] bg-[length:200%_100%] animate-gradient-x" />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── 4-COLUMN COMPACT MAIN FOOTER GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-7 lg:gap-8 pb-7">

          {/* ── Col 1: Brand Logo & Socials (4 cols on lg) ── */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105 duration-200">
                  <Image
                    src="/images/logo_transparent.png"
                    alt="HealthGhuru Logo"
                    fill
                    sizes="36px"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-xl sm:text-2xl tracking-tight leading-none text-[#22C55E]">
                    HEALTH<span className="text-[#f06d2f]">GHURU</span>
                  </span>
                  <span className="text-[9.5px] font-heading font-semibold text-emerald-400/90 tracking-wide mt-0.5">
                    Live Better. Feel Stronger. Every Day.
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              Honest health journalism, peer-reviewed clinical research, and preventive protocols for patient wellbeing.
            </p>

            {/* Social Media Circular Buttons */}
            <div className="flex items-center gap-2 pt-0.5">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] flex items-center justify-center hover:scale-110 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-black hover:border-slate-500 flex items-center justify-center hover:scale-110 transition-all shadow-xs"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent flex items-center justify-center hover:scale-110 transition-all shadow-xs"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] flex items-center justify-center hover:scale-110 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Col 2: Quick Links (2 cols on lg) ── */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[#f06d2f] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f06d2f]" />
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-slate-400">
              <li>
                <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#22C55E] transition-colors">
                  <span className="text-[#f06d2f] text-[11px] font-bold">›</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/latest" className="inline-flex items-center gap-1.5 hover:text-[#22C55E] transition-colors">
                  <span className="text-[#f06d2f] text-[11px] font-bold">›</span>
                  <span>Latest News</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="inline-flex items-center gap-1.5 hover:text-[#22C55E] transition-colors">
                  <span className="text-[#f06d2f] text-[11px] font-bold">›</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="inline-flex items-center gap-1.5 hover:text-[#22C55E] transition-colors">
                  <span className="text-[#f06d2f] text-[11px] font-bold">›</span>
                  <span>Advertise With Us</span>
                </Link>
              </li>
              <li>
                <Link href="/sponsored-articles" className="inline-flex items-center gap-1.5 hover:text-[#22C55E] transition-colors">
                  <span className="text-[#f06d2f] text-[11px] font-bold">›</span>
                  <span>Sponsored Articles</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Col 3: Popular Categories (3 cols on lg) ── */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[#16A34A] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              <span>Popular Categories</span>
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-slate-400">
              <li>
                <Link href="/category/heart" className="inline-flex items-center gap-2 hover:text-[#22C55E] transition-colors">
                  <Heart size={13} className="text-[#f06d2f] shrink-0" />
                  <span>Heart &amp; Cardiology</span>
                </Link>
              </li>
              <li>
                <Link href="/category/cancer" className="inline-flex items-center gap-2 hover:text-[#22C55E] transition-colors">
                  <Activity size={13} className="text-[#16A34A] shrink-0" />
                  <span>Cancer &amp; Oncology</span>
                </Link>
              </li>
              <li>
                <Link href="/category/diabetes" className="inline-flex items-center gap-2 hover:text-[#22C55E] transition-colors">
                  <Stethoscope size={13} className="text-[#f06d2f] shrink-0" />
                  <span>Diabetes Care</span>
                </Link>
              </li>
              <li>
                <Link href="/category/pediatrics" className="inline-flex items-center gap-2 hover:text-[#22C55E] transition-colors">
                  <Baby size={13} className="text-[#16A34A] shrink-0" />
                  <span>Pediatrics &amp; Kids</span>
                </Link>
              </li>
              <li>
                <Link href="/category/mental-health" className="inline-flex items-center gap-2 hover:text-[#22C55E] transition-colors">
                  <Brain size={13} className="text-[#f06d2f] shrink-0" />
                  <span>Mental Health</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Col 4: Contact Us (3 cols on lg) ── */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[#f06d2f] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f06d2f]" />
              <span>Contact Us →</span>
            </h4>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p>
                Email:{' '}
                <a
                  href="mailto:info@healthghuru.com"
                  className="text-[#f06d2f] font-semibold hover:underline"
                >
                  info@healthghuru.com
                </a>
              </p>
              <p className="text-slate-500">
                Chennai, Tamil Nadu, India
              </p>
              <p className="text-[11px] italic text-slate-500 leading-normal pt-0.5">
                HealthGhuru is dedicated to medical truth and patient wellness.
              </p>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-heading font-bold text-[#16A34A] hover:text-[#22C55E] hover:underline"
                >
                  <span>Send a Message Online →</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* ── 1-LINE MEDICAL DISCLAIMER ── */}
        <div className="pt-4 pb-4 border-t border-emerald-950/70 text-[10.5px] text-slate-500 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-[#16A34A] font-mono font-bold uppercase tracking-wider shrink-0 text-[10px]">
            Medical Disclaimer:
          </span>
          <p className="flex-1">
            Content on HealthGhuru is for educational and news purposes only and does not substitute professional medical advice. Always consult a licensed physician.
          </p>
        </div>

        {/* ── BOTTOM LEGAL BAR ── */}
        <div className="pt-3.5 border-t border-emerald-950/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} HealthGhuru. All Rights Reserved.</p>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center font-medium">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-slate-300 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/disclaimer" className="hover:text-slate-300 transition-colors">
              Disclaimer
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
            <Link 
              href="/admin" 
              className="text-[#f06d2f] hover:text-[#22C55E] font-heading font-black transition-colors flex items-center gap-1"
            >
              <Lock size={10} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
