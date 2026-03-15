import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { APP_NAME } from "@/lib/constants";
import { getSessionUserFromCookies } from "@/lib/auth";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "Internal Polaris Pilot administration portal for applications, ranks, and API operations.",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const initialUser = await getSessionUserFromCookies();

  return (
    <html lang="en">
      <body>
        <AuthProvider initialUser={initialUser}>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
