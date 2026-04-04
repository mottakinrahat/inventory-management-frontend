"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

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
  createdAt: Date;
}

export interface RestockItem {
  productId: number;
  productName: string;
  currentStock: number;
  minThreshold: number;
  priority: "High" | "Medium" | "Low";
}

export interface ActivityLog {
  id: number;
  message: string;
  timestamp: Date;
  type: "order" | "stock" | "product" | "restock" | "auth";
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppStore {
  // Auth
  currentUser: { name: string; email: string; role: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Categories
  categories: string[];
  addCategory: (name: string) => boolean;
  removeCategory: (name: string) => void;

  // Products
  products: Product[];
  addProduct: (data: Omit<Product, "id">) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  removeProduct: (id: number) => void;
  restockProduct: (id: number, amount: number) => void;

  // Orders
  orders: Order[];
  createOrder: (
    customerName: string,
    items: OrderItem[]
  ) => { success: boolean; error?: string };
  updateOrderStatus: (id: number, status: OrderStatus) => void;
  cancelOrder: (id: number) => void;

  // Restock Queue
  restockQueue: RestockItem[];
  removeFromRestockQueue: (productId: number) => void;

  // Activity Log
  activityLogs: ActivityLog[];
}

const AppContext = createContext<AppStore | null>(null);

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_CATEGORIES = ["Electronics", "Clothing", "Grocery", "Accessories"];

const SEED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "iPhone 13",
    category: "Electronics",
    price: 799,
    stock: 3,
    minThreshold: 5,
    status: "Active",
  },
  {
    id: 2,
    name: "T-Shirt (XL)",
    category: "Clothing",
    price: 25,
    stock: 20,
    minThreshold: 10,
    status: "Active",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 149,
    stock: 2,
    minThreshold: 5,
    status: "Active",
  },
  {
    id: 4,
    name: "Organic Honey",
    category: "Grocery",
    price: 12,
    stock: 0,
    minThreshold: 10,
    status: "Out of Stock",
  },
  {
    id: 5,
    name: "Laptop Stand",
    category: "Accessories",
    price: 59,
    stock: 18,
    minThreshold: 5,
    status: "Active",
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: 1001,
    customerName: "Alice Johnson",
    items: [{ productId: 2, productName: "T-Shirt (XL)", quantity: 2, unitPrice: 25 }],
    totalPrice: 50,
    status: "Delivered",
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 1002,
    customerName: "Bob Smith",
    items: [
      { productId: 1, productName: "iPhone 13", quantity: 1, unitPrice: 799 },
      { productId: 5, productName: "Laptop Stand", quantity: 1, unitPrice: 59 },
    ],
    totalPrice: 858,
    status: "Shipped",
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 1003,
    customerName: "Carol White",
    items: [{ productId: 3, productName: "Wireless Headphones", quantity: 1, unitPrice: 149 }],
    totalPrice: 149,
    status: "Pending",
    createdAt: new Date(Date.now() - 1800000),
  },
];

const SEED_LOGS: ActivityLog[] = [
  {
    id: 1,
    message: "Order #1001 marked as Delivered",
    timestamp: new Date(Date.now() - 86400000 * 2),
    type: "order",
  },
  {
    id: 2,
    message: "Order #1002 marked as Shipped",
    timestamp: new Date(Date.now() - 3600000),
    type: "order",
  },
  {
    id: 3,
    message: "Order #1003 created by Admin",
    timestamp: new Date(Date.now() - 1800000),
    type: "order",
  },
  {
    id: 4,
    message: "\"Organic Honey\" is Out of Stock — added to Restock Queue",
    timestamp: new Date(Date.now() - 7200000),
    type: "restock",
  },
  {
    id: 5,
    message: "Product \"iPhone 13\" stock is low (3 left)",
    timestamp: new Date(Date.now() - 10800000),
    type: "stock",
  },
];

