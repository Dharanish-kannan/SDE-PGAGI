import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentCategory, ContentType } from "@/types/content";

export interface SearchState {
  query: string;
  debouncedQuery: string;
  activeType: "all" | ContentType;
  activeCategory: "all" | ContentCategory;
  sortBy: "latest" | "trending" | "rating" | "popular";
}

const initialState: SearchState = {
  query: "",
  debouncedQuery: "",
  activeType: "all",
  activeCategory: "all",
  sortBy: "latest",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setDebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload;
    },
    setActiveType: (state, action: PayloadAction<"all" | ContentType>) => {
      state.activeType = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<"all" | ContentCategory>) => {
      state.activeCategory = action.payload;
    },
    setSortBy: (state, action: PayloadAction<"latest" | "trending" | "rating" | "popular">) => {
      state.sortBy = action.payload;
    },
    resetSearch: (state) => {
      state.query = "";
      state.debouncedQuery = "";
      state.activeType = "all";
      state.activeCategory = "all";
      state.sortBy = "latest";
    },
  },
});

export const {
  setQuery,
  setDebouncedQuery,
  setActiveType,
  setActiveCategory,
  setSortBy,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
