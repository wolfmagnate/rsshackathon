"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileText, BookOpen, X } from "lucide-react"
import { useState } from "react"
import AppHeader from "@/components/shared/AppHeader"
import AppFooter from "@/components/shared/AppFooter"
import { allExamsData, Material } from "@/lib/mock-data"
import { useAppContext } from "@/context/AppContext"

function GratitudePopup({
  isOpen,
  onClose,
  authorName,
  onDownload,
}: {
  isOpen: boolean
  onClose: () => void
  authorName: string
  onDownload: (emoji: string, message: string) => void
}) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("")
  const gratitudeTemplates = [
    "ありがとう！",
    "本当に助かります！",
    "感謝です！",
    "ありがとうございます！",
    "大切に使わせていただきます！",
  ]
  const [message, setMessage] = useState(
    () => gratitudeTemplates[Math.floor(Math.random() * gratitudeTemplates.length)]
  )
  const [animatingEmoji, setAnimatingEmoji] = useState<string>("")

  const emojis = ["👍", "❤️", "🙏", "😊", "🎉", "✨"]

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji)
    setAnimatingEmoji(emoji)
    setTimeout(() => setAnimatingEmoji(""), 300)
  }

  const handleDownload = () => {
    onDownload(selectedEmoji, message)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-bold text-white text-balance pr-8">過去問を共有してくれた人に感謝しましょう！</h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-sm text-gray-600 text-balance">
            この過去問をダウンロードするには @{authorName} さんに感謝を伝える必要があります
          </p>

          {/* Emoji Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">感謝の気持ちを絵文字で表現</label>
            <div className="grid grid-cols-6 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`
                    relative h-12 w-12 rounded-xl border-2 transition-all duration-200
                    ${
                      selectedEmoji === emoji
                        ? "border-green-500 bg-green-50 scale-110"
                        : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                    }
                    ${animatingEmoji === emoji ? "animate-bounce" : ""}
                  `}
                >
                  <span className="text-xl">{emoji}</span>
                  {selectedEmoji === emoji && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">メッセージ</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={2}
              maxLength={30}
              placeholder="感謝のメッセージを入力..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleDownload}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!selectedEmoji || !message.trim()}
            >
              <Download className="h-4 w-4 mr-2" />
              ダウンロード
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page({ params }: { params: { classId: string } }) {
  const { classId } = params
  const examData = allExamsData[classId as keyof typeof allExamsData]
  const { currentUser, sendThankYou } = useAppContext()

  const [popupState, setPopupState] = useState<{
    isOpen: boolean
    material: Material | null
    year: number | null
  }>({
    isOpen: false,
    material: null,
    year: null,
  })

  const handleOpenPopup = (material: Material, year: number) => {
    if (currentUser === 'receiver') {
        alert("感謝を伝えるには、「感謝を伝える人」アカウントに切り替えてください。");
        return;
    }
    setPopupState({
      isOpen: true,
      material: material,
      year: year,
    })
  }

  const handleActualDownload = (emoji: string, message: string) => {
    if (!popupState.material || !popupState.year || !examData) return

    console.log(`Download item ${popupState.material.id}`)
    
    const notificationPayload = {
        receiverName: popupState.material.author,
        senderName: "user_giver", // This would be dynamic in a real app
        courseName: examData.courseName,
        examType: `${popupState.year}年 ${popupState.material.semester} ${popupState.material.type === "exam" ? "過去問" : "解答解説"}`,
        emoji,
        message,
    };

    // Asynchronously process the thank you note via API
    fetch('/api/thanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationPayload),
    })
    .then(res => {
        if (!res.ok) {
            console.error("API failed. Falling back to original message.");
            return Promise.resolve(notificationPayload);
        }
        return res.json();
    })
    .then(processedData => {
        sendThankYou(processedData);
    })
    .catch(error => {
        console.error('Fetch failed. Falling back to original message:', error);
        sendThankYou(notificationPayload);
    });
  }

  const handleClosePopup = () => {
    setPopupState({
      isOpen: false,
      material: null,
      year: null,
    })
  }

  if (!examData) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader className="bg-white border-gray-200">
          <h1 className="text-lg font-bold text-center text-balance text-gray-900">
            エラー
          </h1>
        </AppHeader>
        <main className="px-4 py-6 max-w-md mx-auto text-center">
          <p>指定された授業の情報が見つかりませんでした。</p>
        </main>
        <AppFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader className="bg-white border-gray-200">
        <h1 className="text-lg font-bold text-center text-balance text-gray-900">過去問解答解説検索</h1>
      </AppHeader>

      <main className="px-4 py-6 max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2 text-balance">{examData.courseName}</h2>
          <div className="h-1 w-16 bg-green-500 rounded-full"></div>
        </div>

        <div className="space-y-6">
          {examData.years.map((yearData) => (
            <section key={yearData.year} className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-foreground">{yearData.year}年度</h3>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {yearData.materials.length > 0 ? (
                <div className="space-y-2">
                  {yearData.materials.map((material) => (
                    <Card key={material.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="px-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              {material.type === "exam" ? (
                                <FileText className="h-6 w-6 text-green-600" />
                              ) : (
                                <BookOpen className="h-6 w-6 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-base font-medium text-foreground truncate">
                                {yearData.year}年 {material.semester} by @{material.author}
                              </div>
                              <div className="text-sm font-semibold text-green-700 mt-1">
                                {material.type === "exam" ? "過去問" : "解答解説"}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="default"
                            onClick={() => handleOpenPopup(material, yearData.year)}
                            className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0 min-w-[80px] h-10"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">DL</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="text-muted-foreground text-sm">資料なし</div>
                </div>
              )}
            </section>
          ))}
        </div>
      </main>

      <GratitudePopup
        isOpen={popupState.isOpen}
        onClose={handleClosePopup}
        authorName={popupState.material?.author || ""}
        onDownload={handleActualDownload}
      />
      <AppFooter />
    </div>
  )
}
