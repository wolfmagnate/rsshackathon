"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

// Define types
export type User = "giver" | "receiver"

export interface Notification {
  id: number
  message: string
  emoji: string
  senderName: string
  receiverName: string
  courseName: string
  examType: string
  timestamp: string
  isNew: boolean
}

interface AppContextState {
  currentUser: User
  switchUser: (user: User) => void
  notifications: Notification[]
  sendThankYou: (details: Omit<Notification, "id" | "timestamp" | "isNew" | "senderName">) => void
  markAsRead: (id: number) => void
}

// Create Context
const AppContext = createContext<AppContextState | undefined>(undefined)

// Create Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>("giver")
  const [notifications, setNotifications] = useState<Notification[]>([
      {
        id: 1,
        message: "ありがとう！",
        emoji: "🙏",
        senderName: "user_giver",
        receiverName: "yamada_789",
        courseName: "データベース設計論",
        examType: "2023年前期過去問",
        timestamp: "2時間前",
        isNew: true,
      },
      {
        id: 2,
        message: "本当に助かりました！",
        emoji: "😊",
        senderName: "user_giver",
        receiverName: "sato_456",
        courseName: "アルゴリズム論",
        examType: "2023年後期解答解説",
        timestamp: "5時間前",
        isNew: true,
      },
  ])

  const switchUser = (user: User) => {
    setCurrentUser(user)
  }

  const sendThankYou = (details: Omit<Notification, "id" | "timestamp" | "isNew" | "senderName">) => {
    const newNotification: Notification = {
      ...details,
      id: Date.now(),
      timestamp: "たった今",
      isNew: true,
      senderName: "user_giver",
    }
    setNotifications((prev) => [...prev, newNotification])
  }
  
  const markAsRead = (id: number) => {
      setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, isNew: false } : n)
      )
  }

  const value = {
    currentUser,
    switchUser,
    notifications,
    sendThankYou,
    markAsRead
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Create custom hook to use context
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
