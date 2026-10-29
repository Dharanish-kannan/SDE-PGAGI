"use client";

import React, { useState } from "react";
import { X, Sliders, Check, RotateCcw, Key, ShieldCheck, Layers, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  toggleCategory,
  toggleType,
  setViewMode,
  updateApiKeys,
  resetPreferences,
} from "@/redux/slices/preferencesSlice";
import { fetchFeedAsync } from "@/redux/slices/contentSlice";
import { ContentCategory, ContentType, ViewMode } from "@/types/content";
import { useTranslation } from "@/i18n/useTranslation";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: ContentCategory; label: string; icon: string }[] = [
  { id: "technology", label: "Technology", icon: "💻" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "finance", label: "Finance & Markets", icon: "📈" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "science", label: "Science & Space", icon: "🚀" },
  { id: "health", label: "Health & Bio", icon: "🧬" },
];

const STREAM_TYPES: { id: ContentType; label: string; desc: string }[] = [
  { id: "news", label: "News Feed", desc: "Global headlines and editorial journalism" },
  { id: "recommendation", label: "Picks & Media", desc: "Curated movies, series, and music albums" },
  { id: "social", label: "Social Buzz", desc: "Trending posts, community threads, and reels" },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const { t } = useTranslation();

  const [newsKey, setNewsKey] = useState(preferences.apiKeys?.newsApi || "");
  const [tmdbKey, setTmdbKey] = useState(preferences.apiKeys?.tmdbApi || "");
  const [justSaved, setJustSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveApiKeys = () => {
    dispatch(updateApiKeys({ newsApi: newsKey.trim(), tmdbApi: tmdbKey.trim() }));
    // trigger feed refresh with new keys/preferences
    dispatch(
      fetchFeedAsync({
        categories: preferences.favoriteCategories,
        types: preferences.enabledTypes,
        newsApiKey: newsKey.trim(),
        tmdbApiKey: tmdbKey.trim(),
      })
    );
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    dispatch(resetPreferences());
    setNewsKey("");
    setTmdbKey("");
    dispatch(fetchFeedAsync({}));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 id="settings-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                {t("settingsTitle")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("settingsDesc")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-settings-modal-btn"
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Category Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {t("selectCategories")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = preferences.favoriteCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  id={`pref-cat-${cat.id}`}
                  onClick={() => dispatch(toggleCategory(cat.id))}
                  className={`flex items-center gap-2 p-2.5 rounded-2xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="flex-1 truncate">{cat.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Content Streams */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {t("selectSources")}
          </label>
          <div className="space-y-2">
            {STREAM_TYPES.map((type) => {
              const isSelected = preferences.enabledTypes.includes(type.id);
              return (
                <div
                  key={type.id}
                  onClick={() => dispatch(toggleType(type.id))}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-50 dark:bg-slate-800/60 border-indigo-500/30 text-slate-900 dark:text-white"
                      : "bg-transparent border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold">{type.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{type.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Card View Density */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {t("displayDensity")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["grid", "compact", "comfortable"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => dispatch(setViewMode(mode))}
                className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all cursor-pointer ${
                  preferences.viewMode === mode
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Optional API Keys Integration */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            <Key className="w-3.5 h-3.5 text-indigo-500" />
            External API Keys (Optional)
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            Leave blank to use the built-in rich mock API engine. Add real keys to stream directly from NewsAPI or TMDB.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                NewsAPI.org API Key
              </label>
              <input
                type="password"
                value={newsKey}
                onChange={(e) => setNewsKey(e.target.value)}
                placeholder="e.g. 5f83c18b... (optional)"
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                TMDB (The Movie Database) API Key
              </label>
              <input
                type="password"
                value={tmdbKey}
                onChange={(e) => setTmdbKey(e.target.value)}
                placeholder="e.g. 8a7d4... (optional)"
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t("resetPreferences")}
          </button>

          <button
            type="button"
            onClick={handleSaveApiKeys}
            id="save-preferences-btn"
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {justSaved ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              t("savePreferences")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
