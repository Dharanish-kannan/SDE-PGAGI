"use client";

import React from "react";
import {
  Heart,
  Share2,
  ExternalLink,
  GripVertical,
  Play,
  Film,
  Newspaper,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  Clock,
} from "lucide-react";
import { ContentItem, ViewMode } from "@/types/content";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleFavorite } from "@/redux/slices/favoritesSlice";
import { setSelectedItemForDetail } from "@/redux/slices/contentSlice";
import { useTranslation } from "@/i18n/useTranslation";

interface ContentCardProps {
  item: ContentItem;
  viewMode?: ViewMode;
  dragControls?: boolean;
}

const TYPE_CONFIG = {
  news: {
    icon: Newspaper,
    label: "News",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  recommendation: {
    icon: Film,
    label: "Pick",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  social: {
    icon: MessageCircle,
    label: "Social",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
};

export default function ContentCard({
  item,
  viewMode = "grid",
  dragControls = true,
}: ContentCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const { t } = useTranslation();

  const isFavorited = favorites.some((fav) => fav.id === item.id);
  const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.news;
  const TypeIcon = typeConfig.icon;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(item.url || window.location.href);
      alert(t("copiedLink"));
    }
  };

  const handleCardClick = () => {
    dispatch(setSelectedItemForDetail(item));
  };

  const formattedDate = new Date(item.publishedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  // COMPACT VIEW MODE
  if (viewMode === "compact") {
    return (
      <div
        onClick={handleCardClick}
        className="group relative flex items-center justify-between gap-4 p-4 rounded-2xl glass-card hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
        data-testid="content-card-compact"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {dragControls && (
            <div
              className="touch-none cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          {item.imageUrl && (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${typeConfig.badgeColor}`}
              >
                <TypeIcon className="w-2.5 h-2.5" />
                {item.category}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">
                {item.source}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {item.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleFavorite}
            aria-label="Favorite toggle"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isFavorited
                ? "text-rose-500 bg-rose-500/10 hover:bg-rose-500/20"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500" : ""}`} />
          </button>
          <button
            onClick={handleCardClick}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
          >
            {item.ctaText}
          </button>
        </div>
      </div>
    );
  }

  // STANDARD & COMFORTABLE VIEW MODE
  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-3xl glass-card overflow-hidden hover:scale-[1.01] transition-all duration-300 cursor-pointer ${
        viewMode === "comfortable" ? "p-6" : "p-5"
      }`}
      data-testid="content-card"
    >
      <div>
        {/* Top Media & Tags */}
        <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-800 mb-4.5">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-900 to-slate-900 text-indigo-400">
              <Sparkles className="w-8 h-8 opacity-40" />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 shadow-xs border border-white/20`}
            >
              <TypeIcon className="w-3 h-3 text-indigo-500" />
              {item.category}
            </span>

            <div className="flex items-center gap-1.5">
              {dragControls && (
                <div
                  className="p-1.5 rounded-full backdrop-blur-md bg-black/40 text-white/80 hover:text-white cursor-grab active:cursor-grabbing transition-colors"
                  title="Drag and drop to reorder"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical className="w-4 h-4" />
                </div>
              )}

              <button
                onClick={handleToggleFavorite}
                id={`card-fav-${item.id}`}
                aria-label="Add to favorites"
                className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  isFavorited
                    ? "bg-rose-500 text-white scale-110"
                    : "bg-black/40 text-white/80 hover:text-white hover:bg-black/60"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? "fill-white" : ""}`} />
              </button>
            </div>
          </div>

          {/* Bottom of Media: Source & Rating */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-semibold backdrop-blur-xs px-2 py-0.5 rounded-md bg-black/30">
              {item.source}
            </span>

            {item.rating && (
              <span className="px-2 py-0.5 rounded-md font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                ★ {item.rating}
              </span>
            )}
          </div>
        </div>

        {/* Content Headline & Summary */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2 mb-2">
          {item.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40"
            >
              {tag.startsWith("#") ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / CTA and Author */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {item.authorAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.authorAvatar}
              alt={item.author || "Author"}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
              {item.source[0]}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
              {item.author || item.source}
            </p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {formattedDate} {item.readTime && `• ${item.readTime}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShare}
            aria-label="Share article"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCardClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {item.ctaAction === "play" && <Play className="w-3 h-3 fill-white" />}
            {item.ctaAction === "watch" && <Film className="w-3 h-3" />}
            <span>{item.ctaText || t("readMore")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
