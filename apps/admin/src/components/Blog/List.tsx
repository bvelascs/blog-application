import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function getGreeting() {
  const hour = new Date().getHours();
  let timeGreeting;
  if (hour >= 5 && hour < 12) timeGreeting = "Good morning";
  else if (hour >= 12 && hour < 18) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";

  return `${timeGreeting}, Admin`;
}

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="w-3/4 flex items-center justify-center">
        <p className="font-semibold py-12">Posts are no longer available or being deactivated</p>
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="p-4">
        <h2 className="text-4xl font-bold">From the blog</h2>
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
