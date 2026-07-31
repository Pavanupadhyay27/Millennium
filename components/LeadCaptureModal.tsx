"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Phone, Mail, User, ArrowRight } from "lucide-react";
import { useStore } from "../lib/store";

export default function LeadCaptureModal() {
  const { leadModalOpen, closeLeadModal, leadContext, isAuthenticated, login } = useStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (isAuthenticated && leadModalOpen) {
    closeLeadModal();
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      login({ name, email: email || `${phone}@millenniumfurniture.in` });
      const existing = JSON.parse(localStorage.getItem("customer_inquiries") || "[]");
      existing.push({
        id: Date.now(), name, phone, email,
        itemContext: leadContext?.itemTitle || "General Inquiry",
        actionType: leadContext?.actionType || "Interest Click",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("customer_inquiries", JSON.stringify(existing));
    }, 600);
  };

  const handleClose = () => {
    setSubmitted(false);
    setName(""); setPhone(""); setEmail("");
    closeLeadModal();
  };

  const fieldStyle = theme === "light"
    ? {
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(31,27,22,0.15)",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
      }
    : {
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)",
      };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)";
    e.currentTarget.style.boxShadow = theme === "light"
      ? "inset 0 1px 3px rgba(0,0,0,0.06), 0 0 0 2px rgba(16,185,129,0.15)"
      : "inset 0 2px 6px rgba(0,0,0,0.4), 0 0 0 2px rgba(16,185,129,0.12)";
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = theme === "light" ? "rgba(31,27,22,0.15)" : "rgba(255,255,255,0.1)";
    e.currentTarget.style.boxShadow = theme === "light" ? "inset 0 1px 3px rgba(0,0,0,0.06)" : "inset 0 2px 6px rgba(0,0,0,0.4)";
  };

  return (
    <AnimatePresence>
      {leadModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: theme === "light" ? "rgba(31,27,22,0.4)" : "rgba(6,5,4,0.85)",
            backdropFilter: "blur(16px)"
          }}
        >
          <motion.div
            initial={{ scale: 0.94, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: theme === "light" ? "#FAF7F2" : "linear-gradient(180deg, rgba(30,24,18,0.96) 0%, rgba(18,14,10,0.98) 100%)",
              border: theme === "light" ? "1px solid rgba(31,27,22,0.1)" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: theme === "light"
                ? "0 40px 80px rgba(0,0,0,0.15)"
                : "0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Top accent line */}
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.6), rgba(212,168,83,0.6), transparent)" }} />

            <div className="p-7">
              {/* Close */}
              <button
                onClick={handleClose}
                className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 border ${
                  theme === "light"
                    ? "bg-charcoal/5 border-charcoal/10 text-charcoal/60"
                    : "bg-white/5 border-white/10 text-white/60"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {!submitted ? (
                <div className="space-y-5">
                  <div>
                    <span className={`text-[9px] font-extrabold uppercase tracking-[0.2em] block mb-1.5 ${
                      theme === "light" ? "text-accent-teal" : "text-amber-400"
                    }`}>
                      Quick Sign-In
                    </span>
                    <h3 className={`font-serif text-xl font-bold leading-snug ${
                      theme === "light" ? "text-charcoal" : "text-white"
                    }`}>
                      Welcome to Millennium
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${
                      theme === "light" ? "text-charcoal/50" : "text-white/35"
                    }`}>
                      Unlock express checkout & saved wishlist.
                    </p>
                    {leadContext?.itemTitle && (
                      <p className={`text-[10px] mt-1.5 font-medium ${
                        theme === "light" ? "text-accent-teal" : "text-emerald-400/70"
                      }`}>
                        Enquiring: {leadContext.itemTitle}
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="relative">
                      <User className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                        theme === "light" ? "text-charcoal/40" : "text-white/30"
                      }`} />
                      <input
                        type="text" required placeholder="Full Name"
                        value={name} onChange={(e) => setName(e.target.value)}
                        className={`w-full pl-9 pr-4 py-3 rounded-xl text-xs outline-none transition-all ${
                          theme === "light" ? "text-charcoal placeholder:text-charcoal/30" : "text-white/90 placeholder:text-white/25"
                        }`}
                        style={fieldStyle} onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>
                    <div className="relative">
                      <Phone className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                        theme === "light" ? "text-charcoal/40" : "text-white/30"
                      }`} />
                      <input
                        type="tel" required placeholder="Phone Number"
                        value={phone} onChange={(e) => setPhone(e.target.value)}
                        className={`w-full pl-9 pr-4 py-3 rounded-xl text-xs outline-none transition-all ${
                          theme === "light" ? "text-charcoal placeholder:text-charcoal/30" : "text-white/90 placeholder:text-white/25"
                        }`}
                        style={fieldStyle} onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>
                    <div className="relative">
                      <Mail className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                        theme === "light" ? "text-charcoal/40" : "text-white/30"
                      }`} />
                      <input
                        type="email" placeholder="Email (optional)"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-9 pr-4 py-3 rounded-xl text-xs outline-none transition-all ${
                          theme === "light" ? "text-charcoal placeholder:text-charcoal/30" : "text-white/90 placeholder:text-white/25"
                        }`}
                        style={fieldStyle} onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>

                    <button
                      type="submit" disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:translate-y-0.5 disabled:opacity-50 relative overflow-hidden mt-1"
                      style={{
                        background: theme === "light"
                          ? "linear-gradient(180deg, #0D9488 0%, #0F766E 100%)"
                          : "linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)",
                        boxShadow: theme === "light"
                          ? "0 6px 18px rgba(15,118,110,0.25)"
                          : "0 6px 18px rgba(16,185,129,0.4), inset 0 1.5px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.3)",
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                      <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? "Signing In..." : "Continue"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="relative w-14 h-14 mx-auto">
                    {/* Glow ring */}
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: "rgba(16,185,129,0.2)", animationDuration: "2s" }}
                    />
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center relative"
                      style={{
                        background: "radial-gradient(circle at 35% 35%, #34D399, #059669)",
                        boxShadow: "0 8px 24px rgba(16,185,129,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                      }}
                    >
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h4 className={`font-serif text-xl font-bold ${theme === "light" ? "text-charcoal" : "text-white"}`}>Welcome, {name}!</h4>
                  <p className={`text-xs max-w-xs mx-auto ${theme === "light" ? "text-charcoal/50" : "text-white/40"}`}>
                    Our consultant will call you for <strong className={theme === "light" ? "text-charcoal font-bold" : "text-white/70"}>{leadContext?.itemTitle || "your inquiry"}</strong>.
                  </p>
                  <button
                    onClick={handleClose}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 border ${
                      theme === "light"
                        ? "bg-charcoal/5 border-charcoal/10 text-charcoal/80"
                        : "bg-white/5 border-white/10 text-white/80"
                    }`}
                  >
                    Back to Store
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
