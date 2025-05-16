// Import Prisma ORM client for database operations
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client instance
const prisma = new PrismaClient();

// Helper function to update post views
// Takes post id and current views count as parameters
async function updatePost(id: number, views: number) {
  const res = await prisma.post.update({
    where: { id }, // Find post by ID
    data: { views: { increment: 1 } }, // Increment views by 1
  });
  return res;
}

// GET endpoint to fetch current view count
export async function GET(req: Request) {
  // Parse URL search parameters from request URL
  const { searchParams } = new URL(req.url!); 
  // Extract and convert postId to number
  const postId = Number(searchParams.get("postId"));

  // Find post in database by ID
  const post = await prisma.post.findFirst({
    where: {id: postId}
  });
  
  // If post doesn't exist, return 404 error
  if(!post) {
    return new Response(JSON.stringify("No post found."), { status: 404 });
  }

  // Return current view count with 200 status
  return new Response(JSON.stringify(post.views), { status: 200 });
}

// POST endpoint to increment view count
export async function POST(request: Request) {
  // Extract post ID and views from request body
  const { id, views } = await request.json();

  // Call helper function to update views
  const res = await updatePost(id, views);

  // If update fails, return 500 error
  if (!res) {
    return new Response("Failed to update post", { status: 500 });
  }

  // Return updated post data with 200 status
  return new Response(JSON.stringify(res), { status: 200 });
}