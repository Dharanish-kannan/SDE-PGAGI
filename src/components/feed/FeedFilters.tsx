"use client";

import React from "react";
import {
  Sparkles,
  Flame,
  LayoutGrid,
  List,
  Filter,
  SlidersHorizontal,
  Star,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setActiveCategory,
  setActiveType,
  setSortBy,
} from "@/redux/slices/searchSlice";
import { setViewMode } from "@/redux/slices/preferencesSlice";
import { ContentCategory, ContentType, ViewMode } from "@/types/content";
import { useTranslation } from "@/i18n/useTranslation";

const CATEGORY_TABS: { id: "all" | ContentCategory; label: string; icon: string }[] = [
  { id: "all", label: "All Topics", icon: "✨" },
  { id: "technology", label: "Technology", icon: "💻" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "finance", label: "Finance", icon: "📈" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "science", label: "Science", icon: "🚀" },
  { id: "health", label: "Health", icon: "🧬" },
];

const TYPE_TABS: { id: "all" | ContentType; labelKey: string }[] = [
  { id: "all", labelKey: "allTypes" },
  { id: "news", labelKey: "newsOnly" },
  { id: "recommendation", labelKey: "recommendationsOnly" },
  { id: "social", labelKey: "socialOnly" },
];

export default function FeedFilters() {
  const dispatch = useAppDispatch();
  const activeType = useAppSelector((state) => state.search.activeType);
  const activeCategory = useAppSelector((state) => state.search.activeCategory);
  const sortBy = useAppSelector((state) => state.search.sortBy);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Upper Control Bar: Streams & View Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Stream Type Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {TYPE_TABS.map((tab) => {
            const isSelected = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch(setActiveType(tab.id))}
                id={`filter-type-${tab.id}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {t(tab.labelKey as any)}
              </button>
            );
          })}
        </div>

        {/* Right side: Sort by & View Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as any))}
              id="sort-select"
              className="bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value="latest" className="bg-white dark:bg-slate-900">{t("latest")}</option>
              <option value="trending" className="bg-white dark:bg-slate-900">{t("trending")}</option>
              <option value="rating" className="bg-white dark:bg-slate-900">{t("topRated")}</option>
              <option value="popular" className="bg-white dark:bg-slate-900">{t("mostPopular")}</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => dispatch(setViewMode("grid"))}
              id="viewmode-grid-btn"
              title="Grid View"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "grid" || viewMode === "comfortable"
                  ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => dispatch(setViewMode("compact"))}
              id="viewmode-compact-btn"
              title="Compact View"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "compact"
                  ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORY_TABS.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => dispatch(setActiveCategory(cat.id))}
              id={`filter-cat-${cat.id}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                  : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
