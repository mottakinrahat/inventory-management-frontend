"use client";

import { useAppStore } from "@/lib/store";
import { Activity, ShoppingCart, Package, RefreshCw, Shield, Star } from "lucide-react";

const TYPE_CONFIG = {
  order: { icon: ShoppingCart, bg: "oklch(0.62 0.22 270 / 0.12)", color: "oklch(0.62 0.22 270)", label: "Order" },
  stock: { icon: Package, bg: "oklch(0.68 0.20 170 / 0.12)", color: "oklch(0.68 0.20 170)", label: "Stock" },
  product: { icon: Star, bg: "oklch(0.72 0.18 45 / 0.12)", color: "oklch(0.72 0.18 45)", label: "Product" },
  restock: { icon: RefreshCw, bg: "oklch(0.60 0.22 25 / 0.12)", color: "oklch(0.60 0.22 25)", label: "Restock" },
  auth: { icon: Shield, bg: "oklch(0.62 0.19 200 / 0.12)", color: "oklch(0.62 0.19 200)", label: "Auth" },
};

function formatTime(dateOrStr: Date | string): string {
  const date = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateOrStr: Date | string): string {
  const date = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  const today = new Date();
  const d = new Date(date);
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ActivityPage() {
  const { activityLogs } = useAppStore();

  // Group by date
  const groups: Record<string, typeof activityLogs> = {};
  for (const log of activityLogs) {
    const key = formatDate(log.timestamp);
    if (!groups[key]) groups[key] = [];
    groups[key].push(log);
  }

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Activity Log</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.01 260)" }}>
            {activityLogs.length} recorded actions
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {(Object.entries(TYPE_CONFIG) as [string, (typeof TYPE_CONFIG)[keyof typeof TYPE_CONFIG]][]).map(
            ([type, cfg]) => {
              const count = activityLogs.filter((l) => l.type === type).length;
              if (!count) return null;
              return (
                <span key={type} className="badge" style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.label}: {count}
                </span>
              );
            }
          )}
        </div>
      </div>

      {activityLogs.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groups).map(([dateLabel, logs]) => (
            <div key={dateLabel}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1" style={{ background: "oklch(0.22 0.02 260)" }} />
                <span className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: "oklch(0.18 0.02 260)", color: "oklch(0.55 0.01 260)" }}>
                  {dateLabel}
                </span>
                <div className="h-px flex-1" style={{ background: "oklch(0.22 0.02 260)" }} />
              </div>

              <div className="space-y-2">
                {logs.map((log) => {
                  const cfg = TYPE_CONFIG[log.type] ?? TYPE_CONFIG.stock;
                  const Icon = cfg.icon;
                  return (
                    <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl transition-colors"
                      style={{ background: "oklch(0.14 0.015 260)", border: "1px solid oklch(0.20 0.02 260)" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: cfg.bg }}>
                        <Icon size={14} style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white leading-relaxed">{log.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs" style={{ color: "oklch(0.45 0.01 260)" }}>
                            {formatTime(log.timestamp)}
                          </span>
                          <span className="w-1 h-1 rounded-full inline-block"
                            style={{ background: "oklch(0.35 0.01 260)" }} />
                          <span className="badge py-0 px-1.5 text-[10px]"
                            style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="section-card py-20 text-center">
          <Activity size={40} className="mx-auto mb-3" style={{ color: "oklch(0.30 0.02 260)" }} />
          <p className="text-white font-medium">No activity recorded yet</p>
          <p className="text-sm mt-1" style={{ color: "oklch(0.45 0.01 260)" }}>
            Actions like creating orders and updating stock will appear here
          </p>
        </div>
      )}
    </div>
  );
}
