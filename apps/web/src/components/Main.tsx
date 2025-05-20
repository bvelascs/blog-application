import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  
  // Filter for active posts and ensure likes is always a number
  const activePosts = posts
    .filter(post => post.active === true)
    .map(post => ({
      ...post,
      likes: typeof post.likes === 'number' ? post.likes :
             (typeof post.likes === 'object' && post.likes && 'length' in post.likes) ? (post.likes as any).length : 0
    }));

  return (
    <main className={className}>
      {activePosts.length === 0 ? (
      <p>0 posts</p>
      ) : (
      <BlogList posts={activePosts} />
      )}
    </main>
  );
}
