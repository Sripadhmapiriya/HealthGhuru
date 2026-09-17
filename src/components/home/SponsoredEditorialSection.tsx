/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Building2, Stethoscope, ArrowRight, ExternalLink, Megaphone } from 'lucide-react';
import { useAuthModal } from '@/context/AuthModalContext';
import { useSubscription } from '@/lib/hooks/useSubscription';

export function SponsoredEditorialSection() {
  const { isAdFree } = useSubscription();
  const { requireAuth } = useAuthModal();

  if (isAdFree) return null;

  const sponsoredItems = [
    {
      id: "sp-1",
      title: "Apex Heart & Vascular Institute: Precision Robotic Cardiac Valve Surgery",
      excerpt: "Minimally invasive catheter-based valve repairs allow cardiac patients to return home in under 48 hours with accelerated myocardial recovery.",
      sponsor: "Apex Heart & Vascular Institute",
      sponsor_type: "Hospital Partner",
      target_url: "/hospitals/apex-heart-vascular-institute",
      image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
      cta: "Explore Cardiac Services"
    },
    {
      id: "sp-2",
      title: "National Cancer Care Centre: Targeted Immunotherapy Innovations for Advanced Tumors",
      excerpt: "Expanding clinical accessibility to dual-checkpoint inhibitors and personalized cancer vaccines through multi-centre translational trials.",
      sponsor: "National Cancer Research Centre",
      sponsor_type: "Clinical Oncology Partner",
      target_url: "/hospitals/national-cancer-research-care-centre",
      image_url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
      cta: "Consult Specialists"
    },
    {
      id: "sp-3",
      title: "St. Jude Children's Pavilion: Neonatal Intensive Care & Advanced Pediatric Diagnostics",
      excerpt: "Pioneering state-of-the-art non-invasive neonatal monitoring and metabolic screening for infants across the country.",
      sponsor: "St. Jude Children's Medical Pavilion",
      sponsor_type: "Pediatric Care Partner",
      target_url: "/hospitals/st-jude-childrens-medical-pavilion",
      image_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      cta: "Learn More"
    }
  ];

  return (
    <section className="w-full py-8 sm:py-10 bg-[#fffbf8] border-t border-b border-orange-200/60">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with clear SPONSORED badge */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#f06d2f]/30">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold bg-[#f06d2f] text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              SPONSORED HEALTHCARE INITIATIVES
            </span>
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
              Partner Content • Commercial Healthcare Editorial
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              requireAuth('/advertise', {
                intentTitle: 'Healthcare Partner Sponsorship & Advertising',
                intentSubtitle: 'Sign in or register your organization to sponsor editorial initiatives and reach verified health readers.',
              });
            }}
            className="text-xs font-heading font-semibold text-[#f06d2f] hover:underline cursor-pointer"
          >
            Advertise With Us →
          </button>
        </div>

        {/* 3-Column Sponsored Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sponsoredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-orange-200/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs text-[#ffd6c1] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  <Sparkles size={11} className="text-[#f06d2f]" />
                  <span>SPONSORED</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mb-1.5">
                    <Building2 size={12} className="text-[#2E7D32]" />
                    <span>{item.sponsor}</span>
                  </div>

                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#4A6741] line-clamp-2 mt-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400">
                    {item.sponsor_type}
                  </span>
                  <Link
                    href={item.target_url}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#f06d2f] group-hover:underline"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
