import { expect, test } from "vitest";
import { tags } from "./tags";
import type { Post } from "@repo/db/data";

test("returns empty array if no posts are provides", async () => {
  await expect(await tags([])).toEqual([]);
});

test("returns tags with count", async () => {
  const testPosts: Post[] = [
    {
      id: 1,
      urlId: "post-1",
      title: "Post 1",
      description: "Description 1",
      content: "Content 1",
      imageUrl: "https://example.com/image1.jpg",
      date: new Date("2024-01-01"),
      category: "Category 1",
      views: 0,
      likes: 0,
      tags: "A,B",
      active: true,
    },
    {
      id: 2,
      urlId: "post-2",
      title: "Post 2",
      description: "Description 2",
      content: "Content 2",
      imageUrl: "https://example.com/image2.jpg",
      date: new Date("2024-01-02"),
      category: "Category 2",
      views: 0,
      likes: 0,
      tags: "A,C",
      active: true,
    },
    {
      id: 3,
      urlId: "post-3",
      title: "Post 3",
      description: "Description 3",
      content: "Content 3",
      imageUrl: "https://example.com/image3.jpg",
      date: new Date("2024-01-03"),
      category: "Category 3",
      views: 0,
      likes: 0,
      tags: "C",
      active: true,
    },
    {
      id: 4,
      urlId: "post-4",
      title: "Post 4",
      description: "Description 4",
      content: "Content 4",
      imageUrl: "https://example.com/image4.jpg",
      date: new Date("2024-01-04"),
      category: "Category 4",
      views: 0,
      likes: 0,
      tags: "D",
      active: false,
    },
  ];

  await expect(await tags(testPosts)).toEqual([
    { name: "A", count: 2 },
    { name: "B", count: 1 },
    { name: "C", count: 2 },
  ]);
});
