import React from 'react';
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export default function AppHeader({ className, children }: AppHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-50 bg-card border-b border-border shadow-sm", className)}>
      <div className="px-4 py-3">
        {children}
      </div>
    </header>
  );
}