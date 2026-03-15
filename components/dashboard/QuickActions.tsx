"use client";

import Link from "next/link";
import { KeyRound, LayoutTemplate, Plus, Swords } from "lucide-react";

import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const actions = [
  {
    title: "New application",
    description: "Launch the builder and generate graded questions with Polaris AI.",
    href: "/dashboard/application-center/new",
    icon: <LayoutTemplate className="h-5 w-5" />,
  },
  {
    title: "New rank center",
    description: "Define purchasable group roles, prices, and universe links.",
    href: "/dashboard/rank-center/new",
    icon: <Swords className="h-5 w-5" />,
  },
  {
    title: "Manage API keys",
    description: "Upload Roblox Cloud credentials and issue Polaris integration keys.",
    href: "/dashboard/api-keys",
    icon: <KeyRound className="h-5 w-5" />,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader
        title="Quick Actions"
        subtitle="Jump straight into the internal builder workflows"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-[24px] border border-white/8 bg-white/4 p-5 transition hover:-translate-y-1 hover:bg-white/8"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-accent/12 p-3 text-accent">
                {action.icon}
              </div>
              <Plus className="h-4 w-4 text-textMuted transition group-hover:text-text" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-text">{action.title}</h3>
            <p className="mt-2 text-sm text-textMuted">{action.description}</p>
            <Button variant="ghost" className="mt-6">
              Open
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  );
}
