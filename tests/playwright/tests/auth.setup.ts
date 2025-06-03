import { test as setup } from "@playwright/test";
import fs from "fs";

////////////////////////////////////////
// Authentication for Assignment 2
// Delete the code block below if you are not using it
////////////////////////////////////////

// setup(
//   "authenticate assignment 2",
//   { tag: "@a2" },
//   async ({ page, playwright }) => {
//     const authFile = ".auth/user.json";
//     const content = {
//       cookies: [
//         {
//           name: "password",
//           value: "123",
//           domain: "localhost",
//           secure: false,
//           expires: -1,
//           path: "/",
//           httpOnly: false,
//           sameSite: "Lax",
//         },
//       ],
//     };
//     fs.writeFileSync(authFile, JSON.stringify(content, null, 2));
//   },
// );

////////////////////////////////////////////////////////
// Authentication for Assignment 3
// Uncomment once you start working on the assignment 3
////////////////////////////////////////////////////////

setup(
  "authenticate assignment 3",
  { tag: "@a3" },
  async ({ playwright }) => {
    const authFile = ".auth/user.json";

    const apiContext = await playwright.request.newContext();

    // Make the auth request to get the JWT token
    const response = await apiContext.post("/api/auth", {
      data: JSON.stringify({ password: "123" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Debug auth response
    console.log("Auth response status:", response.status());
    
    if (response.ok()) {
      console.log("Authentication successful for tests");
      
      // Get the response body with the token
      const responseBody = await response.json();
      console.log("Token received:", responseBody.token ? "Yes" : "No");
      
      // Store the auth token cookie manually
      await apiContext.storageState({ path: authFile });
      
      // Read the storage state file
      const storageState = JSON.parse(fs.readFileSync(authFile, 'utf8'));
      
      // Check if auth_token cookie exists
      const hasAuthToken = storageState.cookies?.some((c: any) => c.name === 'auth_token');
      console.log("Auth token in cookies:", hasAuthToken ? "Yes" : "No");
      
      if (!hasAuthToken && responseBody.token) {
        // If cookie wasn't automatically set but we have a token, add it manually
        if (!storageState.cookies) storageState.cookies = [];
        storageState.cookies.push({
          name: "auth_token",
          value: responseBody.token,
          domain: "localhost",
          path: "/",
          expires: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
          httpOnly: true,
          secure: false,
          sameSite: "Lax"
        });
        
        // Write back the modified storage state
        fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
        console.log("Manually added auth_token to storage state");
      }
    } else {
      console.error("Authentication failed:", await response.text());
    }
  },
);
