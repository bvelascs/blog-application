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
    // Check if the user has already liked the post
    const fetchUserLike = async () => {
      try {
        const response = await fetch(`/api/likes?postId=${post.id}`);
        const data = await response.json();
        setLikes(data.length);
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
    <div data-test-id={`blog-post-${post.id}`} className="container py-12 dark:text-white">
      {/* Post Metadata */}
      <div className="flex space-x-8 text-sm text-gray-500">
        <p>
          {new Date(post.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p>{post.category}</p>
      </div>

      {/* Post Title */}
      <Link href={`/post/${post.urlId}`} className="text-4xl font-bold">{post.title}</Link>

      {/* Post Image */}
      <Image
        src={post.imageUrl}
        alt={post.title}
        width={1024}
        height={384}
        className="my-6 max-h-96 w-full rounded-lg object-cover"
      />

      {/* Post Content */}
      <div className="border-b-[0.5px] border-gray-400 pb-6">
        <article
          data-test-id="content-markdown"
          dangerouslySetInnerHTML={{ __html: content }}
        ></article>
      </div>

      {/* Post Tags */}
      <div className="flex flex-wrap gap-3 py-4 text-sm text-blue-500">
        {post.tags.split(",").map((tag, index) => (
          <span key={index}>#{tag}</span>
        ))}
      </div>

      {/* Post Footer */}
      <div className="flex justify-between py-4">
        <div>{views} views</div>
        <div className="flex items-center space-x-4">
          <svg
            onClick={handleLike}
            xmlns="http://www.w3.org/2000/svg"
            data-test-id="like-button"
            fill={userLiked ? "red" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="red"
            className="size-6 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>

          <span>{likes} likes</span>
        </div>
      </div>
    </div>
  );
}
