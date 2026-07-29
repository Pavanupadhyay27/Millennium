"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Phone, Mail, X, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useStore } from "../lib/store";

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"quick" | "call">("quick");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
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

      // Save inquiry to localStorage
      const existingLeads = JSON.parse(localStorage.getItem("customer_inquiries") || "[]");
      existingLeads.push({
        id: Date.now(),
        name,
        phone,
        message: message || "Direct floating contact widget inquiry",
        itemContext: "Floating Contact Widget",
        actionType: "Contact Us Widget",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("customer_inquiries", JSON.stringify(existingLeads));
    }, 500);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Expanded Quick Contact Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 w-80 md:w-96 rounded-3xl bg-cream/95 dark:bg-charcoal/95 border border-charcoal/10 dark:border-cream/15 backdrop-blur-xl shadow-2xl overflow-hidden text-charcoal dark:text-cream"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal text-cream dark:from-black dark:to-charcoal p-5 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-cream flex items-center justify-center transition-all"
                aria-label="Close contact widget"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live Concierge
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold">Millennium Support</h4>
              <p className="text-xs text-cream/70 mt-0.5">
                Solid Teak Furniture Consultants (Bhubaneswar, Odisha)
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex border-b border-charcoal/10 dark:border-cream/10 bg-charcoal/5 dark:bg-cream/5 p-1.5 gap-1.5">
              <button
                onClick={() => setActiveTab("quick")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "quick"
                    ? "bg-white dark:bg-charcoal text-accent-teal shadow-sm"
                    : "text-charcoal/60 dark:text-cream/60 hover:text-charcoal dark:hover:text-cream"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Request Call
              </button>
              <button
                onClick={() => setActiveTab("call")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "call"
                    ? "bg-white dark:bg-charcoal text-accent-teal shadow-sm"
                    : "text-charcoal/60 dark:text-cream/60 hover:text-charcoal dark:hover:text-cream"
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Direct Call
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5">
              {activeTab === "quick" ? (
                !submitted ? (
                  <form onSubmit={handleQuickSubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/80 dark:bg-charcoal/80 border border-charcoal/15 dark:border-cream/15 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent-teal"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/80 dark:bg-charcoal/80 border border-charcoal/15 dark:border-cream/15 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent-teal"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        placeholder="Message or specific furniture piece (Optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-white/80 dark:bg-charcoal/80 border border-charcoal/15 dark:border-cream/15 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent-teal resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-accent-teal hover:bg-accent-teal/90 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending..." : "Request Instant Callback"} <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <div className="w-12 h-12 bg-accent-teal/15 text-accent-teal rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h5 className="font-serif font-bold text-base">Request Received!</h5>
                    <p className="text-xs text-charcoal/70 dark:text-cream/70">
                      Our specialist will reach out to <strong>{phone}</strong> within 15 minutes.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-5 py-2 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                    >
                      Done
                    </button>
                  </div>
                )
              ) : (
                <div className="space-y-4 py-2">
                  <p className="text-xs text-charcoal/70 dark:text-cream/70 leading-relaxed">
                    Have questions about customized solid teak wood designs, bulk B2B orders, or store visits?
                  </p>
                  
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-accent-teal/10 hover:bg-accent-teal/20 text-accent-teal border border-accent-teal/20 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-accent-teal text-white flex items-center justify-center shadow-md">
                      <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-cream/50">Call Sales Hotline</div>
                      <div className="text-xs font-bold text-charcoal dark:text-cream">+91 98765 43210</div>
                    </div>
                  </a>

                  <a
                    href="mailto:contact@millenniumfurniture.in"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-charcoal/5 dark:bg-cream/5 hover:bg-charcoal/10 dark:hover:bg-cream/10 border border-charcoal/10 dark:border-cream/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-charcoal text-cream dark:bg-cream dark:text-charcoal flex items-center justify-center shadow-md">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-cream/50">Send Email</div>
                      <div className="text-xs font-bold text-charcoal dark:text-cream">contact@millenniumfurniture.in</div>
                    </div>
                  </a>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      openLeadModal({ actionType: "Floating Widget Customization" });
                    }}
                    className="w-full text-center py-2 text-[11px] font-bold text-accent-teal hover:underline tracking-wide"
                  >
                    Looking for Custom B2B / Wholesale Quotes? Click Here &rarr;
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-accent-teal via-teal-600 to-charcoal text-white shadow-2xl hover:shadow-accent-teal/40 transition-all border border-white/20"
        aria-label="Contact Us"
      >
        {/* Animated Pulsing Ring */}
        <span className="absolute -inset-0.5 rounded-full bg-accent-teal/40 animate-ping pointer-events-none opacity-40" />

        {/* Icon */}
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-5 h-5 text-white transition-transform duration-200 rotate-90" />
          ) : (
            <MessageSquare className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
          )}
        </div>

        {/* Label */}
        <span className="relative text-xs font-extrabold uppercase tracking-wider text-white">
          Contact Us
        </span>

        {/* Active Online Indicator */}
        <span className="relative w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-charcoal" />
      </motion.button>
    </div>
  );
}
