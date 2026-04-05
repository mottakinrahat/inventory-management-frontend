"use client";

import { useState } from "react";
import {
  Plus, ShoppingCart, X  , ChevronDown, Search,
  AlertCircle, Check, Package, Trash2
} from "lucide-react";
import {  useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { OrderItem, OrderStatus } from "@/types";
import { 
  useGetMyProductsQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation
} from "@/redux/api/apiSlice";

const STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  Pending: { bg: "oklch(0.72 0.18 45 / 0.15)", text: "oklch(0.72 0.18 45)", label: "Pending" },
  Confirmed: { bg: "oklch(0.62 0.22 270 / 0.15)", text: "oklch(0.62 0.22 270)", label: "Confirmed" },
  Shipped: { bg: "oklch(0.62 0.19 200 / 0.15)", text: "oklch(0.62 0.19 200)", label: "Shipped" },
  Delivered: { bg: "oklch(0.68 0.20 170 / 0.15)", text: "oklch(0.68 0.20 170)", label: "Delivered" },
  Cancelled: { bg: "oklch(0.60 0.22 25 / 0.15)", text: "oklch(0.60 0.22 25)", label: "Cancelled" },
};

function timeAgo(dateOrStr: Date | string): string {
  const date = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function OrdersPage() {
  // Use getMyProducts endpoint as requested
  const { data: prodsRes, isLoading: prodsLoading } = useGetMyProductsQuery({});
  const products: any[] = prodsRes?.data || prodsRes || [];

  const { data: ordersRes, isLoading: ordersLoading } = useGetOrdersQuery({});
  const orders: any[] = ordersRes?.data || ordersRes || [];

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [createOrder] = useCreateOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "">("");

  // Simplified multi-select logic
  const toggleProductSelection = (product: any) => {
    setItems((prev) => {
      const exists = prev.find((it) => it.productId === product.id);
      if (exists) {
        return prev.filter((it) => it.productId !== product.id);
      } else {
        return [
          ...prev,
          { 
            productId: product.id, 
            productName: product.name, 
            quantity: 1, 
            price: product.price 
          },
        ];
      }
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => 
      prev.map((it) => it.productId === productId ? { ...it, quantity: qty } : it)
    );
  };

  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  const handleCreateOrder = async () => {
    setFormError("");
    if (!customerName.trim()) { setFormError("Customer name is required."); return; }
    if (items.length === 0) { setFormError("Select at least one product."); return; }
    try {
      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        totalPrice: total,
        createdById: currentUser?.id,
        // Post structure using Product IDs and required fields
        items: items.map(it => ({
          productId: it.productId,
          quantity: it.quantity,
          unitPrice: it.price,
          subtotal: it.quantity * it.price
        }))
      };
      await createOrder(payload).unwrap();
      setFormSuccess(`Order created successfully!`);
      setCustomerName(""); setCustomerEmail(""); setItems([]);
      setTimeout(() => { setFormSuccess(""); setShowForm(false); }, 1500);
    } catch (err: any) {
      console.error("Order Creation Error:", err);
      const msg = err?.data?.message || err?.data?.error || err?.error || "Failed to create order.";
      setFormError(msg);
    }
  };

  const filtered = orders.filter((o: any) => {
    const isMine = o.createdById === currentUser?.id;
    if (!isMine) return false;
    const matchSearch = (o.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search) || (o.orderNumber || "").includes(search);
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (prodsLoading || ordersLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <ShoppingCart size={40} className="text-gray-600 mb-4 animate-bounce" />
        <p className="text-gray-400 font-medium">Processing inventory data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.01 260)" }}>
            {filtered.length} total orders
          </p>
        </div>
        <button id="create-order-btn" onClick={() => { setShowForm(!showForm); setFormError(""); setFormSuccess(""); }}
          className="btn-primary">
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Close Form" : "New Order"}
        </button>
      </div>

      {/* Order Creation Form */}
      {showForm && (
        <div className="section-card border border-primary/20 bg-primary/5 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Customer & Selection */}
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <ShoppingCart size={18} className="text-primary" />
                New Order Details
              </h3>
              
              {formError && (
                <div className="p-3 rounded-xl text-xs bg-destructive/10 text-destructive border border-destructive/20 flex gap-2">
                  <AlertCircle size={14} className="shrink-0" /> {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3 rounded-xl text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex gap-2">
                  <Check size={14} /> {formSuccess}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Customer Name *</label>
                  <input className="input-field" placeholder="Full Name"
                    value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Customer Email</label>
                  <input className="input-field" placeholder="Email (Optional)"
                    value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Quick Select Products (My Products)</label>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {products.map((p) => {
                    const isSelected = items.some(it => it.productId === p.id);
                    return (
                      <button 
                        key={p.id}
                        onClick={() => toggleProductSelection(p)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isSelected 
                          ? "border-primary bg-primary/20 text-white" 
                          : "border-border bg-secondary/50 text-gray-400 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-semibold">{p.name}</span>
                          <span className="text-[10px] opacity-70">${p.price} • {p.stockQty} in stock</span>
                        </div>
                        {isSelected ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="space-y-4">
               <h3 className="font-bold text-white flex items-center gap-2">
                <Package size={18} className="text-primary" />
                Selected Items ({items.length})
              </h3>

              <div className="bg-secondary/30 rounded-2xl border border-border overflow-hidden flex flex-col min-h-[350px]">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-secondary/50 border border-white/5 animate-fadeIn">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-white">{item.productName}</p>
                          <p className="text-[10px] text-gray-500">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input 
                            type="number" 
                            min="1"
                            className="w-12 bg-transparent border-b border-white/20 text-center text-xs text-white focus:border-primary outline-none"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId as string, parseInt(e.target.value))}
                          />
                          <button onClick={() => toggleProductSelection({ id: item.productId })} className="text-destructive">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-30">
                      <ShoppingCart size={32} className="mb-2" />
                      <p className="text-xs">No items selected</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-secondary/50 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-400">Total Price</span>
                    <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCreateOrder} disabled={items.length === 0}
                    className="btn-primary w-full py-3.5 shadow-lg shadow-primary/20 disabled:opacity-50 transition-all active:scale-[0.98]">
                    Confirm & Submit Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-[200px] bg-secondary/50 border border-border">
          <Search size={14} className="text-gray-500" />
          <input className="bg-transparent text-sm text-white w-full outline-none placeholder:text-gray-500"
            placeholder="Search orders..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select-field w-auto min-w-[150px]"
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "")}>
          <option value="">All Status</option>
          {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="section-card p-0 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order: any) => {
                  const { bg, text } = STATUS_CONFIG[order.status as OrderStatus] || STATUS_CONFIG.Pending;
                  return (
                    <tr key={order.id}>
                      <td className="font-semibold text-primary">#{order.orderNumber || order.id.slice(-6)}</td>
                      <td className="text-white font-medium">{order.customerName}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {order.items.map((item: any, i: number) => {
                            const pName = item.product?.name || item.productName || "Product";
                            return (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                                {pName} x{item.quantity}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="font-bold text-white">${order.totalPrice.toFixed(2)}</td>
                      <td>
                        <span className="badge" style={{ background: bg, color: text }}>{order.status}</span>
                      </td>
                      <td className="text-gray-400 text-xs">{timeAgo(order.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {order.status !== "Cancelled" && order.status !== "Delivered" && (
                            <StatusDropdown order={order} onUpdate={updateOrderStatus} />
                          )}
                          {order.status === "Pending" && (
                            <button onClick={() => cancelOrder(order.id)} className="btn-danger p-2 rounded-lg">
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center opacity-40">
            <ShoppingCart size={40} className="mx-auto mb-3" />
            <p className="text-white font-medium underline">No matching orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusDropdown({ order, onUpdate }: { order: any; onUpdate: (data: { id: string; status: OrderStatus }) => Promise<any> }) {
  const [open, setOpen] = useState(false);
  const nextStatusesDict: Record<OrderStatus, OrderStatus[]> = {
    Pending: ["Confirmed", "Shipped"],
    Confirmed: ["Shipped", "Delivered"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
  };
  const nextStatuses = nextStatusesDict[order.status as OrderStatus] ?? [];

  if (nextStatuses.length === 0) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="btn-secondary py-1 px-3 text-xs flex items-center gap-2">
        Update <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-20 rounded-xl overflow-hidden glass-card min-w-[140px] shadow-2xl animate-fadeIn">
          {nextStatuses.map((s) => (
            <button key={s} 
              onClick={async () => { await onUpdate({ id: order.id, status: s }); setOpen(false); }}
              className="w-full text-left px-4 py-3 text-xs font-medium hover:bg-primary/20 transition-colors text-white border-b border-white/5 last:border-0"
            >
              Set to {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
