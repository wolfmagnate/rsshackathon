"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import type { Notification } from "@/context/AppContext" // アプリケーションの型定義に合わせてパスを調整してください

// --- ヘルパーコンポーネント (ファイル内部でのみ使用) ---

function AnimatedEmoji({
  emoji,
  isAnimating,
  isNew,
}: {
  emoji: string
  isAnimating: boolean
  isNew?: boolean
}) {
  return (
    <div className="relative">
      {isNew && (
        <>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-0 left-0 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-500"></div>
        </>
      )}

      <div
        className={`
          text-2xl transition-all duration-500 ease-out cursor-pointer
          ${isNew ? "animate-float-glow" : "animate-gentle-float"}
          ${isAnimating ? "animate-celebration scale-150 rotate-12" : ""}
          hover:scale-110 hover:rotate-6
        `}
        style={{
          filter: isNew ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" : "none",
          animation: isNew
            ? "float-glow 2s ease-in-out infinite, rainbow-glow 3s ease-in-out infinite"
            : "gentle-float 4s ease-in-out infinite",
        }}
      >
        {emoji}
      </div>
    </div>
  )
}


// --- メインコンポーネント ---

export default function NotificationCard({
  notification,
  onCardClick,
}: {
  notification: Notification
  onCardClick: (id: number) => void
}) {
  const [isAnimating, setIsAnimating] = useState(false)

  // 絵文字クリック時にカード全体のクリックイベントが発火しないようにする
  const handleEmojiClick = (e: React.MouseEvent) => {
    e.stopPropagation() 
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1000)
  }

  return (
    <div onClick={() => onCardClick(notification.id)} className="cursor-pointer">
      <Card
        className={`
          hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary relative overflow-hidden
          ${notification.isNew ? "animate-shimmer bg-gradient-to-r from-background via-primary/15 to-background bg-[length:200%_100%]" : "bg-white"}
        `}
        style={{
          boxShadow: notification.isNew
            ? "0 0 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
            : undefined,
        }}
      >
        {notification.isNew && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-slide-shine"></div>
        )}

        <CardContent className="px-4 py-1 relative z-10">
          <div className="flex items-start gap-3">
            <button
              onClick={handleEmojiClick}
              className="flex-shrink-0 p-1 rounded-full hover:bg-accent/20 transition-all duration-300 hover:scale-105"
            >
              <AnimatedEmoji emoji={notification.emoji} isAnimating={isAnimating} isNew={notification.isNew} />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p
                  className={`font-bold text-foreground text-base leading-tight text-balance ${notification.isNew ? "animate-pulse-glow" : ""}`}
                >
                  "{notification.message}"
                </p>
                {notification.isNew && (
                  <div className="flex-shrink-0 relative">
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse delay-300"></div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">@{notification.senderName}</span> さんから
                </p>
                <p className="text-sm font-medium text-primary">
                  {notification.courseName} - {notification.examType}
                </p>
                <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


// --- スタイル定義 ---

export function NotificationCardStyles() {
  return (
    <style jsx global>{`
      @keyframes float-glow {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-8px) rotate(2deg); }
        50% { transform: translateY(-4px) rotate(-1deg); }
        75% { transform: translateY(-6px) rotate(1deg); }
      }
      
      @keyframes gentle-float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-3px) rotate(1deg); }
      }
      
      @keyframes celebration {
        0% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.3) rotate(5deg); }
        50% { transform: scale(1.5) rotate(-5deg); }
        75% { transform: scale(1.2) rotate(3deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      
      @keyframes rainbow-glow {
        0% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5)); }
        25% { filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.5)); }
        50% { filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.5)); }
        75% { filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.5)); }
        100% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5)); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes slide-shine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes pulse-glow {
        0%, 100% { text-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
        50% { text-shadow: 0 0 10px rgba(59, 130, 246, 0.6); }
      }
      
      .animate-float-glow { animation: float-glow 2s ease-in-out infinite, rainbow-glow 3s ease-in-out infinite; }
      .animate-gentle-float { animation: gentle-float 4s ease-in-out infinite; }
      .animate-celebration { animation: celebration 1s ease-out; }
      .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
      .animate-slide-shine { animation: slide-shine 2s ease-in-out infinite; }
      .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    `}</style>
  )
}
