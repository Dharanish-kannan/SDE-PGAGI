import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/types/content";

const AUTH_STORAGE_KEY = "personalized_dashboard_user_v1";

const defaultUser: UserProfile = {
  id: "user_pro_01",
  name: "Dhara M.",
  email: "dhara.engineer@domain.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  bio: "Frontend Engineer & Design Systems Enthusiast building real-time dashboards.",
  joinedDate: "October 2026",
  isLoggedIn: true,
};

function getStoredUser(): UserProfile {
  if (typeof window === "undefined") return defaultUser;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to read user profile", e);
  }
  return defaultUser;
}

const initialState: { user: UserProfile } = {
  user: getStoredUser(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string; avatar?: string }>) => {
      state.user = {
        ...state.user,
        ...action.payload,
        isLoggedIn: true,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.user.isLoggedIn = false;
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.user));
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.user = { ...state.user, ...action.payload };
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.user));
      }
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;

export default authSlice.reducer;
