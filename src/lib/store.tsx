"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { apiFetch } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductStatus = "Active" | "Out of Stock";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  minThreshold: number;
  status: ProductStatus;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface RestockItem {
  id: number;
  productId: number;
  product: { name: string; stock: number; minThreshold: number };
  productName?: string;
  currentStock?: number;
  minThreshold?: number;
  priority?: "High" | "Medium" | "Low";
}

export interface ActivityLog {
  id: number;
  message: string;
  timestamp: string;
  type: "order" | "stock" | "product" | "restock" | "auth";
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppStore {
  // Global State
  isLoading: boolean;
  fetchInitialData: () => Promise<void>;

  // Auth
  currentUser: any | null;
  login: (data: any) => Promise<{ success: boolean; error?: string }>;
  signup: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Categories
  categories: any[];
  addCategory: (name: string, description?: string) => Promise<boolean>;
  updateCategory: (id: number, data: any) => Promise<boolean>;
  removeCategory: (id: number) => Promise<void>;

  // Products
  products: Product[];
  addProduct: (data: Omit<Product, "id">) => Promise<boolean>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<boolean>;
  removeProduct: (id: number) => Promise<void>;
  restockProduct: (id: number, amount: number) => Promise<boolean>;

  // Orders
  orders: Order[];
  createOrder: (data: any) => Promise<{ success: boolean; error?: string }>;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<boolean>;
  cancelOrder: (id: number) => Promise<boolean>;

  // Restock Queue
  restockQueue: RestockItem[];
  removeFromRestockQueue: (id: number) => Promise<boolean>;

  // Activity Log
  activityLogs: ActivityLog[];
}

const AppContext = createContext<AppStore | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AppStore["currentUser"]>(null);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [restockQueue, setRestockQueue] = useState<RestockItem[]>([]);

  // ─── Initial Fetch ────────────────────────────────────────────────────────
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catsRes, prodsRes, ordersRes, logsRes, queueRes] = await Promise.allSettled([
        apiFetch<any>("/category"),
        apiFetch<any>("/product"),
        apiFetch<any>("/order"),
        apiFetch<any>("/activity-log"),
        apiFetch<any>("/restock-queue"),
      ]);

      if (catsRes.status === "fulfilled") setCategories(catsRes.value?.data || catsRes.value || []);
      if (prodsRes.status === "fulfilled") setProducts(prodsRes.value?.data || prodsRes.value || []);
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value?.data || ordersRes.value || []);
      if (logsRes.status === "fulfilled") setActivityLogs(logsRes.value?.data || logsRes.value || []);
      if (queueRes.status === "fulfilled") setRestockQueue(queueRes.value?.data || queueRes.value || []);

      // Check current user based on token
      if (localStorage.getItem("accessToken")) {
        // You might want a /auth/me endpoint. If not, use basic decoding or rely on valid token.
        setCurrentUser({ name: "User" });
      }

    } catch (e) {
      console.error("Failed to fetch initial data", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (data: any) => {
    try {
      const res = await apiFetch<any>("/auth/login", {
        method: "POST",
        data,
      });
      if (res?.data?.accessToken || res?.accessToken) {
        localStorage.setItem("accessToken", res?.data?.accessToken || res?.accessToken);
        setCurrentUser(res?.data?.user || res?.user || { name: "User" });
        await fetchInitialData();
        return { success: true };
      }
      return { success: false, error: "Invalid credentials" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [fetchInitialData]);

  const signup = useCallback(async (data: any) => {
    try {
      await apiFetch<any>("/user", {
        method: "POST",
        data,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setCurrentUser(null);
  }, []);

  // ─── Categories ───────────────────────────────────────────────────────────
  const addCategory = useCallback(async (name: string, description?: string) => {
    try {
      await apiFetch("/category", { method: "POST", data: { name, description } });
      await fetchInitialData();
      return true;
    } catch {
      return false;
    }
  }, [fetchInitialData]);

  const updateCategory = useCallback(async (id: number, data: any) => {
    try {
      await apiFetch(`/category/${id}`, { method: "PATCH", data });
      await fetchInitialData();
      return true;
    } catch {
      return false;
    }
  }, [fetchInitialData]);

  const removeCategory = useCallback(async (id: number) => {
    try {
      await apiFetch(`/category/${id}`, { method: "DELETE" });
      await fetchInitialData();
    } catch {}
  }, [fetchInitialData]);

  // ─── Products ─────────────────────────────────────────────────────────────
  const addProduct = useCallback(async (data: Omit<Product, "id">) => {
    try {
      // Data might need mapping to categoryId based on the real schema, but let's send plain data
      await apiFetch("/product", { method: "POST", data });
      await fetchInitialData();
      return true;
    } catch {
      return false;
    }
  }, [fetchInitialData]);

  const updateProduct = useCallback(async (id: number, updates: Partial<Product>) => {
    try {
      await apiFetch(`/product/${id}`, { method: "PATCH", data: updates });
      await fetchInitialData();
      return true;
    } catch {
      return false;
    }
  }, [fetchInitialData]);

  const removeProduct = useCallback(async (id: number) => {
    try {
      await apiFetch(`/product/${id}`, { method: "DELETE" });
      await fetchInitialData();
    } catch {}
  }, [fetchInitialData]);

  const restockProduct = useCallback(async (id: number, amount: number) => {
    // There is PATCH /restock-queue/:id/restock or PATCH /product
    // We'll update product directly or through queue
    try {
      const p = products.find(prod => prod.id === id);
      if (!p) return false;
      await apiFetch(`/product/${id}`, { method: "PATCH", data: { stock: p.stock + amount } });
      await fetchInitialData();
      return true;
    } catch {
      return false;
    }
  }, [products, fetchInitialData]);

  // ─── Orders ───────────────────────────────────────────────────────────────
  const createOrder = useCallback(async (data: any) => {
    try {
      await apiFetch("/order", { method: "POST", data });
      await fetchInitialData();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [fetchInitialData]);

  const updateOrderStatus = useCallback(async (id: number, status: OrderStatus) => {
    try {
      await apiFetch(`/order/${id}`, { method: "PATCH", data: { status } });
      await fetchInitialData();
      return true;
    } catch {
      return false;
    }
  }, [fetchInitialData]);

  const cancelOrder = useCallback(async (id: number) => {
    try {
      await apiFetch(`/order/${id}`, { method: "PATCH", data: { status: "Cancelled" } });
      await fetchInitialData();
      return true;
    } catch {
      return false;
    }
  }, [fetchInitialData]);

  // ─── Restock Queue ───────────────────────────────────────────────
  const removeFromRestockQueue = useCallback(async (id: number) => {
    try {
      await apiFetch(`/restock-queue/${id}`, { method: "DELETE" });
      await fetchInitialData();
      return true;
    } catch {
      return false;
    }
  }, [fetchInitialData]);

  const value: AppStore = {
    isLoading,
    fetchInitialData,
    currentUser,
    login,
    signup,
    logout,
    categories,
    addCategory,
    updateCategory,
    removeCategory,
    products,
    addProduct,
    updateProduct,
    removeProduct,
    restockProduct,
    orders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    restockQueue,
    removeFromRestockQueue,
    activityLogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore(): AppStore {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used inside <AppProvider>");
  return ctx;
}
