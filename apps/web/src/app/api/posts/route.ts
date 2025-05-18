import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@repo/db/client";

export async function GET(request: NextRequest) {
  const client = createClient();
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  
  try {
    const posts = await client.post.findMany({
      where: { active: true },
      skip: page * limit,
      take: limit,
      orderBy: { date: 'desc' }
    });
    
    const totalPosts = await client.post.count({ where: { active: true } });
    
    return NextResponse.json({
      posts,
      totalPosts,
      hasMore: (page + 1) * limit < totalPosts
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
