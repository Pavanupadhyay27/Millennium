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
      setErrorMsg("Please enter security password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("millennium_admin_auth", "true");
      localStorage.setItem("millennium_admin_email", email);
      window.location.href = "/admin";
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#12100E] text-[#1F1B16] dark:text-[#F7F3EC] flex items-center justify-center p-4 sm:p-8 selection:bg-accent-teal/20 transition-colors">
      
      {/* Dual Pane Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-3xl shadow-2xl overflow-hidden min-h-[520px]">
        
        {/* LEFT PANE: Furniture Showcase Image (5 cols) */}
        <div className="lg:col-span-5 relative hidden lg:block overflow-hidden bg-charcoal/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/admin-hero.png"
            alt="Millennium Furniture HQ"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
            <span className="text-[9px] font-extrabold text-accent-teal uppercase tracking-widest block mb-1">
              Odisha Teak Craftsmanship
            </span>
            <h3 className="font-serif font-bold text-xl leading-snug">
              Millennium Store Operations HQ
            </h3>
          </div>
        </div>

        {/* RIGHT PANE: Compact Sign-In Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center justify-between mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Millennium Furniture"
                className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
              />
              <span className="text-[9px] font-extrabold text-accent-teal uppercase tracking-widest bg-accent-teal/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Secure HQ
              </span>
            </div>

            <h1 className="font-serif text-2xl font-bold mb-1">Admin Sign-In</h1>
            <p className="text-xs text-[#1F1B16]/60 dark:text-[#F7F3EC]/60 mb-6">
              Enter administrator password to access HQ operations portal.
            </p>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold p-3 rounded-xl mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                  Email *
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
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F1B16]/70 dark:text-[#F7F3EC]/70">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F1B16]/40 dark:text-[#F7F3EC]/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1F1B16]/15 dark:border-[#F7F3EC]/20 bg-[#FAF7F2] dark:bg-[#12100E] text-xs font-semibold focus:outline-none focus:border-accent-teal text-[#1F1B16] dark:text-[#F7F3EC]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-teal hover:bg-accent-teal/90 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Enter Admin Portal"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 text-center mt-6">
            <p className="text-[11px] text-[#1F1B16]/50 dark:text-[#F7F3EC]/50 flex items-center justify-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" /> Demo: Any password allowed
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
