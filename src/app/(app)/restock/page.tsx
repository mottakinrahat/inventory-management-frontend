"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw, X, Check, ArrowUp, Package } from "lucide-react";
import { useAppStore } from "@/lib/store";

const PRIORITY_CONFIG = {
  High: { bg: "oklch(0.60 0.22 25 / 0.15)", text: "oklch(0.60 0.22 25)", border: "oklch(0.60 0.22 25 / 0.3)" },
  Medium: { bg: "oklch(0.72 0.18 45 / 0.15)", text: "oklch(0.72 0.18 45)", border: "oklch(0.72 0.18 45 / 0.3)" },
  Low: { bg: "oklch(0.62 0.22 270 / 0.15)", text: "oklch(0.62 0.22 270)", border: "oklch(0.62 0.22 270 / 0.3)" },
};

export default function RestockPage() {
  const { restockQueue, restockProduct, removeFromRestockQueue, products } = useAppStore();

  const [restockAmounts, setRestockAmounts] = useState<Record<number, string>>({});
  const [successIds, setSuccessIds] = useState<number[]>([]);

  const handleRestock = (productId: number) => {
    const amount = parseInt(restockAmounts[productId] ?? "0");
    if (!amount || amount < 1) return;
    restockProduct(productId, amount);
    removeFromRestockQueue(productId);
    setSuccessIds((prev) => [...prev, productId]);
    setRestockAmounts((prev) => { const n = { ...prev }; delete n[productId]; return n; });
    setTimeout(() => setSuccessIds((prev) => prev.filter((id) => id !== productId)), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Restock Queue</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.01 260)" }}>
            Products below their minimum stock threshold
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
          style={{ background: "oklch(0.60 0.22 25 / 0.12)", color: "oklch(0.60 0.22 25)" }}>
          <AlertTriangle size={12} />
          {restockQueue.filter((r) => r.priority === "High").length} High Priority
        </div>
      </div>

      {/* Priority Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {(["High", "Medium", "Low"] as const).map((p) => {
          const { text, bg } = PRIORITY_CONFIG[p];
          const count = restockQueue.filter((r) => r.priority === p).length;
          return (
            <div key={p} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: bg, color: text }}>
              <ArrowUp size={10} />
              {p}: {count}
            </div>
          );
        })}
      </div>

      {/* Queue */}
      {restockQueue.length > 0 ? (
        <div className="space-y-3">
          {restockQueue.map((item) => {
            const { bg, text, border } = PRIORITY_CONFIG[item.priority];
            const product = products.find((p) => p.id === item.productId);
            const pct = (item.currentStock / item.minThreshold) * 100;
            const isSuccess = successIds.includes(item.productId);

            return (
              <div key={item.productId} className="section-card"
                style={{ borderColor: border }}>
                <div className="flex flex-wrap items-center gap-4">
                  {/* Icon + Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-[180px]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: bg }}>
                      <Package size={18} style={{ color: text }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.productName}</p>
                      <p className="text-xs" style={{ color: "oklch(0.55 0.01 260)" }}>
                        {product?.category ?? "Unknown"} • Min: {item.minThreshold} units
                      </p>
                    </div>
                  </div>

                  {/* Stock bar */}
                  <div className="flex-1 min-w-[160px]">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "oklch(0.55 0.01 260)" }}>Current stock</span>
                      <span className="font-semibold" style={{ color: text }}>
                        {item.currentStock} / {item.minThreshold}
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "oklch(0.20 0.02 260)" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%`, background: text }} />
                    </div>
                  </div>

                  {/* Priority badge */}
                  <span className="badge shrink-0" style={{ background: bg, color: text }}>
                    {item.priority} Priority
                  </span>

                  {/* Restock input */}
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      id={`restock-amount-${item.productId}`}
                      type="number"
                      min="1"
                      placeholder="Add qty"
                      className="input-field w-24 text-center"
                      value={restockAmounts[item.productId] ?? ""}
                      onChange={(e) => setRestockAmounts((prev) => ({ ...prev, [item.productId]: e.target.value }))}
                    />
                    <button
                      id={`restock-btn-${item.productId}`}
                      onClick={() => handleRestock(item.productId)}
                      className="btn-primary"
                      disabled={isSuccess}>
                      {isSuccess ? <Check size={15} /> : <RefreshCw size={15} />}
                      {isSuccess ? "Done!" : "Restock"}
                    </button>
                    <button
                      id={`remove-queue-${item.productId}`}
                      onClick={() => removeFromRestockQueue(item.productId)}
                      className="w-9 h-9"
                      style={{ color: "oklch(0.50 0.01 260)" }}
                      title="Remove from queue">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="section-card py-20 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "oklch(0.68 0.20 170 / 0.12)" }}>
            <Check size={28} style={{ color: "oklch(0.68 0.20 170)" }} />
          </div>
          <p className="text-white font-semibold text-lg">All stocked up!</p>
          <p className="text-sm mt-2" style={{ color: "oklch(0.45 0.01 260)" }}>
            No products are below their minimum threshold
          </p>
        </div>
      )}
    </div>
  );
}
