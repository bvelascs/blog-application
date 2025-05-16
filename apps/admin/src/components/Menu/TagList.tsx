import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import Link from "next/link";

export async function TagList({posts}: {posts: Post[];}) 
{
  const postTags = await tags(posts);
  
  return (
    <LinkList title="Tag">
      {postTags.map((tag, index) => (
        <Link title={`Tag / ${tag.name}`} href={`/tags/${tag.name.toLowerCase().replace(" ", "-")}`} key={index} className="flex space-x-3 px-3">
          <span data-test-id="post-count" className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-gray-400">
            {tag.count}
          </span>
          <div className="hover:cursor-pointer hover:text-blue-700">{tag.name}</div>
        </Link>
      ))}
    </LinkList>
  );
}
