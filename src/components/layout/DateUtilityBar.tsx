"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, ShieldCheck, Megaphone, ArrowUpRight, User, LogIn, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/context/AuthModalContext";

export function DateUtilityBar() {
  const { data: session } = useSession();
  const { requireAuth, openLoginModal } = useAuthModal();
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format: 16 September 2026
      const dateStr = now.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      // Format: Wednesday
      const dayStr = now.toLocaleDateString("en-US", {
        weekday: "long",
      });
      // Format: 01:39:12 PM
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setCurrentDate(dateStr);
      setCurrentDay(dayStr);
      setCurrentTime(timeStr);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const user = session?.user;

  return (
    <div className="w-full bg-[#f8fafc] border-b border-gray-200/80 text-slate-700 text-xs py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Calendar & Date */}
        <div className="flex items-center gap-2 font-heading font-semibold text-slate-800 text-xs sm:text-[13px]">
          <span className="text-[#f06d2f] text-sm">📅</span>
          <span>{currentDate || "16 September 2026"}</span>
          <span className="text-slate-300 font-normal">|</span>
          <span>{currentDay || "Wednesday"}</span>
          <span className="text-slate-300 font-normal hidden sm:inline">|</span>
          <span className="text-slate-500 font-medium hidden sm:inline">Clinical Healthcare &amp; Wellness Edition</span>
        </div>

        {/* Right: Live Digital Clock Pill + Auth Links + Start Advertising Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live Digital Clock Badge */}
          <div className="bg-white border border-gray-200/90 text-slate-800 font-mono text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 hidden xs:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentTime || "01:39:12 PM"}</span>
          </div>

          {/* Quick Sign In / User Greetings */}
          {user ? (
            <Link
              href="/profile"
              className="text-xs font-heading font-semibold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <User size={13} className="text-emerald-600" />
              <span className="hidden sm:inline">Hi,</span> {user.name?.split(" ")[0] || "Member"}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openLoginModal({ initialMode: "signin" })}
              className="text-slate-700 hover:text-emerald-700 hover:underline px-1 py-0.5 cursor-pointer flex items-center gap-1 font-heading font-semibold text-xs"
            >
              <LogIn size={13} className="text-slate-500" />
              <span>Sign In</span>
            </button>
          )}

          <span className="text-slate-300 font-normal hidden sm:inline">|</span>

          {/* Start Advertising CTA Button */}
          <button
            type="button"
            onClick={() => {
              requireAuth('/advertise', {
                intentTitle: 'Hospital & Advertiser Partner Portal',
                intentSubtitle: 'Sign in or register your organization to launch ad campaigns on HealthGhuru.',
              });
            }}
            className="bg-[#f06d2f] hover:bg-[#e05a1b] text-white text-xs font-heading font-bold px-3 sm:px-3.5 py-1.5 rounded-full transition-all shadow-xs hover:shadow flex items-center gap-1 cursor-pointer"
          >
            <Megaphone size={12} />
            <span>Advertise</span>
          </button>
        </div>
      </div>
    </div>
  );
}
