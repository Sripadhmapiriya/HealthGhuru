/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { sql } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  ShieldCheck,
  Phone,
  Globe,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { getSafeImageUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Accredited Hospitals & Healthcare Centers | HealthGhuru',
  description: 'Explore premier tertiary hospitals, comprehensive cancer centers, and cardiac care institutes affiliated with HealthGhuru.',
};

export default async function HospitalsPage() {
  const hospitals = await sql`
    SELECT * FROM hospitals ORDER BY is_sponsored DESC, is_verified DESC, name ASC
  `;

  return (
    <div className="w-full bg-surface min-h-screen py-8">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2E7D32]/20 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-6 rounded-full bg-[#f06d2f]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#2E7D32] font-bold">
                  ACCREDITED CARE NETWORK
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A2E1A] tracking-tight">
                PREMIER HOSPITALS & MEDICAL CENTERS
              </h1>
              <p className="mt-2 text-sm text-[#4A6741] max-w-2xl leading-relaxed">
                National and regional tertiary health systems, specialized oncology pavilions, and advanced research medical colleges.
              </p>
            </div>

            <div className="bg-[#F5FAF5] p-3.5 rounded-2xl border border-[#2E7D32]/20 flex items-center gap-3 shrink-0">
              <Building2 size={26} className="text-[#2E7D32]" />
              <div className="text-xs">
                <p className="font-bold text-[#1A2E1A]">NABH / JCI Accredited</p>
                <p className="text-gray-500 text-[11px]">Strict hospital safety standards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Profiles List */}
        <div className="space-y-6">
          {hospitals.map((hosp: any) => (
            <div
              key={hosp.id}
              className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 shadow-xs hover:shadow-lg ${
                hosp.is_sponsored
                  ? "border-orange-300 ring-1 ring-orange-200"
                  : "border-[#2E7D32]/20"
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Cover Image (Left 4 cols) */}
                <div className="lg:col-span-4 relative aspect-[16/10] lg:aspect-auto min-h-[220px] bg-gray-100">
                  {hosp.cover_url && (
                    <Image
                      src={getSafeImageUrl(hosp.cover_url, 'hospital', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80')}
                      alt={hosp.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  {hosp.is_sponsored && (
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-[#ffd6c1] text-[10px] font-mono font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow">
                      <Sparkles size={11} className="text-[#f06d2f]" />
                      <span>SPONSORED HOSPITAL</span>
                    </div>
                  )}
                </div>

                {/* Content Area (Cols 5-12) */}
                <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A2E1A]">
                          {hosp.name}
                        </h2>
                        {hosp.is_verified && (
                          <span className="bg-[#1B5E20] text-white text-[9px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                            <ShieldCheck size={11} />
                            <span>VERIFIED</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <MapPin size={13} className="text-[#f06d2f]" />
                        <span>{hosp.city}, {hosp.state}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#4A6741] leading-relaxed mt-2">
                      {hosp.about}
                    </p>

                    {/* Specializations & Facilities */}
                    <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                          Core Specializations
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(hosp.specializations || []).map((spec: string) => (
                            <span
                              key={spec}
                              className="text-[11px] font-heading font-semibold bg-[#F5FAF5] text-[#1B5E20] px-2.5 py-1 rounded-md border border-[#2E7D32]/15"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                          Key Facilities
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(hosp.facilities || []).map((fac: string) => (
                            <span
                              key={fac}
                              className="text-[11px] text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200"
                            >
                              {fac}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Contact */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-4 text-gray-600 font-mono">
                      {hosp.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} className="text-[#2E7D32]" />
                          <span>{hosp.phone}</span>
                        </div>
                      )}
                      {hosp.website_url && (
                        <a
                          href={hosp.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#1B5E20] hover:text-[#f06d2f] transition-colors"
                        >
                          <Globe size={13} />
                          <span>Official Portal</span>
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/doctors`}
                      className="inline-flex items-center gap-1.5 font-heading font-bold text-xs bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-4 py-2 rounded-xl transition-all shadow-xs"
                    >
                      <span>View Affiliated Doctors</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
