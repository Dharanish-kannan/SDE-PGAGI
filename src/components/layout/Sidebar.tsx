"use client";

import React from "react";
import {
  Sparkles,
  LayoutDashboard,
  Flame,
  Heart,
  BarChart3,
  Sliders,
  Radio,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveSection } from "@/redux/slices/contentSlice";
import { useTranslation } from "@/i18n/useTranslation";

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
}

export default function Sidebar({
  isOpen,
  onCloseMobile,
  onOpenSettings,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const activeSection = useAppSelector((state) => state.content.activeSection);
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);
  const trendingCount = useAppSelector((state) => state.content.trendingItems.length);
  const { t } = useTranslation();

  const navItems = [
    {
      id: "feed" as const,
      label: t("feedTab"),
      icon: LayoutDashboard,
      badge: null,
      color: "text-indigo-500",
    },
    {
      id: "trending" as const,
      label: t("trendingTab"),
      icon: Flame,
      badge: trendingCount > 0 ? trendingCount : null,
      color: "text-amber-500",
    },
    {
      id: "favorites" as const,
      label: t("favoritesTab"),
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : null,
      color: "text-rose-500",
    },
    {
      id: "analytics" as const,
      label: t("analyticsTab"),
      icon: BarChart3,
      badge: null,
      color: "text-cyan-500",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between p-5 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5">
                  PULSE<span className="text-indigo-500">.</span>
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Content OS
                </p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    dispatch(setActiveSection(item.id));
                    onCloseMobile();
                  }}
                  id={`nav-item-${item.id}`}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : item.color}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Live status & Preferences */}
        <div className="space-y-3">
          {/* Live Stream Indicator Widget */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                Live Sync Active
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Streaming multi-source news & entertainment feeds.
            </p>
          </div>

          {/* Quick Settings Action */}
          <button
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
            id="sidebar-settings-btn"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-slate-700/60 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>{t("settingsTab")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
