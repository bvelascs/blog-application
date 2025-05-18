// this file is part of the admin application
// for handling user authentication and login functionality
"use client";

import React from "react";
import Image from "next/image";

// LoginScreen component that handles user authentication
const LoginScreen = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  // Refs to access input field values
  const userRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  // Handle form submission
  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Validate password
    if (password === passwordRef.current!.value) {
      // Make API call to login endpoint
      fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send user credentials
        body: JSON.stringify({
          username: userRef.current!.value,
          password: passwordRef.current!.value,
        }),
      }).then((loginResponse) => {
        if (loginResponse.ok) {
          // Redirect to home page on successful login
          window.location.href = "/";
        } else {
          // Handle failed login attempt
          console.error("Login failed");
        }
      });
    } else {
      // Show error for invalid credentials
      alert("Invalid username or password");
    }
  }  // Render login form
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form onSubmit={submitHandler} className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6 w-full flex justify-center">
          <Image src="/wsubanner.jpg" alt="WSU Banner" width={384} height={192} className="rounded-md object-contain" />
        </div>
        <h1 className="pb-4 text-2xl font-bold">Sign in to your Admin account</h1>
        <div className="flex w-96 flex-col gap-3">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-semibold">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="rounded border border-gray-300 p-2"
              ref={userRef}
              // required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="rounded border border-gray-300 p-2"
              ref={passwordRef}
              required
            />
          </div>

          <button type="submit" className="bg-wsu rounded p-2 text-white">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
