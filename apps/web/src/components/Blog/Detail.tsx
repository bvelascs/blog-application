"use client";

import type { Post } from "@repo/db/data";
import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function BlogDetail({ post }: { post: Post }) {
  const [likes, setLikes] = useState(post.likes); // Total likes
  const [userLiked, setUserLiked] = useState(false); // Whether the user has liked the post
  const [views, setViews] = useState(post.views); // Total views

  useEffect(() => {
    fetch(`/api/update/post?postId=${post.id}`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(data => setViews(data));

    // Increment views and update the database
    const incrementViews = async () => {

      try {
        const response = await fetch("/api/update/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: post.id,
            views: views+1,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update views");
        }
        const data = await response.json();
        setViews(data.views);

      } catch (error) {
        console.error("Error updating views:", error);
      }
    };

    incrementViews();
  }, [post.id]);
  useEffect(() => {
    // Check if the user has already liked the post and get total likes count
    const fetchUserLike = async () => {
      try {
        const response = await fetch(`/api/likes?postId=${post.id}`);
        const data = await response.json();
        
        // Update likes count using the count property from API
        setLikes(data.count || data.likes?.length || 0);
        
        // Check if user already liked this post
        const hasUserLike = data.likes?.some((like: any) => like.userIP === "192.168.100.54");
        setUserLiked(!!hasUserLike);
        
        console.log("Likes data:", { count: data.count, likes: data.likes?.length, hasUserLike });
      } catch (error) {
        console.error("Error fetching user like:", error);
      }
    };

    fetchUserLike();
  }, [post.id]);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id, userIP: "192.168.100.54" }),
      });

      const data = await response.json();
      setUserLiked(data.liked);
      setLikes((prevLikes) => (data.liked ? prevLikes + 1 : prevLikes - 1));
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const content = marked.parse(post.content);
  return (
    <div data-test-id={`blog-post-${post.id}`} className="container max-w-4xl mx-auto py-12 dark:text-white">
      {/* Category Badge */}
      <div className="mb-6">
        <span className="inline-block py-1.5 px-4 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
          {post.category}
        </span>
      </div>
      
      {/* Post Title */}
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
        {post.title}
      </h1>
      
      {/* Post Metadata */}
      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p>
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative rounded-xl overflow-hidden shadow-lg mb-10">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={1024}
          height={384}
          className="w-full max-h-96 object-cover"
          priority
        />
      </div>      {/* Post Content */}
      <div className="prose dark:prose-invert max-w-none pb-10 border-b border-gray-200 dark:border-gray-700">
        <article
          data-test-id="content-markdown"
          className="leading-relaxed text-gray-800 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: content }}
        ></article>
      </div>

      {/* Post Tags */}
      <div className="flex flex-wrap gap-2 py-6 text-sm">
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

      {/* Post Footer */}
      <div className="flex justify-between items-center py-6 mt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          <span>{views} views</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors ${
              userLiked 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
            data-test-id="like-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={userLiked ? "rgba(220, 38, 38, 0.5)" : "none"} 
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <span>{likes} likes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
