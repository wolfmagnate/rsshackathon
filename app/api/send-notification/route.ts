import { NextResponse } from 'next/server';
import webpush, { PushSubscription } from 'web-push';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
  console.error("VAPID keys are not defined in environment variables. Please check your .env.local file.");
} else {
    webpush.setVapidDetails(
      'mailto:test@example.com', // 通知に関する連絡先メールアドレス
      vapidPublicKey,
      vapidPrivateKey
    );
}

interface RequestBody {
  subscription: PushSubscription;
  payload: {
    title: string;
    body: string;
  };
}

export async function POST(req: Request) {
  // VAPIDキーが設定されていない場合は、APIを機能させない
  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json(
      { error: 'VAPID keys are not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const { subscription, payload }: RequestBody = await req.json();

    if (!subscription) {
      return NextResponse.json(
        { error: 'Missing subscription object' },
        { status: 400 }
      );
    }

    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );

    return NextResponse.json(
      { message: 'Notification sent successfully.' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error sending notification:', error);
    
    if (error.statusCode) {
      return NextResponse.json(
        { error: error.body || 'Failed to send notification' },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
