"use client";

import { useState } from "react";
import { Plus, Tags, X, Trash2, Check, Layers } from "lucide-react";
import { 
  useGetCategoriesQuery, 
  useAddCategoryMutation, 
  useRemoveCategoryMutation, 
  useGetProductsQuery 
} from "@/redux/api/apiSlice";

const CATEGORY_COLORS = [
  "oklch(0.62 0.22 270)",
  "oklch(0.68 0.20 170)",
  "oklch(0.72 0.18 45)",
  "oklch(0.65 0.20 340)",
  "oklch(0.62 0.19 200)",
  "oklch(0.60 0.22 25)",
];

export default function CategoriesPage() {
  const { data: catsRes, isLoading: catsLoading, isError: catsError } = useGetCategoriesQuery({});
  const categories = catsRes?.data || catsRes || [];

  const { data: prodsRes, isLoading: prodsLoading, isError: prodsError } = useGetProductsQuery({});
  const products = prodsRes?.data || prodsRes || [];

  const [addCategory] = useAddCategoryMutation();
  const [removeCategory] = useRemoveCategoryMutation();

  const [newCat, setNewCat] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdd = async () => {
    setError(""); setSuccess("");
    if (!newCat.trim()) { setError("Category name cannot be empty."); return; }
    if (categories.find((c: any) => (c.name || c) === newCat.trim())) {
      setError(`"${newCat.trim()}" category already exists.`); return;
    }
    try {
      await addCategory({ name: newCat.trim() }).unwrap();
      setSuccess(`Category "${newCat.trim()}" added successfully.`);
      setNewCat("");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to add category.");
    }
  };

  const productCountByCategory = (catName: string) =>
    products.filter((p: any) => {
      const pCat = typeof p.category === "object" ? p.category.name : p.category;
      return pCat === catName || p.categoryId === catName;
    }).length;

  if (catsLoading || prodsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Tags size={40} className="text-gray-600 mb-4 animate-bounce" />
        <p className="text-gray-400 font-medium">Categorizing your data...</p>
      </div>
    );
  }

  if (catsError || prodsError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <X size={24} className="text-red-500" />
        </div>
        <h3 className="text-white font-semibold">Categories unavailable</h3>
        <button onClick={() => window.location.reload()} className="btn-secondary mt-4">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div>
        <h1 className="page-title">Categories</h1>
        <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.01 260)" }}>
          Organize your products into categories
        </p>
      </div>

      {/* Add Form */}
      <div className="section-card">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Tags size={16} style={{ color: "oklch(0.62 0.22 270)" }} />
          Add New Category
        </h3>

        {error && (
          <div className="mb-3 px-4 py-2.5 rounded-xl text-sm"
            style={{ background: "oklch(0.60 0.22 25 / 0.15)", color: "oklch(0.60 0.22 25)", border: "1px solid oklch(0.60 0.22 25 / 0.3)" }}>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
            style={{ background: "oklch(0.68 0.20 170 / 0.15)", color: "oklch(0.68 0.20 170)", border: "1px solid oklch(0.68 0.20 170 / 0.3)" }}>
            <Check size={14} /> {success}
          </div>
        )}

        <div className="flex gap-3">
          <input
            id="category-name-input"
            className="input-field flex-1"
            placeholder="e.g. Electronics, Clothing, Grocery..."
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button id="add-category-btn" onClick={handleAdd} className="btn-primary shrink-0">
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Category Grid */}
      <div>
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Layers size={16} style={{ color: "oklch(0.62 0.22 270)" }} />
          All Categories ({categories.length})
        </h3>

        {categories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((catObj: any, idx: number) => {
              const cat = typeof catObj === "object" ? (catObj.name || "Unnamed") : catObj;
              const catId = catObj.id || catObj;
              const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
              const count = productCountByCategory(cat);
              return (
                <div key={catId} className="section-card stat-card relative overflow-hidden group"
                  style={{ borderColor: `${color}22` }}>
                  {/* BG decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -translate-y-6 translate-x-6"
                    style={{ background: color }} />
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${color}20` }}>
                        <Tags size={18} style={{ color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{cat}</p>
                        <p className="text-sm" style={{ color: "oklch(0.55 0.01 260)" }}>
                           {count} product{count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      id={`delete-category-${String(cat).toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => removeCategory(catId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: "oklch(0.60 0.22 25 / 0.15)", color: "oklch(0.60 0.22 25)" }}
                      title="Remove category">
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Product count bar */}
                  <div className="mt-4">
                    <div className="h-1 rounded-full" style={{ background: "oklch(0.20 0.02 260)" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (count / Math.max(...categories.map((c: any) => productCountByCategory(c.name || c))) * 100) || 0)}%`, background: color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="section-card py-16 text-center">
            <Layers size={40} className="mx-auto mb-3" style={{ color: "oklch(0.30 0.02 260)" }} />
            <p className="text-white font-medium">No categories yet</p>
            <p className="text-sm mt-1" style={{ color: "oklch(0.45 0.01 260)" }}>
              Add your first category above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
