"use client";

import React, { useEffect } from "react";
import { useStore } from "../lib/store";
import { CheckCircle, ShoppingBag, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddedToCartToast() {
  const { lastAddedItem, dismissToast, toggleCartDrawer, cart } = useStore();

  useEffect(() => {
    if (lastAddedItem) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, dismissToast]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {lastAddedItem && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-[90%] sm:w-[420px] bg-white dark:bg-[#1C1814] border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-[#1F1B16] dark:text-[#F7F3EC]"
        >
          {/* Left Item Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-charcoal/5 border border-[#1F1B16]/10 dark:border-[#F7F3EC]/10 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lastAddedItem.image} alt={lastAddedItem.name} className="w-full h-full object-cover" />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Added To Cart
              </span>
              <h4 className="font-serif font-bold text-xs sm:text-sm truncate leading-snug">
                {lastAddedItem.name}
              </h4>
              <p className="text-[10px] text-[#1F1B16]/60 dark:text-[#F7F3EC]/60">
                ₹{lastAddedItem.price.toLocaleString("en-IN")} • Qty: {lastAddedItem.quantity}
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                dismissToast();
                toggleCartDrawer(true);
              }}
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> View ({totalCartCount})
            </button>

            <button
              onClick={dismissToast}
              className="p-1 rounded-full text-[#1F1B16]/40 dark:text-[#F7F3EC]/40 hover:text-[#1F1B16] dark:hover:text-[#F7F3EC] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
