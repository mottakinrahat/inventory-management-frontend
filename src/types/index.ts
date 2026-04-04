export type ProductStatus = "Active" | "Out of Stock";

export interface Product {
  id: string; // Changed to string (cuid) matching schema
  name: string;
  categoryId: string;
  category: string | { name: string; id: string };
  price: number;
  stockQty: number;
  minStockThreshold: number;
  status: ProductStatus;
  createdById: string;
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
  price: number;
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
  id: string;
  productId: string;
  product: { name: string; stockQty: number; minStockThreshold: number };
  productName?: string;
  currentStock?: number;
  minStockThreshold?: number;
  priority?: "High" | "Medium" | "Low";
}

export interface ActivityLog {
  id: number;
  message: string;
  timestamp: string;
  type: "order" | "stock" | "product" | "restock" | "auth";
}
