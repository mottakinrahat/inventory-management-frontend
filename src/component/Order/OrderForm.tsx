// /components/orders/OrderForm.tsx
"use client";

import { useState } from "react";
import { OrderItem, Product } from "@/types/order";

interface Props {
  products: Product[];
  onCreate: (name: string, items: OrderItem[]) => void;
}

export default function OrderForm({ products, onCreate }: Readonly<Props>) {
  const [name, setName] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState("");

  const addItem = () => {
    const p = products.find(p => p.name === product);
    if (!p || !qty) return;

    setItems(prev => [
      ...prev,
      { productName: p.name, quantity: +qty, unitPrice: p.price },
    ]);

    setProduct("");
    setQty("");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <input
        placeholder="Customer Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <select value={product} onChange={e => setProduct(e.target.value)}>
        <option value="">Select Product</option>
        {products.map(p => (
          <option key={p.name}>{p.name}</option>
        ))}
      </select>

      <input
        type="number"
        value={qty}
        onChange={e => setQty(e.target.value)}
      />

      <button onClick={addItem}>Add</button>

      <button
        onClick={() => {
          onCreate(name, items);
          setName("");
          setItems([]);
        }}
      >
        Create Order
      </button>
    </div>
  );
}
