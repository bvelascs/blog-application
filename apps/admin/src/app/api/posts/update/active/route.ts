// This file handles the API route for updating the active status of a post

// Import Prisma ORM for database operations
import { PrismaClient } from "@prisma/client";
import { isLoggedIn } from '../../../../../utils/auth';
import { NextResponse } from "next/server";

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
    try {
        // Check if user is authenticated with valid JWT token
        if (!await isLoggedIn()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extract post ID and active status from request body
        const { id, active } = await request.json();
        
        // Validate required fields
        if (id === undefined || active === undefined) {
            return NextResponse.json({ error: "Post ID and active status are required" }, { status: 400 });
        }
        
        // Attempt to update the post's active status
        const post = await updatePostActive(id, active);
        
        // Return success response with updated post data
        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error("Error updating post active status:", error);
        
        // Return error response if update fails
        return NextResponse.json({ error: "Error updating post" }, { status: 500 });
    }
}