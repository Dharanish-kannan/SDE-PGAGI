import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem } from "@/types/content";

const FAVORITES_STORAGE_KEY = "personalized_dashboard_favorites_v1";

interface FavoritesState {
  items: ContentItem[];
  filterTag: string | null;
}

function getStoredFavorites(): ContentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to read favorites from localStorage", e);
  }
  return [];
}

const initialState: FavoritesState = {
  items: getStoredFavorites(),
  filterTag: null,
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      const index = state.items.findIndex((fav) => fav.id === item.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(item);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.items));
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((fav) => fav.id !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.items));
      }
    },
    clearAllFavorites: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem(FAVORITES_STORAGE_KEY);
      }
    },
    setFilterTag: (state, action: PayloadAction<string | null>) => {
      state.filterTag = action.payload;
    },
    hydrateFavorites: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  toggleFavorite,
  removeFavorite,
  clearAllFavorites,
  setFilterTag,
  hydrateFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
