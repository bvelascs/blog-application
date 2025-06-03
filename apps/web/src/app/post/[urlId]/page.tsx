import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";
import { client } from '@repo/db/client';

const prisma = client.db;

type PageProps = {
  params: { urlId: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function Page({ params }: PageProps) {
  const { urlId } = params;

  // Fetch the specific post directly from the database
  const post = await prisma.post.findUnique({
    where: { urlId },
    include: { likes: true }
  });

  // Process the post to include like count instead of array
  const processedPost = post ? {
    ...post,
    likes: post.likes.length
  } : null;

  if (!processedPost) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p>The post you're looking for doesn't exist or may have been removed.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <BlogDetail post={processedPost}/>
    </AppLayout>
  );
}
