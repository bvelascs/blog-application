
// Importing the seed function from a database utility package
import { seed } from "@repo/db/seed";
// Importing NextResponse to handle API responses in Next.js
import { NextResponse } from "next/server";

// Defining a GET request handler - this function runs when someone hits this API endpoint
export async function GET() {
  // only allow seeding if E2E (End-to-End testing)
  if (!process.env.E2E) {
    // 501 status code (Not Implemented) if not in testing environment
    return new Response("Not Available", { status: 501 });
  }

  // Execute the database seeding function
  await seed();
  // Return a success response with status 200 and a JSON message
  return NextResponse.json({ message: "Seeded" }, { status: 200 });
}
