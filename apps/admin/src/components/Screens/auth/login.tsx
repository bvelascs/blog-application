// this file is part of the admin application
// for handling user authentication and login functionality
"use client";

import React, { useState } from "react";
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
  // Add state for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Set loading state to true to show the indicator
    setIsLoading(true);
    
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
          setIsLoading(false);
        }
      }).catch(() => {
        setIsLoading(false);
      });
    } else {
      // Show error for invalid credentials
      alert("Invalid username or password");
      setIsLoading(false);
    }
  }

  // Render login form
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form onSubmit={submitHandler} className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6 w-full flex justify-center">
          <Image src="/wsubanner.jpg" alt="WSU Banner" width={384} height={192} className="rounded-md object-contain" />
        </div>
        <h1 className="pb-4 text-2xl font-bold">Sign in to your account</h1>
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

          <button 
            type="submit" 
            className="bg-wsu rounded p-2 text-white flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          
          {/* Loading overlay with centered logo and progress indicator */}
          {isLoading && (
            <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
              <Image src="/wsulogo.png" alt="WSU Logo" width={80} height={80} className="animate-pulse mb-4" />
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-wsu animate-progress-bar" style={{ width: '100%' }}></div>
              </div>
              <p className="mt-4 text-gray-700 font-medium">Signing in...</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
