export type ContentType = 'news' | 'recommendation' | 'social';

export type ContentCategory = 
  | 'technology' 
  | 'sports' 
  | 'finance' 
  | 'entertainment' 
  | 'science' 
  | 'health';

export interface ContentItem {
  id: string;
  type: ContentType;
  category: ContentCategory;
  title: string;
  description: string;
  source: string;
  sourceUrl?: string;
  author?: string;
  authorHandle?: string;
  authorAvatar?: string;
  imageUrl?: string;
  url: string;
  publishedAt: string;
  readTime?: string; // e.g. "4 min read" or "2h 15m" or "Music Track"
  likes?: number;
  shares?: number;
  comments?: number;
  rating?: number; // for TMDB / recommendations (e.g. 8.7)
  tags: string[];
  ctaText: string;
  ctaAction?: 'read' | 'play' | 'watch' | 'view';
  isTrending?: boolean;
  score?: number; // trending score
}

export type ViewMode = 'grid' | 'compact' | 'comfortable';

export type ThemeMode = 'light' | 'dark' | 'system';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'hi';

export interface UserPreferences {
  favoriteCategories: ContentCategory[];
  enabledTypes: ContentType[];
  theme: ThemeMode;
  language: LanguageCode;
  viewMode: ViewMode;
  autoRefresh: boolean;
  refreshIntervalSeconds: number;
  apiKeys?: {
    newsApi?: string;
    tmdbApi?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  isLoggedIn: boolean;
}

export interface FeedFilterState {
  searchQuery: string;
  debouncedQuery: string;
  activeType: 'all' | ContentType;
  activeCategory: 'all' | ContentCategory;
  sortBy: 'latest' | 'trending' | 'popular' | 'rating';
}
