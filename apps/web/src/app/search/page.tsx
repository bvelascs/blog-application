// Import required components and data
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

// Search page component that handles filtering posts based on search query
export default async function Page({
  searchParams,
}: {
  // TypeScript type definition for search parameters
  // q? indicates an optional search query parameter from URL
  searchParams: Promise<{ q?: string }>;
}) {
  // Extract search query from URL parameters with empty string default
  const { q = '' } = await searchParams;
  
  // Remove whitespace from start and end of search query
  const searchQuery = q.trim();
  
  // Filter posts based on search query
  const filteredPosts = searchQuery
    ? posts.filter(post => 
        // Case-insensitive search in both title and description
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts; // If no search query, return all posts

  // Render the search results
  return (
    <AppLayout query={searchQuery}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
