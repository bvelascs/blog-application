// Import the login function from the auth utilities
import { login } from '../../../utils/auth';
import { NextResponse } from 'next/server';
 
/**
 * API route for Playwright test authentication
 * This endpoint is specifically designed for test automation
 */
export async function POST(req: Request) {
  try {
    // Extract the password from the request body
    const { password } = await req.json();
    
    console.log("Test authentication attempt with password length:", password?.length);
    
    // Simple validation for testing - accepting "123" or PASSWORD env var
    if (password !== "123" && password !== process.env.PASSWORD) {
      console.log("Test authentication failed - invalid password");
      // If password doesn't match, return 401 Unauthorized response
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Test authentication successful");
    
    // Use a standard test username for the token
    const username = "testuser";
    
    // Create JWT token and set cookie
    const token = await login(username);
    
    // Also set a fallback cookie for compatibility with tests
    const response = NextResponse.json({ 
      message: "Login successful",
      token
    });
    
    // Add the password cookie as fallback for tests that might expect it
    response.cookies.set("password", "123", {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    console.log("Test auth: Set both JWT token and fallback cookie");
    
    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
