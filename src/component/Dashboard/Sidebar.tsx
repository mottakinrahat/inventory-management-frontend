"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  AlertTriangle,
  Activity,
  LogOut,
  Boxes,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import { useGetRestockQueueQuery } from "@/redux/api/apiSlice";
import { RootState } from "@/redux/store";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/products", icon: Package },
  { name: "Categories", path: "/categories", icon: Layers },
  { name: "Orders", path: "/orders", icon: ShoppingCart },
  { name: "Restock Queue", path: "/restock", icon: AlertTriangle },
  { name: "Activity Log", path: "/activity", icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { data: queueRes } = useGetRestockQueueQuery({});
  const restockQueue = queueRes?.data || queueRes || [];

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 left-0 z-50"
      style={{ background: "oklch(0.12 0.015 260)", borderRight: "1px solid oklch(0.20 0.02 260)" }}>

      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b"
        style={{ borderColor: "oklch(0.20 0.02 260)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center pulse-glow"
          style={{ background: "linear-gradient(135deg, oklch(0.55 0.24 270), oklch(0.58 0.22 290))" }}>
          <Boxes size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white leading-none">Smart Inventory</h1>
          <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.01 260)" }}>Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          const badge = item.path === "/restock" && restockQueue.length > 0
            ? restockQueue.length
            : null;

          return (
            <button
              key={item.name}
              id={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => router.push(item.path)}
              className={`sidebar-link w-full ${isActive ? "active" : ""}`}
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1 text-left">{item.name}</span>
              {badge && (
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "oklch(0.55 0.24 270 / 0.2)", color: "oklch(0.78 0.15 270)" }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t" style={{ borderColor: "oklch(0.20 0.02 260)" }}>
        {currentUser && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.24 270), oklch(0.62 0.22 290))" }}>
              {typeof currentUser.name === "object" ? (currentUser.name.name?.[0] ?? "U") : (currentUser.name?.[0] ?? "U")}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-white">
                {typeof currentUser.name === "object" ? currentUser.name.name : currentUser.name}
              </p>
              <p className="text-xs truncate" style={{ color: "oklch(0.55 0.01 260)" }}>
                {currentUser.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300"
          style={{ color: "oklch(0.65 0.18 25)" }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}