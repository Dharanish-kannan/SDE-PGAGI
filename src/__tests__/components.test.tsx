import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import ContentCard from "@/components/feed/ContentCard";
import ThemeToggle from "@/components/common/ThemeToggle";
import DebouncedSearch from "@/components/common/DebouncedSearch";
import FavoritesSection from "@/components/sections/FavoritesSection";
import { ContentItem } from "@/types/content";
import { clearAllFavorites } from "@/redux/slices/favoritesSlice";

const testCardItem: ContentItem = {
  id: "card-test-1",
  type: "news",
  category: "technology",
  title: "Cutting-edge Silicon Innovation",
  description: "Next gen transistor nodes achieve double energy density.",
  source: "Tech Journal",
  url: "https://example.com/silicon",
  publishedAt: new Date().toISOString(),
  readTime: "3 min read",
  likes: 420,
  tags: ["Hardware", "Semiconductor"],
  ctaText: "Read Story",
  ctaAction: "read",
  isTrending: true,
  score: 94,
};

function renderWithRedux(ui: React.ReactElement) {
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("Dashboard Component & Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    store.dispatch(clearAllFavorites());
  });

  describe("ContentCard Component", () => {
    it("renders headline, source, category badge, and CTA button", () => {
      renderWithRedux(<ContentCard item={testCardItem} viewMode="grid" />);

      expect(screen.getByText("Cutting-edge Silicon Innovation")).toBeInTheDocument();
      expect(screen.getAllByText("Tech Journal")[0]).toBeInTheDocument();
      expect(screen.getByText("technology")).toBeInTheDocument();
      expect(screen.getByText("Read Story")).toBeInTheDocument();
    });

    it("toggles favorite state on heart button click", () => {
      renderWithRedux(<ContentCard item={testCardItem} viewMode="grid" />);

      const favBtn = screen.getByLabelText("Add to favorites");
      expect(favBtn).toBeInTheDocument();

      // Click favorite
      fireEvent.click(favBtn);

      const state = store.getState();
      expect(state.favorites.items).toHaveLength(1);
      expect(state.favorites.items[0].id).toBe("card-test-1");
    });
  });

  describe("ThemeToggle Component", () => {
    it("cycles theme state when clicked", () => {
      renderWithRedux(<ThemeToggle />);
      const toggleBtn = screen.getByLabelText("Toggle theme");
      expect(toggleBtn).toBeInTheDocument();

      const initialTheme = store.getState().preferences.theme;
      fireEvent.click(toggleBtn);
      const nextTheme = store.getState().preferences.theme;
      expect(nextTheme).not.toBe(initialTheme);
    });
  });

  describe("DebouncedSearch Component", () => {
    it("allows user to type search queries", () => {
      renderWithRedux(<DebouncedSearch />);
      const searchInput = screen.getByRole("textbox") as HTMLInputElement;

      fireEvent.change(searchInput, { target: { value: "Quantum" } });
      expect(searchInput.value).toBe("Quantum");
      expect(store.getState().search.query).toBe("Quantum");
    });
  });

  describe("FavoritesSection Component", () => {
    it("displays empty state when no items are bookmarked", () => {
      renderWithRedux(<FavoritesSection />);
      expect(screen.getByText(/No saved items yet/i)).toBeInTheDocument();
    });
  });
});
