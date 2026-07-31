"use client";

import React, { useState, useEffect } from "react";
import { useStore, CartItem } from "../lib/store";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fmt = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

export default function CartDrawer() {
  const { cart, cartDrawerOpen, toggleCartDrawer, removeFromCart, updateCartQuantity } = useStore();
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

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

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCartDrawer(false)}
            className="fixed inset-0 z-50 cursor-pointer"
            style={{
              background: theme === "light" ? "rgba(31,27,22,0.4)" : "rgba(6,5,4,0.75)",
              backdropFilter: "blur(10px)"
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] z-50 flex flex-col transition-colors duration-300 ${
              theme === "light"
                ? "bg-[#FAF7F2] border-l border-charcoal/10 shadow-2xl"
                : "bg-gradient-to-b from-[#1A1612] to-[#0E0C0A] border-l border-white/5 shadow-[-20px_0_60px_rgba(0,0,0,0.6)]"
            }`}
          >
            {/* Header */}
            <div
              className={`px-6 py-5 flex items-center justify-between border-b ${
                theme === "light" ? "border-charcoal/10" : "border-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center border shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ${
                    theme === "light"
                      ? "bg-accent-teal/10 border-accent-teal/20"
                      : "bg-emerald-500/20 border-emerald-500/20"
                  }`}
                >
                  <ShoppingBag className={`w-4 h-4 ${theme === "light" ? "text-accent-teal" : "text-emerald-400"}`} />
                </div>
                <div>
                  <h3 className={`font-serif text-base font-bold ${theme === "light" ? "text-charcoal" : "text-white"}`}>Cart</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === "light" ? "text-accent-teal" : "text-emerald-400"}`}>
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleCartDrawer(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 border ${
                  theme === "light"
                    ? "bg-charcoal/5 border-charcoal/10 text-charcoal/60"
                    : "bg-white/5 border-white/10 text-white/60"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length > 0 ? (
                cart.map((item: CartItem) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex gap-3 p-3.5 rounded-2xl border ${
                      theme === "light"
                        ? "bg-white border-charcoal/5 shadow-sm"
                        : "bg-white/5 border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 ${
                        theme === "light" ? "border border-charcoal/5" : "shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold leading-snug line-clamp-1 ${
                            theme === "light" ? "text-charcoal" : "text-white/90"
                          }`}>{item.name}</h4>
                          <p className={`text-[10px] mt-0.5 ${
                            theme === "light" ? "text-charcoal/40" : "text-white/35"
                          }`}>{item.material || "Solid Teak"} · {item.color || "Natural"}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className={`p-1 rounded-lg transition-colors shrink-0 ${
                            theme === "light" ? "text-charcoal/30 hover:text-rose-600" : "text-white/20 hover:text-rose-400"
                          }`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div
                          className={`flex items-center gap-1 px-1.5 py-1 rounded-xl border ${
                            theme === "light"
                              ? "bg-charcoal/5 border-charcoal/10"
                              : "bg-black/30 border-white/5"
                          }`}
                        >
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                              theme === "light"
                                ? "text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10"
                                : "text-white/50 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className={`w-5 text-center text-xs font-bold ${
                            theme === "light" ? "text-charcoal" : "text-white/90"
                          }`}>{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                              theme === "light"
                                ? "text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10"
                                : "text-white/50 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <span className={`font-mono text-sm font-bold ${
                          theme === "light" ? "text-accent-teal" : "text-emerald-400"
                        }`}>
                          {fmt(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
                      theme === "light"
                        ? "bg-charcoal/5 border-charcoal/10 text-charcoal/30"
                        : "bg-white/5 border-white/10 text-white/30"
                    }`}
                  >
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold mb-1 ${theme === "light" ? "text-charcoal/60" : "text-white/60"}`}>Cart is empty</h4>
                    <p className={`text-xs ${theme === "light" ? "text-charcoal/40" : "text-white/25"}`}>Add teak pieces to begin.</p>
                  </div>
                  <button
                    onClick={() => toggleCartDrawer(false)}
                    className={`flex items-center gap-1.5 text-xs font-bold hover:gap-2.5 transition-all ${
                      theme === "light" ? "text-accent-teal" : "text-emerald-400"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" /> Browse Collections
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div
                className={`p-5 space-y-4 border-t ${
                  theme === "light" ? "border-charcoal/10" : "border-white/5"
                }`}
              >
                {/* Trust badge */}
                <div className={`flex items-center gap-2 text-[10px] ${
                  theme === "light" ? "text-charcoal/40" : "text-white/30"
                }`}>
                  <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${theme === "light" ? "text-accent-teal/80" : "text-emerald-400/70"}`} />
                  Secure checkout · GST inclusive · Free BBSR delivery
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                      theme === "light" ? "text-charcoal/40" : "text-white/30"
                    }`}>Subtotal</span>
                    <span className={`text-[10px] ${theme === "light" ? "text-charcoal/40" : "text-white/50"}`}>Taxes included</span>
                  </div>
                  <span className={`font-serif text-2xl font-bold ${
                    theme === "light" ? "text-charcoal" : "text-white"
                  }`}>{fmt(subtotal)}</span>
                </div>

                <a
                  href="/checkout"
                  onClick={() => toggleCartDrawer(false)}
                  className="w-full py-4 rounded-2xl text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all active:translate-y-0.5 relative overflow-hidden"
                  style={{
                    background: theme === "light" 
                      ? "linear-gradient(180deg, #0D9488 0%, #0F766E 100%)" 
                      : "linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)",
                    boxShadow: theme === "light"
                      ? "0 8px 22px rgba(15,118,110,0.25)"
                      : "0 8px 22px rgba(16,185,129,0.45), inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -3px 0 rgba(0,0,0,0.35)",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                  <span className="relative z-10 flex items-center gap-2">
                    Checkout <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
