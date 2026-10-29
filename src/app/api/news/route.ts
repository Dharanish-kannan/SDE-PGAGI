import { NextResponse } from "next/server";
import { INITIAL_CONTENT_ITEMS, PAGINATED_ADDITIONAL_ITEMS } from "@/services/mockData";
import { ContentCategory } from "@/types/content";

interface NewsApiArticle {
  title?: string;
  description?: string;
  content?: string;
  source?: { name?: string };
  url?: string;
  author?: string;
  urlToImage?: string;
  publishedAt?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const apiKey = request.headers.get("x-newsapi-key") || process.env.NEWS_API_KEY;

    // Optional Live NewsAPI integration if API key is provided
    if (apiKey) {
      try {
        const newsCategory = category && category !== "all" ? category : "technology";
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${newsCategory}&page=${page}&pageSize=6&apiKey=${apiKey}`;
        const res = await fetch(url, { headers: { "User-Agent": "PersonalizedDashboard/1.0" } });
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            const liveItems = data.articles.map((art: NewsApiArticle, idx: number) => ({
              id: `live-news-${idx}-${Date.now()}`,
              type: "news" as const,
              category: (category && category !== "all" ? category : "technology") as ContentCategory,
              title: art.title || "Untitled",
              description: art.description || art.content || "No description provided.",
              source: art.source?.name || "News Network",
              sourceUrl: art.url,
              author: art.author || "Staff Reporter",
              imageUrl: art.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80",
              url: art.url || "#",
              publishedAt: art.publishedAt || new Date().toISOString(),
              readTime: "4 min read",
              likes: Math.floor(Math.random() * 500) + 100,
              shares: Math.floor(Math.random() * 100) + 20,
              comments: Math.floor(Math.random() * 50) + 5,
              tags: [category || "News", "Breaking"],
              ctaText: "Read Story",
              ctaAction: "read" as const,
              score: 85,
            }));
            return NextResponse.json({ success: true, items: liveItems, page, isLive: true });
          }
        }
      } catch (liveErr) {
        console.warn("NewsAPI fetch failed, falling back to mock dataset:", liveErr);
      }
    }

    // Default mock dataset filter
    let items = [...INITIAL_CONTENT_ITEMS, ...PAGINATED_ADDITIONAL_ITEMS].filter(
      (item) => item.type === "news"
    );

    if (category && category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    return NextResponse.json({
      success: true,
      items,
      page,
      total: items.length,
      isLive: false,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch news";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
