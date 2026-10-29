import { ContentCategory, ContentItem, ContentType } from "@/types/content";
import { INITIAL_CONTENT_ITEMS, PAGINATED_ADDITIONAL_ITEMS } from "./mockData";

export interface FetchFeedParams {
  categories?: ContentCategory[];
  types?: ContentType[];
  searchQuery?: string;
  page?: number;
  newsApiKey?: string;
  tmdbApiKey?: string;
}

export async function fetchUnifiedFeed({
  categories = [],
  types = ["news", "recommendation", "social"],
  searchQuery = "",
  page = 1,
  newsApiKey,
  tmdbApiKey,
}: FetchFeedParams): Promise<{ items: ContentItem[]; hasMore: boolean; page: number }> {
  try {
    // Attempt local API routes
    const headers: Record<string, string> = {};
    if (newsApiKey) headers["x-newsapi-key"] = newsApiKey;
    if (tmdbApiKey) headers["x-tmdb-key"] = tmdbApiKey;

    const promises: Promise<Response | null>[] = [];

    if (types.includes("news")) {
      promises.push(fetch(`/api/news?page=${page}`, { headers }).catch(() => null));
    }
    if (types.includes("recommendation")) {
      promises.push(fetch(`/api/recommendations?page=${page}`, { headers }).catch(() => null));
    }
    if (types.includes("social")) {
      promises.push(fetch(`/api/social?page=${page}`, { headers }).catch(() => null));
    }

    const responses = await Promise.all(promises);
    let combinedItems: ContentItem[] = [];

    for (const res of responses) {
      if (res && res.ok) {
        try {
          const data = await res.json();
          if (data && Array.isArray(data.items)) {
            combinedItems.push(...data.items);
          }
        } catch {
          // fallback to mock
        }
      }
    }

    // Fallback if API routes were unreachable (e.g. static/test env)
    if (combinedItems.length === 0) {
      if (page === 1) {
        combinedItems = [...INITIAL_CONTENT_ITEMS];
      } else {
        combinedItems = [...PAGINATED_ADDITIONAL_ITEMS];
      }
    }

    // Filter by preferred types
    if (types.length > 0) {
      combinedItems = combinedItems.filter((item) => types.includes(item.type));
    }

    // Filter by categories if specified
    if (categories.length > 0) {
      combinedItems = combinedItems.filter((item) => categories.includes(item.category));
    }

    // Filter by search query if provided
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      combinedItems = combinedItems.filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (item.author && item.author.toLowerCase().includes(q))
        );
      });
    }

    // Interleave/shuffle by timestamp or score for a dynamic unified feel
    combinedItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return {
      items: combinedItems,
      hasMore: page < 3,
      page,
    };
  } catch (error) {
    console.error("fetchUnifiedFeed error:", error);
    // Safe fallback
    return {
      items: INITIAL_CONTENT_ITEMS,
      hasMore: false,
      page: 1,
    };
  }
}
