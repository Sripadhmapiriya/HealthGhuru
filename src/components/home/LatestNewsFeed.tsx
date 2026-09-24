/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  Apple,
  Moon,
  Heart,
  Dumbbell,
  Droplet,
  FlaskConical,
  Ribbon,
  Sparkles,
  Baby,
  Brain,
  Microscope,
  Leaf,
  Truck,
} from 'lucide-react';
import { formatDate, getSafeImageUrl } from '@/lib/utils';

interface LatestNewsFeedProps {
  initialItems: any[];
}

const CATEGORY_FILTERS = [
  { name: "All", icon: null },
  { name: "Cancer", icon: Ribbon },
  { name: "Heart", icon: Heart },
  { name: "Diabetes", icon: Droplet },
  { name: "Women's Health", icon: Sparkles },
  { name: "Pediatrics", icon: Baby },
  { name: "Mental Health", icon: Brain },
  { name: "Fitness", icon: Dumbbell },
  { name: "Nutrition", icon: Apple },
  { name: "Medical Research", icon: Microscope },
];

const DEFAULT_FALLBACK_ITEMS = [
  {
    id: "f-1",
    title: "Mediterranean Diet May Lower Risk of Heart Disease, New Study Finds",
    slug: "mediterranean-diet-may-lower-risk-of-heart-disease-new-study-finds",
    category: "Nutrition",
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    excerpt: "A long-term study shows that a Mediterranean-style diet can significantly reduce the risk of heart disease...",
    published_at: "2026-09-24T08:00:00.000Z",
    source_name: "HealthGuru Editorial Team",
  },
  {
    id: "f-2",
    title: "Better Sleep, Better Health: The Science of Restful Nights",
    slug: "better-sleep-better-health-the-science-of-restful-nights",
    category: "Sleep",
    image_url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
    excerpt: "Quality sleep helps regulate hormones, boosts immunity and supports mental well-being, say new researchers...",
    published_at: "2026-09-23T08:00:00.000Z",
    source_name: "HealthGuru Editorial Team",
  },
  {
    id: "f-3",
    title: "AI-Powered Tools Improve Early Heart Disease Detection",
    slug: "ai-powered-tools-improve-early-heart-disease-detection",
    category: "Heart",
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    excerpt: "New research shows that artificial intelligence can identify heart risks earlier and more accurately...",
    published_at: "2026-09-22T08:00:00.000Z",
    source_name: "HealthGuru Editorial Team",
  },
  {
    id: "f-4",
    title: "Simple Daily Habits That Boost Your Metabolism",
    slug: "simple-daily-habits-that-boost-your-metabolism",
    category: "Fitness",
    image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    excerpt: "Experts say small lifestyle changes, including strength training and more walking, can help keep your metabolism...",
    published_at: "2026-09-21T08:00:00.000Z",
    source_name: "HealthGuru Editorial Team",
  },
  {
    id: "f-5",
    title: "New Study Shows Promise for Immunotherapy in Earlier Cancer Stages",
    slug: "new-study-shows-promise-for-immunotherapy-in-earlier-cancer-stages",
    category: "Medical Research",
    image_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    excerpt: "Researchers report encouraging results for immunotherapy in treating certain cancers at earlier stages...",
    published_at: "2026-09-20T08:00:00.000Z",
    source_name: "HealthGuru Editorial Team",
  },
  {
    id: "f-6",
    title: "New Guidelines for Type 2 Diabetes Focus on Personalized Care",
    slug: "new-guidelines-for-type-2-diabetes-focus-on-personalized-care",
    category: "Diabetes",
    image_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    excerpt: "Experts emphasize tailored treatment plans, lifestyle support and continuous monitoring for better outcomes...",
    published_at: "2026-09-19T08:00:00.000Z",
    source_name: "HealthGuru Editorial Team",
  },
];

