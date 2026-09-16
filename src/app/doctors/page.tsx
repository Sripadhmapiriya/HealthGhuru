/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { sql } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import {
  Stethoscope,
  ShieldCheck,
  Building2,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Doctor Directory & Medical Specialists | HealthGhuru',
  description: 'Connect with verified chief consultants, oncologists, cardiologists, and pediatric specialists in the HealthGhuru Medical Network.',
};

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: { spec?: string };
}) {
  const specFilter = searchParams?.spec;

  const doctors = specFilter
    ? await sql`
        SELECT d.*, h.name as hospital_full_name, h.city as hospital_city
        FROM doctors d
        LEFT JOIN hospitals h ON d.hospital_id = h.id
        WHERE LOWER(d.specialization) LIKE ${`%${specFilter.toLowerCase()}%`}
        ORDER BY d.is_verified DESC, d.experience_years DESC
      `
    : await sql`
        SELECT d.*, h.name as hospital_full_name, h.city as hospital_city
        FROM doctors d
        LEFT JOIN hospitals h ON d.hospital_id = h.id
        ORDER BY d.is_verified DESC, d.experience_years DESC
      `;

  const specializations = [
    "All",
    "Cardiologist",
    "Oncologist",
    "Pediatrician",
    "Endocrinologist",
    "Neurologist"
  ];

  return (
    <div className="w-full bg-surface min-h-screen py-8">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Directory Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2E7D32]/20 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-6 rounded-full bg-[#f06d2f]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#2E7D32] font-bold">
                  EDITORIAL SPECIALIST REGISTRY
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A2E1A] tracking-tight">
                VERIFIED MEDICAL DOCTORS & SPECIALISTS
              </h1>
              <p className="mt-2 text-sm text-[#4A6741] max-w-2xl leading-relaxed">
                Meet the board-certified clinicians, department chairs, and medical reviewers who write, audit, and provide expert commentary for HealthGhuru.
              </p>
            </div>

            <div className="bg-[#F5FAF5] p-3.5 rounded-2xl border border-[#2E7D32]/20 flex items-center gap-3 shrink-0">
              <ShieldCheck size={26} className="text-[#2E7D32]" />
              <div className="text-xs">
                <p className="font-bold text-[#1A2E1A]">100% Verified Credentials</p>
                <p className="text-gray-500 text-[11px]">Independent accreditation check</p>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 mr-2 shrink-0">Specialty:</span>
            {specializations.map((spec) => (
              <Link
                key={spec}
                href={spec === "All" ? "/doctors" : `/doctors?spec=${encodeURIComponent(spec)}`}
                className={`text-xs font-heading font-semibold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                  (spec === "All" && !specFilter) || (specFilter && spec.toLowerCase().includes(specFilter.toLowerCase()))
                    ? "bg-[#1B5E20] text-white border-[#1B5E20] shadow-xs"
                    : "bg-[#F5FAF5] text-[#4A6741] border-[#2E7D32]/15 hover:bg-[#e7f3e7]"
                }`}
              >
                {spec}
              </Link>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc: any) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-6 border border-[#2E7D32]/15 hover:border-[#2E7D32]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Doctor Avatar & Badges */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-[#2E7D32]/30 bg-gray-100 shadow-sm">
                    <Image
                      src={doc.photo_url || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"}
                      alt={doc.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-bold text-base text-[#1A2E1A] truncate">
                        {doc.name}
                      </h3>
                      {doc.is_verified && (
                        <ShieldCheck size={16} className="text-[#2E7D32] shrink-0" />
                      )}
                    </div>

                    <p className="text-xs font-heading font-semibold text-[#f06d2f] mt-0.5 truncate">
                      {doc.specialization}
                    </p>

                    <p className="text-[11px] text-gray-500 font-mono mt-1 flex items-center gap-1 truncate">
                      <Building2 size={12} className="shrink-0 text-gray-400" />
                      <span>{doc.hospital_name || doc.hospital_full_name || "Apex Hospital"}</span>
                    </p>

                    <span className="inline-block text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-200">
                      {doc.experience_years} Years Experience
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#4A6741] line-clamp-3 leading-relaxed">
                  {doc.bio}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-mono">
                  <span className="font-semibold text-gray-700">Credentials:</span> {doc.qualifications}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href={`/interviews`}
                  className="text-xs font-bold text-[#1B5E20] hover:text-[#f06d2f] inline-flex items-center gap-1"
                >
                  <span>Watch Interviews</span>
                  <ArrowRight size={11} />
                </Link>
                <Link
                  href={`/search?q=${encodeURIComponent(doc.name)}`}
                  className="bg-[#F5FAF5] hover:bg-[#e7f3e7] text-[#1B5E20] font-heading font-bold text-xs px-3 py-1.5 rounded-lg border border-[#2E7D32]/20 transition-colors"
                >
                  Authored Articles
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
