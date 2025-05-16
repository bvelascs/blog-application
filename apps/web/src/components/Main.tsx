import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  
  const activePosts = posts.filter(post => post.active === true);

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
