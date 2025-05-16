// Import the login function from the auth utilities
import { login } from '../../../utils/auth';
 
// Define a POST endpoint handler for authentication
export async function POST(req: Request) {
  // Extract the password from the request body
  const { password } = await req.json();
  
  if (password !== "123") {
    // If password doesn't match, return 401 Unauthorized response
    return new Response("Unauthorized", { status: 401 });
  }

  // Get the auth token from environment variables
  const authToken = process.env.AUTH_TOKEN || "default_token";
  
  // Call the login function with the auth token to establish a session
  await login(authToken);
  
  // Return a success response as JSON
  return Response.json({ message: "Login successful" });
}
