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
  
  // Create all posts from data.ts
  for (const post of posts) {
    // Create post without the likes field which isn't compatible with Prisma schema
    const { likes, ...postData } = post;
    await prisma.post.create({
      data: postData,
    });
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
