"use client";

import { Bell, Search } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/orders": "Orders",
  "/restock": "Restock Queue",
  "/activity": "Activity Log",
};

export default function Navbar() {
  const { currentUser, restockQueue } = useAppStore();
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";
  const hasAlerts = restockQueue.some((r) => r.priority === "High");

  return (
    <header className="h-16 flex items-center justify-between px-6 gap-4 border-b"
      style={{
        background: "oklch(0.13 0.015 260)",
        borderColor: "oklch(0.20 0.02 260)",
      }}>
      
      {/* Page title */}
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{
            background: "oklch(0.18 0.02 260)",
            border: "1px solid oklch(0.22 0.02 260)",
            color: "oklch(0.55 0.01 260)",
          }}>
          <Search size={14} />
          <span className="text-xs">Search...</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{
              background: "oklch(0.18 0.02 260)",
              border: "1px solid oklch(0.22 0.02 260)",
            }}>
            <Bell size={16} className="text-gray-400" />
          </button>
          {hasAlerts && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center"
              style={{ background: "oklch(0.60 0.22 25)" }}>
              !
            </span>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, oklch(0.55 0.24 270), oklch(0.62 0.22 290))",
            }}>
            {currentUser?.name?.[0] ?? "A"}
          </div>
          <span className="hidden sm:block text-sm font-medium text-white">
            {currentUser?.name ?? "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}