// pages/index.js
import { useState, useEffect } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// Base64をUint8Arrayに変換するヘルパー関数
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function HomePage() {
  const [subscription, setSubscription] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Service Workerの準備ができてから購読状態を確認
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
          setIsLoading(false);
        });
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const subscribe = async () => {
    if (!VAPID_PUBLIC_KEY) {
      alert('VAPID公開鍵が設定されていません。');
      return;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      setSubscription(sub);
      setIsSubscribed(true);
      alert('Push通知を購読しました！');
    } catch (error) {
      console.error('Failed to subscribe: ', error);
      alert('Push通知の購読に失敗しました。');
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;
    try {
      await subscription.unsubscribe();
      setSubscription(null);
      setIsSubscribed(false);
      alert('Push通知の購読を解除しました。');
    } catch (error) {
      console.error('Failed to unsubscribe: ', error);
    }
  };
  
  const sendNotification = async () => {
    if (!subscription) {
      alert('まずPush通知を購読してください。');
      return;
    }

    try {
      const payload = {
        title: 'テスト通知です！',
        body: 'この通知は、あなたのブラウザから送信されました。',
      };

      const res = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription, payload }),
      });

      if (!res.ok) {
        throw new Error('Failed to send notification');
      }
      alert('通知を送信しました！');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('通知の送信に失敗しました。');
    }
  };
  
  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Push通知デモ（自分自身に送信）</h1>
      <p>このページでは、ブラウザから自分自身のブラウザにPush通知を送るテストができます。</p>
      
      {!isSubscribed ? (
        <button onClick={subscribe}>1. Push通知を購読する</button>
      ) : (
        <>
          <p>✅ 購読済みです。</p>
          <button onClick={sendNotification}>2. 自分にテスト通知を送信</button>
          <button onClick={unsubscribe} style={{ marginLeft: '10px' }}>購読を解除</button>
        </>
      )}
    </div>
  );
}
