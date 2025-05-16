// This file defines an API route for handling user logout requests

// Import the logout utility function from the auth utilities file
import { logout } from '../../../../utils/auth';

// Define a POST endpoint handler function for handling logout requests
export async function POST(

) {
  // Call the logout function to clear any existing session/authentication
  await logout();

  // Return a JSON response indicating successful logout
  return Response.json({ message: "Logged out successfully" });
}