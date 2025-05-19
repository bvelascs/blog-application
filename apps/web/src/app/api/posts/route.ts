import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@repo/db/client";

/**
 * API endpoint that handles paginated blog post retrieval
 * This supports the infinite scroll functionality on the blog's front-end
 * 
 * @param request - The incoming HTTP request with pagination parameters
 * @returns JSON response with posts and pagination metadata
 */
export async function GET(request: NextRequest) {
  // Create a database client to interact with the database
  const client = createClient();
  
  // Extract pagination parameters from the URL query string
  const searchParams = request.nextUrl.searchParams;
  
  // Parse page number (defaults to 0 if not provided)
  // This represents which "page" of results we're on
  const page = parseInt(searchParams.get("page") || "0", 10);
  
  // Parse limit (defaults to 5 if not provided)
  // This controls how many posts to load per "page"
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  
  try {
    // Query the database for a batch of posts with pagination
    const posts = await client.post.findMany({
      where: { active: true },     // Only return published/active posts
      skip: page * limit,          // Skip previously loaded posts (page * limit)
      take: limit,                 // Take only the specified number of posts
      orderBy: { date: 'desc' }    // Sort by newest posts first
    });
    
    // Get total count of active posts for pagination calculations
    const totalPosts = await client.post.count({ where: { active: true } });
    
    // Return the posts along with pagination metadata
    return NextResponse.json({
      posts,                       // The batch of posts for this page
      totalPosts,                  // Total number of posts in the database
      hasMore: (page + 1) * limit < totalPosts  // Boolean flag indicating if more posts exist
                                   // This tells the frontend whether to show a "load more" indicator
    });
  } catch (error) {
    // Log any errors that occur during the database query
    console.error("Error fetching posts:", error);
    
    // Return an appropriate error response
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
