"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import {
  Megaphone,
  Building2,
  Stethoscope,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';

export default function AdvertisePage() {
  const adPlacements = [
    { name: "Top Header Horizontal Billboard", spec: "1200x90 Responsive Banner", ctr: "2.8% avg CTR", desc: "Premium above-the-fold visibility across all page visits and mobile news feeds." },
    { name: "Sponsored Clinical Article", spec: "Dedicated Editorial Hub", ctr: "4.2 min avg read time", desc: "Long-form medical feature detailing hospital specialties, case outcomes, or clinical breakthroughs." },
    { name: "Doctor Interview Showcase", spec: "Video & Transcribed Roundtable", ctr: "68% video completion", desc: "Professional video interview spotlighting senior consultants and medical department heads." },
    { name: "In-Feed Native News Card", spec: "Responsive Editorial Card", ctr: "3.4% engagement rate", desc: "Seamless integration within the homepage and category news feeds with clear 'SPONSORED' disclosure." },
    { name: "Specialist Category Sponsorship", spec: "Category Takeover (e.g. Oncology, Heart)", ctr: "High clinical intent", desc: "Exclusive branding on targeted condition hubs for relevant therapeutic areas." },
    { name: "Daily Medical Dispatch Newsletter", spec: "Dedicated Sponsor Slot", ctr: "38% open rate", desc: "Direct delivery to 25,000+ subscriber inboxes including doctors, researchers, and proactive patients." }
  ];

  return (
    <div className="w-full bg-surface min-h-screen py-10">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-[#143419] via-[#1B5E20] to-[#0f2e15] text-white rounded-3xl p-8 sm:p-12 border border-emerald-500/30 shadow-xl mb-12">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-widest text-[#ffd6c1] uppercase bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
              HEALTHGHURU MEDIA NETWORK
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              HEALTHCARE ADVERTISING & PARTNERSHIPS
            </h1>
            <p className="mt-4 text-sm sm:text-base text-emerald-100 leading-relaxed">
              Connect your hospital, diagnostic facility, pharmaceutical innovation, or wellness brand with India's fastest-growing digital health news readership.
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-5 border border-[#2E7D32]/15 text-center shadow-xs">
            <p className="font-display font-bold text-2xl sm:text-3xl text-[#1B5E20]">1.4M+</p>
            <p className="text-xs text-gray-500 font-heading font-semibold mt-1">Monthly Health Readers</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#2E7D32]/15 text-center shadow-xs">
            <p className="font-display font-bold text-2xl sm:text-3xl text-[#f06d2f]">3.8 min</p>
            <p className="text-xs text-gray-500 font-heading font-semibold mt-1">Average Session Duration</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#2E7D32]/15 text-center shadow-xs">
            <p className="font-display font-bold text-2xl sm:text-3xl text-[#1B5E20]">40+</p>
            <p className="text-xs text-gray-500 font-heading font-semibold mt-1">Accredited Hospital Partners</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#2E7D32]/15 text-center shadow-xs">
            <p className="font-display font-bold text-2xl sm:text-3xl text-[#f06d2f]">100%</p>
            <p className="text-xs text-gray-500 font-heading font-semibold mt-1">Compliant Disclosure Rigor</p>
          </div>
        </div>

        {/* Placements Grid */}
        <div className="mb-12">
          <div className="pb-3 mb-6 border-b-2 border-[#2E7D32]">
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A2E1A] uppercase tracking-wide">
              ADVERTISING & SPONSORSHIP PLACEMENTS
            </h2>
            <p className="text-xs text-[#4A6741] font-medium">
              Transparent, high-impact placements clearly disclosed with SPONSORED labeling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adPlacements.map((ad, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-[#2E7D32]/15 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#f06d2f] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {ad.spec}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#1A2E1A] mt-2">
                    {ad.name}
                  </h3>
                  <p className="text-xs text-[#4A6741] mt-2 leading-relaxed">
                    {ad.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono font-bold text-[#1B5E20]">
                  <span>Metric: {ad.ctr}</span>
                  <span className="text-[#f06d2f]">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#2E7D32]/20 shadow-sm max-w-3xl mx-auto">
          <h2 className="font-heading font-extrabold text-2xl text-[#1A2E1A] text-center mb-2">
            Request HealthGhuru Media Kit & Rates
          </h2>
          <p className="text-xs text-gray-500 text-center mb-6">
            Connect with our healthcare sponsorship team within 2 business hours.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Our Healthcare Media Partnerships team will reach out to you within 2 business hours."); }} className="space-y-4 text-xs font-heading">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Your Name *</label>
                <input type="text" placeholder="Dr. / Mr. / Ms." required className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#2E7D32] outline-none" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Organization / Hospital *</label>
                <input type="text" placeholder="Hospital, Clinic or Brand Name" required className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#2E7D32] outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Work Email *</label>
                <input type="email" placeholder="email@organization.com" required className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#2E7D32] outline-none" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#2E7D32] outline-none" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Campaign Goals / Targeted Specialty</label>
              <textarea rows={3} placeholder="Describe your target audience (e.g. Oncology patients, Cardiology second opinions, preventive wellness)..." className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#2E7D32] outline-none" />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:brightness-110 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Submit Advertising Inquiry
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