function getCategoryBadge(category?: string) {
  const cat = (category || "Health").toLowerCase();
  if (cat.includes("nutrition") || cat.includes("diet") || cat.includes("food")) {
    return {
      label: "NUTRITION",
      icon: Apple,
      className: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      iconClass: "text-emerald-700",
    };
  }
  if (cat.includes("sleep")) {
    return {
      label: "SLEEP",
      icon: Moon,
      className: "bg-purple-50 text-purple-800 border-purple-200/80",
      iconClass: "text-purple-700",
    };
  }
  if (cat.includes("heart") || cat.includes("cardio")) {
    return {
      label: "HEART",
      icon: Heart,
      className: "bg-rose-50 text-rose-700 border-rose-200/80",
      iconClass: "text-rose-600 fill-rose-100",
    };
  }
  if (cat.includes("fitness") || cat.includes("exercise") || cat.includes("workout")) {
    return {
      label: "FITNESS",
      icon: Dumbbell,
      className: "bg-teal-50 text-teal-800 border-teal-200/80",
      iconClass: "text-teal-700",
    };
  }
  if (cat.includes("diabetes") || cat.includes("endocrine")) {
    return {
      label: "DIABETES",
      icon: Droplet,
      className: "bg-orange-50 text-orange-800 border-orange-200/80",
      iconClass: "text-orange-700 fill-orange-100",
    };
  }
  if (cat.includes("research") || cat.includes("clinical") || cat.includes("science")) {
    return {
      label: "MEDICAL RESEARCH",
      icon: FlaskConical,
      className: "bg-sky-50 text-sky-800 border-sky-200/80",
      iconClass: "text-sky-700",
    };
  }
  if (cat.includes("cancer") || cat.includes("oncology")) {
    return {
      label: "CANCER",
      icon: Ribbon,
      className: "bg-rose-50 text-rose-800 border-rose-200/80",
      iconClass: "text-rose-700",
    };
  }
  if (cat.includes("women")) {
    return {
      label: "WOMEN'S HEALTH",
      icon: Sparkles,
      className: "bg-purple-50 text-purple-800 border-purple-200/80",
      iconClass: "text-purple-700",
    };
  }
  if (cat.includes("pediatric") || cat.includes("child")) {
    return {
      label: "PEDIATRICS",
      icon: Baby,
      className: "bg-blue-50 text-blue-800 border-blue-200/80",
      iconClass: "text-blue-700",
    };
  }
  if (cat.includes("mental") || cat.includes("mind") || cat.includes("brain")) {
    return {
      label: "MENTAL HEALTH",
      icon: Brain,
      className: "bg-violet-50 text-violet-800 border-violet-200/80",
      iconClass: "text-violet-700",
    };
  }
  return {
    label: (category || "HEALTH").toUpperCase(),
    icon: Sparkles,
    className: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    iconClass: "text-emerald-700",
  };
}

