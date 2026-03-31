"use client";

import React from "react";
import Navbar from "@/component/Dashboard/Navbar";
import { Sidebar } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md fixed inset-y-0 left-0 z-50 transition-transform transform-gpu">
        <div className="h-full flex flex-col p-4">
          {/* You can add logo or branding here */}
          <div className="mb-8 text-xl font-semibold text-gray-700">Dashboard</div>
          
          {/* Sidebar content */}
          <nav className="flex-1 space-y-4">
            {/* Example links or menu items */}
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-200 transition">Home</a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-200 transition">Analytics</a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-200 transition">Settings</a>
            {/* Add more links as needed */}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50 rounded-tr-lg shadow-inner">
          {children}
        </main>
      </div>
    </div>
  );
}