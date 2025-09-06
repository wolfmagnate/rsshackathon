"use client"

import { Search, Bell, Upload, User } from "lucide-react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export default function AppFooter() {
  const { currentUser, notifications } = useAppContext();

  const newNotificationCount = notifications.filter(n => n.isNew && n.receiverName !== 'user_giver').length;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="px-4 py-3">
        <nav className="flex items-center justify-around max-w-md mx-auto">
          <Link href="/" className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent/50 transition-colors">
            <Search className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">検索</span>
          </Link>

          <Link href="/notifications" className="relative flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent/50 transition-colors">
            {currentUser === 'receiver' && newNotificationCount > 0 && (
              <div className="absolute top-1 right-1/2 translate-x-4 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                {newNotificationCount}
              </div>
            )}
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">通知</span>
          </Link>

          <Link href="/upload" className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent/50 transition-colors">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">アップロード</span>
          </Link>

          <Link href="/profile" className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent/50 transition-colors">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">プロフィール</span>
          </Link>
        </nav>
      </div>
    </footer>
  );
}