export function LatestNewsFeed({ initialItems }: LatestNewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter items based on selected category
  const filteredFromDB = (initialItems || []).filter((item) => {
    if (selectedCategory === "All") return true;
    const cat = (item.category || "").toLowerCase();
    const target = selectedCategory.toLowerCase();
    return cat.includes(target) || target.includes(cat);
  });

  const filteredFallbacks = DEFAULT_FALLBACK_ITEMS.filter((item) => {
    if (selectedCategory === "All") return true;
    const cat = (item.category || "").toLowerCase();
    const target = selectedCategory.toLowerCase();
    return cat.includes(target) || target.includes(cat);
  });

  // Combine real database items and rich fallbacks to ensure 6 balanced cards
  const combinedItems = [...filteredFromDB, ...filteredFallbacks];
  // Deduplicate by title or id
  const seen = new Set();
  const displayedItems = combinedItems.filter((item) => {
    const key = item.title?.toLowerCase() || item.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);

  return (
    <section className="w-full py-8 sm:py-12 bg-[#F9FAF8] border-t border-emerald-500/10">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with ECG Heartbeat Pulse Line matching Image 1 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="text-[11px] font-heading font-black tracking-widest text-[#0D6E42] uppercase">
              REAL-TIME CLINICAL WIRE
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading font-black text-xl sm:text-3xl lg:text-[32px] text-[#0C3B2E] tracking-tight uppercase">
              LATEST HEALTH NEWS &amp; ANALYSIS
            </h2>

            {/* Emerald line with orange ECG heartbeat pulse on the right */}
            <div className="hidden sm:flex items-center flex-1 ml-4 sm:ml-6">
              <div className="flex-1 h-[2px] bg-[#16A34A]" />
              <svg className="w-20 h-6 text-[#EA580C] shrink-0 -ml-0.5" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12H24L28 4L34 20L39 8L43 15L47 12H80" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
            Trusted research, expert insights and the latest updates from the world of health.
          </p>
        </div>

        {/* Category Filters Bar with smooth edge-to-edge mobile scrolling */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORY_FILTERS.map((catItem) => {
            const IconComponent = catItem.icon;
            const isSelected = selectedCategory === catItem.name;
            return (
              <button
                key={catItem.name}
                onClick={() => {
                  setSelectedCategory(catItem.name);
                }}
                className={`text-xs font-heading font-bold whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#EA580C] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 border border-gray-200/90 shadow-2xs"
                }`}
              >
                {IconComponent && <IconComponent size={13} className={isSelected ? "text-white" : "text-slate-600"} />}
                <span>{catItem.name}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Part Grid: Left 2 Columns of News Cards + Right Sponsored Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* LEFT 2 COLUMNS OF NEWS CARDS (Cols 1-8) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {displayedItems.map((item, index) => {
                const slug = item.slug || `news-${index}`;
                const badge = getCategoryBadge(item.category);
                const BadgeIcon = badge.icon;
                const rawImg = item.image_url || "";
                const isBadImg = !rawImg || rawImg.toLowerCase().includes("screenshot") || rawImg.includes("localhost");
                const fallbackImg = DEFAULT_FALLBACK_ITEMS[index % DEFAULT_FALLBACK_ITEMS.length].image_url;
                const imageSrc = isBadImg ? fallbackImg : getSafeImageUrl(item.image_url, item.category, fallbackImg);

                return (
                  <article
                    key={item.id || index}
                    className="group bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5">
                      {/* Thumbnail Image */}
                      <Link
                        href={`/article/${slug}`}
                        className="relative w-full sm:w-36 md:w-32 lg:w-36 h-36 sm:h-auto aspect-[16/10] sm:aspect-auto rounded-xl overflow-hidden shrink-0 bg-slate-100 block"
                      >
                        <Image
                          src={imageSrc}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 150px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Badge + Date */}
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-heading font-black px-2 py-0.5 rounded-full border ${badge.className}`}>
                              <BadgeIcon size={10} className={badge.iconClass} />
                              <span>{badge.label}</span>
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                              <Calendar size={11} className="text-slate-400" />
                              <span>{formatDate(item.published_at || new Date())}</span>
                            </span>
                          </div>

                          {/* Title */}
                          <Link href={`/article/${slug}`}>
                            <h3 className="font-heading font-black text-xs sm:text-[13.5px] lg:text-[14px] text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h3>
                          </Link>

                          {/* Excerpt */}
                          <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            {item.excerpt || item.description || item.summary || "A long-term study shows clinical improvements and healthy outcomes..."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0 text-[10px] sm:text-[11px]">
                        <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-700 truncate">Medically Reviewed</span>
                        <span className="hidden sm:inline text-slate-300">|</span>
                        <span className="hidden sm:inline text-slate-400 truncate">By HealthGuru Editorial Team</span>
                      </div>
                      <Link
                        href={`/article/${slug}`}
                        className="inline-flex items-center gap-1 text-[#EA580C] hover:text-[#C2410C] font-heading font-bold text-xs shrink-0 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Read Report</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN (Cols 9-12): HealthPlus Sponsored Card */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-[#FAFDFB] border border-emerald-200/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full shadow-2xs hover:shadow-md transition-shadow">
              <div>
                {/* Header: Logo + Sponsored Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                      <Leaf size={18} />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm sm:text-base text-[#0D4D3A] leading-none">HealthPlus</h4>
                      <span className="text-[10px] text-slate-400 font-medium">Better Nutrition. A Healthier You.</span>
                    </div>
                  </div>
                  <span className="bg-[#15803D] text-white text-[10px] font-heading font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Sponsored
                  </span>
                </div>

                {/* Main Copy */}
                <div className="mt-5">
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-[#0D4D3A] leading-snug tracking-tight">
                    Science-Backed Nutrition for Every Stage of Life
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Premium supplements and natural wellness products for your complete health.
                  </p>
                  <Link
                    href="/sponsored-articles"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:brightness-105 text-white font-heading font-bold text-xs px-5 py-2.5 rounded-full shadow-md shadow-orange-600/20 mt-4 transition-all"
                  >
                    <span>Explore Now</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Product Image */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mt-5 bg-emerald-50/50">
                  <Image
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
                    alt="HealthPlus Daily Wellness Supplements"
                    fill
                    sizes="(max-width: 1024px) 100vw, 340px"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              </div>

              {/* Bottom 3 Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 mt-5 border-t border-emerald-100 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Leaf size={16} className="text-emerald-600" />
                  <span className="text-[10px] font-bold text-slate-700 leading-tight">High Quality Ingredients</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-emerald-100 px-1">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span className="text-[10px] font-bold text-slate-700 leading-tight">Clinically Researched</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck size={16} className="text-emerald-600" />
                  <span className="text-[10px] font-bold text-slate-700 leading-tight">Trusted Worldwide</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
