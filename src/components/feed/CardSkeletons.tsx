import React from "react";

export function CardSkeleton() {
  return (
    <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 overflow-hidden flex flex-col justify-between">
      <div>
        <div className="w-full h-44 rounded-2xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer mb-4" />
        <div className="flex items-center gap-2 mb-3">
          <div className="w-16 h-4 rounded-full bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
          <div className="w-20 h-4 rounded-full bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        </div>
        <div className="w-full h-5 rounded-lg bg-slate-200 dark:bg-slate-800 skeleton-shimmer mb-2" />
        <div className="w-3/4 h-5 rounded-lg bg-slate-200 dark:bg-slate-800 skeleton-shimmer mb-4" />
        <div className="w-full h-3.5 rounded-md bg-slate-200 dark:bg-slate-800 skeleton-shimmer mb-2" />
        <div className="w-5/6 h-3.5 rounded-md bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
      </div>

      <div className="pt-5 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
          <div className="w-20 h-3 rounded-md bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        </div>
        <div className="w-24 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
      </div>
    </div>
  );
}

export function FeedSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
