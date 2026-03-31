"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/products", icon: Package },
  { name: "Categories", path: "/categories", icon: Layers },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
  { name: "Restock Queue", path: "/restock", icon: AlertTriangle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-lg font-semibold tracking-tight">
          Inventory System
        </h1>
      </div>

      {/* MENU */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent text-accent-foreground font-medium shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t text-xs text-muted-foreground">
        © 2026 Inventory App
      </div>
    </aside>
  );
}