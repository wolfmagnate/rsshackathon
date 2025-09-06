"use client"

import AppHeader from "@/components/shared/AppHeader"
import AppFooter from "@/components/shared/AppFooter"
import { User, Construction } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader>
        <div className="flex items-center justify-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">プロフィール</h1>
        </div>
      </AppHeader>
      <main className="flex-1 px-4 py-6 max-w-md mx-auto pb-20 flex flex-col items-center justify-center text-center">
        <Construction className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">ページ準備中</h2>
        <p className="text-muted-foreground">
          このページは現在作成中です。デモ用のため、実装されていません。
        </p>
      </main>
      <AppFooter />
    </div>
  )
}
