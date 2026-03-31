import React from 'react';

interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
  minThreshold: number;
  status: 'Active' | 'Out of Stock';
}

interface Props {
  products: Product[];
}

const ProductList: React.FC<Props> = ({ products }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Products List</h3>
      {products.length === 0 ? (
        <p className="text-gray-500">No products added yet.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Min Threshold</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{prod.name}</td>
                <td className="border border-gray-300 px-4 py-2">{prod.category}</td>
                <td className="border border-gray-300 px-4 py-2">${prod.price.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{prod.stock}</td>
                <td className="border border-gray-300 px-4 py-2">{prod.minThreshold}</td>
                <td className={`border border-gray-300 px-4 py-2 font-semibold ${prod.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                  {prod.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;