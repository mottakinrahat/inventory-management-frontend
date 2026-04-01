"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  minThreshold: number;
  status: 'Active' | 'Out of Stock';
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [nextId, setNextId] = useState(1);

  // Category form state
  const [newCategory, setNewCategory] = useState("");

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    minThreshold: "",
    status: "Active" as 'Active' | 'Out of Stock'
  });

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory("");
    }
  };

  const addProduct = () => {
    if (
      productForm.name.trim() &&
      productForm.category &&
      productForm.price &&
      productForm.stock &&
      productForm.minThreshold
    ) {
      const newProduct: Product = {
        id: nextId,
        name: productForm.name.trim(),
        category: productForm.category,
        price: Number.parseFloat(productForm.price),
        stock: Number.parseInt(productForm.stock),
        minThreshold: Number.parseInt(productForm.minThreshold),
        status: productForm.status
      };
      setProducts([...products, newProduct]);
      setNextId(nextId + 1);
      setProductForm({
        name: "",
        category: "",
        price: "",
        stock: "",
        minThreshold: "",
        status: "Active"
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold">Product & Category Setup</h2>

      {/* Category Management */}
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Category
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Existing Categories:</h3>
              {categories.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {categories.map((cat) => (
                    <li key={cat} className="text-gray-700">{cat}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No categories added yet.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Management */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Product Name"
              value={productForm.name}
              onChange={(e) => setProductForm({...productForm, name: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={productForm.category}
              onChange={(e) => setProductForm({...productForm, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) => setProductForm({...productForm, price: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={productForm.stock}
              onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Minimum Stock Threshold"
              value={productForm.minThreshold}
              onChange={(e) => setProductForm({...productForm, minThreshold: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={productForm.status}
              onChange={(e) => setProductForm({...productForm, status: e.target.value as 'Active' | 'Out of Stock'})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          <button
            onClick={addProduct}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Product
          </button>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Min Threshold</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.minThreshold}</TableCell>
                    <TableCell className={product.status === 'Active' ? 'text-green-600' : 'text-red-600'}>
                      {product.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No products added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}