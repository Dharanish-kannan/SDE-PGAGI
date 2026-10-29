import { describe, it, expect, beforeEach } from "vitest";
import preferencesReducer, {
  toggleCategory,
  setTheme,
  setViewMode,
  updateApiKeys,
} from "@/redux/slices/preferencesSlice";
import favoritesReducer, {
  toggleFavorite,
  removeFavorite,
  clearAllFavorites,
} from "@/redux/slices/favoritesSlice";
import searchReducer, {
  setQuery,
  setDebouncedQuery,
  setActiveCategory,
  setSortBy,
  resetSearch,
} from "@/redux/slices/searchSlice";
import contentReducer, {
  reorderFeedItems,
  pushRealtimeUpdate,
  applyRealtimeQueue,
  setSelectedItemForDetail,
} from "@/redux/slices/contentSlice";
import authReducer, { login, logout, updateProfile } from "@/redux/slices/authSlice";
import { ContentItem } from "@/types/content";

const mockItem1: ContentItem = {
  id: "test-1",
  type: "news",
  category: "technology",
  title: "Test Quantum Title",
  description: "Test description",
  source: "Tech Source",
  url: "https://example.com/test-1",
  publishedAt: new Date().toISOString(),
  tags: ["Tech", "Quantum"],
  ctaText: "Read Story",
  isTrending: true,
  score: 95,
};

const mockItem2: ContentItem = {
  id: "test-2",
  type: "recommendation",
  category: "entertainment",
  title: "Test Movie Title",
  description: "Test movie review",
  source: "TMDB",
  url: "https://example.com/test-2",
  publishedAt: new Date().toISOString(),
  tags: ["Cinema", "Action"],
  ctaText: "Watch Trailer",
  rating: 8.5,
  isTrending: true,
  score: 90,
};

describe("Redux State Management Unit Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Preferences Slice", () => {
    it("should toggle category selection off and on", () => {
      let state = preferencesReducer(undefined, { type: "@@INIT" });
      expect(state.favoriteCategories).toContain("technology");

      // Toggle off
      state = preferencesReducer(state, toggleCategory("technology"));
      expect(state.favoriteCategories).not.toContain("technology");

      // Toggle back on
      state = preferencesReducer(state, toggleCategory("technology"));
      expect(state.favoriteCategories).toContain("technology");
    });

    it("should prevent removing all categories (retains at least 1)", () => {
      let state = preferencesReducer(undefined, { type: "@@INIT" });
      // Keep only one category
      state = { ...state, favoriteCategories: ["technology"] };
      // Attempt to toggle the only remaining category
      state = preferencesReducer(state, toggleCategory("technology"));
      expect(state.favoriteCategories.length).toBe(1);
    });

    it("should change theme and view density", () => {
      let state = preferencesReducer(undefined, { type: "@@INIT" });
      state = preferencesReducer(state, setTheme("light"));
      expect(state.theme).toBe("light");

      state = preferencesReducer(state, setViewMode("compact"));
      expect(state.viewMode).toBe("compact");
    });

    it("should securely store custom API keys", () => {
      let state = preferencesReducer(undefined, { type: "@@INIT" });
      state = preferencesReducer(state, updateApiKeys({ newsApi: "secret-key-123" }));
      expect(state.apiKeys?.newsApi).toBe("secret-key-123");
    });
  });

  describe("Favorites Slice", () => {
    it("should add an item to favorites", () => {
      let state = favoritesReducer(undefined, { type: "@@INIT" });
      state = favoritesReducer(state, toggleFavorite(mockItem1));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe("test-1");
    });

    it("should toggle off an already favorited item", () => {
      let state = favoritesReducer(undefined, { type: "@@INIT" });
      state = favoritesReducer(state, toggleFavorite(mockItem1));
      expect(state.items).toHaveLength(1);

      // Toggle again to remove
      state = favoritesReducer(state, toggleFavorite(mockItem1));
      expect(state.items).toHaveLength(0);
    });

    it("should remove favorite by ID and clear all", () => {
      let state = favoritesReducer(undefined, { type: "@@INIT" });
      state = favoritesReducer(state, toggleFavorite(mockItem1));
      state = favoritesReducer(state, toggleFavorite(mockItem2));
      expect(state.items).toHaveLength(2);

      state = favoritesReducer(state, removeFavorite("test-1"));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe("test-2");

      state = favoritesReducer(state, clearAllFavorites());
      expect(state.items).toHaveLength(0);
    });
  });

  describe("Search Slice", () => {
    it("should handle query and debounced query changes", () => {
      let state = searchReducer(undefined, { type: "@@INIT" });
      state = searchReducer(state, setQuery("quantum"));
      expect(state.query).toBe("quantum");

      state = searchReducer(state, setDebouncedQuery("quantum"));
      expect(state.debouncedQuery).toBe("quantum");
    });

    it("should filter by category and sort method", () => {
      let state = searchReducer(undefined, { type: "@@INIT" });
      state = searchReducer(state, setActiveCategory("finance"));
      expect(state.activeCategory).toBe("finance");

      state = searchReducer(state, setSortBy("rating"));
      expect(state.sortBy).toBe("rating");

      state = searchReducer(state, resetSearch());
      expect(state.activeCategory).toBe("all");
      expect(state.query).toBe("");
    });
  });

  describe("Content Slice & Drag-and-Drop Reordering", () => {
    it("should reorder feed items correctly", () => {
      let state = contentReducer(undefined, { type: "@@INIT" });
      const reordered = [mockItem2, mockItem1];
      state = contentReducer(state, reorderFeedItems(reordered));
      expect(state.feedItems[0].id).toBe("test-2");
      expect(state.feedItems[1].id).toBe("test-1");
    });

    it("should queue and apply incoming real-time updates", () => {
      let state = contentReducer(undefined, { type: "@@INIT" });
      const liveItem: ContentItem = {
        ...mockItem1,
        id: "live-realtime-99",
        title: "Breaking live story",
      };

      state = contentReducer(state, pushRealtimeUpdate(liveItem));
      expect(state.liveQueue).toHaveLength(1);
      expect(state.showLiveToast).toBe(true);

      state = contentReducer(state, applyRealtimeQueue());
      expect(state.liveQueue).toHaveLength(0);
      expect(state.showLiveToast).toBe(false);
      expect(state.feedItems[0].id).toBe("live-realtime-99");
    });

    it("should select item for detail view modal", () => {
      let state = contentReducer(undefined, { type: "@@INIT" });
      state = contentReducer(state, setSelectedItemForDetail(mockItem1));
      expect(state.selectedItemForDetail?.id).toBe("test-1");
      expect(state.readHistoryIds).toContain("test-1");
    });
  });

  describe("Auth & Profile Slice", () => {
    it("should handle login, logout and profile updates", () => {
      let state = authReducer(undefined, { type: "@@INIT" });
      state = authReducer(state, updateProfile({ name: "Alex Turing", bio: "AI Researcher" }));
      expect(state.user.name).toBe("Alex Turing");
      expect(state.user.bio).toBe("AI Researcher");

      state = authReducer(state, logout());
      expect(state.user.isLoggedIn).toBe(false);

      state = authReducer(state, login({ name: "Alex", email: "alex@example.com" }));
      expect(state.user.isLoggedIn).toBe(true);
    });
  });
});
