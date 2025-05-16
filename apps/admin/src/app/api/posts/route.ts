// This file is a Next.js API route that handles requests to the /api/posts endpoint.

// Import PrismaClient to interact with the database
import { PrismaClient } from '@prisma/client';

// Initialize a single instance of PrismaClient for database operations
const prisma = new PrismaClient();

// Helper function to fetch all blog posts from the database
// Returns a Promise that resolves to an array of posts
async function getAllPosts() {
    // Use Prisma's findMany method to get all posts
    const posts = prisma.post.findMany({});
    return posts;
}

// Export GET handler function for the API route
export async function GET() {
  // Fetch all posts using the helper function
  const posts = await getAllPosts();

  // Return posts as JSON response with proper headers
  return new Response(JSON.stringify(posts), {
    status: 200,      // 200 OK status code
    headers: {
      'Content-Type': 'application/json',
    },
  });
}