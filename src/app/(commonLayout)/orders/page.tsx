// /app/orders/page.tsx
"use client";

import OrderForm from "@/components/orders/OrderForm";
import OrdersTable from "@/components/orders/OrdersTable";
import OrderFilters from "@/components/orders/OrderFilters";
import { useOrders } from "@/hooks/useOrders";
import { useState } from "react";

const products = [
  { name: "iPhone 13", price: 800 },
  { name: "Laptop", price: 1200 },
];

export default function OrdersPage() {
  const { orders, createOrder, updateStatus } = useOrders();

  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const filtered = orders.filter(o =>
    (!status || o.status === status)
  );

  return (
    <div className="space-y-6">
      <OrderForm products={products} onCreate={createOrder} />
      <OrderFilters
        status={status}
        date={date}
        setStatus={setStatus}
        setDate={setDate}
      />
      <OrdersTable orders={filtered} onUpdate={updateStatus} />
    </div>
  );
}