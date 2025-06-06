import { expect, test } from "vitest";
import { history } from "./history";
import type { Post } from "@repo/db/data";

test("returns empty array if no history are provides", async () => {
  await expect(await history([])).toEqual([]);
});

test("returns sorted counts by year and month", async () => {
  const testPosts: Post[] = [
    {
      id: 1,
      urlId: "post-1",
      title: "Post 1",
      description: "Description 1",
      content: "Content 1",
      imageUrl: "https://example.com/image1.jpg",
      date: new Date("01 Jan 2022"),
      category: "Category 1",
      views: 0,
      likes: 0,
      tags: "tag1",
      active: true,
    },
    {
      id: 2,
      urlId: "post-2",
      title: "Post 2",
      description: "Description 2",
      content: "Content 2",
      imageUrl: "https://example.com/image2.jpg",
      date: new Date("08 Jan 2022"),
      category: "Category 2",
      views: 0,
      likes: 0,
      tags: "tag2",
      active: true,
    },
    {
      id: 3,
      urlId: "post-3",
      title: "Post 3",
      description: "Description 3",
      content: "Content 3",
      imageUrl: "https://example.com/image3.jpg",
      date: new Date("07 Jan 2022"),
      category: "Category 3",
      views: 0,
      likes: 0,
      tags: "tag3",
      active: true,
    },
    {
      id: 4,
      urlId: "post-4",
      title: "Post 4",
      description: "Description 4",
      content: "Content 4",
      imageUrl: "https://example.com/image4.jpg",
      date: new Date("07 Mar 2020"),
      category: "Category 4",
      views: 0,
      likes: 0,
      tags: "tag4",
      active: true,
    },
    {
      id: 5,
      urlId: "post-5",
      title: "Post 5",
      description: "Description 5",
      content: "Content 5",
      imageUrl: "https://example.com/image5.jpg",
      date: new Date("07 Apr 2020"),
      category: "Category 5",
      views: 0,
      likes: 0,
      tags: "tag5",
      active: true,
    },
    {
      id: 6,
      urlId: "post-6",
      title: "Post 6",
      description: "Description 6",
      content: "Content 6",
      imageUrl: "https://example.com/image6.jpg",
      date: new Date("07 May 2024"),
      category: "Category 6",
      views: 0,
      likes: 0,
      tags: "tag6",
      active: true,
    },
    {
      id: 7,
      urlId: "post-7",
      title: "Post 7",
      description: "Description 7",
      content: "Content 7",
      imageUrl: "https://example.com/image7.jpg",
      date: new Date("01 Jan 2012"),
      category: "Category 7",
      views: 0,
      likes: 0,
      tags: "tag7",
      active: false,
    },
  ];

  await expect(await history(testPosts)).toEqual([
    { month: 5, year: 2024, count: 1 },
    { month: 1, year: 2022, count: 3 },
    { month: 4, year: 2020, count: 1 },
    { month: 3, year: 2020, count: 1 },
  ]);
});
