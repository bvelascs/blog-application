// This file is a Next.js API route that handles requests to the /api/posts endpoint.

// Import client from @repo/db/client to interact with the database
import { client } from '@repo/db/client';

// Use the shared Prisma client instance
const prisma = client.db;

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