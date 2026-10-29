import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentCategory, ContentType, LanguageCode, ThemeMode, UserPreferences, ViewMode } from "@/types/content";

const PREFERENCES_STORAGE_KEY = "personalized_dashboard_preferences_v1";

const defaultPreferences: UserPreferences = {
  favoriteCategories: ["technology", "entertainment", "finance", "sports", "science", "health"],
  enabledTypes: ["news", "recommendation", "social"],
  theme: "dark",
  language: "en",
  viewMode: "grid",
  autoRefresh: true,
  refreshIntervalSeconds: 30,
  apiKeys: {
    newsApi: "",
    tmdbApi: "",
  },
};

function getStoredPreferences(): UserPreferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (raw) {
      return { ...defaultPreferences, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error("Failed to read preferences from localStorage", e);
  }
  return defaultPreferences;
}

const initialState: UserPreferences = getStoredPreferences();

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<ContentCategory>) => {
      const category = action.payload;
      if (state.favoriteCategories.includes(category)) {
        if (state.favoriteCategories.length > 1) {
          state.favoriteCategories = state.favoriteCategories.filter((c) => c !== category);
        }
      } else {
        state.favoriteCategories.push(category);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
      }
    },
    toggleType: (state, action: PayloadAction<ContentType>) => {
      const type = action.payload;
      if (state.enabledTypes.includes(type)) {
        if (state.enabledTypes.length > 1) {
          state.enabledTypes = state.enabledTypes.filter((t) => t !== type);
        }
      } else {
        state.enabledTypes.push(type);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
      }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
      }
    },
    setLanguage: (state, action: PayloadAction<LanguageCode>) => {
      state.language = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
      }
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
      }
    },
    updateApiKeys: (state, action: PayloadAction<{ newsApi?: string; tmdbApi?: string }>) => {
      state.apiKeys = { ...state.apiKeys, ...action.payload };
      if (typeof window !== "undefined") {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
      }
    },
    resetPreferences: () => {
      if (typeof window !== "undefined") {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(defaultPreferences));
      }
      return defaultPreferences;
    },
    hydratePreferences: (state, action: PayloadAction<UserPreferences>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  toggleCategory,
  toggleType,
  setTheme,
  setLanguage,
  setViewMode,
  updateApiKeys,
  resetPreferences,
  hydratePreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
