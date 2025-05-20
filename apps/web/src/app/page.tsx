import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import { client } from '@repo/db/client';

const prisma = client.db;
// Fetch posts with likes included
const rawPosts = await prisma.post.findMany({
  include: {
    likes: true // Include the likes relation
  }
});

// Transform posts to include like counts
export const posts = rawPosts.map(post => ({
  ...post,
  likes: post.likes.length // Replace likes relation with count
})) as any;
   

export default async function Home() {
  return (
    <AppLayout>
      <Main posts={posts} />
    </AppLayout>
  );
}
