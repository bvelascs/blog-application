import type { Post } from "@repo/db/data";

export function history(posts: Post[]) 
{
  let allDates: Date[] = [];
  let uniqueDates: Date[] = [];

  allDates = posts
    .flat()
    .map((post) => post.date);

  uniqueDates = [...new Set(allDates.map(date => date.toDateString()))]
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map(date => new Date(date));

  return uniqueDates.map(date => ({
    month: date.getMonth(),
    year: date.getFullYear(),
    count: allDates.filter(d => d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth()).length,
  }));
}

