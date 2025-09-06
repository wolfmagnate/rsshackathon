"use client"; // インタラクティブなコンポーネントを使うため宣言

import { useState } from "react";
import { MessageCircle, User, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function HomePage() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-semibold">PWA Chat App</h1>
          <p className="text-sm text-gray-500">Online</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>RSS Hackathonへようこそ！！！</span>
            </CardTitle>
            <CardDescription>This is a sample UI using shadcn/ui and Lucide.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge>Feature</Badge>
              <p>PWA Ready!</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">UI</Badge>
              <p>shadcn/ui</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-start">
          <div className="p-3 rounded-lg bg-blue-500 text-white max-w-xs">
            Hello, how are you?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="p-3 rounded-lg bg-gray-200 max-w-xs">
            I'm good, thanks! This UI looks great.
          </div>
        </div>
      </main>

      {/* Footer Input */}
      <footer className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <Input 
            type="text" 
            placeholder="Type a message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
