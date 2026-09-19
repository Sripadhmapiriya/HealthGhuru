/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { sql } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import {
  Video,
  Play,
  ShieldCheck,
  Building2,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';
import { getSafeImageUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Doctor Interviews & Clinical Webinars | HealthGhuru',
  description: 'Watch in-depth video interviews and read clinical transcripts with leading cardiologists, oncologists, and pediatric specialists.',
};

export default async function InterviewsPage() {
  const interviews = await sql`
    SELECT di.*, d.name as doctor_name, d.specialization as doctor_specialization, d.photo_url as doctor_photo, d.qualifications as doctor_qualifications, h.name as hospital_name, h.city as hospital_city
    FROM doctor_interviews di
    LEFT JOIN doctors d ON di.doctor_id = d.id
    LEFT JOIN hospitals h ON di.hospital_id = h.id
    ORDER BY di.is_featured DESC, di.published_at DESC
  `;

  return (
    <div className="w-full bg-surface min-h-screen py-8">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2E7D32]/20 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Video size={18} className="text-[#f06d2f]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#2E7D32] font-bold">
                  PHYSICIAN DIALOGUES
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A2E1A] tracking-tight">
                DOCTOR INTERVIEWS & ROUNDTABLES
              </h1>
              <p className="mt-2 text-sm text-[#4A6741] max-w-2xl leading-relaxed">
                Watch verified specialists dissect early symptoms, surgical innovations, and clinical trial outcomes in comprehensive conversational deep-dives.
              </p>
            </div>

            <div className="bg-[#F5FAF5] p-3.5 rounded-2xl border border-[#2E7D32]/20 flex items-center gap-3 shrink-0">
              <ShieldCheck size={26} className="text-[#2E7D32]" />
              <div className="text-xs">
                <p className="font-bold text-[#1A2E1A]">Verified Specialists</p>
                <p className="text-gray-500 text-[11px]">Primary department heads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((item: any) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#2E7D32]/20 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/9] w-full bg-black">
                {item.cover_image_url && (
                  <Image
                    src={getSafeImageUrl(item.cover_image_url, item.category || 'medical')}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#f06d2f] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={20} className="fill-white translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-[#1B5E20] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                    {item.category || "Clinical Interview"}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    {item.doctor_photo && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#2E7D32] shrink-0">
                        <Image
                          src={getSafeImageUrl(item.doctor_photo, 'medical', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80')}
                          alt={item.doctor_name || 'Doctor'}
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-xs text-[#1A2E1A] truncate">
                        {item.doctor_name}
                      </h4>
                      <p className="text-[10px] text-gray-500 truncate">
                        {item.doctor_specialization} • {item.hospital_name}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                    "{item.title}"
                  </h3>

                  <p className="text-xs text-[#4A6741] line-clamp-2 mt-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-400">
                    Includes Transcript
                  </span>
                  <Link
                    href={`/interviews/${item.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#f06d2f] hover:underline"
                  >
                    <span>Watch & Read</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
