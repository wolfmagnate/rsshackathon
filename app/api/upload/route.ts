import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // This is a dummy route. We are just confirming the file was received.
    console.log("File received in /api/upload:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    return NextResponse.json({ message: "File received successfully" });

  } catch (error) {
    console.error("API Error in /api/upload:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
