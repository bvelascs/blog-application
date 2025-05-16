import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";


export function LeftMenu() {

  const activePosts = posts.filter((post) => post.active);
  

  return (
    <div className="w-1/4  border-r-2 border-gray-200 pt-8">
      {/* Sidebar component, swap this element with another sidebar if you like */}

      <nav className="font-bold py-12">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <CategoryList posts={posts} />
          </li>
          <li>
            <HistoryList posts={activePosts} />
          </li>
          <li>
            <TagList posts={activePosts} />
          </li>
        </ul>
      </nav>
    </div>
  );
}
