"use client";

import React, { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Check, Package } from "lucide-react";
import { Product } from "@/types";
import { 
  useGetProductsQuery, 
  useGetCategoriesQuery, 
  useAddProductMutation, 
  useUpdateProductMutation, 
  useRemoveProductMutation 
} from "@/redux/api/apiSlice";

const STATUS_STYLES: Record<string, [string, string]> = {
  Active: ["oklch(0.68 0.20 170 / 0.15)", "oklch(0.68 0.20 170)"],
  "Out of Stock": ["oklch(0.60 0.22 25 / 0.15)", "oklch(0.60 0.22 25)"],
};

export default function ProductsPage() {
  const { data: prodsRes } = useGetProductsQuery({});
  const products: Product[] = prodsRes?.data || prodsRes || [];
  const { data: catsRes } = useGetCategoriesQuery({});
  const categories = catsRes?.data || catsRes || [];

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [removeProduct] = useRemoveProductMutation();

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const emptyForm = {
    name: "", category: "", price: "", stock: "", minThreshold: "", status: "Active" as Product["status"],
  };
  const [form, setForm] = useState(emptyForm);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.category === filterCat;
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim() || !form.category || !form.price || !form.stock || !form.minThreshold) {
      setError("All fields are required.");
      return;
    }
    const data = {
      name: form.name.trim(),
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      minThreshold: parseInt(form.minThreshold),
      status: form.status,
    };

    try {
      if (editingId !== null) {
        await updateProduct({ id: editingId, ...data }).unwrap();
        setEditingId(null);
      } else {
        await addProduct(data).unwrap();
      }
      setForm(emptyForm);
      setShowForm(false);
    } catch {
      setError("Failed to save product.");
    }
  };

  const startEdit = (p: Product) => {
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      minThreshold: String(p.minThreshold),
      status: p.status,
    });
    setEditingId(p.id);
    setShowForm(true);
    setError("");
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.01 260)" }}>
            {products.length} products across {categories.length} categories
          </p>
        </div>
        <button id="add-product-btn" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); setError(""); }}
          className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="section-card border" style={{ borderColor: "oklch(0.62 0.22 270 / 0.3)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">
              {editingId !== null ? "Edit Product" : "Add New Product"}
            </h3>
            <button onClick={cancelForm} className="btn-secondary p-1.5 rounded-lg">
              <X size={14} />
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl text-sm"
              style={{ background: "oklch(0.60 0.22 25 / 0.15)", color: "oklch(0.60 0.22 25)", border: "1px solid oklch(0.60 0.22 25 / 0.3)" }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Product Name *</label>
              <input id="product-name" className="input-field" placeholder="e.g. iPhone 13"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Category *</label>
              <select id="product-category" className="select-field"
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((c: any) => <option key={c.id || c} value={c.name || c}>{c.name || c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Price ($) *</label>
              <input id="product-price" className="input-field" type="number" min="0" placeholder="0.00"
                value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Stock Quantity *</label>
              <input id="product-stock" className="input-field" type="number" min="0" placeholder="0"
                value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Min Threshold *</label>
              <input id="product-threshold" className="input-field" type="number" min="0" placeholder="5"
                value={form.minThreshold} onChange={(e) => setForm({ ...form, minThreshold: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Status</label>
              <select id="product-status" className="select-field"
                value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Product["status"] })}>
                <option value="Active">Active</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button id="save-product-btn" onClick={handleSubmit} className="btn-primary">
              <Check size={15} />
              {editingId !== null ? "Save Changes" : "Add Product"}
            </button>
            <button onClick={cancelForm} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-[180px]"
          style={{ background: "oklch(0.14 0.015 260)", border: "1px solid oklch(0.22 0.02 260)" }}>
          <Search size={14} style={{ color: "oklch(0.55 0.01 260)" }} />
          <input className="bg-transparent text-sm text-white w-full outline-none placeholder:text-gray-500"
            placeholder="Search products..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select-field w-auto min-w-[140px]"
          value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c: any) => <option key={c.id || c} value={c.name || c}>{c.name || c}</option>)}
        </select>
        <select className="select-field w-auto min-w-[130px]"
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="section-card p-0 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Min Threshold</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isLow = p.stock < p.minThreshold && p.stock > 0;
                  const [bg, color] = STATUS_STYLES[p.status] ?? ["", ""];
                  return (
                    <tr key={p.id}>
                      <td className="text-gray-500 text-xs">{p.id}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "oklch(0.62 0.22 270 / 0.12)" }}>
                            <Package size={13} style={{ color: "oklch(0.62 0.22 270)" }} />
                          </div>
                          <span className="font-medium text-white">{p.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="px-2.5 py-1 rounded-lg text-xs"
                          style={{ background: "oklch(0.20 0.03 265)", color: "oklch(0.78 0.12 265)" }}>
                          {p.category}
                        </span>
                      </td>
                      <td className="font-medium text-white">${p.price.toFixed(2)}</td>
                      <td>
                        <span className="font-semibold" style={{
                          color: p.stock === 0
                            ? "oklch(0.60 0.22 25)"
                            : isLow
                            ? "oklch(0.72 0.18 45)"
                            : "oklch(0.68 0.20 170)"
                        }}>
                          {p.stock}
                        </span>
                        {isLow && (
                          <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded"
                            style={{ background: "oklch(0.72 0.18 45 / 0.15)", color: "oklch(0.72 0.18 45)" }}>
                            Low
                          </span>
                        )}
                      </td>
                      <td className="text-gray-400">{p.minThreshold}</td>
                      <td>
                        <span className="badge text-xs" style={{ background: bg, color }}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button id={`edit-product-${p.id}`} onClick={() => startEdit(p)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            style={{ background: "oklch(0.62 0.22 270 / 0.12)", color: "oklch(0.62 0.22 270)" }}
                            title="Edit">
                            <Pencil size={12} />
                          </button>
                          <button id={`delete-product-${p.id}`} onClick={async () => await removeProduct(p.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            style={{ background: "oklch(0.60 0.22 25 / 0.12)", color: "oklch(0.60 0.22 25)" }}
                            title="Delete">
                            <Trash2 size={12} />
                          </button>
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
            <Package size={40} className="mx-auto mb-3" style={{ color: "oklch(0.30 0.02 260)" }} />
            <p className="text-white font-medium">No products found</p>
            <p className="text-sm mt-1" style={{ color: "oklch(0.45 0.01 260)" }}>
              {search || filterCat || filterStatus
                ? "Try adjusting your filters"
                : "Add your first product to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
