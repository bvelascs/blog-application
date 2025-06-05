import { PrismaClient } from "@prisma/client";
import { posts } from "./data.js";

const prisma = new PrismaClient();

// Export the seed function so it can be imported elsewhere
export async function seed() {
  console.log("Seeding database...");

  // Delete all likes first to avoid foreign key constraint violations
  await prisma.like.deleteMany({});
  console.log("Deleted existing likes");
  
  // Delete all existing posts
  await prisma.post.deleteMany({});
  console.log("Deleted existing posts");
    // Create all posts from data.ts and their likes
  for (const post of posts) {
    // Create post without the likes field which isn't compatible with Prisma schema
    const { likes, ...postData } = post;
    
    // Create the post first
    const createdPost = await prisma.post.create({
      data: postData,
    });
      // Then create the specified number of likes for this post
    if (likes && likes > 0) {
      // Create likes one by one (SQLite doesn't support createMany)
      for (let i = 0; i < likes; i++) {
        await prisma.like.create({
          data: {
            postId: createdPost.id,
            userIP: `192.168.1.${i + 1}` // Generate mock IPs
          }
        });
      }
      
      console.log(`Created ${likes} likes for post "${createdPost.title}"`);
    }
  }
  console.log(`Created ${posts.length} posts`);

  console.log("Database seeded successfully!");
}

// Keep the main function to allow running the seed directly
async function main() {
  await seed();
  await prisma.$disconnect();
}

// ES modules don't have require.main === module
// Using import.meta.url to check if this is the main module
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current file's path and the process's entry point
const currentFilePath = fileURLToPath(import.meta.url);
const entryPoint = process.argv[1] ? path.resolve(process.argv[1]) : '';

// Check if this module is being run directly
if (entryPoint === currentFilePath) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
