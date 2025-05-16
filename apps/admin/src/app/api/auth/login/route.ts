
import { login } from '../../../../utils/auth';
// Define a POST endpoint handler function
export async function POST(
  req: Request  // Takes a Request object as parameter
) {
  // Extract username and password from the request body using destructuring
  const { username, password } = await req.json();
  
  // Create an auth token by combining environment variable with credentials
  const authToken = process.env.AUTH_TOKEN + username + password;
  
  // Call the login function with the generated auth token
  await login(authToken!);

  // Return a JSON response indicating successful login
  return Response.json({ message: "Login successfully" });
}