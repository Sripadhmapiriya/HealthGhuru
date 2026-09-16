"use client";

import React from "react";
import { motion } from "framer-motion";

type RevealVariant = "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scaleUp";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
}: ScrollRevealProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: any = {
    fadeUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay } },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut", delay } },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay } },
    },
    slideRight: {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay } },
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut", delay } },
    },
  };

  return (
    <motion.div
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
