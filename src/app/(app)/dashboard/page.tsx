"use client";

import {
  useGetOrdersQuery,
  useGetProductsQuery,
  useGetRestockQueueQuery,
  useGetActivityLogsQuery,
} from "@/redux/api/apiSlice";
import {
  ShoppingCart,
  Wallet,
  Clock,
  AlertTriangle,
  TrendingUp,
  Package,
  CheckCircle2,
  Activity,
} from "lucide-react";

function timeAgo(dateOrStr: Date | string): string {
  if (!dateOrStr) return "N/A";
  const date = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  if (!date || isNaN(date.getTime())) return "N/A";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const LOG_COLORS: Record<string, string> = {
  order: "oklch(0.62 0.22 270)",
  stock: "oklch(0.65 0.20 170)",
  product: "oklch(0.72 0.18 45)",
  restock: "oklch(0.60 0.22 25)",
  auth: "oklch(0.60 0.01 260)",
};

export default function DashboardPage() {
  const { data: ordersRes, isLoading: ordersLoading, isError: ordersError } = useGetOrdersQuery({});
  const orders: any[] = ordersRes?.data || ordersRes || [];

  const { data: prodsRes, isLoading: prodsLoading, isError: prodsError } = useGetProductsQuery({});
  const products: any[] = prodsRes?.data || prodsRes || [];

  const { data: queueRes, isLoading: queueLoading, isError: queueError } = useGetRestockQueueQuery({});
  const restockQueue: any[] = queueRes?.data || queueRes || [];

  const { data: logsRes, isLoading: logsLoading, isError: logsError } = useGetActivityLogsQuery({});
  const activityLogs: any[] = logsRes?.data || logsRes || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
  const todayRevenue = todayOrders.reduce((s, o) => s + o.totalPrice, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const lowStockCount = restockQueue.length;

  const stats = [
    {
      label: "Orders Today",
      value: todayOrders.length,
      icon: ShoppingCart,
      color: "oklch(0.62 0.22 270)",
      bg: "oklch(0.62 0.22 270 / 0.12)",
      trend: "+12%",
    },
    {
      label: "Revenue Today",
      value: `$${todayRevenue.toLocaleString()}`,
      icon: Wallet,
      color: "oklch(0.68 0.20 170)",
      bg: "oklch(0.68 0.20 170 / 0.12)",
      trend: "+8%",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "oklch(0.72 0.18 45)",
      bg: "oklch(0.72 0.18 45 / 0.12)",
      trend: null,
    },
    {
      label: "Low Stock Items",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "oklch(0.65 0.22 25)",
      bg: "oklch(0.65 0.22 25 / 0.12)",
      trend: null,
    },
  ];

  if (ordersLoading || prodsLoading || queueLoading || logsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fadeIn">
        <TrendingUp size={40} className="text-[#9d50bb] mb-4 animate-pulse" />
        <p className="text-gray-400 font-medium tracking-wide">Crunching latest stats...</p>
      </div>
    );
  }

  if (ordersError || prodsError || queueError || logsError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-5 border border-red-500/20">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="text-white font-bold text-lg">Dashboard Error</h3>
        <p className="text-sm text-gray-400 mt-2 mb-8 max-w-xs mx-auto leading-relaxed">
          Some data failed to load. The server might be temporarily unavailable.
        </p>
        <button onClick={() => window.location.reload()} className="btn-secondary">Retry Refresh</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.01 260)" }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
          style={{ background: "oklch(0.68 0.20 170 / 0.15)", color: "oklch(0.68 0.20 170)" }}>
          <TrendingUp size={12} />
          Live Data
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="section-card stat-card relative overflow-hidden">
              {/* BG accent */}
              <div className="absolute inset-0 opacity-5 rounded-2xl"
                style={{ background: `radial-gradient(circle at top right, ${stat.color}, transparent)` }} />
              
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: stat.bg }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                {stat.trend && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "oklch(0.68 0.20 170 / 0.15)", color: "oklch(0.68 0.20 170)" }}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm" style={{ color: "oklch(0.55 0.01 260)" }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two-column bottom */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Product Summary */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Package size={16} style={{ color: "oklch(0.62 0.22 270)" }} />
              Product Summary
            </h3>
            <span className="text-xs" style={{ color: "oklch(0.55 0.01 260)" }}>
              {products.length} products
            </span>
          </div>
          <div className="space-y-3">
            {products.slice(0, 6).map((p) => {
              const pct = Math.min(100, (p.stockQty / Math.max(p.minStockThreshold * 2, 1)) * 100);
              const isLow = p.stockQty < p.minStockThreshold;
              const barColor = p.stockQty === 0
                ? "oklch(0.60 0.22 25)"
                : isLow
                ? "oklch(0.72 0.18 45)"
                : "oklch(0.68 0.20 170)";

              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: barColor }} />
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                    <span className="text-xs font-medium" style={{ color: isLow ? "oklch(0.72 0.18 45)" : "oklch(0.68 0.20 170)" }}>
                      {p.stockQty === 0 ? "Out of Stock" : `${p.stockQty} left`}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "oklch(0.20 0.02 260)" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Activity size={16} style={{ color: "oklch(0.62 0.22 270)" }} />
              Recent Activity
            </h3>
            <span className="text-xs" style={{ color: "oklch(0.55 0.01 260)" }}>
              Latest {Math.min(activityLogs.length, 6)} actions
            </span>
          </div>
          <div className="space-y-3">
            {activityLogs.slice(0, 6).map((log) => {
              const dotColor = LOG_COLORS[log.type] ?? "oklch(0.55 0.01 260)";
              return (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: dotColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-snug">{log.message}</p>
                    <p className="text-xs mt-0.5" style={{ color: "oklch(0.45 0.01 260)" }}>
                      {timeAgo(log.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            {activityLogs.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: "oklch(0.45 0.01 260)" }}>
                No activity yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="section-card">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
          <CheckCircle2 size={16} style={{ color: "oklch(0.68 0.20 170)" }} />
          Order Status Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] as const).map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            const colors: Record<string, [string, string]> = {
              Pending: ["oklch(0.72 0.18 45 / 0.15)", "oklch(0.72 0.18 45)"],
              Confirmed: ["oklch(0.62 0.22 270 / 0.15)", "oklch(0.62 0.22 270)"],
              Shipped: ["oklch(0.62 0.19 200 / 0.15)", "oklch(0.62 0.19 200)"],
              Delivered: ["oklch(0.68 0.20 170 / 0.15)", "oklch(0.68 0.20 170)"],
              Cancelled: ["oklch(0.60 0.22 25 / 0.15)", "oklch(0.60 0.22 25)"],
            };
            const [bg, text] = colors[status];
            return (
              <div key={status} className="rounded-xl p-3 text-center" style={{ background: bg }}>
                <p className="text-2xl font-bold" style={{ color: text }}>{count}</p>
                <p className="text-xs mt-1" style={{ color: text, opacity: 0.8 }}>{status}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
