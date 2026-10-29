# ⚡ Pulse — Personalized Content Dashboard
### *SDE Intern Frontend Development Assignment*

A modern, high-performance, and responsive **Personalized Content Dashboard** built with **Next.js (App Router)**, **React 19**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**. Unifies real-time news journalism, movie/music media recommendations, and trending social conversations into an engaging, customizable workspace.

---

## 🌟 Key Features Overview

| Feature Category | Capabilities & Implementation |
| :--- | :--- |
| **Personalized Content Feed** | • Multi-stream aggregation (News, TMDB Picks, Spotify, Social)<br>• Category customization (Tech, Sports, Finance, Cinema, Science, Health)<br>• Persisted to `localStorage` via Redux Toolkit |
| **Dual-Mode API Architecture** | • **Zero-Config Instant Mock Fallback**: Reviewers can test immediately without any external API keys.<br>• **Live API Support**: Seamlessly accepts real NewsAPI and TMDB API keys via Settings panel or `.env.local`. |
| **Interactive Content Cards** | • High-resolution imagery with gradient overlays<br>• Contextual CTA actions (*"Read Story"*, *"Watch Trailer"*, *"Play Now"*, *"View Post"*)<br>• Dynamic rating, author avatar, engagement badges, and tags |
| **Drag-and-Drop Reordering** | • Interactive card dragging and feed reorganization powered by **Framer Motion**<br>• State synchronized directly with Redux |
| **Debounced Search** | • 300ms debounced search filtering headlines, descriptions, authors, and hashtags<br>• Hotkey support: press `/` to focus, `Escape` to clear |
| **Favorites & Bookmarks Vault** | • Instant bookmarking on cards or detail views<br>• Dedicated **Favorites Section** with tag pills and sub-search<br>• Session persistence across browser reloads |
| **Trending & Spotlight Section** | • Real-time momentum ranking algorithm<br>• #1 Viral Spotlight card with category breakdown |
| **Analytics & Consumption Insights** | • Visual telemetry tracking read articles, bookmarked items, stream distribution, and engagement metrics |
| **Dark / Light / System Mode** | • Theme switching using CSS custom properties and Tailwind dark classes<br>• Persisted across sessions |
| **Bonus: Real-Time Stream (SSE)** | • Server-Sent Events (`/api/realtime`) with live pulse badge and interactive toast prompt (*"+X new updates available — click to view"*) |
| **Bonus: Multi-Language (i18n)** | • Instant language switching across **English**, **Español**, **Français**, **Deutsch**, and **हिन्दी** |
| **Bonus: User Profile & Auth** | • Mock authentication with avatar selector, name, bio, and sign in/out workflows |

---

## 🏗️ Architecture & State Management

```
src/
├── app/
│   ├── api/
│   │   ├── news/route.ts            # NewsAPI proxy with fallback
│   │   ├── recommendations/route.ts # TMDB / Spotify recommendations proxy
│   │   ├── social/route.ts          # Social media hashtag & thread feed
│   │   └── realtime/route.ts        # Server-Sent Events live stream endpoint
│   ├── layout.tsx                   # Root layout with fonts, metadata, and ReduxProvider
│   ├── page.tsx                     # Main page mounting MainLayout
│   └── globals.css                  # Custom CSS properties, glassmorphism, and themes
├── components/
│   ├── layout/                      # Header, Sidebar, MainLayout
│   ├── feed/                        # ContentFeed, ContentCard, Skeletons, FeedFilters, InfiniteScroll
│   ├── sections/                    # TrendingSection, FavoritesSection, AnalyticsSection
│   ├── modals/                      # SettingsModal, AuthModal, DetailModal
│   └── common/                      # DebouncedSearch, ThemeToggle, LanguageSwitcher, RealtimeTicker
├── redux/
│   ├── store.ts                     # Redux store configuration
│   ├── hooks.ts                     # Typed useAppDispatch, useAppSelector
│   ├── ReduxProvider.tsx            # Client state hydrator & SSE synchronization
│   └── slices/                      # preferencesSlice, favoritesSlice, contentSlice, searchSlice, authSlice
├── types/
│   └── content.ts                   # Strongly-typed TypeScript interfaces
├── services/
│   ├── contentApi.ts                # Client API data fetching service
│   └── mockData.ts                  # Curated mock dataset with fallback coverage
├── i18n/
│   ├── translations.ts              # 5-language translation dictionary
│   └── useTranslation.ts            # Translation hook connected to Redux
└── __tests__/
    ├── reducers.test.ts             # 13 unit tests for all Redux slices
    ├── components.test.tsx          # Component & integration tests
    └── setup.ts                     # Test environment setup
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18.17+ or v20+ (tested on Node v24)
- **npm** v9+

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd SDE
npm install --legacy-peer-deps
```

### 3. Running Locally
Start the Next.js development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 🧪 Testing Suite

### Unit & Integration Testing (Vitest & React Testing Library)
Run the automated test suite:
```bash
npm run test
```
To run in watch mode:
```bash
npm run test:watch
```

**Coverage includes:**
- **Preferences Slice**: Category toggling, retain at least 1 category constraint, theme switching, display density, and API key storage.
- **Favorites Slice**: Add to favorites, remove from favorites, duplicates prevention, and clear all.
- **Search Slice**: Live query changes, debounced query synchronization, category filtering, and sorting.
- **Content Slice**: Framer Motion drag-and-drop reordering, realtime queueing and applying, detail modal item selection.
- **Auth Slice**: Login/logout states and profile field updates.
- **Components**: `ContentCard` rendering, favorite heart toggling, `ThemeToggle` cycling, `DebouncedSearch` keystroke updates, and `FavoritesSection` empty state handling.

### End-to-End Testing (Playwright)
Run the Playwright E2E suite:
```bash
npx playwright test
```

---

## 🔑 Optional External API Configuration

The application works 100% out-of-the-box using the built-in mock engine. To enable real live API calls:

1. Click the **Settings (Sliders)** icon in the top header.
2. Enter your API keys:
   - **NewsAPI Key**: Register at [newsapi.org](https://newsapi.org)
   - **TMDB Key**: Register at [themoviedb.org](https://themoviedb.org)
3. Click **Save Preferences**. The dashboard will immediately stream live third-party data!

Alternatively, add them to `.env.local`:
```env
NEWS_API_KEY=your_news_api_key_here
TMDB_API_KEY=your_tmdb_api_key_here
```

---

## ⌨️ Keyboard Shortcuts & UX Delights
- **`/`**: Focus global search bar instantly from anywhere on the page.
- **`Escape`**: Clear search input and blur search bar.
- **Drag & Drop**: Grab any card's vertical grip handle to reorder cards in your personalized feed.
- **Theme Switcher**: Click the sun/moon/monitor icon in the header to cycle between Dark, Light, and System themes.
- **Language Selector**: Switch between English, Spanish, French, German, and Hindi with immediate UI adaptation.

---

## 📄 License
MIT License. Built for the SDE Intern Frontend Development Assignment.
