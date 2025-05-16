import { posts } from "@/app/page";
import { BlogDetail } from "@/components/Blog/Detail";
import { getLikes } from "@/components/Blog/ListItem";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Post } from "@repo/db/data";

interface PageProps {
  params: Promise<{ urlId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { urlId } = await params;

  const post = posts.find((post: Post) => post.urlId.toString() === urlId);
  if (!post) {
    return (
      <AppLayout>
        <div>Post not found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <BlogDetail post={post}/>
    </AppLayout>
  );
}
