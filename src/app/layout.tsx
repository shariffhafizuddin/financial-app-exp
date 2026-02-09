import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import HeaderNav from "@/components/HeaderNav";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Financial Tracker",
  description: "Local-first financial tracker"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <header className="mb-6 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Financial Tracker
            </Link>
            <HeaderNav />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
