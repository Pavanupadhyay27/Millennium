"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Phone, Mail, X, Send, Sparkles, CheckCircle2, MessageCircle, Clock, ShieldCheck } from "lucide-react";
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

      const existingLeads = JSON.parse(localStorage.getItem("customer_inquiries") || "[]");
      existingLeads.push({
        id: Date.now(),
        name,
        phone,
        message: message || "Direct floating contact widget inquiry",
        itemContext: "Floating Luxury Concierge Widget",
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto font-sans">
      {/* Expanded Luxury Concierge Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="mb-4 w-[340px] sm:w-[380px] rounded-[28px] bg-cream/95 dark:bg-[#181614]/95 border border-charcoal/15 dark:border-cream/20 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden text-charcoal dark:text-cream relative"
          >
            {/* Ambient Animated Glow Header Background */}
            <div className="relative bg-gradient-to-br from-[#1F1B16] via-[#2A241E] to-[#141210] text-cream p-6 pb-7 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl pointer-events-none" />
              
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-cream flex items-center justify-center transition-all duration-200"
                aria-label="Close contact widget"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Live Business Support
                </span>
              </div>
              <h4 className="font-serif text-xl font-bold tracking-tight">Millennium Studio</h4>
              <p className="text-xs text-cream/70 mt-1 font-light leading-relaxed">
                Handcrafted Teak Furniture & Custom B2B Advisors
              </p>

              {/* Response Time Badge */}
              <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-semibold text-cream/90 border border-white/10">
                <Clock className="w-3 h-3 text-emerald-400" /> Instant Response via WhatsApp / Phone
              </div>
            </div>

            {/* Quick Action Tabs */}
            <div className="flex border-b border-charcoal/10 dark:border-cream/10 bg-charcoal/5 dark:bg-cream/5 p-1.5 gap-1">
              <button
                onClick={() => setActiveTab("quick")}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "quick"
                    ? "bg-white dark:bg-charcoal text-emerald-600 dark:text-emerald-400 shadow-md"
                    : "text-charcoal/60 dark:text-cream/60 hover:text-charcoal dark:hover:text-cream"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Callback Request
              </button>
              <button
                onClick={() => setActiveTab("call")}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "call"
                    ? "bg-white dark:bg-charcoal text-emerald-600 dark:text-emerald-400 shadow-md"
                    : "text-charcoal/60 dark:text-cream/60 hover:text-charcoal dark:hover:text-cream"
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Direct Call & Chat
              </button>
            </div>

            {/* Form & Actions Body */}
            <div className="p-5 sm:p-6">
              {activeTab === "quick" ? (
                !submitted ? (
                  <form onSubmit={handleQuickSubmit} className="space-y-3.5">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/80 dark:bg-charcoal/80 border border-charcoal/15 dark:border-cream/15 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/80 dark:bg-charcoal/80 border border-charcoal/15 dark:border-cream/15 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        placeholder="Furniture item or custom enquiry (Optional)..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-white/80 dark:bg-charcoal/80 border border-charcoal/15 dark:border-cream/15 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? "Connecting..." : "Request Instant Callback"} <Send className="w-3.5 h-3.5" />
                    </button>

                    <p className="text-[10px] text-center text-charcoal/50 dark:text-cream/50 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> 100% Secure & Confidential Inquiry
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-14 h-14 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h5 className="font-serif font-bold text-lg">Inquiry Received!</h5>
                    <p className="text-xs text-charcoal/70 dark:text-cream/70 max-w-xs mx-auto leading-relaxed">
                      Thank you <strong>{name}</strong>! Our consultant will connect with you at <strong>{phone}</strong> shortly.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
                    >
                      Close Window
                    </button>
                  </div>
                )
              ) : (
                <div className="space-y-3 py-1">
                  {/* WhatsApp Business Option */}
                  <a
                    href="https://wa.me/919337721647?text=Hello%20Millennium%20Furniture,%20I%20am%20interested%20in%20your%20solid%20teak%20wood%20designs."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 transition-all group shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <MessageCircle className="w-5 h-5 fill-white/20" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400">WhatsApp Business Chat</div>
                      <div className="text-xs font-extrabold text-charcoal dark:text-cream">+91 93377 21647</div>
                    </div>
                  </a>

                  {/* Direct Phone Call Option */}
                  <a
                    href="tel:+919337721647"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-charcoal/5 dark:bg-cream/5 hover:bg-charcoal/10 dark:hover:bg-cream/10 border border-charcoal/10 dark:border-cream/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-charcoal text-cream dark:bg-cream dark:text-charcoal flex items-center justify-center shadow-md shrink-0">
                      <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-cream/50">Call Sales Hotline</div>
                      <div className="text-xs font-extrabold text-charcoal dark:text-cream">+91 93377 21647</div>
                    </div>
                  </a>

                  {/* Email Link */}
                  <a
                    href="mailto:contact@millenniumfurniture.in"
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-charcoal/5 dark:bg-cream/5 hover:bg-charcoal/10 dark:hover:bg-cream/10 border border-charcoal/10 dark:border-cream/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-charcoal/80 text-cream dark:bg-cream/80 dark:text-charcoal flex items-center justify-center shadow-md shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-charcoal/50 dark:text-cream/50">Official Email</div>
                      <div className="text-xs font-bold text-charcoal dark:text-cream">contact@millenniumfurniture.in</div>
                    </div>
                  </a>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      openLeadModal({ actionType: "Floating WhatsApp / Custom Inquiry" });
                    }}
                    className="w-full text-center py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline tracking-wide border border-emerald-500/20 rounded-2xl bg-emerald-500/5"
                  >
                    Need B2B Wholesale / Trade Pricing? Click &rarr;
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button with WhatsApp Icon integration */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#1F1B16] dark:bg-[#FAF7F2] text-cream dark:text-[#1F1B16] shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-emerald-500/40 transition-all duration-300 border border-white/20 dark:border-black/20"
        aria-label="Contact Us & WhatsApp"
      >
        {/* Glow halo animation */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none opacity-40 blur-sm" />

        {/* Dynamic Icon */}
        <div className="relative w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
          {isOpen ? (
            <X className="w-4 h-4 transition-transform duration-200 rotate-90" />
          ) : (
            <MessageCircle className="w-4 h-4 fill-white/20" />
          )}
        </div>

        {/* Text Label */}
        <span className="relative text-xs font-extrabold uppercase tracking-widest">
          {isOpen ? "Close" : "Contact Us"}
        </span>

        {/* Live Status Green Pill */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
      </motion.button>
    </div>
  );
}
