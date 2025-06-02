"use client"; // Marks this as a client-side component for Next.js

import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";

const AdminMenu = () => {
  // Handler function for user logout
  async function logoutHandler() {
    // Send POST request to logout endpoint
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // If logout successful, redirect to home page
    // Otherwise, log error to console
    if (res.ok) {
      redirect("/");
    } else {
      console.error("Logout failed");
    }
  }
  return (
    // Main navigation container with full width and shadow
    <div className="bg-[#a31631] text-white w-screen shadow-lg">
      {/* Content container with padding and flex layout */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Blog title/logo section */}
        <h1 className="flex w-fit items-center justify-center space-x-4">
          <Link href={"/"} className="flex items-center gap-3 w-full">
            <div className="bg-white p-1 rounded">
              <Image src="/wsulogo.png" alt="WSU Logo" width={40} height={40} className="object-contain" />
            </div>
            <span className="text-xl font-bold">WSU Admin Portal</span>
          </Link>
        </h1>

        {/* Navigation buttons container */}
        <div className="flex items-center gap-4">
          {/* Create Post button with link */}
          <Link
            href={"/posts/create"}
            className="bg-white text-[#a31631] hover:bg-gray-100 cursor-pointer rounded-md border-none px-4 py-2 font-medium transition-colors"
          >
            Create Post
          </Link>

          {/* Logout button */}
          <button
            onClick={logoutHandler}
            className="bg-[#333f48] hover:bg-[#5a6a76] cursor-pointer rounded-md border-none px-4 py-2 text-white font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
