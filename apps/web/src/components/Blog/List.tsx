//infinite scroll
// This component is responsible for rendering a list of blog posts with infinite scrolling functionality.

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

export function BlogList({ posts: initialPosts }: { posts: Post[] }) {  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);  const POSTS_PER_PAGE = 4; // Show fewer posts initially to ensure infinite scroll is triggered
  // Initialize with the first batch
  useEffect(() => {
    // For debugging, log the likes values in the initial posts
    console.log("Initial posts likes:", initialPosts.map(p => ({ id: p.id, likes: p.likes })));
      // Make sure likes is always a number in initial posts
    const formattedPosts = initialPosts.map(post => ({
      ...post,
      likes: typeof post.likes === 'number' ? post.likes : 
             (typeof post.likes === 'object' && post.likes && 'length' in post.likes) ? (post.likes as any).length : 0
    }));
    
    setVisiblePosts(formattedPosts.slice(0, POSTS_PER_PAGE));
    setHasMore(formattedPosts.length > POSTS_PER_PAGE);
  }, [initialPosts]);

  // Load more posts when the user scrolls to the bottom
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(`/api/posts?page=${nextPage}&limit=${POSTS_PER_PAGE}`);
      const data = await response.json();
        // For debugging, log the likes values in the API response
      console.log("API response posts likes:", data.posts?.map((p: any) => ({ id: p.id, likes: p.likes })) || []);
        if (data.posts && data.posts.length > 0) {
        // Ensure no duplicate posts by checking IDs
        setVisiblePosts(prev => {
          const existingIds = new Set(prev.map((post: Post) => post.id));
          const uniqueNewPosts = data.posts
            .filter((post: any) => !existingIds.has(post.id))
            .map((post: any) => ({
              ...post,
              // Make sure likes is always a number
              likes: typeof post.likes === 'number' ? post.likes : 
                     Array.isArray(post.likes) ? post.likes.length : 0
            }));
          return [...prev, ...uniqueNewPosts];
        });
        setCurrentPage(nextPage);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      // Add a small delay to make the loading animation more noticeable
      setTimeout(() => {
        setLoading(false);
      }, 800);
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
        />      ))}
      
      {/* Loading indicator and end of content message */}
      <div ref={loaderRef} className="py-4 text-center">
        {loading && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#a31631] border-t-transparent"></div>
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
