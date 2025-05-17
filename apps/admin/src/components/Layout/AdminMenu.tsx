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
    <div className="flex h-16 w-screen items-center justify-between shadow-sm">
      {/* Content container with padding and flex layout */}
      <div className="container mx-auto flex h-full items-center justify-between px-4">        {/* Blog title/logo section */}
        <h1 className="flex w-fit items-center justify-center space-x-4">
          <Link href={"/"} className="flex items-center gap-3 w-full">
            <Image src="/wsulogo.png" alt="WSU Logo" width={40} height={40} />
            <span className="text-xl font-bold">Admin of Full Stack Blog</span>
          </Link>
        </h1>

        {/* Navigation buttons container */}
        <div>
          {/* Create Post button with link */}
          <Link
            href={"/posts/create"}
            className="cursor-pointer rounded-md border-none px-4 py-2"
          >
            Create Post
          </Link>

            {/* Logout button */}
          <button
            onClick={logoutHandler}
            className="bg-wsu hover:bg-wsu-light cursor-pointer rounded-md border-none px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
