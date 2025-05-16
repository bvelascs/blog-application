// This file handles the API route for updating
// a post in the admin panel

// Import Prisma ORM for database operations
import { PrismaClient } from "@prisma/client";

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
  const post = await prisma.post.update({
    where: { id }, // Find post by ID
    data: {// Update post fields
      title,
      description,
      content,
      imageUrl,
      tags,
      category,
      urlId: title.toLowerCase().replace(/\s+/g, "-"), // Update urlId to match new title
    },
  });
  return post;// Return updated post
}

// POST endpoint handler
export async function POST(request: Request) {
  // Extract updated post details from request body
  const { id, title, description, content, imageUrl, tags, category } = await request.json();

  try {
    // Attempt to update the post with new details
    const post = await updatePost(id, title, description, content, imageUrl, tags, category);
    // Return success response with updated post data
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    // Return error response if update fails
    return new Response("Error updating post", { status: 500 });
  }
}