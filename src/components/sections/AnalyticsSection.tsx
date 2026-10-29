"use client";

import React from "react";
import { BarChart3, PieChart, BookOpen, Heart, Flame, Clock, ShieldCheck, Zap } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useTranslation } from "@/i18n/useTranslation";

export default function AnalyticsSection() {
  const feedItems = useAppSelector((state) => state.content.feedItems);
  const favorites = useAppSelector((state) => state.favorites.items);
  const preferences = useAppSelector((state) => state.preferences);
  const readHistoryIds = useAppSelector((state) => state.content.readHistoryIds);
  const { t } = useTranslation();

  // Category counts
  const categoryCounts: Record<string, number> = {};
  feedItems.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  const streamTypeCounts = {
    news: feedItems.filter((i) => i.type === "news").length,
    recommendations: feedItems.filter((i) => i.type === "recommendation").length,
    social: feedItems.filter((i) => i.type === "social").length,
  };

  const totalInteractions = feedItems.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-500">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t("analyticsTab")}
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personal consumption analytics, content breakdown, and interaction telemetry
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t("readingTimeStats")}</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {readHistoryIds.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Detailed stories viewed</p>
        </div>

        <div className="p-5 rounded-3xl glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t("favoritesCountStats")}</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {favorites.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Bookmarked in Vault</p>
        </div>

        <div className="p-5 rounded-3xl glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t("activeCategoriesStats")}</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {preferences.favoriteCategories.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Topics configured</p>
        </div>

        <div className="p-5 rounded-3xl glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Feed Pulse</span>
            <Flame className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalInteractions.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Social engagements</p>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stream Breakdown */}
        <div className="p-6 rounded-3xl glass-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-500" />
            Stream Distribution
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span>News Journalism</span>
                <span className="text-indigo-500">{streamTypeCounts.news} items</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(streamTypeCounts.news / (feedItems.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span>Recommendations (Film & Audio)</span>
                <span className="text-purple-500">{streamTypeCounts.recommendations} items</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${(streamTypeCounts.recommendations / (feedItems.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span>Social Buzz & Threads</span>
                <span className="text-emerald-500">{streamTypeCounts.social} items</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(streamTypeCounts.social / (feedItems.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 rounded-3xl glass-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-500" />
            Content By Topic
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div
                key={cat}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <p className="text-xs font-bold capitalize text-slate-700 dark:text-slate-300">
                  {cat}
                </p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                    {count}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {Math.round((count / (feedItems.length || 1)) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
