"use client";

import {
  Gauge,
  KeyRound,
  LayoutTemplate,
  Settings,
  Swords,
  UserRound,
} from "lucide-react";

import { Navigation } from "@/components/Navigation";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: <Gauge className="h-4 w-4" /> },
  {
    label: "Application Center",
    href: "/dashboard/application-center",
    icon: <LayoutTemplate className="h-4 w-4" />,
  },
  {
    label: "Rank Center",
    href: "/dashboard/rank-center",
    icon: <Swords className="h-4 w-4" />,
  },
  {
    label: "API Keys",
    href: "/dashboard/api-keys",
    icon: <KeyRound className="h-4 w-4" />,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: <UserRound className="h-4 w-4" />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

export function Sidebar() {
  return (
    <aside className="relative overflow-hidden rounded-[32px] border border-white/10 bg-panel/90 p-5 shadow-panel backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="mb-8">
        <div className="inline-flex items-center rounded-full bg-accent/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-accent">
          Polaris Pilot
        </div>
        <h1 className="mt-4 font-display text-3xl text-text">Admin Flight Deck</h1>
        <p className="mt-2 text-sm text-textMuted">
          Applications, rankings, promotions, and keys in one command layer.
        </p>
      </div>
      <Navigation items={items} vertical />
      <div className="mt-8 rounded-[24px] bg-white/6 p-4">
        <p className="text-xs uppercase tracking-[0.32em] text-textMuted">
          Live Status
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="relative inline-flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-success/70" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
          </span>
          <div>
            <div className="text-sm font-medium text-text">Portal Operational</div>
            <div className="text-xs text-textMuted">
              Prisma-backed admin environment
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
