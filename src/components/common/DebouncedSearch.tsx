"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setQuery, setDebouncedQuery } from "@/redux/slices/searchSlice";
import { useTranslation } from "@/i18n/useTranslation";

export default function DebouncedSearch() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.query);
  const [localInput, setLocalInput] = useState(query);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  // Debounce logic (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        dispatch(setDebouncedQuery(localInput));
        setIsDebouncing(false);
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [localInput, dispatch]);

  // Keyboard shortcut: '/' to focus search, 'Escape' to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setLocalInput("");
        setIsDebouncing(false);
        dispatch(setQuery(""));
        dispatch(setDebouncedQuery(""));
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalInput(val);
    setIsDebouncing(true);
    dispatch(setQuery(val));
  };

  const handleClear = () => {
    setLocalInput("");
    setIsDebouncing(false);
    dispatch(setQuery(""));
    dispatch(setDebouncedQuery(""));
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={localInput}
          onChange={handleChange}
          id="global-search-input"
          placeholder={t("searchPlaceholder")}
          className="w-full pl-10 pr-16 py-2 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-inner"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {isDebouncing && (
            <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
          )}

          {localInput ? (
            <button
              onClick={handleClear}
              id="clear-search-btn"
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800/80 rounded-md border border-slate-300/60 dark:border-slate-700/60">
              /
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
}
