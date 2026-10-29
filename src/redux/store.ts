import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./slices/preferencesSlice";
import favoritesReducer from "./slices/favoritesSlice";
import contentReducer from "./slices/contentSlice";
import searchReducer from "./slices/searchSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    favorites: favoritesReducer,
    content: contentReducer,
    search: searchReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
