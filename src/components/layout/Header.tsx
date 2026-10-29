"use client";

import React from "react";
import { Sparkles, Sliders, Bell, User as UserIcon, Menu } from "lucide-react";
import DebouncedSearch from "@/components/common/DebouncedSearch";
import ThemeToggle from "@/components/common/ThemeToggle";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTranslation } from "@/i18n/useTranslation";

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onToggleSidebar?: () => void;
}

export default function Header({
  onOpenSettings,
  onOpenAuth,
  onToggleSidebar,
}: HeaderProps) {
  const user = useAppSelector((state) => state.auth.user);
  const liveQueue = useAppSelector((state) => state.content.liveQueue);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Mobile Menu toggle + Logo for mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            id="mobile-sidebar-toggle"
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
              PULSE<span className="text-indigo-500">.</span>
            </span>
          </div>
        </div>

        {/* Center: Global Debounced Search */}
        <div className="flex-1 flex justify-center max-w-xl">
          <DebouncedSearch />
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            id="open-settings-btn"
            title="Dashboard Settings & API keys"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
            aria-label="Open settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* User Profile Avatar / Sign In */}
          <button
            onClick={onOpenAuth}
            id="user-profile-btn"
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500/40 transition-all cursor-pointer group"
            aria-label="User profile"
          >
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-500 truncate max-w-[100px]">
              {user.name.split(" ")[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
