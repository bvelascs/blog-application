import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

/**
 * Helper function to delete a post
 * @param id - The ID of the post to delete
 * @returns The deleted post
 */
async function deletePost(id: number) {
  // First delete any likes associated with the post to avoid foreign key constraint errors
  await prisma.like.deleteMany({
    where: { postId: id }
  });
  
  // Then delete the actual post
  const post = await prisma.post.delete({
    where: { id }
  });
  
  return post;
}

/**
 * DELETE endpoint handler to delete a post
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is logged in
    if (!await isLoggedIn()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get post ID from URL
    const searchParams = new URL(request.url).searchParams;
    const id = Number(searchParams.get('id'));

    // Validate ID
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Valid post ID is required" }, 
        { status: 400 }
      );
    }

    // Attempt to delete the post
    const deletedPost = await deletePost(id);
    
    // Return success response with deleted post data
    return NextResponse.json(
      { message: "Post deleted successfully", post: deletedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    
    // Check for not found error
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
