import { NextResponse } from "next/server";
import { generateSafeComment } from "@/lib/llm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, ...notificationData } = body;

    if (typeof message !== 'string') {
      return NextResponse.json({ error: "Message must be a string" }, { status: 400 });
    }

    const safeMessage = await generateSafeComment(message);

    const processedNotification = {
      ...notificationData,
      message: safeMessage,
    };
    
    return NextResponse.json(processedNotification);

  } catch (error) {
    console.error("API Error in /api/thanks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
