"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import {
  Noto_Sans_SC,
  Noto_Sans_TC,
  Noto_Serif_SC,
  Roboto,
} from "next/font/google";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: "normal",
  preload: true,
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
});

const notoSc = Noto_Sans_SC({
  weight: ["300", "400", "500", "700"],
  style: "normal",
  preload: false,
  variable: "--font-noto-sc",
  display: "swap",
});

const notoTc = Noto_Sans_TC({
  weight: ["300", "400", "500", "700"],
  style: "normal",
  preload: false,
  variable: "--font-noto-tc",
  display: "swap",
});

const notoSerifSc = Noto_Serif_SC({
  weight: ["400", "700", "900"],
  style: "normal",
  preload: false,
  variable: "--font-noto-serif-sc",
  display: "swap",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Sidebar */}
      <aside className="flex-shrink-0 border-r border-gray-200 bg-white">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main
          className={`flex-1 overflow-y-auto p-4 md:p-6 transition-opacity duration-300`}
          style={{ opacity: mounted ? 1 : 0 }}
        >
          {children}
          <Toaster position="top-center" richColors closeButton />
        </main>
      </div>
    </div>
  );
}
