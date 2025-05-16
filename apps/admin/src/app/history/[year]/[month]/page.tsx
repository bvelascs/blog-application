// Import necessary components for page layout
import { AppLayout } from "../../../../components/Layout/AppLayout";
import { Main } from "../../../../components/Main";
// Import posts data from the database
import { posts } from "@repo/db/data";

// Define the main Page component that handles year/month archive views
export default async function Page({
  params,
}: {
  // Define the expected URL parameters with TypeScript types
  params: Promise<{ year: string; month: string }>;
}) {
  // Destructure year and month from the URL parameters
  const { year, month } = await params;

  // Filter posts to only show those matching the selected year and month
  const postsByDate = posts.filter(
    (post) =>
      post.date.getMonth() == Number(month) - 1 &&
      post.date.getFullYear() == Number(year)
  );

  // Render the page layout with filtered posts
  return (
    <AppLayout>
      <Main posts={postsByDate} />
    </AppLayout>
  );
}
