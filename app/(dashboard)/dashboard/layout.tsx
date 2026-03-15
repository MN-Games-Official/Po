import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { getSessionUserFromCookies } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUserFromCookies();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-5 lg:grid-cols-[320px_1fr]">
        <Sidebar />
        <div className="min-w-0">
          <Header />
          <section className="mt-5 min-w-0">{children}</section>
          <Footer />
        </div>
      </div>
    </main>
  );
}
