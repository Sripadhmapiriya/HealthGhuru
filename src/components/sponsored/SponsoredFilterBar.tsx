'use client';

import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SponsoredFilterBarProps {
  selectedSponsorType: string;
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
  onSponsorTypeChange: (type: string) => void;
  onCategoryChange: (cat: string) => void;
  onSearchChange: (q: string) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

const SPONSOR_TYPES = [
  { id: 'All', label: 'All Partners' },
  { id: 'HOSPITAL', label: '🏥 Hospitals' },
  { id: 'DOCTOR', label: '👨‍⚕️ Doctors' },
  { id: 'CLINIC', label: '🏪 Clinics' },
  { id: 'DIAGNOSTIC_CENTRE', label: '🔬 Diagnostics' },
  { id: 'HEALTHCARE_BRAND', label: '💊 Brands' },
  { id: 'WELLNESS_BRAND', label: '🌿 Wellness' },
];

const CATEGORIES = [
  'All',
  'Cancer',
  'Heart',
  'Diabetes',
  'Women’s Health',
  'Pediatrics',
  'Mental Health',
  'Fitness',
  'Nutrition',
];

export function SponsoredFilterBar({
  selectedSponsorType,
  selectedCategory,
  searchQuery,
  sortBy,
  onSponsorTypeChange,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onReset,
}: SponsoredFilterBarProps) {
  const isFiltered =
    selectedSponsorType !== 'All' ||
    selectedCategory !== 'All' ||
    Boolean(searchQuery) ||
    sortBy !== 'latest';

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
      {/* Top row: Sponsor Type Pills + Search & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        
        {/* Sponsor Type Filter (Horizontal Scroll on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          <span className="text-[11px] font-mono font-bold text-gray-400 uppercase mr-1 hidden sm:inline">
            Partner:
          </span>
          {SPONSOR_TYPES.map((st) => {
            const active = selectedSponsorType === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSponsorTypeChange(st.id)}
                className={`px-3 py-1.5 rounded-full font-heading text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  active
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-emerald-50/70 text-gray-700 hover:bg-emerald-100/70 border border-emerald-200/50'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Row */}
        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search partner content..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#16A34A] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1">
            <SlidersHorizontal size={13} className="text-gray-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-xs font-heading font-medium bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#16A34A]"
            >
              <option value="latest">Latest Stories</option>
              <option value="most_read">Most Read</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>

      </div>

      {/* Bottom row: Category Pills + Reset */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] font-mono font-bold text-gray-400 uppercase mr-1">
            Category:
          </span>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#16A34A]/10 text-[#16A34A] font-bold border border-[#16A34A]/30'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1 hover:underline"
          >
            <X size={12} />
            <span>Reset filters</span>
          </button>
        )}
      </div>

    </div>
  );
}
