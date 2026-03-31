import React, { useState } from 'react';

interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
  minThreshold: number;
  status: 'Active' | 'Out of Stock';
}

interface Props {
  categories: string[];
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductForm: React.FC<Props> = ({ categories, products, setProducts }) => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productMinThreshold, setProductMinThreshold] = useState('');
  const [productStatus, setProductStatus] = useState<'Active' | 'Out of Stock'>('Active');

  const addProduct = () => {
    if (
      productName.trim() &&
      productCategory &&
      productPrice &&
      productStock &&
      productMinThreshold
    ) {
      const newProduct: Product = {
        name: productName.trim(),
        category: productCategory,
        price: parseFloat(productPrice),
        stock: parseInt(productStock),
        minThreshold: parseInt(productMinThreshold),
        status: productStatus,
      };
      setProducts([...products, newProduct]);
      // Reset form
      setProductName('');
      setProductCategory('');
      setProductPrice('');
      setProductStock('');
      setProductMinThreshold('');
      setProductStatus('Active');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Product</h2>
      <div className="flex flex-col gap-3">
        <input
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="number"
          placeholder="Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <input
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="number"
          placeholder="Stock Quantity"
          value={productStock}
          onChange={(e) => setProductStock(e.target.value)}
        />
        <input
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="number"
          placeholder="Min Stock Threshold"
          value={productMinThreshold}
          onChange={(e) => setProductMinThreshold(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={productStatus}
          onChange={(e) => setProductStatus(e.target.value as 'Active' | 'Out of Stock')}
        >
          <option value="Active">Active</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          onClick={addProduct}
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductForm;