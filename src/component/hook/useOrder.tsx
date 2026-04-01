// /hooks/useOrders.ts
import { useState } from "react";
import { Order, OrderItem } from "@/types/order";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [nextId, setNextId] = useState(1);

  const calculateTotal = (items: OrderItem[]) =>
    items.reduce((t, i) => t + i.quantity * i.unitPrice, 0);

  const createOrder = (customerName: string, items: OrderItem[]) => {
    const newOrder: Order = {
      id: nextId,
      customerName,
      items,
      totalPrice: calculateTotal(items),
      status: "Pending",
      date: new Date(),
    };

    setOrders(prev => [...prev, newOrder]);
    setNextId(prev => prev + 1);
  };

  const updateStatus = (id: number, status: Order["status"]) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  return {
    orders,
    createOrder,
    updateStatus,
  };
};