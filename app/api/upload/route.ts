import { MAX_FILE_SIZE } from "@/lib/constants";
import { auth } from "@clerk/nextjs/server";
import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  
  try {

    const body = (await request.json()) as HandleUploadBody;
    //form json respone
    const jsonResponse = await handleUpload({
      token: process.env.BOOKIFIED_READ_WRITE_TOKEN!,
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Here you can implement any logic before generating the token, such as authentication or validation.
        // For example, you could check if the user is authenticated and has permission to upload files.
        // If the user is not authenticated, you could throw an error to prevent the upload.}})
        const { userId } = await auth();

        if (!userId) {
          throw new Error("Unauthorized: User not authenticated");
        }

        return {
          // You can add custom claims or modify the token payload here if needed.
          allowedContentTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
          ], // Example: restrict to PDF and image files
          addRandomSuffix: true, // Optionally add a random suffix to the filename to prevent collisions
          maximumSizeInBytes: MAX_FILE_SIZE, // Example: set a maximum file size limit (e.g., 50MB)
          tokenPayload: JSON.stringify({ userId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This function is called after the upload is completed. You can perform any post-upload actions here, such as saving file metadata to a database or triggering other processes.
        console.log("File uploaded to blob:", blob.url);
        //parse the token payload to get the user ID
        const payload = tokenPayload ? JSON.parse(tokenPayload) : null;
        const userId = payload?.userId;
        console.log("Upload completed by user ID:", userId);
        //TODO: POSThung
      },
    });
    // You can return any response data here if needed. This will be sent back to the client after the upload is completed.
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("Unauthorized") ? 401 : 500;
    console.error("Upload error:", message);
    const clientMessage = status === 401 ? "Unauthorized" : "Upload failed";
    return NextResponse.json({ error: clientMessage }, { status });
  }
}
