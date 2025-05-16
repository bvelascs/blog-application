import { posts } from "@/app/page";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@repo/db/data";

export function LeftMenu() {

  const activePosts = posts;
  

  return (
    <div className="w-1/4  border-r-2 border-gray-200 pt-8">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <h1 className="flex w-full items-center justify-center space-x-4">
        <Link href={"/"} className="w-full text-xl font-bold">Full Stack Blog</Link>
      </h1>
      <nav className="font-bold py-12">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <CategoryList posts={posts} />
          </li>
          <li>
            <HistoryList posts={activePosts} />
          </li>
          <li>
            <TagList posts={activePosts.filter((post: Post) => post.active)} />
          </li>
        </ul>
      </nav>
    </div>
  );
}
