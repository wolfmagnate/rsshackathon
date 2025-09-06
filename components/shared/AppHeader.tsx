"use client"

import React from 'react';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, Users } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

interface AppHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const userMapping = {
    giver: "感謝を伝える人",
    receiver: "感謝される人"
}

export default function AppHeader({ className, children }: AppHeaderProps) {
  const { currentUser, switchUser } = useAppContext();

  return (
    <header className={cn("sticky top-0 z-50 bg-card border-b border-border shadow-sm", className)}>
      <div className="px-4 py-3 flex items-center justify-between max-w-md mx-auto">
        <div className="flex-1"></div>
        <div className="text-center">{children}</div>
        <div className="flex-1 flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>アカウント切り替え</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => switchUser("giver")}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>{userMapping['giver']}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchUser("receiver")}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>{userMapping['receiver']}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}