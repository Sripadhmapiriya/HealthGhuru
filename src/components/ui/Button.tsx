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
    const baseStyles = "inline-flex items-center justify-center font-heading font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";
    const accentGradient = "linear-gradient(135deg, #f06d2f 0%, #ff8a57 100%)";
    
    const inlineStyle: React.CSSProperties | undefined = (variant === 'primary' || variant === 'accent') ? {
      backgroundImage: accentGradient,
    } : undefined;
    const variants = {
      primary: "bg-gradient-accent text-white shadow-md hover:-translate-y-[1px] hover:shadow-lg active:translate-y-[0px] active:shadow-md rounded-full",
      secondary: "bg-white border-2 border-primary text-primary hover:-translate-y-[1px] hover:shadow-md active:translate-y-[0px] rounded-full",
      ghost: "bg-transparent border border-primary text-primary hover:-translate-y-[1px] hover:shadow-sm active:translate-y-[0px] rounded-full",
      accent: "bg-gradient-accent text-dark shadow-md hover:-translate-y-[1px] hover:shadow-lg active:translate-y-[0px] active:shadow-md rounded-full",
      outline: "bg-transparent border border-border text-text-primary hover:border-primary/50 hover:bg-surface-alt active:translate-y-[0px] rounded-full",
    };
    
    const sizes = {
      sm: "text-sm px-4 py-2",
      md: "text-base px-6 py-2.5",
      lg: "text-lg px-8 py-3.5",
    };

    return (
      <button
        ref={ref}
        data-cursor="button"
        data-cursor-text={cursorLabel}
        style={inlineStyle}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
