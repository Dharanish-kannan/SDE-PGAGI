"use client";

import React from "react";
import { Sparkles, ArrowUpCircle, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { applyRealtimeQueue, dismissRealtimeToast } from "@/redux/slices/contentSlice";
import { useTranslation } from "@/i18n/useTranslation";

export default function RealtimeTicker() {
  const dispatch = useAppDispatch();
  const liveQueue = useAppSelector((state) => state.content.liveQueue);
  const showToast = useAppSelector((state) => state.content.showLiveToast);
  const { t } = useTranslation();

  if (!showToast || liveQueue.length === 0) {
    return null;
  }

  const latestItem = liveQueue[0];

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-md w-[calc(100%-3rem)] animate-in slide-in-from-bottom-5 duration-300">
      <div className="relative p-3.5 rounded-2xl bg-indigo-600/95 dark:bg-indigo-900/90 text-white shadow-2xl backdrop-blur-md border border-indigo-400/40 flex items-start gap-3">
        <div className="relative flex h-3 w-3 mt-1 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-300"></span>
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t("realtimeFeed")}
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white/20 text-white">
              +{liveQueue.length}
            </span>
          </div>

          <p className="text-xs font-medium text-white/95 truncate mt-0.5">
            {latestItem.title}
          </p>

          <button
            onClick={() => dispatch(applyRealtimeQueue())}
            id="apply-realtime-btn"
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white text-indigo-700 hover:bg-cyan-50 active:scale-95 transition-transform cursor-pointer shadow-xs"
          >
            <ArrowUpCircle className="w-3.5 h-3.5" />
            Show {liveQueue.length} new {liveQueue.length === 1 ? "item" : "items"}
          </button>
        </div>

        <button
          onClick={() => dispatch(dismissRealtimeToast())}
          className="absolute top-2.5 right-2.5 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
