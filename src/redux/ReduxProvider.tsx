"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";
import { hydratePreferences } from "./slices/preferencesSlice";
import { hydrateFavorites } from "./slices/favoritesSlice";
import { pushRealtimeUpdate } from "./slices/contentSlice";
import { REALTIME_INCOMING_ITEMS } from "@/services/mockData";

function StateHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.preferences.theme);
  const autoRefresh = useAppSelector((state) => state.preferences.autoRefresh);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const prefRaw = localStorage.getItem("personalized_dashboard_preferences_v1");
      if (prefRaw) {
        dispatch(hydratePreferences(JSON.parse(prefRaw)));
      }
      const favRaw = localStorage.getItem("personalized_dashboard_favorites_v1");
      if (favRaw) {
        dispatch(hydrateFavorites(JSON.parse(favRaw)));
      }
    } catch (e) {
      console.warn("Storage hydration error", e);
    }
  }, [dispatch]);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [theme]);

  // Real-time live feed stream (Server-Sent Events + fallback interval)
  useEffect(() => {
    if (!autoRefresh) return;

    let eventSource: EventSource | null = null;
    let fallbackTimer: NodeJS.Timeout | null = null;
    let fallbackIndex = 0;

    try {
      eventSource = new EventSource("/api/realtime");
      eventSource.addEventListener("new_content", (event: MessageEvent) => {
        try {
          const item = JSON.parse(event.data);
          dispatch(pushRealtimeUpdate(item));
        } catch {}
      });
      eventSource.onerror = () => {
        eventSource?.close();
        // Setup fallback interval
        if (!fallbackTimer) {
          fallbackTimer = setInterval(() => {
            if (fallbackIndex < REALTIME_INCOMING_ITEMS.length) {
              dispatch(pushRealtimeUpdate(REALTIME_INCOMING_ITEMS[fallbackIndex]));
              fallbackIndex++;
            }
          }, 25000);
        }
      };
    } catch {
      // Fallback
      fallbackTimer = setInterval(() => {
        if (fallbackIndex < REALTIME_INCOMING_ITEMS.length) {
          dispatch(pushRealtimeUpdate(REALTIME_INCOMING_ITEMS[fallbackIndex]));
          fallbackIndex++;
        }
      }, 25000);
    }

    return () => {
      if (eventSource) eventSource.close();
      if (fallbackTimer) clearInterval(fallbackTimer);
    };
  }, [autoRefresh, dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StateHydrator>{children}</StateHydrator>
    </Provider>
  );
}
