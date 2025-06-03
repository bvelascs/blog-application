
// Import necessary dependencies
import { PrismaClient } from "@prisma/client";
import { getLikes } from "@/components/Blog/ListItem";
import { NextResponse } from "next/server";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// POST endpoint to handle like/unlike actions
export async function POST(req: Request) {
  try {
    // Extract postId and userIP from request body
    const { postId, userIP } = await req.json();
    
    // Validate required fields
    if (!postId || !userIP) {
      return NextResponse.json(
        { error: "Post ID and User IP are required" },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { message: "Post unliked", liked: false },
        { status: 200 }
      );
    } else {
      // If no like exists, create one
      await prisma.like.create({
        data: { postId, userIP },
      });
      
      // Return like confirmation
      return NextResponse.json(
        { message: "Post liked", liked: true },
        { status: 200 }
      );
    }
  } catch (error) {
    // Error handling
    console.error("Error handling like:", error);
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve like count for a post
export async function GET(req: Request) {
  try {
    // Extract postId from URL parameters
    const { searchParams } = new URL(req.url);
    const postId = Number(searchParams.get("postId"));

    // Validate postId presence
    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    // Get likes count for the post
    const likes = await getLikes(postId);
    
    // Return likes array and count information for better client handling
    return NextResponse.json(
      { likes, count: likes.length },
      { status: 200 }
    );
  } catch (error) {
    // Error handling
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}
