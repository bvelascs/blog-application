import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check if AWS environment variables are properly set
    const awsConfig = {
      region: process.env.AWS_REGION,
      bucketName: process.env.AWS_BUCKET_NAME,
      // Don't show actual credentials, just check if they exist
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
    };
    
    return NextResponse.json({ 
      status: "AWS Configuration Check",
      config: awsConfig,
      message: "This endpoint checks if AWS environment variables are properly loaded"
    });
  } catch (error) {
    console.error("Error checking config:", error);
    return NextResponse.json({ error: "Error checking configuration" }, { status: 500 });
  }
}
