"use client";

import { useState } from "react";
import {
  Plus, ShoppingCart, X, Trash2, ChevronDown, Search,
  AlertCircle, Check, Package
} from "lucide-react";
import { OrderItem, OrderStatus } from "@/types";
import { 
  useGetProductsQuery,
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
  const { data: prodsRes } = useGetProductsQuery({});
  const products = prodsRes?.data || prodsRes || [];

  const { data: ordersRes } = useGetOrdersQuery({});
  const orders = ordersRes?.data || ordersRes || [];

  const [createOrder] = useCreateOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selProduct, setSelProduct] = useState("");
  const [selQty, setSelQty] = useState("1");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "">("");

  const activeProducts = products.filter((p: any) => p.status === "Active");

  const addItemToOrder = () => {
    setFormError("");
    const product = products.find((p: any) => String(p.id) === selProduct);
    if (!product) { setFormError("Please select a product."); return; }
    if (product.status === "Out of Stock") {
      setFormError(`"${product.name}" is currently unavailable.`); return;
    }
    // Conflict: duplicate product
    if (items.some((i) => i.productId === product.id)) {
      setFormError(`"${product.name}" is already added to the order.`); return;
    }
    const qty = parseInt(selQty);
    if (!qty || qty < 1) { setFormError("Quantity must be at least 1."); return; }
    if (qty > product.stock) {
      setFormError(`Only ${product.stock} item(s) of "${product.name}" available in stock.`); return;
    }
    setItems((prev) => [
      ...prev,
      { productId: product.id, productName: product.name, quantity: qty, unitPrice: product.price },
    ]);
    setSelProduct(""); setSelQty("1");
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  const handleCreateOrder = async () => {
    setFormError("");
    if (!customerName.trim()) { setFormError("Customer name is required."); return; }
    if (items.length === 0) { setFormError("Add at least one product to the order."); return; }
    try {
      await createOrder({ customerName: customerName.trim(), items }).unwrap();
      setFormSuccess(`Order created successfully!`);
      setCustomerName(""); setItems([]);
      setTimeout(() => { setFormSuccess(""); setShowForm(false); }, 1500);
    } catch (err: any) {
      setFormError(err?.data?.message || err?.error || "Failed to create order.");
    }
  };

  const filtered = orders.filter((o: any) => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.01 260)" }}>
            {orders.length} total orders
          </p>
        </div>
        <button id="create-order-btn" onClick={() => { setShowForm(true); setFormError(""); setFormSuccess(""); }}
          className="btn-primary">
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Order Form */}
      {showForm && (
        <div className="section-card" style={{ borderColor: "oklch(0.62 0.22 270 / 0.3)" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <ShoppingCart size={16} style={{ color: "oklch(0.62 0.22 270)" }} />
              Create New Order
            </h3>
            <button onClick={() => setShowForm(false)} className="btn-secondary p-1.5 rounded-lg">
              <X size={14} />
            </button>
          </div>

          {formError && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
              style={{ background: "oklch(0.60 0.22 25 / 0.12)", color: "oklch(0.65 0.22 25)", border: "1px solid oklch(0.60 0.22 25 / 0.25)" }}>
              <AlertCircle size={15} className="shrink-0 mt-0.5" /> {formError}
            </div>
          )}
          {formSuccess && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: "oklch(0.68 0.20 170 / 0.12)", color: "oklch(0.68 0.20 170)", border: "1px solid oklch(0.68 0.20 170 / 0.25)" }}>
              <Check size={15} /> {formSuccess}
            </div>
          )}

          {/* Customer name */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Customer Name *</label>
            <input id="order-customer" className="input-field" placeholder="Full name..."
              value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>

          {/* Add product row */}
          <div className="p-4 rounded-xl mb-4" style={{ background: "oklch(0.12 0.015 260)", border: "1px solid oklch(0.20 0.02 260)" }}>
            <p className="text-xs font-medium text-gray-400 mb-3">Add Product to Order</p>
            <div className="flex flex-wrap gap-3">
              <select id="order-product-select" className="select-field flex-1 min-w-[160px]"
                value={selProduct} onChange={(e) => setSelProduct(e.target.value)}>
                <option value="">Select Product</option>
                {activeProducts.map((p: any) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name} — ${p.price} ({p.stock} left)
                  </option>
                ))}
              </select>
              <input id="order-qty" className="input-field w-24" type="number" min="1" placeholder="Qty"
                value={selQty} onChange={(e) => setSelQty(e.target.value)} />
              <button id="add-item-btn" onClick={addItemToOrder} className="btn-secondary shrink-0">
                <Plus size={14} /> Add Item
              </button>
            </div>
          </div>

          {/* Items list */}
          {items.length > 0 && (
            <div className="mb-4 rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.22 0.02 260)" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.productId}>
                      <td className="text-white font-medium">{item.productName}</td>
                      <td className="text-gray-300">{item.quantity}</td>
                      <td className="text-gray-300">${item.unitPrice.toFixed(2)}</td>
                      <td className="font-semibold text-white">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removeItem(item.productId)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ color: "oklch(0.60 0.22 25)" }}>
                          <X size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 flex justify-between items-center"
                style={{ background: "oklch(0.12 0.015 260)", borderTop: "1px solid oklch(0.20 0.02 260)" }}>
                <span className="text-sm font-medium text-gray-400">Total</span>
                <span className="text-lg font-bold text-white">${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button id="submit-order-btn" onClick={handleCreateOrder} className="btn-primary">
              <Check size={15} /> Create Order
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-[180px]"
          style={{ background: "oklch(0.14 0.015 260)", border: "1px solid oklch(0.22 0.02 260)" }}>
          <Search size={14} style={{ color: "oklch(0.55 0.01 260)" }} />
          <input className="bg-transparent text-sm text-white w-full outline-none placeholder:text-gray-500"
            placeholder="Search by customer or order ID..."
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
                  <th>Order ID</th>
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
                      <td className="font-semibold" style={{ color: "oklch(0.62 0.22 270)" }}>
                        #{order.id}
                      </td>
                      <td className="text-white font-medium">{order.customerName}</td>
                      <td>
                        <div className="flex flex-col gap-0.5">
                          {order.items.map((item: any, i: number) => (
                            <span key={i} className="text-xs text-gray-400">
                              {item.productName} × {item.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="font-bold text-white">${order.totalPrice.toFixed(2)}</td>
                      <td>
                        <span className="badge" style={{ background: bg, color: text }}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-gray-400 text-xs">{timeAgo(order.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {order.status !== "Cancelled" && order.status !== "Delivered" && (
                            <StatusDropdown order={order} onUpdate={updateOrderStatus} />
                          )}
                          {order.status === "Pending" && (
                            <button id={`cancel-order-${order.id}`}
                              onClick={async () => await cancelOrder(order.id)}
                              className="btn-danger py-1 px-2.5 text-xs">
                              <X size={11} /> Cancel
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
          <div className="py-16 text-center">
            <ShoppingCart size={40} className="mx-auto mb-3" style={{ color: "oklch(0.30 0.02 260)" }} />
            <p className="text-white font-medium">No orders found</p>
            <p className="text-sm mt-1" style={{ color: "oklch(0.45 0.01 260)" }}>
              {search || filterStatus ? "Try adjusting your filters" : "Create your first order"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusDropdown({ order, onUpdate }: { order: any; onUpdate: (id: number, status: OrderStatus) => Promise<any> }) {
  const [open, setOpen] = useState(false);
  const nextStatusesDict: Record<OrderStatus, OrderStatus[]> = {
    Pending: ["Confirmed", "Shipped"],
    Confirmed: ["Shipped", "Delivered"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
  };
  const nextStatuses: OrderStatus[] = nextStatusesDict[order.status as OrderStatus] ?? [];

  if (nextStatuses.length === 0) return null;

  return (
    <div className="relative">
      <button id={`status-btn-${order.id}`}
        onClick={() => setOpen(!open)}
        className="btn-secondary py-1 px-2.5 text-xs flex items-center gap-1">
        Update <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-10 rounded-xl overflow-hidden shadow-xl"
          style={{ background: "oklch(0.16 0.02 260)", border: "1px solid oklch(0.25 0.03 265)", minWidth: "120px" }}>
          {nextStatusesDict[order.status as OrderStatus]?.map((s) => {
            const { text } = STATUS_CONFIG[s];
            return (
              <button key={s} id={`set-status-${order.id}-${s.toLowerCase()}`}
                onClick={async () => { await onUpdate(order.id, s); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-white/5"
                style={{ color: text }}>
                → {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
