"use client";

import React, { useState } from "react";
import { Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@millenniumfurniture.in");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("Please enter the admin security password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      // Store admin session in localStorage
      localStorage.setItem("millennium_admin_auth", "true");
      localStorage.setItem("millennium_admin_email", email);
      window.location.href = "/admin";
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] flex flex-col items-center justify-center p-6 selection:bg-accent-teal/20 transition-colors">
      <div className="w-full max-w-md">
        
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Millennium Furniture"
            className="h-16 w-auto mx-auto mb-3 object-contain dark:brightness-0 dark:invert"
          />
          <span className="text-[10px] font-extrabold text-accent-teal uppercase tracking-widest bg-accent-teal/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> HQ Portal Sign-In
          </span>
        </div>

        {/* Login Card Container */}
        <div className="bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div>
            <h1 className="font-serif text-2xl font-bold mb-1">Store Admin Login</h1>
            <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">
              Sign in with your administrator credentials to access inventory & wholesale queue.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                Admin Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F1B16]/40 dark:text-[#F7F3EC]/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@millenniumfurniture.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-semibold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                Security Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F1B16]/40 dark:text-[#F7F3EC]/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-semibold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-teal hover:bg-accent-teal/90 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Sign In to Admin HQ"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Bypass Hint */}
          <div className="pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-center">
            <p className="text-[11px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" /> Demo: Enter any password to enter Admin HQ
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
