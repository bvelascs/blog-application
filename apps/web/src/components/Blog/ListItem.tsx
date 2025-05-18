// Import necessary dependencies
import type { Post } from "@repo/db/data";    // Type definition for blog posts
import Link from "next/link";                  // Next.js component for client-side navigation
import { PrismaClient } from '@prisma/client'; // Database ORM

// Initialize database client
const prisma = new PrismaClient();

// Helper function to fetch all likes for a specific post
export async function getLikes(postId: number) {
  const likes = await prisma.like.findMany({
    where: { postId },
  });
  return likes;
}

// function to check if a specific user has liked a post
export async function getUserLike(postId: number) {
  const userLiked = await prisma.like.findFirst({
    where: {
      postId,
      userIP: "192.168.100.100"
    },
  });
  return userLiked;
}

// Main component to render a blog post item
export async function BlogListItem({ post }: { post: Post }) {
  // Fetch social metrics for the post
  const likes = await getLikes(post.id);
  const views = await prisma.post.findUnique({
    where: { id: post.id },
    select: { views: true },
  });
  
  return (
    <article
      key={post.id}
      className="flex flex-row gap-8 p-8 transition-shadow duration-300 hover:shadow-lg"
      data-test-id={`blog-post-${post.id}`} // For testing purposes
    >
      {/* Post Image Section */}
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-96 w-64 rounded-lg object-cover"
      />

      {/* Post Content Container */}
      <div className="flex w-1/2 flex-col justify-between">
        {/* Post Title with Link */}
        <Link
          href={`/post/${post.urlId}`}
          title={`Category / ${post.title}`}
          className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300 hover:text-blue-600"
        >
          {post.title}
        </Link>

        {/* Post Metadata (Date and Category) */}
        <div className="mt-4 text-sm text-500">
          <p>
            {/* Format date to DD MMM YYYY format */}
            {post.date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="mt-1">{post.category}</p>
        </div>

        {/* Post Description */}
        <p className="mt-6 leading-relaxed text-700">{post.description}</p>

        {/* Tags Section with Links */}
        <div className="mt-6 flex flex-wrap gap-2 text-sm text-blue-500">
          {post.tags.split(",").map((tag, index) => (
            <Link
              key={index}
              href={`/tags/${tag.trim().toLowerCase().replace(" ", "-")}`}
              className="rounded-full bg-blue-100 px-2 py-1 text-blue-600 hover:bg-blue-200"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Social Metrics (Views and Likes) */}
        <div className="mt-6 flex flex-wrap gap-2 text-sm text-blue-500">
          <div className="text-500">{views!.views} views</div>          <div className="ml-auto flex items-center space-x-1 text-500">
            {/* Heart Icon SVG */}
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="red"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <div>{likes.length} likes</div>
          </div>
        </div>
      </div>
    </article>
  );
}
