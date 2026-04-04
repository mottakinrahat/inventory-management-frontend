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
