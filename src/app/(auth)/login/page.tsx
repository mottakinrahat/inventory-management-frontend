"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Boxes, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useLoginMutation, useLazyGetUserMeQuery } from "@/redux/api/apiSlice";
import { setCredentials } from "@/redux/features/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [getUserMe] = useLazyGetUserMeQuery();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const processLogin = async (loginEmail: string, loginPass: string) => {
    setError("");
    setLoading(true);
    try {
      const payload = await login({ email: loginEmail, password: loginPass }).unwrap();
      const token = payload?.data?.accessToken || payload?.accessToken;

      if (token) {
        // ✅ Persist token to localStorage so it survives page refresh
        localStorage.setItem("accessToken", token);

        // Initial store update with token so prepareHeaders works immediately
        dispatch(
          setCredentials({
            user: payload?.data?.user || payload?.user || null,
            accessToken: token,
          })
        );

        // Fetch full profile — Authorization header now works because token is in Redux state
        try {
          const userRes = await getUserMe(undefined).unwrap();
          console.log(userRes)
          const userObj = userRes?.data || userRes;
          dispatch(setCredentials({ user: userObj, accessToken: token }));
        } catch (fetchErr) {
          console.error("Failed to fetch full user info:", fetchErr);
        }

        router.push("/dashboard");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err: any) {
      setError(err?.data?.message || err?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    await processLogin(email, password);
  };

  const handleDemoLogin = async () => {
    setEmail("demo@example.com");
    setPassword("password123");
    await processLogin("demo@example.com", "password123");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "oklch(0.10 0.01 260)" }}>

      {/* LEFT — Branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 relative overflow-hidden"
        style={{ background: "oklch(0.12 0.015 260)", borderRight: "1px solid oklch(0.20 0.02 260)" }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-96 h-96 rounded-full opacity-10 -top-20 -left-20"
            style={{ background: "radial-gradient(circle, oklch(0.62 0.22 270), transparent)" }}
          />
          <div
            className="absolute w-64 h-64 rounded-full opacity-8 bottom-10 right-10"
            style={{ background: "radial-gradient(circle, oklch(0.65 0.20 340), transparent)" }}
          />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center pulse-glow"
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.24 270), oklch(0.58 0.22 290))" }}
            >
              <Boxes size={20} className="text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Smart Inventory</span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage your<br />
            <span className="gradient-text">inventory smarter</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "oklch(0.55 0.01 260)" }}>
            Real-time stock tracking, order management, and intelligent restock alerts — all in one place.
          </p>
        </div>

        {/* Features */}
        <div className="relative space-y-3">
          {[
            "📦 Real-time stock level tracking",
            "🛒 Full order lifecycle management",
            "⚡ Instant low-stock alerts",
            "📊 Business insights & analytics",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3 text-sm" style={{ color: "oklch(0.70 0.01 260)" }}>
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <p className="relative text-xs" style={{ color: "oklch(0.40 0.01 260)" }}>
          © 2026 Smart Inventory System
        </p>
      </div>

      {/* RIGHT — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.24 270), oklch(0.58 0.22 290))" }}
            >
              <Boxes size={18} className="text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Smart Inventory</span>
          </div>

          <div className="section-card">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back 👋</h1>
            <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.01 260)" }}>
              Sign in to your account to continue
            </p>

            {error && (
              <div
                className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                style={{
                  background: "oklch(0.60 0.22 25 / 0.12)",
                  color: "oklch(0.65 0.22 25)",
                  border: "1px solid oklch(0.60 0.22 25 / 0.25)",
                }}
              >
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.65 0.01 260)" }}>
                  Email Address
                </label>
                <div className="flex items-center gap-2 input-field" style={{ display: "flex" }}>
                  <Mail size={15} style={{ color: "oklch(0.50 0.01 260)" }} className="shrink-0" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className="bg-transparent outline-none w-full text-white placeholder:text-gray-600 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "oklch(0.65 0.01 260)" }}>
                  Password
                </label>
                <div className="flex items-center gap-2 input-field" style={{ display: "flex" }}>
                  <Lock size={15} style={{ color: "oklch(0.50 0.01 260)" }} className="shrink-0" />
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-transparent outline-none w-full text-white placeholder:text-gray-600 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
              </div>

              <button id="login-btn" onClick={handleLogin} disabled={loading} className="btn-primary w-full py-3 mt-2 text-base">
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="relative flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: "oklch(0.22 0.02 260)" }} />
                <span className="text-xs" style={{ color: "oklch(0.40 0.01 260)" }}>or</span>
                <div className="h-px flex-1" style={{ background: "oklch(0.22 0.02 260)" }} />
              </div>

              <button id="demo-login-btn" onClick={handleDemoLogin} disabled={loading} className="btn-secondary w-full py-3">
                🚀 Demo Login (pre-filled)
              </button>

              <p className="text-center text-sm" style={{ color: "oklch(0.50 0.01 260)" }}>
                Don't have an account?{" "}
                <span
                  onClick={() => router.push("/signup")}
                  className="cursor-pointer font-medium"
                  style={{ color: "oklch(0.75 0.18 270)" }}
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
