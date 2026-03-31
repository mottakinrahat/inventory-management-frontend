"use client"
import CategoryForm from '@/component/homepage/CategoryForm';
import ProductForm from '@/component/homepage/ProductForm';
import ProductList from '@/component/homepage/ProductList';
import React, { useState } from 'react';

interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
  minThreshold: number;
  status: 'Active' | 'Out of Stock';
}

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 shadow-md py-4 bg-white rounded-lg">
        Product & Category Setup
      </h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <CategoryForm categories={categories} setCategories={setCategories} />
        <ProductForm categories={categories} products={products} setProducts={setProducts} />
        <div className="col-span-2">
          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
}