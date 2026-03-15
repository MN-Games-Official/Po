import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getSessionUserFromCookies } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUserFromCookies();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-panel px-8 py-10 shadow-panel">
          <div className="pointer-events-none absolute inset-0 bg-radial opacity-90" />
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.34em] text-textMuted">
              Polaris Pilot
            </div>
            <h1 className="mt-8 font-display text-5xl leading-none text-text sm:text-6xl">
              Command the internal operations layer.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-textMuted">
              Build application flows, configure rank monetization, manage API
              credentials, and keep Roblox promotion tooling connected without a
              separate public marketing surface.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                "AI-assisted application generation",
                "Encrypted Roblox and Polaris keys",
                "Strict TypeScript + Zod validation",
                "Responsive admin-grade UX",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-text"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center">{children}</section>
      </div>
    </main>
  );
}
