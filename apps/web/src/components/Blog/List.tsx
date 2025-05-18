"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Post } from "@repo/db/data";
import { ClientBlogListItem } from "./ClientBlogListItem";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

export function BlogList({ posts: initialPosts }: { posts: Post[] }) {
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const POSTS_PER_PAGE = 5;
  
  // Initialize with the first batch
  useEffect(() => {
    setVisiblePosts(initialPosts.slice(0, POSTS_PER_PAGE));
    setHasMore(initialPosts.length > POSTS_PER_PAGE);
  }, [initialPosts]);

  // Load more posts when the user scrolls to the bottom
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(`/api/posts?page=${nextPage}&limit=${POSTS_PER_PAGE}`);
      const data = await response.json();
      
      if (data.posts && data.posts.length > 0) {
        setVisiblePosts(prev => [...prev, ...data.posts]);
        setCurrentPage(nextPage);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore]);
  
  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { rootMargin: "100px" }
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) observer.observe(currentLoaderRef);

    return () => {
      if (currentLoaderRef) observer.unobserve(currentLoaderRef);
    };
  }, [loadMorePosts, hasMore, loading]);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-medium mb-4">{getGreeting()}, Brandon</h2>
      
      {visiblePosts.map((post) => (
        <ClientBlogListItem
          key={post.id}
          post={post}
          likes={post.likes}
          views={post.views}
        />
      ))}
      
      {/* Custom section between posts and loader */}
      <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-2">Recommended for you</h3>
        <p className="text-gray-600">Discover more content based on your reading history.</p>
      </div>
      
      {/* Loading indicator and end of content message */}
      <div ref={loaderRef} className="py-4 text-center">
        {loading && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
        {!hasMore && visiblePosts.length > 0 && (
          <p className="text-gray-500">You've reached the end of the content.</p>
        )}
      </div>
    </div>
  );
}

export default BlogList;