function computeRestockQueue(products: Product[]): RestockItem[] {
  return products
    .filter((p) => p.stock < p.minThreshold)
    .map((p) => {
      const ratio = p.stock / p.minThreshold;
      const priority: RestockItem["priority"] =
        ratio === 0 ? "High" : ratio <= 0.4 ? "High" : ratio <= 0.7 ? "Medium" : "Low";
      return {
        productId: p.id,
        productName: p.name,
        currentStock: p.stock,
        minThreshold: p.minThreshold,
        priority,
      };
    })
    .sort((a, b) => a.currentStock - b.currentStock);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppStore["currentUser"]>(null);
  const [categories, setCategories] = useState<string[]>(SEED_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(SEED_LOGS);
  const [nextProductId, setNextProductId] = useState(100);
  const [nextOrderId, setNextOrderId] = useState(1004);
  const [nextLogId, setNextLogId] = useState(10);

  const addLog = useCallback(
    (message: string, type: ActivityLog["type"]) => {
      setActivityLogs((prev) => [
        { id: nextLogId, message, timestamp: new Date(), type },
        ...prev.slice(0, 99),
      ]);
      setNextLogId((n) => n + 1);
    },
    [nextLogId]
  );

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const login = useCallback((email: string, _password: string) => {
    setCurrentUser({
      name: email === "demo@example.com" ? "Demo Admin" : "Admin",
      email,
      role: "Admin",
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // ─── Categories ───────────────────────────────────────────────────────────
  const addCategory = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed || categories.includes(trimmed)) return false;
      setCategories((prev) => [...prev, trimmed]);
      addLog(`Category "${trimmed}" added`, "product");
      return true;
    },
    [categories, addLog]
  );

  const removeCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  }, []);

  // ─── Products ─────────────────────────────────────────────────────────────
  const addProduct = useCallback(
    (data: Omit<Product, "id">) => {
      const newProduct: Product = { id: nextProductId, ...data };
      setProducts((prev) => [...prev, newProduct]);
      setNextProductId((n) => n + 1);
      addLog(`Product "${data.name}" added`, "product");
      if (data.stock < data.minThreshold) {
        addLog(`"${data.name}" stock is below threshold — added to Restock Queue`, "restock");
      }
    },
    [nextProductId, addLog]
  );

  const updateProduct = useCallback(
    (id: number, updates: Partial<Product>) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const updated = { ...p, ...updates };
          if (updated.stock === 0) updated.status = "Out of Stock";
          else if (updated.status === "Out of Stock" && updated.stock > 0)
            updated.status = "Active";
          return updated;
        })
      );
    },
    []
  );

  const removeProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const restockProduct = useCallback(
    (id: number, amount: number) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const newStock = p.stock + amount;
          return {
            ...p,
            stock: newStock,
            status: newStock > 0 ? "Active" : "Out of Stock",
          };
        })
      );
      const product = products.find((p) => p.id === id);
      if (product) {
        addLog(`Stock updated for "${product.name}" (+${amount} units)`, "stock");
      }
    },
    [products, addLog]
  );

  // ─── Orders ───────────────────────────────────────────────────────────────
  const createOrder = useCallback(
    (customerName: string, items: OrderItem[]) => {
      // Conflict: check inactive products
      for (const item of items) {
        const p = products.find((p) => p.id === item.productId);
        if (!p || p.status === "Out of Stock") {
          return {
            success: false,
            error: `"${item.productName}" is currently unavailable.`,
          };
        }
        if (p.stock < item.quantity) {
          return {
            success: false,
            error: `Only ${p.stock} item(s) of "${p.name}" available in stock.`,
          };
        }
      }

      // Deduct stock
      const updatedProducts = [...products];
      for (const item of items) {
        const idx = updatedProducts.findIndex((p) => p.id === item.productId);
        if (idx !== -1) {
          updatedProducts[idx] = {
            ...updatedProducts[idx],
            stock: updatedProducts[idx].stock - item.quantity,
            status:
              updatedProducts[idx].stock - item.quantity === 0
                ? "Out of Stock"
                : "Active",
          };
          if (updatedProducts[idx].stock < updatedProducts[idx].minThreshold) {
            addLog(
              `"${updatedProducts[idx].name}" stock went below threshold`,
              "restock"
            );
          }
        }
      }
      setProducts(updatedProducts);

      const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
      const newOrder: Order = {
        id: nextOrderId,
        customerName,
        items,
        totalPrice: total,
        status: "Pending",
        createdAt: new Date(),
      };
      setOrders((prev) => [newOrder, ...prev]);
      setNextOrderId((n) => n + 1);
      addLog(`Order #${nextOrderId} created by ${currentUser?.name ?? "user"}`, "order");
      return { success: true };
    },
    [products, nextOrderId, currentUser, addLog]
  );

  const updateOrderStatus = useCallback(
    (id: number, status: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
      addLog(`Order #${id} marked as ${status}`, "order");
    },
    [addLog]
  );

  const cancelOrder = useCallback(
    (id: number) => {
      const order = orders.find((o) => o.id === id);
      if (!order) return;

      // Restore stock on cancel
      setProducts((prev) =>
        prev.map((p) => {
          const item = order.items.find((i) => i.productId === p.id);
          if (!item) return p;
          const newStock = p.stock + item.quantity;
          return { ...p, stock: newStock, status: newStock > 0 ? "Active" : p.status };
        })
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o))
      );
      addLog(`Order #${id} was cancelled`, "order");
    },
    [orders, addLog]
  );

  // ─── Restock Queue (derived) ───────────────────────────────────────────────
  const restockQueue = computeRestockQueue(products);

  const removeFromRestockQueue = useCallback(
    (productId: number) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        addLog(`"${product.name}" removed from Restock Queue`, "restock");
      }
    },
    [products, addLog]
  );

  const value: AppStore = {
    currentUser,
    login,
    logout,
    categories,
    addCategory,
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
