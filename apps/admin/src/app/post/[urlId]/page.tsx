// This file is a part of the admin app for a blogging platform.
// The [urlId] in the path indicates a dynamic route parameter

// Import necessary components and utilities
import { BlogDetail } from "../../../components/Blog/Detail";
import { AppLayout } from "../../../components/Layout/AppLayout";
import { posts } from "@repo/db/data";
import { isLoggedIn } from "../../../utils/auth";
import LoginScreen from "../../../components/Screens/auth/login";

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
  }

  // Find the post that matches the urlId from our data
  const post = posts.find((post) => post.urlId.toString() === urlId);

  // If no matching post is found, show error message
  if (!post) {
    return (
      <AppLayout>
        <div>Post not found</div>
      </AppLayout>
    );
  }

  // If post is found, render it within the app layout
  return (
    <AppLayout>
      <BlogDetail post={post} />
    </AppLayout>
  );
}
