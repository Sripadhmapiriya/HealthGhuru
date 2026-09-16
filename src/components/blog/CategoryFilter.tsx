"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = ["All", "Nutrition", "Fitness", "Mental Health", "Sleep"];

interface CategoryFilterProps {
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-8">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={cn(
              "category-filter-pill relative px-5 py-2.5 rounded-full text-sm font-heading font-semibold transition-colors duration-300",
              isActive ? "text-dark" : "bg-white border border-primary/20 text-primary hover:border-primary/50"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-accent rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
}
