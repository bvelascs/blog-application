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
    <div className="w-1/4 border-r-2 border-gray-200 bg-gradient-to-b from-slate-50 to-white shadow-inner">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <h1 className="flex w-full items-center justify-center px-6 py-5 border-b border-gray-100">
          <Link href={"/"} className="flex items-center gap-3 w-full transition-transform hover:scale-105">
            <div className="bg-blue-50 p-2 rounded-full shadow-sm">
              <Image src="/wsulogo.png" alt="WSU Logo" width={40} height={40} className="h-10 w-10 object-contain" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Full Stack Blog</span>
          </Link>
        </h1>
      </div>
      <nav className="font-medium p-5">
        <ul role="list" className="flex flex-1 flex-col gap-y-8">
          <li className="hover:translate-x-1 transition-transform">
            <CategoryList posts={posts} />
          </li>
          <li className="hover:translate-x-1 transition-transform">
            <HistoryList posts={activePosts} />
          </li>
          <li className="hover:translate-x-1 transition-transform">
            <TagList posts={activePosts.filter((post: Post) => post.active)} />
          </li>
        </ul>
      </nav>
    </div>
  );
}
