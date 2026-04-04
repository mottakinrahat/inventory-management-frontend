"use client";

import React from "react";
import Navbar from "@/component/Dashboard/Navbar";
import Sidebar from "@/component/Dashboard/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen" style={{ background: "oklch(0.10 0.01 260)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
