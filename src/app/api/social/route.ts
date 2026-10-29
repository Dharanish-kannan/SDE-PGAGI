import { NextResponse } from "next/server";
import { INITIAL_CONTENT_ITEMS, PAGINATED_ADDITIONAL_ITEMS } from "@/services/mockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const tag = searchParams.get("tag");

    let items = [...INITIAL_CONTENT_ITEMS, ...PAGINATED_ADDITIONAL_ITEMS].filter(
      (item) => item.type === "social"
    );

    if (category && category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    if (tag) {
      const cleanTag = tag.toLowerCase().replace("#", "");
      items = items.filter((item) =>
        item.tags.some((t) => t.toLowerCase().includes(cleanTag))
      );
    }

    return NextResponse.json({
      success: true,
      items,
      page,
      total: items.length,
      isLive: false,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch social posts";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
