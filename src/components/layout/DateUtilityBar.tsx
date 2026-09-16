"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, ShieldCheck, Megaphone, ArrowUpRight } from "lucide-react";

export function DateUtilityBar() {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format: Wednesday, 16 September 2026
      const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      // Format: 10:33 AM
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setCurrentDate(dateStr);
      setCurrentTime(timeStr);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#f2f7f2] border-b border-[#2E7D32]/15 text-[#1A2E1A] text-xs py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Dynamic Date */}
        <div className="flex items-center gap-2 font-heading font-medium text-[#2E7D32]">
          <Calendar size={13} className="text-[#f06d2f] shrink-0" />
          <span>{currentDate || "Wednesday, 16 September 2026"}</span>
          <span className="hidden md:inline text-gray-300">•</span>
          <span className="hidden md:flex items-center gap-1 text-[#4A6741]">
            <Clock size={12} className="text-[#2E7D32]" />
            <span>{currentTime || "10:30 AM"}</span>
          </span>
        </div>

        {/* Center: Editorial Trust badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-[#4A6741]">
          <ShieldCheck size={13} className="text-[#2E7D32]" />
          <span>Peer-Reviewed Clinical Sources & Verified Specialists</span>
        </div>

        {/* Right: Advertising CTA */}
        <div className="flex items-center gap-3 font-heading font-semibold text-[11px]">
          <Link
            href="/advertise"
            className="flex items-center gap-1 text-[#f06d2f] hover:text-[#d8581f] transition-colors group"
          >
            <Megaphone size={12} className="group-hover:scale-110 transition-transform" />
            <span>Advertise With Us</span>
            <ArrowUpRight size={11} />
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/doctors"
            className="text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
          >
            Doctor Directory
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/hospitals"
            className="text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
          >
            Hospitals
          </Link>
        </div>
      </div>
    </div>
  );
}
