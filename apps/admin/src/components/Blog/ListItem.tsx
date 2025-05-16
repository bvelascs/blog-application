"use client"; // Marks this component as client-side rendered
import type { Post } from "@repo/db/data";
import Link from "next/link";
import { useState } from "react";

// Component that displays a single blog post in a list view
export function BlogListItem({ post }: { post: Post }) {
  // State to track post's active status
  const [active, setActive] = useState(post.active);

  // Function to toggle post's active status via API
  const toggleActive = async () => {
    try {
      // Send POST request to update active status
      const response = await fetch(`/api/posts/update/active`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: post.id,
          active: !active, // Toggle the current active state
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setActive(updatedPost.active); // Update local state with server response
      }
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  return (
    // Main article container with hover effects
    <article className="flex flex-row gap-8 p-8 transition-shadow duration-300 hover:shadow-lg">
      {/* Post Featured Image */}
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-96 w-96 rounded-lg object-cover"
      />

      {/* Post Content Container */}
      <div className="flex w-1/2 flex-col justify-between">
        {/* Post Title with Link */}
        <Link
          href={`/post/${post.urlId}`}
          title={post.title}
          className="text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-blue-600 dark:text-white"
        >
          {post.title}
        </Link>

        {/* Active/Inactive Toggle Button 
            Changes color based on active state:
            - Green for active
            - Red for inactive */}
        <button
          data-test-id="active-button"
          onClick={toggleActive}
          className="mt-2 rounded-full px-4 py-2 text-sm font-semibold w-48"
          style={{
            backgroundColor: active ? "#dcfce7" : "#fee2e2",
            color: active ? "#047857" : "#b91c1c",
          }}
        >
          {active ? "Active" : "Inactive"}
        </button>

        {/* Post Date and Category Information */}
        <div className="mt-4 text-sm text-500">
          <p>
            Posted on{" "}
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
          <p className="mt-1">{post.category}</p>
        </div>

        {/* Post Description */}
        <p className="mt-6 leading-relaxed text-700">{post.description}</p>        {/* Tags Display - Join tags with comma and space */}
        <div className="mt-6 flex flex-wrap gap-2 text-sm text-blue-500">
          <span>#{post.tags.split(",").map(tag => tag.trim()).join(", #")}</span>
        </div>

        {/* Post Metrics Display (Views and Likes) */}
        <div className="mt-6 flex gap-2 text-sm text-blue-500">
          <div>{post.views} views</div>
          <div className="ml-auto flex items-center space-x-1">
            <div>{post.likes} likes</div>
          </div>
        </div>
      </div>
    </article>
  );
}
