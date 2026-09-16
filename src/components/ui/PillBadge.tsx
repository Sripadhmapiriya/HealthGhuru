import React from "react";
import { cn } from "@/lib/utils";

interface PillBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active?: boolean;
}

export function PillBadge({ children, active = false, className, ...props }: PillBadgeProps) {
  return (
    <div
      className={cn(
        "pill-badge inline-flex items-center rounded-full px-4 py-1.5 text-sm font-heading font-semibold transition-colors",
        active
          ? "bg-accent text-dark"
          : "bg-white border border-primary text-primary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
