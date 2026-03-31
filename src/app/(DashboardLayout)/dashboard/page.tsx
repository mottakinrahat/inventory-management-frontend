import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { ShoppingCart, Wallet, Clock, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-4 bg-gray-100 min-h-screen">
      {/* Header */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Dashboard Overview
      </h2>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Orders Today */}
        <Card className="bg-white hover:shadow-xl transition-transform transform hover:scale-105 rounded-lg">
          <CardHeader className="flex items-center space-x-4 p-4 border-b border-gray-200">
            <ShoppingCart className="w-6 h-6 text-blue-500" />
            <CardTitle className="text-sm font-medium text-gray-600">
              Orders Today
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-gray-800">25</p>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="bg-white hover:shadow-xl transition-transform transform hover:scale-105 rounded-lg">
          <CardHeader className="flex items-center space-x-4 p-4 border-b border-gray-200">
            <Wallet className="w-6 h-6 text-green-500" />
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-gray-800">$1,200</p>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="bg-white hover:shadow-xl transition-transform transform hover:scale-105 rounded-lg">
          <CardHeader className="flex items-center space-x-4 p-4 border-b border-gray-200">
            <Clock className="w-6 h-6 text-yellow-500" />
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-gray-800">8</p>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="bg-white hover:shadow-xl transition-transform transform hover:scale-105 rounded-lg">
          <CardHeader className="flex items-center space-x-4 p-4 border-b border-gray-200">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <CardTitle className="text-sm font-medium text-gray-600">
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-red-600">5</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Summary */}
      <Card className="bg-white rounded-lg shadow-lg">
        <CardHeader className="border-b border-gray-200 p-4">
          <CardTitle className="text-xl font-semibold text-gray-700">
            Product Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 text-sm text-gray-700">
          {/* Product 1 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span className="font-medium">iPhone 13</span>
            </div>
            <span className="text-red-500 font-semibold">3 left</span>
          </div>
          {/* Product 2 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span className="font-medium">T-Shirt</span>
            </div>
            <span className="text-green-600 font-semibold">20 available</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}