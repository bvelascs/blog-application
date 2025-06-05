"use client"; // Marks this component as client-side rendered
import type { Post } from "@repo/db/data";
import Link from "next/link";
import { useState } from "react";

// Component that displays a single blog post in a list view
export function BlogListItem({ post }: { post: Post }) {  // State to track post's active status and loading states
  const [active, setActive] = useState(post.active);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
  
  // Function to delete a post
  const deletePost = async () => {
    if (!window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      return;
    }
    
    setIsDeleting(true);
    setDeleteError("");
    
    try {
      const response = await fetch(`/api/posts/delete?id=${post.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        // Refresh the page after successful deletion
        window.location.reload();
      } else {
        const data = await response.json();
        setDeleteError(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    // Main article container with hover effects
    <article className="flex flex-row gap-8 p-8 transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-gray-900/50 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      {/* Post Featured Image */}
      <img
        src={post.imageUrl}
        alt={post.title}
        className="h-96 w-96 rounded-lg object-cover transition-transform duration-200 hover:scale-105"
      />

      {/* Post Content Container */}
      <div className="flex w-1/2 flex-col justify-between">
        {/* Post Title with Link */}
        <Link
          href={`/post/${post.urlId}`}
          title={post.title}
          className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          {post.title}
        </Link>

        {/* Button Action Area */}
        <div className="flex space-x-2 mt-2">
          {/* Active/Inactive Toggle Button */}
          <button
            data-test-id="active-button"
            onClick={toggleActive}
            className={`rounded-full px-4 py-2 text-sm font-semibold w-48 transition-colors duration-200 ${
              active 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            {active ? "Active" : "Inactive"}
          </button>
          
          {/* Delete Button */}
          <button
            onClick={deletePost}
            disabled={isDeleting}
            className="rounded-full px-4 py-2 text-sm font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
        
        {/* Delete Error Message */}
        {deleteError && (
          <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{deleteError}</p>
        )}

        {/* Post Date and Category Information */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
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
        <p className="mt-6 leading-relaxed text-gray-700 dark:text-gray-300">{post.description}</p>

        {/* Tags Display - Join tags with comma and space */}
        <div className="mt-6 flex flex-wrap gap-2 text-sm text-blue-600 dark:text-blue-400">
          <span>#{post.tags.split(",").map(tag => tag.trim()).join(", #")}</span>
        </div>

        {/* Post Metrics Display (Views and Likes) */}
        <div className="mt-6 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{post.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="rgb(239, 68, 68)"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <div>{post.likes} likes</div>
          </div>
        </div>
      </div>
    </article>
  );
}
