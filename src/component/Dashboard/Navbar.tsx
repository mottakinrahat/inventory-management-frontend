"use client";

export default function Navbar() {
  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">Admin</div>
        <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full">
          A
        </div>
      </div>
    </div>
  );
}