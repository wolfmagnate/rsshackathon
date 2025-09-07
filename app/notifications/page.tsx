"use client"

import { Bell, Sparkles, UserCheck } from "lucide-react"
import { useState } from "react"
import AppHeader from "@/components/shared/AppHeader"
import AppFooter from "@/components/shared/AppFooter"
import { useAppContext } from "@/context/AppContext"
import NotificationCard, { NotificationCardStyles } from "@/components/notifications/NotificationCard"
import ConfettiOverlay, { ConfettiOverlayStyles } from "@/components/effects/ConfettiOverlay"

export default function Page() {
  const { currentUser, notifications, markAsRead } = useAppContext()
  
  const [animatingCardId, setAnimatingCardId] = useState<number | null>(null)

  const receivedNotifications = notifications.filter(n => n.receiverName !== 'user_giver');
  const newNotificationCount = receivedNotifications.filter((n) => n.isNew).length

  const handleNotificationClick = (id: number) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.isNew && animatingCardId !== id) {
      setAnimatingCardId(id);

      setTimeout(() => {
        markAsRead(id);
        setAnimatingCardId(null);
      }, 1500);
    } else {
      // 既読カードの場合は、元のコード通り何もしない（もしくは必要に応じて既読でもmarkAsReadを呼ぶ）
      // markAsRead(id) // 必要であればこの行を有効化
    }
  }

  if (currentUser === 'giver') {
      return (
          <div className="min-h-screen bg-background flex flex-col">
              <AppHeader>
                  <div className="flex items-center justify-center gap-2">
                      <Bell className={`h-5 w-5 text-primary`} />
                      <h1 className="text-lg font-bold text-foreground text-balance">感謝の通知</h1>
                  </div>
              </AppHeader>
              <main className="flex-1 px-4 py-6 max-w-md mx-auto pb-24 flex flex-col items-center justify-center text-center">
                  <UserCheck className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">通知はありません</h2>
                  <p className="text-muted-foreground text-balance">
                      「感謝される人」アカウントに切り替えると、受け取った感謝の通知を確認できます。
                  </p>
              </main>
              <AppFooter />
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader>
        <div className="flex items-center justify-center gap-2">
          <Bell className={`h-5 w-5 text-primary ${newNotificationCount > 0 ? "animate-wiggle" : ""}`} />
          <h1 className="text-lg font-bold text-foreground text-balance">感謝の通知</h1>
        </div>
      </AppHeader>

      <main className="flex-1 px-4 py-6 max-w-md mx-auto pb-20">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary px-4 py-2 rounded-full mb-3">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">あなたの貢献に感謝！</span>
          </div>
          <p className="text-sm text-muted-foreground text-balance">
            過去問をダウンロードした人からの感謝メッセージです
          </p>
        </div>

        {receivedNotifications.length > 0 ? (
            <div className="space-y-3 mb-8">
            {receivedNotifications.slice().reverse().map((notification) => (
                <div key={notification.id} className="relative">
                  <NotificationCard 
                    notification={notification} 
                    onCardClick={handleNotificationClick} 
                  />
                  {animatingCardId === notification.id && <ConfettiOverlay />}
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-10">
                <p className="text-muted-foreground">まだ感謝の通知はありません。</p>
            </div>
        )}
      </main>

      <AppFooter />
      
      <NotificationCardStyles />
      <ConfettiOverlayStyles />

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        @keyframes gentle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }
        .animate-gentle-pulse { animation: gentle-pulse 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </div>
  )
}
