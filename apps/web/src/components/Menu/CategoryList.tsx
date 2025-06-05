import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { LinkList } from "./LinkList";
import Link from "next/link";

export function CategoryList({ posts }: { posts: Post[] }) {
  // TODO: Implement proper category list
  return (
    <LinkList title="Categories">
      <Link
        title={`category / DevOps`}
        href={`/category/devops`}
        key="devops-static"        className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
      >
        <span
          data-test-id="post-count"
          className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-blue-200 bg-blue-50 text-blue-700 shadow-sm text-sm font-medium dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        >
          0
        </span>
        <div className="hover:cursor-pointer hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-300 font-medium">DevOps</div>
      </Link>
      {categories(posts).map((category, index) => (
        <Link
          title={`category / ${category.name}`}
          href={`/category/${category.name.toLowerCase().replace(" ", "-")}`}
          key={index}          className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
        >
          <span
            data-test-id="post-count"
            className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-blue-200 bg-blue-50 text-blue-700 shadow-sm text-sm font-medium dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          >
            {category.count}
          </span>
          <div className="hover:cursor-pointer hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-300 font-medium">
            {category.name}
          </div>
        </Link>
      ))}
    </LinkList>
  );
}
