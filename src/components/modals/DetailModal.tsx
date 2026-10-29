"use client";

import React from "react";
import { X, ExternalLink, Heart, Share2, Calendar, Sparkles, MessageSquare, ThumbsUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSelectedItemForDetail } from "@/redux/slices/contentSlice";
import { toggleFavorite } from "@/redux/slices/favoritesSlice";
import { useTranslation } from "@/i18n/useTranslation";

export default function DetailModal() {
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => state.content.selectedItemForDetail);
  const favorites = useAppSelector((state) => state.favorites.items);
  const { t } = useTranslation();

  if (!item) return null;

  const isFavorited = favorites.some((fav) => fav.id === item.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(item.url || window.location.href);
      alert(t("copiedLink"));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={() => dispatch(setSelectedItemForDetail(null))}
          id="close-detail-modal-btn"
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Banner */}
        {item.imageUrl && (
          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-6 bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md bg-white/20 border border-white/20">
                {item.type} • {item.category}
              </span>
              {item.rating && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                  ★ {item.rating}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{item.source}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(item.publishedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {item.readTime && (
            <>
              <span>•</span>
              <span>{item.readTime}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 id="detail-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
          {item.title}
        </h2>

        {/* Author details */}
        {item.author && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-5">
            {item.authorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.authorAvatar}
                alt={item.author}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                {item.author[0]}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.author}</p>
              {item.authorHandle && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.authorHandle}</p>
              )}
            </div>
          </div>
        )}

        {/* Description / Content Body */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}

        {/* Metrics Row */}
        <div className="flex items-center gap-6 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 mb-6">
          {item.likes !== undefined && (
            <span className="flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-rose-500" />
              {item.likes.toLocaleString()} likes
            </span>
          )}
          {item.comments !== undefined && (
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              {item.comments.toLocaleString()} comments
            </span>
          )}
          {item.score !== undefined && (
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Score: {item.score}/100
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(toggleFavorite(item))}
              id="modal-fav-toggle-btn"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isFavorited
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
              {isFavorited ? t("removeFromFavorites") : t("addToFavorites")}
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Share"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <a
            href={item.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <span>{item.ctaText || t("readMore")}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
