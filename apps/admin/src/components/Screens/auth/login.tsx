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
  // Add state for error message
  const [error, setError] = useState<string | null>(null);  // Handle form submission
  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Clear any previous errors
    setError(null);
    
    // Set loading state to show the indicator
    setIsLoading(true);
    
    try {
      // Get input values
      const inputUsername = userRef.current?.value;
      const inputPassword = passwordRef.current?.value;
      
      // Validate input exists
      if (!inputUsername || !inputPassword) {
        setError("Username and password are required");
        setIsLoading(false);
        return;
      }
      
      // Instead of doing client-side validation, we'll send credentials to the server
      console.log("Attempting login with:", { username: inputUsername });
      
      // Make API call to login endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send user credentials
        body: JSON.stringify({
          username: inputUsername,
          password: inputPassword,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful, token received");
        
        // Brief delay to show success state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect to home page on successful login
        window.location.href = "/";
      } else {
        // Parse error message from response
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while trying to log in. Please try again.");
      setIsLoading(false);
    }
  }

  // Render login form
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md">
        <form onSubmit={submitHandler} className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6 w-full flex justify-center">
            <Image src="/wsubanner.jpg" alt="WSU Banner" width={384} height={192} className="rounded-md object-contain" />
          </div>
          <h1 className="pb-4 text-2xl font-bold text-gray-800">Sign in to your account</h1>
          
          {error && (
            <div className="w-full bg-red-50 text-red-700 p-3 mb-4 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm font-semibold text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>                <input
                  id="username"
                  type="text"
                  className="pl-10 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631]"
                  ref={userRef}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>                <input
                  id="password"
                  type="password"
                  className="pl-10 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#a31631] focus:border-[#a31631]"
                  ref={passwordRef}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 mb-2">
              <div className="flex items-center">                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#a31631] focus:ring-[#a31631] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>              <a href="#" className="text-sm font-medium text-[#a31631] hover:text-[#853846]">
                Forgot your password?
              </a>
            </div>            <button 
              type="submit" 
              className={`mt-2 w-full rounded-md p-2 text-white font-medium flex items-center justify-center transition-colors duration-300 ${isLoading ? 'bg-gray-400' : 'bg-[#a31631] hover:bg-[#853846] focus:ring-2 focus:ring-offset-2 focus:ring-[#a31631]'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>          </div>
        </form>
      </div>
      
      {/* Loading overlay with centered logo and progress indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
          <Image src="/wsulogo.png" alt="WSU Logo" width={100} height={100} className="mb-6" />          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full animate-pulse w-full"
              style={{ 
                backgroundColor: '#a31631',
                animation: 'progress 1.5s ease-in-out infinite'
              }}
            ></div>
          </div>
          <p className="mt-4 text-gray-700 font-medium">Signing in to your account...</p>
          <style jsx>{`
            @keyframes progress {
              0% { width: 0%; }
              50% { width: 100%; }
              100% { width: 0%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
