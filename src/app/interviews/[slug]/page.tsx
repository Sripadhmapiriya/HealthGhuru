/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import {
  Video,
  Play,
  ShieldCheck,
  Building2,
  Stethoscope,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { getSafeImageUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const items = await sql`
    SELECT title, summary FROM doctor_interviews WHERE slug = ${params.slug} LIMIT 1
  `;
  if (items.length > 0) {
    return {
      title: `${items[0].title} | HealthGhuru Doctor Interview`,
      description: items[0].summary,
    };
  }
  return { title: 'Doctor Interview | HealthGhuru' };
}

export default async function InterviewDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const items = await sql`
    SELECT di.*, d.name as doctor_name, d.specialization as doctor_specialization, d.photo_url as doctor_photo, d.qualifications as doctor_qualifications, d.bio as doctor_bio, d.experience_years, h.name as hospital_name, h.city as hospital_city, h.about as hospital_about, h.cover_url as hospital_cover
    FROM doctor_interviews di
    LEFT JOIN doctors d ON di.doctor_id = d.id
    LEFT JOIN hospitals h ON di.hospital_id = h.id
    WHERE di.slug = ${params.slug}
    LIMIT 1
  `;

  if (items.length === 0) {
    notFound();
  }

  const interview = items[0];

  return (
    <div className="w-full bg-surface min-h-screen py-8">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-heading mb-4">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          <span>/</span>
          <Link href="/interviews" className="hover:text-[#1B5E20]">Interviews</Link>
          <span>/</span>
          <span className="text-[#1B5E20] font-bold truncate max-w-sm">{interview.title}</span>
        </nav>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#2E7D32]/15 shadow-sm space-y-8">
            
            {/* Title & Metadata */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#1B5E20] text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase">
                  {interview.category || "CLINICAL SPECIALIST INTERVIEW"}
                </span>
                <span className="text-xs text-gray-400 font-mono">• Full Transcript Included</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A2E1A] leading-tight">
                {interview.title}
              </h1>
            </div>

            {/* Video Player Embed / Cover */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black shadow-md group">
              {interview.youtube_video_id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${interview.youtube_video_id}`}
                  title={interview.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full">
                  {interview.cover_image_url && (
                    <Image
                      src={getSafeImageUrl(interview.cover_image_url, interview.category || 'medical')}
                      alt={interview.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#f06d2f] text-white flex items-center justify-center shadow-xl">
                      <Play size={28} className="fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interview Introduction */}
            <div>
              <h2 className="font-heading font-bold text-lg text-[#1B5E20] mb-2">
                Interview Overview & Clinical Context
              </h2>
              <p className="text-sm sm:text-base text-[#1A2E1A] leading-relaxed">
                {interview.summary}
              </p>
            </div>

            {/* Key Discussion Points */}
            {interview.key_points && interview.key_points.length > 0 && (
              <div className="bg-[#F5FAF5] rounded-2xl p-5 sm:p-6 border border-[#2E7D32]/20">
                <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#1B5E20] mb-3">
                  Key Discussion Points & Takeaways
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#1A2E1A]">
                  {interview.key_points.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#2E7D32] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Transcript */}
            {interview.transcript && (
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1B5E20] mb-3 pb-2 border-b border-gray-100">
                  Full Recorded Transcript
                </h3>
                <div className="text-xs sm:text-sm text-gray-700 font-body leading-relaxed space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <p>{interview.transcript}</p>
                  <p className="text-xs text-gray-500 font-mono mt-4">
                    [End of audio transcript • Recorded under HealthGhuru Editorial Standards]
                  </p>
                </div>
              </div>
            )}

            {/* Medical Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <div className="flex items-start gap-2">
                <ShieldAlert size={15} className="text-[#f06d2f] shrink-0 mt-0.5" />
                <p>
                  <strong>Notice:</strong> Opinions and clinical insights expressed in this interview are those of the featured medical specialist and reflect current peer-reviewed consensus. Always consult your personal physician before making therapeutic modifications.
                </p>
              </div>
            </div>

          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Doctor Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#2E7D32]/20 shadow-xs">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#2E7D32] shrink-0">
                  {interview.doctor_photo && (
                    <Image
                      src={getSafeImageUrl(interview.doctor_photo, 'medical', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80')}
                      alt={interview.doctor_name || 'Doctor'}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-heading font-bold text-sm text-[#1A2E1A]">
                      {interview.doctor_name}
                    </h3>
                    <ShieldCheck size={14} className="text-[#2E7D32]" />
                  </div>
                  <p className="text-xs text-[#f06d2f] font-semibold">
                    {interview.doctor_specialization}
                  </p>
                  <span className="text-[10px] text-gray-400 font-mono block">
                    {interview.experience_years} Years Clinical Practice
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#4A6741] leading-relaxed">
                {interview.doctor_bio}
              </p>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-[11px] text-gray-500 font-mono">
                  <strong>Qualifications:</strong> {interview.doctor_qualifications}
                </p>
                <Link
                  href="/doctors"
                  className="mt-3 block text-center py-2 rounded-xl bg-[#F5FAF5] text-[#1B5E20] font-heading font-bold text-xs hover:bg-[#e7f3e7] border border-[#2E7D32]/20 transition-colors"
                >
                  View Specialist Profile
                </Link>
              </div>
            </div>

            {/* Hospital Information Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#2E7D32]/20 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#2E7D32] font-bold block mb-1">
                AFFILIATED INSTITUTION
              </span>
              <h4 className="font-heading font-bold text-sm text-[#1A2E1A]">
                {interview.hospital_name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">{interview.hospital_city}</p>
              <p className="text-xs text-[#4A6741] mt-2 leading-relaxed line-clamp-3">
                {interview.hospital_about}
              </p>
              <Link
                href="/hospitals"
                className="mt-4 block text-center py-2 rounded-xl bg-[#1B5E20] text-white font-heading font-bold text-xs hover:bg-[#2E7D32] transition-colors"
              >
                Hospital Facilities & Doctors →
              </Link>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
