"use client";

import type { Post } from "@repo/db/data";
import BlogList, { getGreeting } from "./Blog/List";
import { useEffect, useState } from "react";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  const [activePosts, setActivePosts] = useState<Post[]>(
    posts
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
  );
  const [filters, setFilters] = useState<{
    content: string;
    tags: string;
    date: string;
  }>({
    content: "",
    tags: "",
    date: "",
  });

  const [sortOption, setSortOption] = useState<string>("");
  
  // Calculate dashboard metrics
  const totalPosts = posts.length;
  const activeTotalPosts = posts.filter(post => post.active).length;
  const draftPosts = posts.filter(post => !post.active).length;

  function applyFilters() {
    let filteredPosts = posts.filter((post) => !Object.keys(post).includes("added"));

    // Filter by content

    if (filters.content) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(filters.content.toLowerCase()) ||
          post.description
            .toLowerCase()
            .includes(filters.content.toLowerCase()) ||
          post.content.toLowerCase().includes(filters.content.toLowerCase()),
      );
    }

    // Filter by tags
    if (filters.tags) {
      filteredPosts = filteredPosts.filter((post) =>
        post.tags
          .split(",")
          .some((tag) =>
            tag.toLowerCase().includes(filters.tags.toLowerCase()),
          ),
      );
    }

    // Filter by date
    if (filters.date.length === 8) {
      const day = parseInt(filters.date.slice(0, 2), 10);
      const month = parseInt(filters.date.slice(2, 4), 10) - 1; // Months are 0-indexed
      const year = parseInt(filters.date.slice(4, 8), 10);

      const searchDate = new Date(year, month, day);

      filteredPosts = filteredPosts.filter((post) => {
        const postDate = new Date(post.date); // Assuming `post.date` is a valid date string
        return postDate >= searchDate;
      });
    }

    // Sort posts
    if (sortOption) {
      filteredPosts = [...filteredPosts].sort((a, b) => {
        if (sortOption === "title-asc") {
          return a.title.localeCompare(b.title);
        } else if (sortOption === "title-desc") {
          return b.title.localeCompare(a.title);
        } else if (sortOption === "date-asc") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortOption === "date-desc") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      });
    }
    setActivePosts(filteredPosts);
  }

  useEffect(() => {
    applyFilters();
  }, [filters, sortOption]);

  function changeContentHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters((prev) => ({ ...prev, content: e.target.value }));
  }

  function changeTagHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters((prev) => ({ ...prev, tags: e.target.value }));
  }

  function changeDateHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters((prev) => ({ ...prev, date: e.target.value }));
  }

  function changeSortHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortOption(e.target.value);
  }
  return (
    <main className={className}>
      {/* Welcome message */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-[#a31631]">
        <h1 className="text-3xl font-bold text-[#333f48] dark:text-white mb-2">{getGreeting()}</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your WSU Blog Administration Dashboard</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-[#a31631]">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#a31631]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Total Posts</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalPosts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-[#333f48]">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#333f48]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Active Posts</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{activeTotalPosts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Draft Posts</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{draftPosts}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and filters section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#333f48] dark:text-white">Post Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="content--search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by content:
            </label>
            <input
              id="content--search"
              onChange={changeContentHandler}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#a31631] focus:border-[#a31631] text-gray-900 dark:text-white transition-colors duration-200"
              type="text"
              placeholder="Search in title, description, or content"
            />
          </div>
          <div>
            <label htmlFor="tag--search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by tag:
            </label>
            <input
              id="tag--search"
              onChange={changeTagHandler}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#a31631] focus:border-[#a31631] text-gray-900 dark:text-white transition-colors duration-200"
              type="text"
              placeholder="Enter a tag name"
            />
          </div>          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Date Created:
            </label>
            <input
              id="date"
              type="date"
              onChange={changeDateHandler}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#a31631] focus:border-[#a31631] text-gray-900 dark:text-white transition-colors duration-200"
            />
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By:
            </label>
            <select
              id="sort"
              onChange={changeSortHandler}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#a31631] focus:border-[#a31631] text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="">None</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="date-desc">Date (Newest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-[#333f48] dark:text-white">Posts</h2>
        </div>
        <div className="p-6">
          {activePosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl dark:text-gray-400">No posts found</p>
              <p className="mt-2 dark:text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <BlogList posts={activePosts} />
          )}
        </div>
      </div>
    </main>
  );
}
