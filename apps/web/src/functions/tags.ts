import type { Post } from "@repo/db/data";

export async function tags(posts: Post[]) {
  let allTags: string[] = [];
  let uniqueTags: string[] = [];

  allTags = posts
    .map(post => post.tags.split(",")) 
    .flat()
    .map(tag => tag.trim().toLowerCase());
   
  uniqueTags = [...new Set(allTags)].sort();
 
  return uniqueTags.map(tag => ({
    name: tag,
    count: allTags.filter(t => t === tag).length,
  }));
}
