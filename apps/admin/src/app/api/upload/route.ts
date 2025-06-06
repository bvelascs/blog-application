import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";

// Initialize S3 client
// Log environment variables to help with debugging
console.log("Environment variables check:", {
  region: process.env.AWS_REGION,
  bucketName: process.env.AWS_BUCKET_NAME,
  // Don't log actual credentials, just check if they exist
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
  // Explicitly log where we are loading from (important for debugging)
  envSource: process.env.NODE_ENV
});

// Ensure we have required environment variables
const region = process.env.AWS_REGION || "ap-southeast-2"; // Default to ap-southeast-2
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

// Double check credentials before proceeding
if (!accessKeyId || !secretAccessKey || !bucketName) {
  console.error("Missing AWS credentials:", { 
    hasAccessKey: !!accessKeyId, 
    hasSecretKey: !!secretAccessKey, 
    hasBucket: !!bucketName 
  });
}

// Force explicit values for debugging
console.log("Creating S3Client with region:", region || "ap-southeast-2");

const s3Client = new S3Client({
  region: "ap-southeast-2", // Force using a specific region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  }
});

export async function POST(req: NextRequest) {
  // Log AWS configuration for debugging
  console.log("AWS Config:", {
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
    // Don't log actual credentials, just check if they exist
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
  });
    try {
    // Additional debugging for API handler
    console.log("Upload API handler called");
    
    // Check if user is logged in
    if (!await isLoggedIn()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate unique filename with original extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    
    // Validate file type
    const allowedTypes = ["jpg", "jpeg", "png", "gif"];
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed." }, { status: 400 });
    }

    const fileName = `${uuidv4()}.${fileExtension}`;
      // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);    // Upload to S3 using hardcoded bucket name
    const awsBucket = "images-blog-application-major";
    console.log("Using bucket:", awsBucket);
    
    const command = new PutObjectCommand({
      Bucket: awsBucket,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      // Removed ACL as the bucket does not support ACLs
    });    await s3Client.send(command);
      // Create public URL using hardcoded values
    const imageUrl = `https://images-blog-application-major.s3.ap-southeast-2.amazonaws.com/${fileName}`;
      return NextResponse.json({ imageUrl });  
  } catch (error) {
    console.error("Error uploading image:", error);
    // Get more detailed error information
    const errorDetails = error instanceof Error ? 
      { message: error.message, stack: error.stack } : 
      { message: String(error) };
    
    console.error("Detailed error:", JSON.stringify(errorDetails));
    
    // Return a more descriptive error message to the client
    return NextResponse.json({ 
      error: "Failed to upload image", 
      details: errorDetails.message,
      // Include a hint if it seems like an AWS credentials issue
      possibleIssue: errorDetails.message.includes("credentials") ? 
        "AWS credentials may be invalid or expired" : 
        errorDetails.message.includes("bucket") ? 
          "AWS bucket may not exist or is not accessible" : 
          "Unknown issue"
    }, { status: 500 });
  }
}