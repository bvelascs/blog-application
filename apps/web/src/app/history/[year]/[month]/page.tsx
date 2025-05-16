// Import required components and data
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

// Page component for displaying posts from a specific year and month
// [year] and [month] in the filepath are dynamic route parameters
export default async function Page({
  params,
}: {

  params: Promise<{ year: string; month: string }>;
}) {
  // Extract year and month from the URL parameters
  const { year, month } = await params;

  // Filter posts to only show those from the specified year and month
  const postsByDate = posts.filter(
    (post) =>
      post.date.getMonth() == Number(month) - 1 && // Convert URL month to 0-based index
      post.date.getFullYear() == Number(year) // Match the year exactly
  );

  // Render the filtered posts within the app layout
  return (
    <AppLayout>
      <Main posts={postsByDate} />
    </AppLayout>
  );
}
