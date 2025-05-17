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
      <div className="w-full mb-6">
        <h1 className="text-4xl font-bold">{getGreeting()}, Admin</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="content--search" className="font-bold text-gray-700">
            Filter by Content:
          </label>
          <input
            id="content--search"
            onChange={changeContentHandler}
            className="border-b-1 h-12 w-full border-gray-300 outline-none"
            type="text"
            name="search"
            placeholder="Search"
          />
        </div>
        <div>
          <label htmlFor="tag--search" className="font-bold text-gray-700">
            Filter by tag:
          </label>
          <input
            id="tag--search"
            onChange={changeTagHandler}
            className="border-b-1 h-12 w-full border-gray-300 outline-none"
            type="text"
            name="search"
            placeholder="Search"
          />
        </div>
        <div>
          <label htmlFor="date--search" className="font-bold text-gray-700">
            Filter by Date Created:
          </label>
          <input
            id="date--search"
            onChange={changeDateHandler}
            className="border-b-1 h-12 w-full border-gray-300 outline-none"
            type="text"
            name="search"
            placeholder="Search"
          />
        </div>
        <div>
          <label htmlFor="sort" className="font-bold text-gray-700">
            Sort By:
          </label>
          <select
            id="sort"
            onChange={changeSortHandler}
            className="border-b-1 h-12 w-full border-gray-300 outline-none"
          >
            <option value="">None</option>
            <option value="title-asc">Title ASC</option>
            <option value="title-desc">Title DESC</option>
            <option value="date-asc">Date ASC</option>
            <option value="date-desc">Date DESC</option>
          </select>
        </div>
      </div>

      {activePosts.length === 0 ? (
        <p>0 posts</p>
      ) : (
        <BlogList posts={activePosts} />
      )}
    </main>
  );
}
