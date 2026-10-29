"use client";

import React, { useState } from "react";
import { Flame, TrendingUp, Trophy } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ContentCard from "@/components/feed/ContentCard";
import { ContentCategory } from "@/types/content";
import { useTranslation } from "@/i18n/useTranslation";
import { setSelectedItemForDetail } from "@/redux/slices/contentSlice";

const TRENDING_CATEGORIES: { id: "all" | ContentCategory; label: string }[] = [
  { id: "all", label: "All Trending" },
  { id: "technology", label: "Tech & AI" },
  { id: "entertainment", label: "Movies & Music" },
  { id: "sports", label: "Sports Drama" },
  { id: "finance", label: "Finance & Crypto" },
];

export default function TrendingSection() {
  const dispatch = useAppDispatch();
  const feedItems = useAppSelector((state) => state.content.feedItems);
  const [selectedCat, setSelectedCat] = useState<"all" | ContentCategory>("all");
  const { t } = useTranslation();

  // Pick top trending items based on score / trending flag
  const trendingList = feedItems
    .filter((item) => (selectedCat === "all" ? true : item.category === selectedCat))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const spotlightItem = trendingList[0];
  const otherTrending = trendingList.slice(1);

  return (
    <div className="w-full">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-5 h-5 fill-amber-500" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t("trendingTab")}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time viral momentum across newsrooms, cinema releases, and social discussions
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {TRENDING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === cat.id
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spotlight #1 Viral Card */}
      {spotlightItem && (
        <div
          onClick={() => dispatch(setSelectedItemForDetail(spotlightItem))}
          className="relative rounded-3xl overflow-hidden glass-card p-6 sm:p-8 mb-8 border border-amber-500/30 group cursor-pointer hover:border-amber-500/60 transition-all"
        >
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-linear-to-r from-amber-500 to-rose-500 text-slate-950 shadow-lg">
            <Trophy className="w-3.5 h-3.5 fill-slate-950" />
            #1 MOMENTUM VIRAL
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs text-amber-500 font-bold uppercase tracking-wider mb-2 mt-4 sm:mt-0">
                <span>{spotlightItem.source}</span>
                <span>•</span>
                <span>{spotlightItem.category}</span>
                {spotlightItem.score && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-extrabold">
                    Score {spotlightItem.score}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors mb-3 leading-tight">
                {spotlightItem.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-5">
                {spotlightItem.description}
              </p>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer">
                  {spotlightItem.ctaText || "Explore Story"}
                </button>
                <span className="text-xs text-slate-400">
                  {spotlightItem.likes?.toLocaleString()} interactions today
                </span>
              </div>
            </div>

            {spotlightItem.imageUrl && (
              <div className="lg:col-span-5 h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={spotlightItem.imageUrl}
                  alt={spotlightItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other Trending Grid */}
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-amber-500" />
        Rising in Momentum
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherTrending.map((item) => (
          <ContentCard key={item.id} item={item} dragControls={false} />
        ))}
      </div>
    </div>
  );
}
