"use client";

import React, { useState, useMemo } from "react";
import { Heart, Trash2, BookmarkCheck, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAllFavorites } from "@/redux/slices/favoritesSlice";
import { setActiveSection } from "@/redux/slices/contentSlice";
import ContentCard from "@/components/feed/ContentCard";
import { useTranslation } from "@/i18n/useTranslation";

export default function FavoritesSection() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const preferences = useAppSelector((state) => state.preferences);
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [searchFav, setSearchFav] = useState<string>("");
  const { t } = useTranslation();

  // Extract unique tags from favorite items
  const allTags = useMemo(() => {
    const set = new Set<string>();
    favorites.forEach((fav) => {
      fav.tags.forEach((tag) => set.add(tag.replace("#", "")));
    });
    return Array.from(set);
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((fav) => {
      const matchesTag =
        tagFilter === "all" ||
        fav.tags.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()));
      const matchesSearch =
        !searchFav.trim() ||
        fav.title.toLowerCase().includes(searchFav.toLowerCase()) ||
        fav.description.toLowerCase().includes(searchFav.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [favorites, tagFilter, searchFav]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t("favoritesTab")}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {favorites.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your personal vault of bookmarked stories, media recommendations, and social updates
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to remove all saved favorites?")) {
                  dispatch(clearAllFavorites());
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Vault
            </button>
          </div>
        )}
      </div>

      {/* Search and Tag Filters within Favorites */}
      {favorites.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFav}
              onChange={(e) => setSearchFav(e.target.value)}
              placeholder="Filter your saved items..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setTagFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  tagFilter === "all"
                    ? "bg-rose-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                All Tags
              </button>
              {allTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    tagFilter === tag
                      ? "bg-rose-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {favorites.length === 0 && (
        <div className="py-24 px-6 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200/80 dark:border-slate-800 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <BookmarkCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {t("emptyFavoritesTitle")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
            {t("emptyFavoritesDesc")}
          </p>
          <button
            onClick={() => dispatch(setActiveSection("feed"))}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Explore Unified Feed
          </button>
        </div>
      )}

      {/* Favorites Grid */}
      {filteredFavorites.length > 0 && (
        <div
          className={
            preferences.viewMode === "compact"
              ? "space-y-3"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          }
        >
          {filteredFavorites.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              viewMode={preferences.viewMode}
              dragControls={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
