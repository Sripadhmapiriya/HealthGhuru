"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Send,
  Heart,
  ArrowRight,
  ShieldCheck,
  Megaphone,
} from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";

export default function Footer() {
  const pathname = usePathname();
  const { requireAuth } = useAuthModal();

  if (pathname === '/login' || pathname === '/subscribe') {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 sm:pt-16 pb-8 relative">
      {/* 4px Signature Brand Gradient Top Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f]" />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Subscription Strip with Ambient Gradient */}
        <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-orange-950/70 rounded-2xl p-6 sm:p-8 mb-12 border border-emerald-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-orange-200 uppercase bg-white/10 px-2.5 py-0.5 rounded border border-white/10">
              DAILY CLINICAL DISPATCH
            </span>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white mt-2">
              Live Better. Feel Stronger. Every Day.
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-xl">
              Get the latest peer-reviewed medical breakthroughs, physician interviews, and wellness news delivered to your inbox every morning.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to HealthGhuru!"); }} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="w-full sm:w-72 px-4 py-2.5 rounded-full bg-slate-900/80 border border-emerald-500/40 text-white text-xs placeholder-slate-400 outline-none focus:border-[#f06d2f]"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f06d2f] to-[#ff8a57] hover:brightness-110 text-white font-heading font-bold text-xs shadow-md transition-all whitespace-nowrap"
            >
              Subscribe Free
            </button>
          </form>
        </div>

        {/* 6-Column News Portal Structure */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12 text-xs">
          
          {/* Col 1: HealthGhuru Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image
                    src="/images/logo_transparent.png"
                    alt="HealthGhuru"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-display font-bold text-xl text-white">
                  HEALTH<span className="text-[#f06d2f]">GHURU</span>
                </span>
              </div>
            </Link>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              India's premier digital health news platform, providing continuous, fact-checked medical journalism, clinical trial analysis, and expert guidance.
            </p>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck size={14} />
              <span>Verified Medical Portal</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-white mb-3 pb-1 border-b border-emerald-800">
              Categories
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li><Link href="/category/cancer" className="hover:text-[#f06d2f] transition-colors">Cancer</Link></li>
              <li><Link href="/category/heart" className="hover:text-[#f06d2f] transition-colors">Heart Health</Link></li>
              <li><Link href="/category/diabetes" className="hover:text-[#f06d2f] transition-colors">Diabetes</Link></li>
              <li><Link href="/category/womens-health" className="hover:text-[#f06d2f] transition-colors">Women's Health</Link></li>
              <li><Link href="/category/pediatrics" className="hover:text-[#f06d2f] transition-colors">Pediatrics</Link></li>
              <li><Link href="/category/mental-health" className="hover:text-[#f06d2f] transition-colors">Mental Health</Link></li>
              <li><Link href="/category/fitness" className="hover:text-[#f06d2f] transition-colors">Fitness</Link></li>
              <li><Link href="/category/nutrition" className="hover:text-[#f06d2f] transition-colors">Nutrition</Link></li>
            </ul>
          </div>

          {/* Col 3: Explore */}
          <div>
            <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-white mb-3 pb-1 border-b border-emerald-800">
              Explore
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li><Link href="/latest" className="hover:text-[#f06d2f] transition-colors">Latest News</Link></li>
              <li><Link href="/trending" className="hover:text-[#f06d2f] transition-colors">Trending Stories</Link></li>
              <li><Link href="/research" className="hover:text-[#f06d2f] transition-colors">Medical Research</Link></li>
              <li><Link href="/videos" className="hover:text-[#f06d2f] transition-colors">Health Videos</Link></li>
              <li><Link href="/videos?format=short" className="hover:text-[#f06d2f] transition-colors">Health Shorts</Link></li>
              <li><Link href="/magazines" className="hover:text-[#f06d2f] transition-colors">Magazines</Link></li>
              <li><Link href="/tools" className="hover:text-[#f06d2f] transition-colors">Health Tools & BMI</Link></li>
            </ul>
          </div>

          {/* Col 4: Medical Ecosystem */}
          <div>
            <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-white mb-3 pb-1 border-b border-emerald-800">
              Medical Directory
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li><Link href="/doctors" className="hover:text-[#f06d2f] transition-colors">Doctor Directory</Link></li>
              <li><Link href="/hospitals" className="hover:text-[#f06d2f] transition-colors">Hospitals & Centers</Link></li>
              <li><Link href="/interviews" className="hover:text-[#f06d2f] transition-colors">Doctor Interviews</Link></li>
              <li><Link href="/about/medical-review" className="hover:text-[#f06d2f] transition-colors">Medical Board</Link></li>
              <li><Link href="/editorial-standards" className="hover:text-[#f06d2f] transition-colors">Editorial Standards</Link></li>
            </ul>
          </div>

          {/* Col 5: Business */}
          <div>
            <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-white mb-3 pb-1 border-b border-emerald-800">
              Business
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    requireAuth('/advertise', {
                      intentTitle: 'Hospital & Advertiser Partner Portal',
                      intentSubtitle: 'Sign in or register your organization to launch ad campaigns on HealthGhuru.',
                    });
                  }}
                  className="text-[#f06d2f] font-semibold hover:underline text-left cursor-pointer"
                >
                  Advertise With Us
                </button>
              </li>
              <li><Link href="/sponsored" className="hover:text-[#f06d2f] transition-colors">Sponsored Content</Link></li>
              <li><Link href="/partner" className="hover:text-[#f06d2f] transition-colors">Hospital Partnerships</Link></li>
              <li><Link href="/press" className="hover:text-[#f06d2f] transition-colors">Press & Media</Link></li>
              <li><Link href="/careers" className="hover:text-[#f06d2f] transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Col 6: Legal & Disclaimers */}
          <div>
            <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-white mb-3 pb-1 border-b border-emerald-800">
              Legal & Privacy
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li><Link href="/privacy-policy" className="hover:text-[#f06d2f] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-[#f06d2f] transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-[#f06d2f] transition-colors">Medical Disclaimer</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-[#f06d2f] transition-colors">Cookie Policy</Link></li>
              <li><Link href="/contact" className="hover:text-[#f06d2f] transition-colors">Contact Editorial</Link></li>
            </ul>
          </div>

        </div>

        {/* Mandatory Medical Disclaimer Alert Box */}
        <div className="bg-black/40 rounded-xl p-4 border border-emerald-800/40 text-[11px] text-gray-400 leading-relaxed mb-6">
          <div className="flex items-start gap-2.5">
            <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-200">EDITORIAL & MEDICAL DISCLAIMER:</strong> HealthGhuru is a digital health news and educational publication. Content published on this platform — including clinical research reports, doctor interviews, articles, and wellness tools — is intended solely for general informational and journalistic purposes. It is not a substitute for professional medical consultation, diagnosis, or treatment. Always consult a qualified healthcare provider regarding medical conditions or symptoms. In medical emergencies, contact your local emergency services immediately.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
          <p>© {new Date().getFullYear()} HealthGhuru Media Network. All rights reserved.</p>
          <p className="font-heading font-semibold text-emerald-300">
            Live Better. Feel Stronger. Every Day.
          </p>
        </div>

      </div>
    </footer>
  );
}
