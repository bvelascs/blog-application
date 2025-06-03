import { PrismaClient } from "@prisma/client";
import { isLoggedIn } from "../../../../utils/auth";
import { NextResponse } from "next/server";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// Helper function to create a new blog post
async function createPost(title: string, description: string, content: string, imageUrl: string, tags: string, category: string) {
  const post = await prisma.post.create({
    data: {
      // Create URL-friendly ID from title (e.g., "My Post" becomes "my-post")
      urlId: title.toLowerCase().replace(/\s+/g, "-"),
      // Using object property shorthand for matching parameter names
      title,
      description,
      content,
      imageUrl,
      category,
      views: 0,     // initialise view count to zero
      active: true, // Set post as active by default
      tags,
    },
  });
  return post;
}

// API route handler for POST requests
export async function POST(request: Request) {
  try {
    // Check if user is logged in with valid JWT token
    if (!await isLoggedIn()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    // Extract post data from request body using destructuring
    const { title, description, content, imageUrl, tags, category } = await request.json();

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    
    // Attempt to create the post using helper function
    const post = await createPost(title, description, content, imageUrl, tags, category);
    
    // Return successful response with created post data
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    
    // If any error occurs during post creation, return error response
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}