"use client"; // Marks this as a client-side component for Next.js

import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";

const AdminMenu = () => {  // Handler function for user logout
  async function logoutHandler() {
    // Send POST request to logout endpoint
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // If logout successful, force navigation to home page
    // Otherwise, log error to console
    if (res.ok) {
      // Use window.location for a full page refresh to clear any cached content
      window.location.href = "/";
    } else {
      console.error("Logout failed");
    }
  }
  return (
    // Main navigation container with full width and shadow
    <div className="bg-[#a31631] text-white w-full shadow-lg">
      {/* Content container with padding and flex layout */}
      <div className="flex h-16 items-center px-6">
        {/* Blog title/logo section */}
        <h1 className="flex items-center">
          <Link href={"/"} className="flex items-center gap-3">
            <div className="bg-white p-1 rounded">
              <Image src="/wsulogo.png" alt="WSU Logo" width={40} height={40} className="object-contain" />
            </div>
            <span className="text-xl font-bold">Admin of Full Stack Blog</span>
          </Link>
        </h1>

        {/* Navigation buttons container */}
        <div className="ml-auto flex items-center gap-4">
          {/* Create Post button with link */}          <Link
            href={"/posts/create"}
            className="bg-white dark:bg-gray-800 text-[#a31631] hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md border-none px-4 py-2 font-medium transition-colors"
          >
            Create Post
          </Link>

          {/* Logout button */}
          <button
            onClick={logoutHandler}
            className="bg-[#333f48] hover:bg-[#5a6a76] dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer rounded-md border-none px-4 py-2 text-white font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
