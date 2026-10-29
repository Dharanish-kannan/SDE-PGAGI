import { NextResponse } from "next/server";
import { INITIAL_CONTENT_ITEMS, PAGINATED_ADDITIONAL_ITEMS } from "@/services/mockData";
import { ContentCategory } from "@/types/content";

interface TmdbMovieResult {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const tmdbApiKey = request.headers.get("x-tmdb-key") || process.env.TMDB_API_KEY;

    // Optional Live TMDB integration if API key is provided
    if (tmdbApiKey) {
      try {
        const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApiKey}&page=${page}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const liveItems = data.results.slice(0, 6).map((movie: TmdbMovieResult) => ({
              id: `tmdb-${movie.id}`,
              type: "recommendation" as const,
              category: "entertainment" as ContentCategory,
              title: movie.title || movie.original_title || "Untitled Motion Picture",
              description: movie.overview || "Exciting motion picture recommendation based on your preferences.",
              source: "TMDB Movies",
              sourceUrl: "https://themoviedb.org",
              author: "Top Trending Film",
              imageUrl: movie.backdrop_path 
                ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` 
                : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
              url: `https://www.themoviedb.org/movie/${movie.id}`,
              publishedAt: movie.release_date || new Date().toISOString(),
              readTime: "Feature Film",
              rating: Math.round((movie.vote_average || 7.5) * 10) / 10,
              likes: Math.floor((movie.vote_count || 100) * 1.5),
              shares: Math.floor((movie.popularity || 50) * 2),
              comments: Math.floor((movie.vote_count || 50) * 0.1),
              tags: ["Cinema", "TMDB", "Trending"],
              ctaText: "Watch Trailer",
              ctaAction: "watch" as const,
              isTrending: true,
              score: Math.round(movie.popularity || 85),
            }));
            return NextResponse.json({ success: true, items: liveItems, page, isLive: true });
          }
        }
      } catch (err) {
        console.warn("TMDB fetch failed, falling back to mock dataset:", err);
      }
    }

    // Default mock dataset filter
    let items = [...INITIAL_CONTENT_ITEMS, ...PAGINATED_ADDITIONAL_ITEMS].filter(
      (item) => item.type === "recommendation"
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
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch recommendations";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
