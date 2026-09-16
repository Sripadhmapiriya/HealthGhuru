"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hoverEffect = true, ...props }, ref) => {
    const Component = hoverEffect ? motion.div : "div";
    const hoverProps = hoverEffect ? {
      whileHover: { y: -6, boxShadow: "var(--card-shadow-hover)" }
    } : {};

    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={cn(
          "bg-white rounded-card shadow-card overflow-hidden transition-shadow duration-300",
          className
        )}
        {...hoverProps}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...props as any}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";
