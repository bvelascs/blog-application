// This file handles the API route for updating the active status of a post

// Import Prisma ORM for database operations
import { PrismaClient } from "@prisma/client";
import { isLoggedIn } from '../../../../../utils/auth';

// Initialize Prisma client for database connections
const prisma = new PrismaClient();

// Helper function to update post's active status
// Parameters:
// - id: The post's unique identifier
// - active: Boolean flag indicating if post should be active/inactive
async function updatePostActive(id: number, active: boolean) {
  const post = await prisma.post.update({
    where: { id },// Find post by ID
    data: {
      active, // Update the active status
    },
  })
  return post; // Return updated post
}

// POST endpoint handler
export async function POST(request: Request) {
    if (!await isLoggedIn()) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Extract post ID and active status from request body
    const { id, active } = await request.json();
    
    try {
        // Attempt to update the post's active status
        const post = await updatePostActive(id, active);
        // Return success response with updated post data
        return new Response(JSON.stringify(post), { status: 200 });
    } catch (error) {
        // Return error response if update fails
        return new Response("Error updating post", { status: 500 });
    }
}