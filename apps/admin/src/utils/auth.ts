// Import the cookies utility from Next.js headers module
import { cookies } from "next/headers";

// Function to check if a user is logged in
// Returns true if auth_token cookie exists, false otherwise
export async function isLoggedIn() {
  const userCookies = await cookies();
  return userCookies.has("auth_token");
}

// Function to log in a user by setting an auth token cookie
// Parameters:
// - token: The authentication token to store in cookies
export async function login(token: string) {
  const userCookies = await cookies();
  userCookies.set("auth_token", token, {
    httpOnly: true,   
    maxAge: 60 * 60 * 24 * 7, 
  });
}

// Function to log out a user by removing the auth token cookie
export async function logout() {
  const userCookies = await cookies();
  userCookies.delete("auth_token");  // Remove the auth_token cookie
}