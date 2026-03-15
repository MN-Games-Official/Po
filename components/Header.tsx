"use client";

import { Bell, LogOut, Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-panel/75 p-5 shadow-panel backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
        <Search className="h-4 w-4 text-textMuted" />
        <input
          aria-label="Search admin content"
          placeholder="Search applications, rank centers, keys..."
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-textMuted"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-2xl border border-white/10 bg-white/6 p-3 text-textMuted transition hover:bg-white/10 hover:text-text"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        </button>
        <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
          <div className="text-sm font-medium text-text">
            {user?.full_name || user?.username || "Operator"}
          </div>
          <div className="text-xs text-textMuted">{user?.email}</div>
        </div>
        <Button variant="ghost" onClick={() => void logout()}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}

