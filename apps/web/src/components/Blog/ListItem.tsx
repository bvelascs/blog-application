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
  
  return (    <article
      key={post.id}
      className="flex flex-row gap-8 p-8 mb-8 bg-white dark:bg-gray-800 rounded-xl transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700"
      data-test-id={`blog-post-${post.id}`} // For testing purposes
    >
      {/* Post Image Section */}
      <div className="relative h-96 w-64 overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02] group">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Post Content Container */}
      <div className="flex w-1/2 flex-col justify-between">        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block py-1 px-3 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
            {post.category}
          </span>
        </div>

        {/* Post Title with Link */}
        <Link
          href={`/post/${post.urlId}`}
          title={`${post.category} / ${post.title}`}
          className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          {post.title}
        </Link>

        {/* Post Metadata (Date) */}
        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p>
            {/* Format date to DD MMM YYYY format */}
            {post.date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Post Description */}
        <p className="mt-6 leading-relaxed text-gray-700 dark:text-gray-300">{post.description}</p>        {/* Tags Section with Links */}
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          {post.tags.split(",").map((tag, index) => (
            <Link
              key={`${post.id}-tag-${index}`}
              href={`/tags/${tag.trim().toLowerCase().replace(" ", "-")}`}
              className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
              #{tag.trim()}
            </Link>
          ))}
        </div>

        {/* Social Metrics (Views and Likes) */}
        <div className="mt-8 flex items-center justify-between text-sm border-t dark:border-gray-700 pt-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>{views!.views} views</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
            {/* Heart Icon SVG */}
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              fill={likes.length > 0 ? "rgba(239, 68, 68, 0.2)" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="rgb(239, 68, 68)"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <span>{likes.length} likes</span>
          </div>
          
          <Link 
            href={`/post/${post.urlId}`}
            className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Read more
            <svg className="ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
