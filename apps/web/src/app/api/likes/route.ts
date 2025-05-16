
// Import necessary dependencies
import { PrismaClient } from "@prisma/client";
import { getLikes } from "@/components/Blog/ListItem";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// POST endpoint to handle like/unlike actions
export async function POST(req: Request) {
  // Extract postId and userIP from request body
  const { postId, userIP } = await req.json();

  try {
    // Check if user has already liked this post
    const existingLike = await prisma.like.findFirst({
      where: { postId, userIP },
    });

    if (existingLike) {
      // If like exists, remove it (unlike)
      await prisma.like.delete({
        where: {
          postId_userIP: {
            postId: existingLike.postId,
            userIP: existingLike.userIP,
          },
        },
      });
      // Return unlike confirmation
      return new Response(
        JSON.stringify({ message: "Post unliked", liked: false }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      // If no like exists, create one
      await prisma.like.create({
        data: { postId, userIP },
      });
      // Return like confirmation
      return new Response(
        JSON.stringify({ message: "Post liked", liked: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    // Error handling
    console.error("Error handling like:", error);
    return new Response('Error occurred', { status: 500 });
  }
}

// GET endpoint to retrieve like count for a post
export async function GET(req: Request) {
  try {
    // Extract postId from URL parameters
    const { searchParams } = new URL(req.url!);
    const postId = Number(searchParams.get("postId"));

    // Validate postId presence
    if (!postId) {
      return new Response(
        JSON.stringify({ error: "postId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" }}
      );
    }

    // Get likes count for the post
    const likes = await getLikes(postId);
    
    // Return likes data
    return new Response(
      JSON.stringify(likes),
      { status: 200, headers: { "Content-Type": "application/json" }}
    );
  } catch (error) {
    // Error handling
    console.error("Error in GET function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch likes" }),
      { status: 500 }
    );
  }
}
