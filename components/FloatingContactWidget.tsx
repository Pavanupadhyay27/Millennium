"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, X, Send, Sparkles, CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { useStore } from "../lib/store";

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { openLeadModal } = useStore();

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      const existingLeads = JSON.parse(localStorage.getItem("customer_inquiries") || "[]");
      existingLeads.push({
        id: Date.now(),
        name,
        phone,
        itemContext: "Floating Quick Contact Card",
        actionType: "Contact Us Widget",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("customer_inquiries", JSON.stringify(existingLeads));
    }, 400);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto font-sans">
      {/* Ultra Clean & Minimal Contact Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="mb-3 w-[310px] sm:w-[340px] rounded-3xl bg-white dark:bg-[#1C1917] border border-charcoal/15 dark:border-cream/20 shadow-2xl overflow-hidden text-charcoal dark:text-cream relative"
          >
            {/* Header */}
            <div className="bg-[#1C1917] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="font-serif text-base font-bold tracking-tight">Contact Studio</h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct Instant Actions */}
            <div className="p-4 space-y-3">
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919337721647?text=Hello%20Millennium%20Furniture,%20I%20am%20interested%20in%20your%20solid%20teak%20wood%20designs."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg.emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" /> Chat on WhatsApp (+91 93377 21647)
              </a>

              {/* Or Quick Call Me Form */}
              <div className="relative my-2 text-center">
                <span className="bg-white dark:bg-[#1C1917] px-2 text-[10px] font-bold text-charcoal/40 dark:text-cream/40 uppercase tracking-widest relative z-10">
                  Or Request a Call
                </span>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-charcoal/10 dark:border-cream/10" />
                </div>
              </div>

              {!submitted ? (
                <form onSubmit={handleQuickSubmit} className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-charcoal/5 dark:bg-cream/5 border border-charcoal/15 dark:border-cream/20 rounded-xl px-3.5 py-2 text-xs font-semibold text-charcoal dark:text-cream placeholder:text-charcoal/50 dark:placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-accent-teal"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-charcoal/5 dark:bg-cream/5 border border-charcoal/15 dark:border-cream/20 rounded-xl px-3.5 py-2 text-xs font-semibold text-charcoal dark:text-cream placeholder:text-charcoal/50 dark:placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-accent-teal"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent-teal hover:bg-teal-700 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Get Call Back"} <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <div className="w-10 h-10 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h5 className="font-serif font-bold text-sm">Thanks {name}!</h5>
                  <p className="text-[11px] text-charcoal/70 dark:text-cream/70">
                    We will call <strong>{phone}</strong> shortly.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-4 py-1.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-full text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                  >
                    Done
                  </button>
                </div>
              )}

              {/* Direct Links */}
              <div className="pt-2 border-t border-charcoal/10 dark:border-cream/10 flex items-center justify-between text-[11px] font-semibold text-charcoal/60 dark:text-cream/60">
                <a href="tel:+919337721647" className="hover:text-accent-teal flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Call Directly
                </a>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openLeadModal({ actionType: "Floating Widget Customization" });
                  }}
                  className="hover:text-accent-teal text-[10px] font-bold underline"
                >
                  B2B Trade &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1C1917] dark:bg-[#FAF7F2] text-cream dark:text-[#1C1917] shadow-xl hover:shadow-2xl transition-all border border-white/20 dark:border-black/20"
        aria-label="Contact Us"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
          {isOpen ? <X className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5 fill-white/20" />}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider">
          {isOpen ? "Close" : "Contact Us"}
        </span>
      </motion.button>
    </div>
  );
}
