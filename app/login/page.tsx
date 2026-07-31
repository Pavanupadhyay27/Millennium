"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useStore } from "../../lib/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login } = useStore();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (currentTheme) setTheme(currentTheme);
    };
    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: email.split("@")[0] || "User", email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Authentication failed.");
        setIsLoading(false);
        return;
      }
      login({ name: data.user.name, email: data.user.email });
      window.location.href = "/";
    } catch {
      setErrorMsg("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        theme === "light" ? "bg-[#FAF7F2]" : "bg-[#12100E]"
      }`}
      style={theme === "dark" ? { background: "linear-gradient(135deg, #0E0C0A 0%, #1A1612 50%, #0E0C0A 100%)" } : {}}
    >
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div
          className={`w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl transition-all duration-300 border ${
            theme === "light"
              ? "bg-[#FAF7F2] border-charcoal/10 shadow-2xl"
              : "border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
          }`}
        >
          {/* LEFT: Image Panel */}
          <div className="hidden lg:block relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
              alt="Millennium Teak Furniture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(10,8,6,0.3) 50%, transparent 100%)" }} />
            <div className="absolute bottom-10 left-10 right-10">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-400 mb-3 block">
                Odisha Handcrafted
              </span>
              <h2 className="font-serif text-3xl font-bold text-white leading-tight mb-3">
                Where Craft Meets Luxury
              </h2>
              <p className="text-white/50 text-xs leading-relaxed">
                Solid teak. Lifetime warranty. Bhubaneswar.
              </p>
            </div>
          </div>

          {/* RIGHT: Form Panel */}
          <div
            className={`p-10 md:p-14 flex flex-col justify-center transition-colors duration-300 ${
              theme === "light"
                ? "bg-[#FAF7F2] border-l border-charcoal/10"
                : "border-l border-white/5"
            }`}
            style={
              theme === "dark"
                ? {
                    background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                    backdropFilter: "blur(24px)",
                  }
                : {}
            }
          >
            <div className="mb-8">
              <span className={`text-[10px] font-extrabold uppercase tracking-[0.2em] block mb-2 ${
                theme === "light" ? "text-accent-teal" : "text-emerald-400"
              }`}>
                Welcome Back
              </span>
              <h1 className={`font-serif text-3xl font-bold ${
                theme === "light" ? "text-charcoal" : "text-white"
              }`}>Sign In</h1>
            </div>

            {errorMsg && (
              <div
                className={`mb-5 px-4 py-3 rounded-2xl text-xs font-bold border ${
                  theme === "light"
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-700"
                    : "bg-rose-500/12 border-rose-500/30 text-rose-300"
                }`}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                  theme === "light" ? "text-charcoal/55" : "text-white/40"
                }`}>
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-4 pr-12 py-3.5 rounded-2xl text-sm outline-none transition-all ${
                      theme === "light" ? "text-charcoal placeholder:text-charcoal/30 border border-charcoal/15 bg-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal" : "text-white/90 placeholder:text-white/20 border border-white/10 bg-black/40 focus:border-emerald-500"
                    }`}
                    style={
                      theme === "light"
                        ? { boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)" }
                        : { boxShadow: "inset 0 3px 8px rgba(0,0,0,0.5)" }
                    }
                  />
                  <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    theme === "light" ? "text-charcoal/30" : "text-white/25"
                  }`} />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                    theme === "light" ? "text-charcoal/55" : "text-white/40"
                  }`}>
                    Password
                  </label>
                  <a href="#" className={`text-[10px] font-bold transition-colors ${
                    theme === "light" ? "text-accent-teal hover:underline" : "text-emerald-400 hover:text-emerald-300"
                  }`}>
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-4 pr-12 py-3.5 rounded-2xl text-sm outline-none transition-all ${
                      theme === "light" ? "text-charcoal placeholder:text-charcoal/30 border border-charcoal/15 bg-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal" : "text-white/90 placeholder:text-white/20 border border-white/10 bg-black/40 focus:border-emerald-500"
                    }`}
                    style={
                      theme === "light"
                        ? { boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)" }
                        : { boxShadow: "inset 0 3px 8px rgba(0,0,0,0.5)" }
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                      theme === "light" ? "text-charcoal/35 hover:text-charcoal" : "text-white/25 hover:text-white/60"
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-4 rounded-2xl text-white font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all active:translate-y-0.5 disabled:opacity-50 relative overflow-hidden"
                style={{
                  background: theme === "light"
                    ? "linear-gradient(180deg, #0D9488 0%, #0F766E 100%)"
                    : "linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)",
                  boxShadow: theme === "light"
                    ? "0 8px 24px rgba(15,118,110,0.25)"
                    : "0 8px 24px rgba(16,185,129,0.4), inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -2.5px 0 rgba(0,0,0,0.35)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-2xl" />
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? "Signing In..." : "Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </form>

            <p className={`text-xs text-center mt-8 ${
              theme === "light" ? "text-charcoal/40" : "text-white/30"
            }`}>
              No account?{" "}
              <a href="/signup" className={`font-bold transition-colors ${
                theme === "light" ? "text-accent-teal hover:underline" : "text-emerald-400 hover:text-emerald-300"
              }`}>
                Create one
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
