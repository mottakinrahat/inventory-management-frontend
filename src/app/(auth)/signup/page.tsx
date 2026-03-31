"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { Button, Input } from "@/component/ui/ui";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">
          Join Smart Inventory
        </h1>
        <p className="text-indigo-100 text-center max-w-sm">
          Start managing your business smarter with real-time inventory tracking.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">
            Create Account 🚀
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Sign up to get started
          </p>

          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              icon={<User size={18} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
              placeholder="Create password"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e:any) => setPassword(e.target.value)}
            />

            <Button onClick={handleSignup}>Sign Up</Button>

            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-indigo-600 cursor-pointer font-medium"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}