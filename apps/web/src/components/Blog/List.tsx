import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="w-3/4 flex items-center justify-center">
        <p className="font-semibold py-12">Posts are no longer available or being deactivated</p>
      </div>
    );
  }

  return (
    <div className="w-3/4">
      <div className="p-4">
        <h1 className="text-4xl font-bold">From the blog</h1>
        <p>Learn how to grow your business with our expert advice.</p>
        <div className="py-12">
          {posts.map((post) => (
            <BlogListItem key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogList;
