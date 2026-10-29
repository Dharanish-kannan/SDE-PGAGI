import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem } from "@/types/content";
import { fetchUnifiedFeed, FetchFeedParams } from "@/services/contentApi";
import { INITIAL_CONTENT_ITEMS } from "@/services/mockData";

export interface ContentState {
  feedItems: ContentItem[];
  trendingItems: ContentItem[];
  liveQueue: ContentItem[];
  showLiveToast: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  loadMoreStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  hasMore: boolean;
  activeSection: "feed" | "trending" | "favorites" | "analytics";
  selectedItemForDetail: ContentItem | null;
  readHistoryIds: string[];
}

const initialState: ContentState = {
  feedItems: INITIAL_CONTENT_ITEMS,
  trendingItems: INITIAL_CONTENT_ITEMS.filter((item) => item.isTrending || (item.score && item.score >= 90)),
  liveQueue: [],
  showLiveToast: false,
  status: "idle",
  loadMoreStatus: "idle",
  error: null,
  page: 1,
  hasMore: true,
  activeSection: "feed",
  selectedItemForDetail: null,
  readHistoryIds: [],
};

export const fetchFeedAsync = createAsyncThunk(
  "content/fetchFeedAsync",
  async (params: FetchFeedParams, { rejectWithValue }) => {
    try {
      const response = await fetchUnifiedFeed(params);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch content feed");
    }
  }
);

export const loadMoreFeedAsync = createAsyncThunk(
  "content/loadMoreFeedAsync",
  async (params: FetchFeedParams, { rejectWithValue }) => {
    try {
      const response = await fetchUnifiedFeed(params);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load more items");
    }
  }
);

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    reorderFeedItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.feedItems = action.payload;
    },
    pushRealtimeUpdate: (state, action: PayloadAction<ContentItem>) => {
      // Avoid duplicate
      if (!state.feedItems.some((item) => item.id === action.payload.id)) {
        state.liveQueue.unshift(action.payload);
        state.showLiveToast = true;
      }
    },
    applyRealtimeQueue: (state) => {
      state.feedItems = [...state.liveQueue, ...state.feedItems];
      state.liveQueue = [];
      state.showLiveToast = false;
    },
    dismissRealtimeToast: (state) => {
      state.showLiveToast = false;
    },
    setActiveSection: (state, action: PayloadAction<"feed" | "trending" | "favorites" | "analytics">) => {
      state.activeSection = action.payload;
    },
    setSelectedItemForDetail: (state, action: PayloadAction<ContentItem | null>) => {
      state.selectedItemForDetail = action.payload;
      if (action.payload && !state.readHistoryIds.includes(action.payload.id)) {
        state.readHistoryIds.push(action.payload.id);
      }
    },
    markItemAsRead: (state, action: PayloadAction<string>) => {
      if (!state.readHistoryIds.includes(action.payload)) {
        state.readHistoryIds.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial fetch
      .addCase(fetchFeedAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFeedAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedItems = action.payload.items;
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.page;
        state.trendingItems = action.payload.items.filter((item) => item.isTrending || (item.score && item.score >= 88));
      })
      .addCase(fetchFeedAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Could not retrieve feed data";
      })
      // Load more / infinite scroll
      .addCase(loadMoreFeedAsync.pending, (state) => {
        state.loadMoreStatus = "loading";
      })
      .addCase(loadMoreFeedAsync.fulfilled, (state, action) => {
        state.loadMoreStatus = "succeeded";
        // Merge without duplicates
        const existingIds = new Set(state.feedItems.map((i) => i.id));
        const newItems = action.payload.items.filter((i) => !existingIds.has(i.id));
        state.feedItems = [...state.feedItems, ...newItems];
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(loadMoreFeedAsync.rejected, (state) => {
        state.loadMoreStatus = "failed";
      });
  },
});

export const {
  reorderFeedItems,
  pushRealtimeUpdate,
  applyRealtimeQueue,
  dismissRealtimeToast,
  setActiveSection,
  setSelectedItemForDetail,
  markItemAsRead,
} = contentSlice.actions;

export default contentSlice.reducer;
