import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import Link from "next/link";

export async function TagList({posts}: {posts: Post[];}) 
{
  const postTags = await tags(posts);
  
  return (
    <LinkList title="Tag">
      {postTags.map((tag, index) => (        <Link 
          title={`Tag / ${tag.name}`} 
          href={`/tags/${tag.name.toLowerCase().replace(" ", "-")}`} 
          key={index} 
          className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-all duration-200"
        >
          <span 
            data-test-id="post-count" 
            className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-blue-200 bg-blue-50 text-blue-700 shadow-sm text-sm font-medium"
          >
            {tag.count}
          </span>
          <div className="hover:cursor-pointer hover:text-blue-700 font-medium">
            {tag.name.charAt(0).toUpperCase() + tag.name.slice(1).toLowerCase()}
          </div>
        </Link>
      ))}
    </LinkList>
  );
}
