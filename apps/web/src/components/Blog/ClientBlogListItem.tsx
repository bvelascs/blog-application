"use client";

import type { Post } from "@repo/db/data";
import Link from "next/link";

type ClientBlogListItemProps = {
  post: Post;
  likes: number;
  views: number;
};

export function ClientBlogListItem({ post, likes, views }: ClientBlogListItemProps) {
  return (
    <article
      className="flex flex-row gap-8 p-8 transition-shadow duration-300 hover:shadow-lg"
      data-test-id={`blog-post-${post.id}`}
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
          className="text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-blue-600 dark:text-white"
        >
          {post.title}
        </Link>

        {/* Category */}
        <div className="mt-2">
          <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-600">
            {post.category}
          </span>
        </div>

        {/* Post Description */}
        <p className="mt-6 leading-relaxed text-700">{post.description}</p>

        {/* Tags Display */}
        <div className="mt-6 flex flex-wrap gap-2">          {post.tags.split(",").map((tag, index) => (
            <Link
              key={`${post.id}-tag-${index}`}
              href={`/tags/${tag.trim().toLowerCase().replace(" ", "-")}`}
              className="rounded-full bg-blue-100 px-2 py-1 text-blue-600 hover:bg-blue-200"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Social Metrics (Views and Likes) */}
        <div className="mt-6 flex flex-wrap gap-2 text-sm text-blue-500">
          <div className="text-500">{views} views</div>
          <div className="ml-auto flex items-center space-x-1 text-500">
            {/* Heart Icon SVG */}            <svg 
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
            <div>{likes || 0} likes</div>
          </div>
        </div>
      </div>
    </article>
  );
}
