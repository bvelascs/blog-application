// import { posts, type Post } from "../components/data";

export function categories<T>(
  posts: { category: string; active: boolean }[],
): { name: string; count: number }[] {
  return posts
    .sort((a, b) => a.category.localeCompare(b.category))
    .reduce(
      (acc, post) => {
        const category = acc.find((c) => c.name === post.category);
        if (category) {
          category.count++;
        } else {
          acc.push({ name: post.category, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[],
    );
}

export function categoriesNotForTest<T>(
  posts: { category: string; active: boolean }[],
): { name: string; count: number }[] {
  return posts
    // .filter((p) => p.active)
    .reduce(
      (acc, post) => {
        const category = acc.find((c) => c.name === post.category);
        if (category) {
          category.count++;
        } else {
          acc.push({ name: post.category, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[],
    );
}
