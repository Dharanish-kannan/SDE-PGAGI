"use client";

import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setTheme } from "@/redux/slices/preferencesSlice";
import { ThemeMode } from "@/types/content";

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.preferences.theme);

  const cycleTheme = () => {
    const sequence: ThemeMode[] = ["dark", "light", "system"];
    const nextIndex = (sequence.indexOf(currentTheme) + 1) % sequence.length;
    dispatch(setTheme(sequence[nextIndex]));
  };

  return (
    <button
      onClick={cycleTheme}
      id="theme-toggle-btn"
      title={`Current theme: ${currentTheme}. Click to switch.`}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" && <Moon className="w-4 h-4 text-indigo-400 transition-transform rotate-0" />}
      {currentTheme === "light" && <Sun className="w-4 h-4 text-amber-500 transition-transform rotate-0" />}
      {currentTheme === "system" && <Monitor className="w-4 h-4 text-cyan-400 transition-transform rotate-0" />}
    </button>
  );
}
