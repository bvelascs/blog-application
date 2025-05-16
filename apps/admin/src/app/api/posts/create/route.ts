import { PrismaClient } from "@prisma/client";

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
  // Extract post data from request body using destructuring
  const { title, description, content, imageUrl, tags, category } = await request.json();

  try {
    // Attempt to create the post using helper function
    const post = await createPost(title, description, content, imageUrl, tags, category);
    
    // Return successful response with created post data
    return new Response(JSON.stringify(post), {
      status: 201,      // 201 Created status code
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // If any error occurs during post creation, return error response
    return new Response(JSON.stringify({ error: "Failed to create post" }), {
      status: 500,      // 500 Internal Server Error status code
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}