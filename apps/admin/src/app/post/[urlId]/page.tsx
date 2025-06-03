// This file is a part of the admin app for a blogging platform.
// The [urlId] in the path indicates a dynamic route parameter

// Import necessary components and utilities
import { BlogDetail } from "../../../components/Blog/Detail";
import { AppLayout } from "../../../components/Layout/AppLayout";
import { isLoggedIn } from "../../../utils/auth";
import LoginScreen from "../../../components/Screens/auth/login";
import { client } from "@repo/db/client";
import type { Post } from "@repo/db/data";

// Define TypeScript interface for the page props
// params contains the URL parameters passed to the page
interface PageProps {
  params: Promise<{ urlId: string }>;
}

// Main page component - async to handle authentication check
export default async function Page({ params }: PageProps) {
  // Extract the urlId from the URL parameters
  const { urlId } = await params;

  // Check if user is authenticated
  const loggedIn = await isLoggedIn();
  
  // If not logged in, show login screen with credentials from environment variables
  if (!loggedIn) {
    return (
      <LoginScreen
        username={process.env.USERNAME!}
        password={process.env.PASSWORD!}
      />
    );
  }  // Fetch the post from the database using Prisma client
  const prisma = client.db;
  const dbPost = await prisma.post.findUnique({
    where: { urlId: urlId },
    include: { likes: true }
  });

  // If no matching post is found, show error message
  if (!dbPost) {
    return (
      <AppLayout>
        <div>Post not found</div>
      </AppLayout>
    );
  }
    // Convert database post to the format expected by the BlogDetail component
  const post = {
    ...dbPost,
    likes: dbPost.likes.length, // Convert likes array to count
    date: dbPost.date instanceof Date ? dbPost.date : new Date(dbPost.date)
  } as Post;

  // If post is found, render it within the app layout
  return (
    <AppLayout>
      <BlogDetail post={post} />
    </AppLayout>
  );
}
