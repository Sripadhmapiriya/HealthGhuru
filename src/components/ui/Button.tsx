"use client";

import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "outline";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  cursorLabel?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, cursorLabel, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-heading font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[#16A34A] hover:bg-[#15803D] text-white shadow-xs hover:-translate-y-[1px] active:translate-y-[0px] rounded-xl",
      accent: "bg-[#f06d2f] hover:bg-[#e05b1d] text-white shadow-xs hover:-translate-y-[1px] active:translate-y-[0px] rounded-xl",
      secondary: "bg-white border-2 border-[#16A34A] text-[#16A34A] hover:bg-emerald-50 hover:-translate-y-[1px] active:translate-y-[0px] rounded-xl",
      ghost: "bg-transparent text-[#16A34A] hover:bg-emerald-50 hover:-translate-y-[1px] active:translate-y-[0px] rounded-xl",
      outline: "bg-transparent border border-emerald-200 text-slate-800 hover:border-[#16A34A] hover:bg-emerald-50/50 active:translate-y-[0px] rounded-xl",
    };
    
    const sizes = {
      sm: "text-xs px-3.5 py-1.5",
      md: "text-sm px-5 py-2.5",
      lg: "text-base px-7 py-3",
    };

    return (
      <button
        ref={ref}
        data-cursor="button"
        data-cursor-text={cursorLabel}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
