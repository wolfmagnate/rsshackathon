"use client"

function MegaConfettiPiece({
  delay,
  color,
  shape,
  startX,
}: {
  delay: number
  color: string
  shape: string
  startX: number
}) {
  return (
    <div
      className="absolute animate-mega-confetti-fall"
      style={{
        left: `${startX}%`,
        top: "-40px",
        animationDelay: `${delay}ms`,
        color: color,
        fontSize: "24px",
        zIndex: 100,
      }}
    >
      {shape}
    </div>
  )
}

function GiantCelebrationEmoji({
  delay,
  startX,
  emoji,
}: {
  delay: number
  startX: number
  emoji: string
}) {
  return (
    <div
      className="absolute animate-giant-celebration-float"
      style={{
        left: `${startX}%`,
        top: "60%",
        animationDelay: `${delay}ms`,
        fontSize: "48px",
        zIndex: 90,
      }}
    >
      {emoji}
    </div>
  )
}

function ExplosiveBurst({ delay }: { delay: number }) {
  const burstEmojis = ["🎉", "🎊", "✨", "💥", "🌟", "⭐", "💫", "🎈"]
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {burstEmojis.map((emoji, i) => (
        <div
          key={i}
          className="absolute animate-explosive-burst"
          style={{
            animationDelay: `${delay + i * 25}ms`,
            fontSize: "36px",
            transform: `rotate(${i * 45}deg) translateX(0px)`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  )
}


export default function ConfettiOverlay() {
  const megaConfettiShapes = ["🎉", "🎊", "✨", "⭐", "💫", "🌟", "🎈", "🎁"]
  const confettiColors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#a8e6cf", "#ffd93d"]
  const celebrationEmojis = ["🎊", "🎉", "🥳", "🎈", "🏆", "💎", "⭐", "🌟"]

  return (
    // 親要素いっぱいに広がり、クリックを妨げないレイヤー
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 1. 紙吹雪 */}
      {Array.from({ length: 40 }).map((_, i) => (
        <MegaConfettiPiece
          key={`mega-confetti-${i}`}
          delay={i * 15}
          color={confettiColors[i % confettiColors.length]}
          shape={megaConfettiShapes[i % megaConfettiShapes.length]}
          startX={Math.random() * 100}
        />
      ))}

      {/* 2. 浮かび上がる絵文字 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <GiantCelebrationEmoji
          key={`giant-${i}`}
          delay={i * 100}
          startX={10 + i * 12}
          emoji={celebrationEmojis[i % celebrationEmojis.length]}
        />
      ))}

      {/* 3. 爆発エフェクト (3回) */}
      <ExplosiveBurst delay={0} />
      <ExplosiveBurst delay={400} /> 
      <ExplosiveBurst delay={800} /> 

      {/* 4. キラキラエフェクト */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`mega-sparkle-${i}`}
          className="absolute animate-mega-sparkle-twinkle"
          style={{
            left: `${15 + i * 6}%`,
            top: `${20 + (i % 4) * 20}%`,
            animationDelay: `${i * 60}ms`,
            fontSize: "28px",
          }}
        >
          ✨
        </div>
      ))}
    </div>
  )
}

// --- スタイル定義 ---

export function ConfettiOverlayStyles() {
  return (
    <style jsx global>{`
      @keyframes mega-confetti-fall {
        0% { transform: translateY(-40px) rotate(0deg) scale(0); opacity: 1; }
        10% { transform: translateY(-20px) rotate(180deg) scale(1.2); opacity: 1; }
        100% { transform: translateY(600px) rotate(1080deg) scale(0.8); opacity: 0; }
      }
      
      @keyframes giant-celebration-float {
        0% { transform: translateY(0) scale(0) rotate(0deg); opacity: 1; }
        50% { transform: translateY(-160px) scale(1.8) rotate(180deg); opacity: 0.8; }
        100% { transform: translateY(-320px) scale(0) rotate(360deg); opacity: 0; }
      }
      
      @keyframes explosive-burst {
        0% { transform: rotate(var(--rotation, 0deg)) translateX(0px) scale(0); opacity: 1; }
        50% { transform: rotate(var(--rotation, 0deg)) translateX(120px) scale(1.8); opacity: 0.8; }
        100% { transform: rotate(var(--rotation, 0deg)) translateX(60px) scale(0); opacity: 0; }
      }
      
      @keyframes mega-sparkle-twinkle {
        0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { transform: scale(2.2) rotate(180deg); opacity: 1; }
      }

      .animate-mega-confetti-fall { animation: mega-confetti-fall 1.4s ease-in forwards; }
      .animate-giant-celebration-float { animation: giant-celebration-float 1.2s ease-out forwards; }
      .animate-explosive-burst { animation: explosive-burst 1.0s ease-out forwards; }
      .animate-mega-sparkle-twinkle { animation: mega-sparkle-twinkle 1.5s ease-in-out infinite; }
    `}</style>
  )
}
