"use client";

import React, { useMemo } from "react";
import { Reorder, AnimatePresence } from "framer-motion";
import { Move, AlertCircle, RefreshCw, FilterX } from "lucide-react";
import ContentCard from "./ContentCard";
import FeedFilters from "./FeedFilters";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";
import { FeedSkeletonList } from "./CardSkeletons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  reorderFeedItems,
  fetchFeedAsync,
  loadMoreFeedAsync,
} from "@/redux/slices/contentSlice";
import { resetSearch } from "@/redux/slices/searchSlice";
import { ContentItem } from "@/types/content";
import { useTranslation } from "@/i18n/useTranslation";

export default function ContentFeed() {
  const dispatch = useAppDispatch();
  const feedItems = useAppSelector((state) => state.content.feedItems);
  const status = useAppSelector((state) => state.content.status);
  const loadMoreStatus = useAppSelector((state) => state.content.loadMoreStatus);
  const hasMore = useAppSelector((state) => state.content.hasMore);
  const page = useAppSelector((state) => state.content.page);
  const error = useAppSelector((state) => state.content.error);

  const preferences = useAppSelector((state) => state.preferences);
  const searchState = useAppSelector((state) => state.search);
  const { t } = useTranslation();

  // Filter and sort items dynamically
  const filteredItems = useMemo(() => {
    let items = [...feedItems];

    // 1. Filter by Preferred Categories (from settings)
    if (preferences.favoriteCategories.length > 0) {
      items = items.filter((item) =>
        preferences.favoriteCategories.includes(item.category)
      );
    }

    // 2. Filter by Preferred Stream Types (from settings)
    if (preferences.enabledTypes.length > 0) {
      items = items.filter((item) =>
        preferences.enabledTypes.includes(item.type)
      );
    }

    // 3. Active Stream Type filter (from quick tabs)
    if (searchState.activeType !== "all") {
      items = items.filter((item) => item.type === searchState.activeType);
    }

    // 4. Active Category filter (from quick pills)
    if (searchState.activeCategory !== "all") {
      items = items.filter((item) => item.category === searchState.activeCategory);
    }

    // 5. Debounced Search Query
    if (searchState.debouncedQuery.trim()) {
      const q = searchState.debouncedQuery.toLowerCase().trim();
      items = items.filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (item.author && item.author.toLowerCase().includes(q))
        );
      });
    }

    // 6. Sort
    if (searchState.sortBy === "trending") {
      items.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (searchState.sortBy === "rating") {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (searchState.sortBy === "popular") {
      items.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      // latest
      items.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    return items;
  }, [feedItems, preferences, searchState]);

  const handleReorder = (newItems: ContentItem[]) => {
    dispatch(reorderFeedItems(newItems));
  };

  const handleLoadMore = () => {
    if (loadMoreStatus === "loading" || !hasMore) return;
    dispatch(
      loadMoreFeedAsync({
        categories: preferences.favoriteCategories,
        types: preferences.enabledTypes,
        searchQuery: searchState.debouncedQuery,
        page: page + 1,
        newsApiKey: preferences.apiKeys?.newsApi,
        tmdbApiKey: preferences.apiKeys?.tmdbApi,
      })
    );
  };

  const handleRetry = () => {
    dispatch(
      fetchFeedAsync({
        categories: preferences.favoriteCategories,
        types: preferences.enabledTypes,
        searchQuery: searchState.debouncedQuery,
        page: 1,
      })
    );
  };

  return (
    <div className="w-full">
      {/* Filters and Controls */}
      <FeedFilters />

      {/* Reorder Hint Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 mb-6 text-xs text-indigo-700 dark:text-indigo-300">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>{t("dragHint")}</span>
        </div>
        <span className="text-[11px] font-semibold opacity-75">
          {filteredItems.length} items shown
        </span>
      </div>

      {/* Loading Skeleton */}
      {status === "loading" && <FeedSkeletonList count={6} />}

      {/* Error State */}
      {status === "failed" && (
        <div className="py-16 px-6 text-center rounded-3xl bg-rose-500/5 border border-rose-500/20 max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Unable to fetch content feed
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {status !== "loading" && status !== "failed" && filteredItems.length === 0 && (
        <div className="py-20 px-6 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3">
            <FilterX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {t("emptyFeedTitle")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
            {t("emptyFeedDesc")}
          </p>
          <button
            onClick={() => dispatch(resetSearch())}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all cursor-pointer shadow-md"
          >
            Reset Filters & Search
          </button>
        </div>
      )}

      {/* Content Feed with Drag-and-Drop Reorder */}
      {status !== "loading" && filteredItems.length > 0 && (
        <div>
          <Reorder.Group
            axis="y"
            values={filteredItems}
            onReorder={handleReorder}
            className={
              preferences.viewMode === "compact"
                ? "space-y-3"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            }
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="list-none"
                  whileDrag={{ scale: 1.03, zIndex: 30 }}
                  transition={{ duration: 0.2 }}
                >
                  <ContentCard
                    item={item}
                    viewMode={preferences.viewMode}
                    dragControls={true}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {/* Infinite Scroll Trigger */}
          <InfiniteScrollTrigger
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={loadMoreStatus === "loading"}
          />
        </div>
      )}
    </div>
  );
}
