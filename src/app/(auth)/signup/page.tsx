"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Boxes, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAppStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!name.trim()) { setError("Full name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(email, password);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "oklch(0.10 0.01 260)" }}>

      {/* LEFT */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 relative overflow-hidden"
        style={{ background: "oklch(0.12 0.015 260)", borderRight: "1px solid oklch(0.20 0.02 260)" }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 rounded-full opacity-10 -top-20 -right-20"
            style={{ background: "radial-gradient(circle, oklch(0.65 0.20 340), transparent)" }} />
          <div className="absolute w-64 h-64 rounded-full opacity-8 bottom-10 left-10"
            style={{ background: "radial-gradient(circle, oklch(0.62 0.22 270), transparent)" }} />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center pulse-glow"
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.24 270), oklch(0.58 0.22 290))" }}>
              <Boxes size={20} className="text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Smart Inventory</span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start managing<br />
            <span className="gradient-text">smarter today</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "oklch(0.55 0.01 260)" }}>
            Join thousands of businesses that trust Smart Inventory to keep their operations running smoothly.
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-3">
          {[
            { val: "99.9%", label: "Uptime" },
            { val: "10k+", label: "Products tracked" },
            { val: "5k+", label: "Orders managed" },
            { val: "4.9★", label: "User rating" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4"
              style={{ background: "oklch(0.16 0.02 260)", border: "1px solid oklch(0.22 0.02 260)" }}>
              <p className="text-xl font-bold" style={{ color: "oklch(0.75 0.18 270)" }}>{s.val}</p>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.01 260)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <p className="relative text-xs" style={{ color: "oklch(0.40 0.01 260)" }}>
          © 2026 Smart Inventory System
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.24 270), oklch(0.58 0.22 290))" }}>
              <Boxes size={18} className="text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Smart Inventory</span>
          </div>

          <div className="section-card">
            <h1 className="text-2xl font-bold text-white mb-1">Create Account 🚀</h1>
            <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.01 260)" }}>
              Fill in your details to get started
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                style={{ background: "oklch(0.60 0.22 25 / 0.12)", color: "oklch(0.65 0.22 25)", border: "1px solid oklch(0.60 0.22 25 / 0.25)" }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.65 0.01 260)" }}>
                  Full Name
                </label>
                <div className="flex items-center gap-2 input-field" style={{ display: "flex" }}>
                  <User size={15} style={{ color: "oklch(0.50 0.01 260)" }} className="shrink-0" />
                  <input id="signup-name" type="text" placeholder="John Doe"
                    className="bg-transparent outline-none w-full text-white placeholder:text-gray-600 text-sm"
                    value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.65 0.01 260)" }}>
                  Email Address
                </label>
                <div className="flex items-center gap-2 input-field" style={{ display: "flex" }}>
                  <Mail size={15} style={{ color: "oklch(0.50 0.01 260)" }} className="shrink-0" />
                  <input id="signup-email" type="email" placeholder="you@example.com"
                    className="bg-transparent outline-none w-full text-white placeholder:text-gray-600 text-sm"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.65 0.01 260)" }}>
                  Password
                </label>
                <div className="flex items-center gap-2 input-field" style={{ display: "flex" }}>
                  <Lock size={15} style={{ color: "oklch(0.50 0.01 260)" }} className="shrink-0" />
                  <input id="signup-password" type="password" placeholder="Min 6 characters"
                    className="bg-transparent outline-none w-full text-white placeholder:text-gray-600 text-sm"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>

              <button id="signup-btn" onClick={handleSignup} disabled={loading}
                className="btn-primary w-full py-3 mt-2 text-base">
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <p className="text-center text-sm" style={{ color: "oklch(0.50 0.01 260)" }}>
                Already have an account?{" "}
                <span onClick={() => router.push("/login")}
                  className="cursor-pointer font-medium"
                  style={{ color: "oklch(0.75 0.18 270)" }}>
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}