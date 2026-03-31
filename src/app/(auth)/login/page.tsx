"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { Button, Input } from "@/component/ui/ui";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.push("/dashboard");
  };

  const handleDemoLogin = () => {
    setEmail("demo@example.com");
    setPassword("123456");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT SIDE (Branding) */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">
          Smart Inventory
        </h1>
        <p className="text-indigo-100 text-center max-w-sm">
          Manage your products, orders, and stock effortlessly with a powerful system.
        </p>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Please enter your details to continue
          </p>

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={handleLogin}>Sign In</Button>

            <Button variant="outline" onClick={handleDemoLogin}>
              Demo Login
            </Button>

            <p className="text-sm text-center text-gray-500">
              Don’t have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-indigo-600 cursor-pointer font-medium"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}