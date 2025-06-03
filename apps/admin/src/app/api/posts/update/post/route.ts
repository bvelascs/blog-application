// This file handles the API route for updating
// a post in the admin panel

// Import Prisma ORM for database operations
import { PrismaClient } from "@prisma/client";
import { isLoggedIn } from "../../../../../utils/auth";
import { NextResponse } from "next/server";

// Initialize Prisma client for database connections
const prisma = new PrismaClient();

// Parameters:
// - id: Post's unique identifier
// - title: Updated post title
// - description: Updated post description
// - content: Updated post content
// - imageUrl: Updated post image URL
// - tags: Updated post tags
// - category: Updated post category
async function updatePost(id: number, title: string, description: string, content: string, imageUrl: string, tags: string, category: string) {
  // Get the original post to check if the title has changed
  const originalPost = await prisma.post.findUnique({ where: { id } });
  if (!originalPost) {
    throw new Error("Post not found");
  }
  
  // Only generate a new urlId if the title has changed
  let urlId = originalPost.urlId;
  
  if (originalPost.title !== title) {
    // Create base URL-friendly ID from title
    let baseUrlId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
    // Make sure we have a valid urlId (at least 3 chars)
    if (baseUrlId.length < 3) {
      baseUrlId = `post-${Date.now()}`;
    }
      // Check if the urlId already exists and is not the current post
    urlId = baseUrlId;
    let counter = 1;
    
    // Keep checking until we find a unique urlId
    while (true) {
      const existingPost = await prisma.post.findFirst({ 
        where: { 
          urlId,
          id: { not: id }
        } 
      });
      
      if (!existingPost) break; // Found a unique urlId
      
      // Try with a counter suffix
      urlId = `${baseUrlId}-${counter}`;
      counter++;
    }
  }
  
  const post = await prisma.post.update({
    where: { id }, // Find post by ID
    data: {// Update post fields
      title,
      description,
      content,
      imageUrl,
      tags,
      category,
      urlId, // Use new urlId or keep original
    },
  });
  return post;// Return updated post
}

// POST endpoint handler
export async function POST(request: Request) {
  try {
    // Check if user is logged in with valid JWT token
    if (!await isLoggedIn()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Extract updated post details from request body
    const { id, title, description, content, imageUrl, tags, category } = await request.json();

    // Attempt to update the post with new details
    const post = await updatePost(id, title, description, content, imageUrl, tags, category);
    
    // Return success response with updated post data
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    
    // Return error response if update fails
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}