"use client";

import React, { useEffect, useRef } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function InfiniteScrollTrigger({
  onLoadMore,
  hasMore,
  isLoading,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "250px" }
    );

    const currentEl = triggerRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-8 h-8 text-indigo-500 mb-2 opacity-80" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t("reachedEnd")}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          Updated in real-time as new events unfold.
        </p>
      </div>
    );
  }

  return (
    <div ref={triggerRef} className="py-8 flex flex-col items-center justify-center">
      {isLoading ? (
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Fetching fresh stories...</span>
        </div>
      ) : (
        <button
          onClick={onLoadMore}
          id="load-more-btn"
          className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-xs cursor-pointer active:scale-95"
        >
          {t("loadMore")}
        </button>
      )}
    </div>
  );
}
