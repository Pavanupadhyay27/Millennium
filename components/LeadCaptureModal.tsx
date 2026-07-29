"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Phone, Mail, User, Sparkles, ArrowRight } from "lucide-react";
import { useStore } from "../lib/store";

export default function LeadCaptureModal() {
  const { leadModalOpen, closeLeadModal, leadContext, isAuthenticated, login } = useStore();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If customer is already authenticated, automatically close modal
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

      // Authenticate user in store so they are NEVER asked again
      login({ name, email: email || `${phone}@millenniumfurniture.in` });

      const existingLeads = JSON.parse(localStorage.getItem("customer_inquiries") || "[]");
      existingLeads.push({
        id: Date.now(),
        name,
        phone,
        email,
        itemContext: leadContext?.itemTitle || "General Inquiry",
        actionType: leadContext?.actionType || "Interest Click",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("customer_inquiries", JSON.stringify(existingLeads));
    }, 600);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setEmail("");
    closeLeadModal();
  };

  return (
    <AnimatePresence>
      {leadModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="bg-cream dark:bg-charcoal border border-charcoal/10 dark:border-cream/20 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative overflow-hidden text-charcoal dark:text-cream"
          >
            {/* Close Button */}
            <button
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-charcoal/5 dark:bg-cream/10 flex items-center justify-center hover:bg-accent-teal hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {!submitted ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold text-accent-teal uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Quick Member Sign-In
                  </span>
                  <h3 className="font-serif text-2xl font-bold leading-snug">
                    Sign In to Millennium Furniture
                  </h3>
                  <p className="text-xs text-charcoal/70 dark:text-cream/70 mt-1.5 leading-relaxed">
                    Sign in once to unlock express checkout, saved wishlist items & exclusive B2B trade offers.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-charcoal/70 dark:text-cream/70">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-cream/40" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Patnaik"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/80 dark:bg-charcoal/80 border border-charcoal/15 dark:border-cream/15 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent-teal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-charcoal/70 dark:text-cream/70">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-cream/40" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 93377 21647"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/80 dark:bg-charcoal/80 border border-charcoal/15 dark:border-cream/15 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent-teal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-charcoal/70 dark:text-cream/70">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-cream/40" />
                      <input
                        type="email"
                        placeholder="ananya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/80 dark:bg-charcoal/80 border border-charcoal/15 dark:border-cream/15 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent-teal"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent-teal text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-accent-teal/90 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Signing In..." : "Sign In / Register"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-accent-teal/15 text-accent-teal rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold">Thank You, {name}!</h4>
                <p className="text-xs text-charcoal/70 dark:text-cream/70 max-w-xs mx-auto leading-relaxed">
                  Our interior consultant has received your inquiry for <strong>{leadContext?.itemTitle || "Millennium Furniture"}</strong> and will call you shortly at <strong>{phone}</strong>.
                </p>
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-charcoal text-cream dark:bg-cream dark:text-charcoal rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                >
                  Back to Store
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
