// Import necessary components and data
import { AppLayout } from "../../components/Layout/AppLayout";
import { Main } from "../../components/Main";
import { posts } from "@repo/db/data";

// Define the main search page component
// searchParams will contain query parameters from the URL (e.g., ?q=search+term)
export default async function Page({
  searchParams,
}: {
  // TypeScript type definition for search parameters
  // q? means the 'q' parameter is optional
  searchParams: Promise<{ q?: string }>;
}) {
  // Destructure the search query parameter with default empty string
  const { q = '' } = await searchParams;
  
  // Remove whitespace from start and end of search query
  const searchQuery = q.trim();
  
  // Filter posts based on search query
  const filteredPosts = searchQuery
    ? posts.filter(post => 
        // Check if title or description contains the search query
        // Convert both to lowercase for case-insensitive search
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts; // If no search query, return all posts

  // Render the page with filtered results
  return (
    <AppLayout query={searchQuery}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
