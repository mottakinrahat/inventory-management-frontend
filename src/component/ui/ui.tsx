"use client";

import React from "react";

export const Input = ({
  label,
  type = "text",
  icon,
  ...props
}: {
  label: string;
  type?: string;
  icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="w-full">
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </label>

      <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
        {icon && <div className="mr-2 text-gray-400">{icon}</div>}
        <input
          type={type}
          {...props}
          className="w-full outline-none bg-transparent text-sm"
        />
      </div>
    </div>
  );
};

export const Button = ({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
}) => {
  const base = "w-full py-2.5 rounded-xl font-medium transition";

  const styles =
    variant === "primary"
      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
      : "border border-gray-300 hover:bg-gray-100 text-gray-700";

  return (
    <button {...props} className={`${base} ${styles}`}>
      {children}
    </button>
  );
};