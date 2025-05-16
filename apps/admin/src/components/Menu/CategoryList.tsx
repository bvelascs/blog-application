import type { Post } from "@repo/db/data";
import { LinkList } from "./LinkList";
import Link from "next/link";
import { categories } from "../../functions/categories";

export function CategoryList({ posts }: { posts: Post[] }) {
  // TODO: Implement proper category list
  return (
    <LinkList title="Categories">
      {categories(posts).map((category, index) => (
        <Link 
          title={`category / ${category.name}`} 
          href={`/category/${category.name.toLowerCase().replace(" ", "-")}`} 
          key={index} 
          className="flex space-x-3 px-3"
        >
          <span data-test-id="post-count" className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-gray-400">
        {category.count}
          </span>
          <div className="hover:cursor-pointer hover:text-blue-700">
        {category.name}
          </div>
        </Link>
      ))}
        </LinkList>
  );
}
