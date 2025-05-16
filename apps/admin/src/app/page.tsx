// Import necessary components and utilities
import { isLoggedIn } from "../utils/auth";
import LoginScreen from "../components/Screens/auth/login";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// Helper function to fetch all blog posts from the database
async function getAllPosts() {
    const posts = prisma.post.findMany({});
    return posts;
}

// Main page component - handles authentication and content display
export default async function Home() {
  // Check if user is authenticated
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    // If not logged in, render the login screen with credentials from environment variables
    return (
      <LoginScreen
        username={process.env.USERNAME!} 
        password={process.env.PASSWORD!}
      />
    );
  } else {
    // If logged in, fetch all posts and display them
    const posts = await getAllPosts();
    return (
      <AppLayout>
        {/* 'as any' is used to bypass TypeScript type checking - consider adding proper types */}
        <Main posts={posts as any} />  
      </AppLayout>
    );
  }
}
