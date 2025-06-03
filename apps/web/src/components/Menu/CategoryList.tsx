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
        key="devops-static"
        className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-all duration-200"
      >
        <span
          data-test-id="post-count"
          className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-blue-200 bg-blue-50 text-blue-700 shadow-sm text-sm font-medium"
        >
          0
        </span>
        <div className="hover:cursor-pointer hover:text-blue-700 font-medium">DevOps</div>
      </Link>
      {categories(posts).map((category, index) => (
        <Link
          title={`category / ${category.name}`}
          href={`/category/${category.name.toLowerCase().replace(" ", "-")}`}
          key={index}
          className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-all duration-200"
        >
          <span
            data-test-id="post-count"
            className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-blue-200 bg-blue-50 text-blue-700 shadow-sm text-sm font-medium"
          >
            {category.count}
          </span>
          <div className="hover:cursor-pointer hover:text-blue-700 font-medium">
            {category.name}
          </div>
        </Link>
      ))}
    </LinkList>
  );
}
